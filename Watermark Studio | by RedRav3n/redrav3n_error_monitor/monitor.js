(() => {
  "use strict";

  const DEFAULT_ENDPOINT = "https://redrav3nmail.cyou/api/client-errors";
  const MAX_PENDING_REPORTS = 30;
  const recentReports = new Map();
  const installedProjects = new Set();

  function sanitize(value, limit = 4000) {
    let text = String(value ?? "");
    text = text
      .replace(
        /(authorization|api[_-]?key|token|secret|password|cookie|golden_key)["']?\s*[:=]\s*["']?([^\s"',;}&]+)/gi,
        "$1=[REDACTED]",
      )
      .replace(/\bsk-[A-Za-z0-9_-]{12,}\b/g, "[REDACTED]")
      .replace(/\b\d{8,12}:[A-Za-z0-9_-]{24,}\b/g, "[REDACTED]");
    return text.slice(0, limit);
  }

  function normalizeError(error) {
    if (error instanceof Error) {
      return {
        type: error.name || "Error",
        message: sanitize(error.message || error),
        stack: sanitize(error.stack || ""),
      };
    }
    if (typeof error === "object" && error) {
      try {
        return {
          type: sanitize(error.name || "Error", 120),
          message: sanitize(JSON.stringify(error)),
          stack: sanitize(error.stack || ""),
        };
      } catch (_) {
        // Fall through to the safe string representation.
      }
    }
    return { type: "Error", message: sanitize(error), stack: "" };
  }

  function storageKey(project) {
    return `redrav3nErrorReportsV1:${project}`;
  }

  async function readPending(project) {
    const key = storageKey(project);
    if (globalThis.chrome?.storage?.local) {
      const stored = await chrome.storage.local.get(key);
      return Array.isArray(stored[key]) ? stored[key] : [];
    }
    try {
      const stored = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(stored) ? stored : [];
    } catch (_) {
      return [];
    }
  }

  async function writePending(project, reports) {
    const key = storageKey(project);
    const bounded = reports.slice(-MAX_PENDING_REPORTS);
    if (globalThis.chrome?.storage?.local) {
      await chrome.storage.local.set({ [key]: bounded });
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify(bounded));
    } catch (_) {
      // Storage can be unavailable in private or constrained contexts.
    }
  }

  async function persist(report) {
    try {
      const pending = await readPending(report.project);
      pending.push(report);
      await writePending(report.project, pending);
    } catch (_) {
      // Monitoring must never break the host application.
    }
  }

  async function postReport(report, endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
        credentials: "omit",
        cache: "no-store",
        keepalive: true,
        referrerPolicy: "no-referrer",
      });
      if (!response.ok) throw new Error(`Monitor HTTP ${response.status}`);
      return true;
    } catch (_) {
      await persist(report);
      return false;
    }
  }

  async function deliver(report, endpoint) {
    const isContentScript =
      Boolean(globalThis.document) &&
      /^https?:$/.test(globalThis.location?.protocol || "") &&
      Boolean(globalThis.chrome?.runtime?.sendMessage);
    if (isContentScript) {
      try {
        const response = await chrome.runtime.sendMessage({
          action: "redrav3nErrorMonitor:report",
          endpoint,
          report,
        });
        if (response?.ok) return true;
      } catch (_) {
        // Fall back to direct delivery and then the local queue.
      }
    }
    return postReport(report, endpoint);
  }

  async function flush(project, endpoint = DEFAULT_ENDPOINT) {
    const pending = await readPending(project);
    if (!pending.length) return;
    const unsent = [];
    for (const report of pending) {
      if (!(await deliver(report, endpoint))) unsent.push(report);
    }
    await writePending(project, unsent);
  }

  function capture(error, context = {}) {
    const project = sanitize(context.project || "unknown", 80);
    const normalized = normalizeError(error);
    const fingerprint = `${project}:${normalized.type}:${normalized.message}`;
    const now = Date.now();
    if (now - (recentReports.get(fingerprint) || 0) < 10000) return;
    recentReports.set(fingerprint, now);

    const report = {
      project,
      type: normalized.type,
      message: normalized.message,
      stack: normalized.stack,
      page: sanitize(globalThis.location?.href || "", 800),
      context: sanitize(context.name || "runtime", 160),
      timestamp: new Date(now).toISOString(),
      userAgent: sanitize(globalThis.navigator?.userAgent || "", 400),
    };
    void deliver(report, context.endpoint || DEFAULT_ENDPOINT);
  }

  let fetchMonitorInstalled = false;

  function requestUrl(input) {
    if (typeof input === "string") return input;
    return input?.url || "unknown";
  }

  function installFetchMonitor(project, endpoint) {
    if (fetchMonitorInstalled || typeof globalThis.fetch !== "function") return;
    fetchMonitorInstalled = true;
    const originalFetch = globalThis.fetch.bind(globalThis);

    globalThis.fetch = async (...args) => {
      const rawUrl = requestUrl(args[0]);
      const isMonitorRequest = rawUrl.startsWith(endpoint);
      try {
        const response = await originalFetch(...args);
        if (!isMonitorRequest && !response.ok) {
          capture(
            new Error(`HTTP ${response.status} ${response.statusText || "request failed"}`),
            {
              project,
              endpoint,
              name: `api:${sanitize(rawUrl, 140)}`,
            },
          );
        }
        return response;
      } catch (error) {
        if (!isMonitorRequest) {
          capture(error, {
            project,
            endpoint,
            name: `network:${sanitize(rawUrl, 136)}`,
          });
        }
        throw error;
      }
    };
  }

  function install({ project, endpoint = DEFAULT_ENDPOINT }) {
    if (!project || installedProjects.has(project)) return;
    installedProjects.add(project);
    installFetchMonitor(project, endpoint);

    globalThis.addEventListener?.("error", (event) => {
      capture(event.error || event.message || "Unknown browser error", {
        project,
        endpoint,
        name: "unhandled-error",
      });
    });
    globalThis.addEventListener?.("unhandledrejection", (event) => {
      capture(event.reason || "Unhandled promise rejection", {
        project,
        endpoint,
        name: "unhandled-rejection",
      });
    });
    void flush(project, endpoint);
  }

  globalThis.RedRav3nErrorMonitor = Object.freeze({
    capture,
    flush,
    install,
    sanitize,
  });

  if (!globalThis.document && globalThis.chrome?.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message?.action !== "redrav3nErrorMonitor:report") return false;
      postReport(message.report, message.endpoint || DEFAULT_ENDPOINT)
        .then((ok) => sendResponse({ ok }))
        .catch(() => sendResponse({ ok: false }));
      return true;
    });
  }

  const script = globalThis.document?.currentScript;
  if (script?.dataset.project) {
    install({
      project: script.dataset.project,
      endpoint: script.dataset.endpoint || DEFAULT_ENDPOINT,
    });
  }
})();
