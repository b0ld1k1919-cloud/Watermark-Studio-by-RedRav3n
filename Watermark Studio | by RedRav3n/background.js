importScripts("redrav3n_error_monitor/monitor.js");
RedRav3nErrorMonitor.install({ project: "watermark-studio" });

const APP_URL = chrome.runtime.getURL("app.html");
let appWindowId = null;
let openingApp = null;

async function openAppWindow() {
  if (openingApp) return openingApp;
  openingApp = (async () => {
    if (appWindowId !== null) {
      try {
        await chrome.windows.update(appWindowId, { focused: true });
        return appWindowId;
      } catch (_) {
        appWindowId = null;
      }
    }

    const created = await chrome.windows.create({
      url: APP_URL,
      type: "popup",
      width: 1180,
      height: 790,
      focused: true,
    });
    appWindowId = created.id ?? null;
    return appWindowId;
  })();
  try {
    return await openingApp;
  } finally {
    openingApp = null;
  }
}

function reportBackgroundError(error, name) {
  RedRav3nErrorMonitor.capture(error, {
    project: "watermark-studio",
    name,
  });
}

chrome.action.onClicked.addListener(() =>
  openAppWindow().catch((error) => reportBackgroundError(error, "open-app")),
);
chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === appWindowId) appWindowId = null;
});
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action !== "openApp") return false;
  openAppWindow()
    .then(() => sendResponse({ ok: true }))
    .catch((error) => {
      reportBackgroundError(error, "open-app-message");
      sendResponse({ ok: false, error: error.message });
    });
  return true;
});
