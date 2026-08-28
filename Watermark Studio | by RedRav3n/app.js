const STORAGE_KEY = "watermarkStudioConfigsV1";
const ACTIVE_KEY = "watermarkStudioActiveConfigV1";
const TELEGRAM_URL = "https://t.me/LinkHub_RedRav3n";

const defaultConfig = {
  id: "telegram",
  name: "Telegram",
  maxWidth: 1280,
  maxHeight: 1280,
  allowUpscale: false,
  watermarkType: "text",
  watermarkText: "@RedRav3n",
  watermarkImageDataUrl: "",
  watermarkImageName: "",
  fontSize: 44,
  imageSize: 160,
  opacity: 32,
  margin: 34,
  rotation: 0,
  position: "bottom-right",
  color: "#ffffff",
  format: "image/jpeg",
  quality: 92,
};

const els = {
  pageTitle: document.getElementById("pageTitle"),
  navItems: [...document.querySelectorAll(".nav-item")],
  views: {
    studio: document.getElementById("studioView"),
    configs: document.getElementById("configsView"),
  },
  imageInput: document.getElementById("imageInput"),
  watermarkImageInput: document.getElementById("watermarkImageInput"),
  importConfigInput: document.getElementById("importConfigInput"),
  configSelect: document.getElementById("configSelect"),
  imageLabel: document.getElementById("imageLabel"),
  watermarkImageName: document.getElementById("watermarkImageName"),
  dropZone: document.getElementById("dropZone"),
  canvas: document.getElementById("previewCanvas"),
  canvasEmpty: document.getElementById("canvasEmpty"),
  downloadBtn: document.getElementById("downloadBtn"),
  saveConfigBtn: document.getElementById("saveConfigBtn"),
  newConfigBtn: document.getElementById("newConfigBtn"),
  newConfigBtnAlt: document.getElementById("newConfigBtnAlt"),
  bulkConfigBtn: document.getElementById("bulkConfigBtn"),
  bulkConfigBtnAlt: document.getElementById("bulkConfigBtnAlt"),
  exportConfigBtn: document.getElementById("exportConfigBtn"),
  removeWatermarkImageBtn: document.getElementById("removeWatermarkImageBtn"),
  configsGrid: document.getElementById("configsGrid"),
  activeConfigName: document.getElementById("activeConfigName"),
  outputSize: document.getElementById("outputSize"),
  textWatermarkControls: document.getElementById("textWatermarkControls"),
  imageWatermarkControls: document.getElementById("imageWatermarkControls"),
  textSizeControl: document.getElementById("textSizeControl"),
  imageSizeControl: document.getElementById("imageSizeControl"),
  textColorControl: document.getElementById("textColorControl"),
  bulkConfigDialog: document.getElementById("bulkConfigDialog"),
  bulkConfigForm: document.getElementById("bulkConfigForm"),
  bulkConfigNames: document.getElementById("bulkConfigNames"),
  closeBulk: [...document.querySelectorAll("[data-close-bulk]")],
  socialIntegrations: document.getElementById("socialIntegrations"),
  socialDialog: document.getElementById("socialDialog"),
  telegramBtn: document.getElementById("telegramBtn"),
  closeSocial: [...document.querySelectorAll("[data-close-social]")],
};

const fields = {
  name: document.getElementById("configName"),
  maxWidth: document.getElementById("maxWidth"),
  maxHeight: document.getElementById("maxHeight"),
  allowUpscale: document.getElementById("allowUpscale"),
  watermarkType: document.getElementById("watermarkType"),
  watermarkText: document.getElementById("watermarkText"),
  fontSize: document.getElementById("fontSize"),
  imageSize: document.getElementById("imageSize"),
  opacity: document.getElementById("opacity"),
  margin: document.getElementById("margin"),
  rotation: document.getElementById("rotation"),
  position: document.getElementById("position"),
  color: document.getElementById("color"),
  format: document.getElementById("format"),
  quality: document.getElementById("quality"),
};

let configs = [];
let activeConfigId = defaultConfig.id;
let sourceImage = null;
let sourceFileName = "watermark-photo";
let watermarkImage = null;
let watermarkImageSrc = "";

const ctx = els.canvas.getContext("2d", { alpha: true });

init();

async function init() {
  const saved = await chrome.storage.local.get([STORAGE_KEY, ACTIVE_KEY]);
  configs =
    Array.isArray(saved[STORAGE_KEY]) && saved[STORAGE_KEY].length
      ? saved[STORAGE_KEY].map(normalizeConfig)
      : [defaultConfig];
  activeConfigId = saved[ACTIVE_KEY] || configs[0].id;
  if (!configs.some((config) => config.id === activeConfigId)) {
    activeConfigId = configs[0].id;
  }

  fillForm(getActiveConfig());
  bindEvents();
  renderConfigs();
  render();
}

function bindEvents() {
  els.navItems.forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  els.imageInput.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (file) loadImageFile(file);
  });

  els.watermarkImageInput.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) loadWatermarkImageFile(file);
  });

  els.configSelect.addEventListener("change", () => {
    activeConfigId = els.configSelect.value;
    fillForm(getActiveConfig());
    persist();
    renderConfigs();
    render();
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    els.dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      els.dropZone.classList.add("dragging");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    els.dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      els.dropZone.classList.remove("dragging");
    });
  });

  els.dropZone.addEventListener("drop", (event) => {
    const file = [...event.dataTransfer.files].find((item) =>
      item.type.startsWith("image/"),
    );
    if (file) loadImageFile(file);
  });

  Object.values(fields).forEach((field) => {
    field.addEventListener("input", () => {
      updateActiveConfig(readForm());
      render();
    });
    field.addEventListener("change", () => {
      updateActiveConfig(readForm());
      render();
    });
  });

  els.saveConfigBtn.addEventListener("click", saveCurrentConfig);
  els.newConfigBtn.addEventListener("click", createConfig);
  els.newConfigBtnAlt.addEventListener("click", createConfig);
  els.bulkConfigBtn.addEventListener("click", openBulkDialog);
  els.bulkConfigBtnAlt.addEventListener("click", openBulkDialog);
  els.bulkConfigForm.addEventListener("submit", createBulkConfigs);
  els.closeBulk.forEach((button) =>
    button.addEventListener("click", () => els.bulkConfigDialog.close()),
  );
  els.exportConfigBtn.addEventListener("click", exportActiveConfig);
  els.importConfigInput.addEventListener("change", importConfig);
  els.downloadBtn.addEventListener("click", downloadImage);
  els.removeWatermarkImageBtn.addEventListener("click", removeWatermarkImage);

  els.socialIntegrations.addEventListener("click", () =>
    els.socialDialog.showModal(),
  );
  els.closeSocial.forEach((button) =>
    button.addEventListener("click", () => els.socialDialog.close()),
  );
  els.telegramBtn.addEventListener("click", () => {
    chrome.tabs.create({ url: TELEGRAM_URL });
    els.socialDialog.close();
  });
}

function setView(view) {
  els.navItems.forEach((button) =>
    button.classList.toggle("active", button.dataset.view === view),
  );
  Object.entries(els.views).forEach(([name, node]) =>
    node.classList.toggle("active", name === view),
  );
  els.pageTitle.textContent = view === "configs" ? "Конфигурации" : "Студия";
}

function getActiveConfig() {
  return configs.find((config) => config.id === activeConfigId) || configs[0];
}

function normalizeConfig(config) {
  const watermarkType = ["text", "image", "both"].includes(config.watermarkType)
    ? config.watermarkType
    : defaultConfig.watermarkType;

  return {
    ...defaultConfig,
    ...config,
    id: String(config.id || crypto.randomUUID()),
    name: String(config.name || "Без названия").slice(0, 64),
    watermarkType,
    maxWidth: clampInt(config.maxWidth, 1, 10000, defaultConfig.maxWidth),
    maxHeight: clampInt(config.maxHeight, 1, 10000, defaultConfig.maxHeight),
    fontSize: clampInt(config.fontSize, 8, 500, defaultConfig.fontSize),
    imageSize: clampInt(config.imageSize, 8, 2000, defaultConfig.imageSize),
    opacity: clampInt(config.opacity, 0, 100, defaultConfig.opacity),
    margin: clampInt(config.margin, 0, 1000, defaultConfig.margin),
    rotation: clampInt(config.rotation, -45, 45, defaultConfig.rotation),
    quality: clampInt(config.quality, 10, 100, defaultConfig.quality),
  };
}

function clampInt(value, min, max, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function fillForm(config) {
  fields.name.value = config.name;
  fields.maxWidth.value = config.maxWidth;
  fields.maxHeight.value = config.maxHeight;
  fields.allowUpscale.checked = Boolean(config.allowUpscale);
  fields.watermarkType.value = config.watermarkType;
  fields.watermarkText.value = config.watermarkText;
  fields.fontSize.value = config.fontSize;
  fields.imageSize.value = config.imageSize;
  fields.opacity.value = config.opacity;
  fields.margin.value = config.margin;
  fields.rotation.value = config.rotation;
  fields.position.value = config.position;
  fields.color.value = config.color;
  fields.format.value = config.format;
  fields.quality.value = config.quality;
  updateWatermarkImageLabel(config);
  updateWatermarkControls(config);
  loadStoredWatermarkImage(config.watermarkImageDataUrl);
}

function readForm() {
  return normalizeConfig({
    ...getActiveConfig(),
    name: fields.name.value.trim() || "Без названия",
    maxWidth: fields.maxWidth.value,
    maxHeight: fields.maxHeight.value,
    allowUpscale: fields.allowUpscale.checked,
    watermarkType: fields.watermarkType.value,
    watermarkText: fields.watermarkText.value,
    fontSize: fields.fontSize.value,
    imageSize: fields.imageSize.value,
    opacity: fields.opacity.value,
    margin: fields.margin.value,
    rotation: fields.rotation.value,
    position: fields.position.value,
    color: fields.color.value,
    format: fields.format.value,
    quality: fields.quality.value,
  });
}

function updateActiveConfig(nextConfig) {
  configs = configs.map((config) =>
    config.id === activeConfigId ? nextConfig : config,
  );
  els.activeConfigName.textContent = nextConfig.name;
  renderConfigs();
  renderConfigSelect();
  updateWatermarkImageLabel(nextConfig);
  updateWatermarkControls(nextConfig);
  persist();
}

async function persist() {
  await chrome.storage.local.set({
    [STORAGE_KEY]: configs,
    [ACTIVE_KEY]: activeConfigId,
  });
}

function saveCurrentConfig() {
  updateActiveConfig(readForm());
  els.saveConfigBtn.textContent = "Сохранено";
  setTimeout(() => {
    els.saveConfigBtn.textContent = "Сохранить";
  }, 900);
}

function createConfig() {
  const copy = {
    ...readForm(),
    id: crypto.randomUUID(),
    name: "Новая конфигурация",
  };
  configs = [copy, ...configs];
  activeConfigId = copy.id;
  fillForm(copy);
  persist();
  renderConfigs();
  render();
}

function openBulkDialog() {
  els.bulkConfigDialog.showModal();
  els.bulkConfigNames.focus();
}

function createBulkConfigs(event) {
  event.preventDefault();
  const names = els.bulkConfigNames.value
    .split(/\r?\n/)
    .map((name) => name.trim())
    .filter(Boolean);
  if (!names.length) return;

  const base = readForm();
  const created = names.map((name) => ({
    ...base,
    id: crypto.randomUUID(),
    name: name.slice(0, 64),
  }));
  configs = [...created, ...configs];
  activeConfigId = created[0].id;
  fillForm(created[0]);
  persist();
  renderConfigs();
  render();
  els.bulkConfigDialog.close();
}

function renderConfigs() {
  renderConfigSelect();
  els.configsGrid.replaceChildren(
    ...configs.map((config) => {
      const card = document.createElement("article");
      card.className = `data-card${config.id === activeConfigId ? " active" : ""}`;

      const main = document.createElement("div");
      main.className = "data-main";
      main.innerHTML = `<strong></strong><span></span>`;
      main.querySelector("strong").textContent = config.name;
      main.querySelector("span").textContent =
        `${config.maxWidth}x${config.maxHeight} · ${config.position} · ${config.opacity}%`;

      const actions = document.createElement("div");
      actions.className = "data-actions";

      const useBtn = makeButton("secondary", "Выбрать", () => {
        activeConfigId = config.id;
        fillForm(config);
        persist();
        renderConfigs();
        render();
        setView("studio");
      });
      const exportBtn = makeButton("primary", "Скачать", () =>
        downloadConfig(config),
      );
      const deleteBtn = makeButton("danger-button", "Удалить", () => {
        if (configs.length === 1) return;
        configs = configs.filter((item) => item.id !== config.id);
        if (activeConfigId === config.id) activeConfigId = configs[0].id;
        fillForm(getActiveConfig());
        persist();
        renderConfigs();
        render();
      });
      deleteBtn.disabled = configs.length === 1;

      actions.append(useBtn, exportBtn, deleteBtn);
      card.append(main, actions);
      return card;
    }),
  );
}

function renderConfigSelect() {
  els.configSelect.replaceChildren(
    ...configs.map((config) => {
      const option = document.createElement("option");
      option.value = config.id;
      option.textContent = config.name;
      option.selected = config.id === activeConfigId;
      return option;
    }),
  );
}

function makeButton(className, text, onClick) {
  const button = document.createElement("button");
  button.className = className;
  button.type = "button";
  button.textContent = text;
  button.addEventListener("click", onClick);
  return button;
}

function loadImageFile(file) {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    URL.revokeObjectURL(url);
    sourceImage = img;
    sourceFileName = stripExtension(file.name) || "watermark-photo";
    els.imageLabel.textContent = `${file.name} · ${img.naturalWidth}x${img.naturalHeight}`;
    els.canvasEmpty.classList.add("hidden");
    els.downloadBtn.disabled = false;
    render();
  };
  img.onerror = () => {
    URL.revokeObjectURL(url);
    els.imageLabel.textContent = "Не удалось открыть фото";
  };
  img.src = url;
}

function loadWatermarkImageFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const config = readForm();
    config.watermarkImageDataUrl = String(reader.result);
    config.watermarkImageName = file.name;
    if (config.watermarkType === "text") config.watermarkType = "image";
    updateActiveConfig(config);
    fillForm(config);
    render();
  };
  reader.readAsDataURL(file);
}

function removeWatermarkImage() {
  const config = readForm();
  config.watermarkImageDataUrl = "";
  config.watermarkImageName = "";
  if (config.watermarkType === "image") config.watermarkType = "text";
  watermarkImage = null;
  watermarkImageSrc = "";
  updateActiveConfig(config);
  fillForm(config);
  render();
}

function updateWatermarkImageLabel(config) {
  els.watermarkImageName.textContent =
    config.watermarkImageName || "Картинка не выбрана";
  els.removeWatermarkImageBtn.disabled = !config.watermarkImageDataUrl;
}

function updateWatermarkControls(config) {
  const showText =
    config.watermarkType === "text" || config.watermarkType === "both";
  const showImage =
    config.watermarkType === "image" || config.watermarkType === "both";
  els.textWatermarkControls.classList.toggle("hidden", !showText);
  els.imageWatermarkControls.classList.toggle("hidden", !showImage);
  els.textSizeControl.classList.toggle("hidden", !showText);
  els.textColorControl.classList.toggle("hidden", !showText);
  els.imageSizeControl.classList.toggle("hidden", !showImage);
}

function loadStoredWatermarkImage(src) {
  if (!src) {
    watermarkImage = null;
    watermarkImageSrc = "";
    return;
  }
  if (src === watermarkImageSrc && watermarkImage) return;

  const image = new Image();
  image.onload = () => {
    watermarkImage = image;
    watermarkImageSrc = src;
    render();
  };
  image.src = src;
}

function render() {
  const config = readForm();
  els.activeConfigName.textContent = config.name;

  if (!sourceImage) {
    els.outputSize.textContent = "Нет фото";
    return;
  }

  const size = WatermarkRenderer.getOutputSize(sourceImage, config);
  els.canvas.width = size.width;
  els.canvas.height = size.height;
  ctx.clearRect(0, 0, size.width, size.height);
  ctx.drawImage(sourceImage, 0, 0, size.width, size.height);
  WatermarkRenderer.drawWatermark(ctx, size, config, watermarkImage);
  els.outputSize.textContent = `${size.width}x${size.height}`;
}

function downloadImage() {
  if (!sourceImage) return;
  const config = readForm();
  const extension = getExtension(config.format);
  els.canvas.toBlob(
    (blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      chrome.downloads.download(
        {
          url,
          filename: `${slugify(sourceFileName)}-${slugify(config.name)}.${extension}`,
          saveAs: true,
        },
        () => setTimeout(() => URL.revokeObjectURL(url), 1500),
      );
    },
    config.format,
    config.quality / 100,
  );
}

function exportActiveConfig() {
  downloadConfig(readForm());
}

function downloadConfig(config) {
  const payload = {
    type: "Watermark Studio | by RedRav3n",
    version: 1,
    exportedAt: new Date().toISOString(),
    config: normalizeConfig(config),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download(
    {
      url,
      filename: `watermark-config-${slugify(config.name)}.json`,
      saveAs: true,
    },
    () => setTimeout(() => URL.revokeObjectURL(url), 1500),
  );
}

function importConfig(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      const imported = normalizeConfig(parsed.config || parsed);
      imported.id = crypto.randomUUID();
      configs = [imported, ...configs];
      activeConfigId = imported.id;
      fillForm(imported);
      persist();
      renderConfigs();
      render();
      setView("studio");
    } catch (_) {
      alert("Не удалось импортировать конфигурацию.");
    }
  };
  reader.readAsText(file);
}

function stripExtension(name) {
  return name.replace(/\.[^.]+$/, "");
}

function getExtension(format) {
  if (format === "image/png") return "png";
  if (format === "image/webp") return "webp";
  return "jpg";
}

function slugify(value) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9а-яё_-]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "config"
  );
}
