const UI_SETTINGS_KEY = "watermarkStudioUiSettingsV1";

const uiDefaults = {
  language: "ru",
  accent: "red",
  motion: "full",
  compact: false,
  glow: true,
  scale: "100",
};

const accentMap = {
  red: ["#d9293b", "#ed3b4d", "#ff8791", "rgba(217, 41, 59, .16)"],
  blue: ["#6b9cff", "#82aaff", "#a8c3ff", "rgba(107, 156, 255, .16)"],
  green: ["#45c98d", "#55d99b", "#8ae8bb", "rgba(69, 201, 141, .16)"],
  violet: ["#b383ff", "#c19aff", "#d7bcff", "rgba(179, 131, 255, .16)"],
};

const translations = {
  en: {
    "Студия": "Studio",
    "Фото и водяной знак": "Photo and watermark",
    "Конфигурации": "Configurations",
    "Импорт и экспорт": "Import and export",
    "Настройки": "Settings",
    "Интерфейс и язык": "Interface and language",
    "Интеграции": "Integrations",
    "Конфигурация": "Configuration",
    "Скачать фото": "Download photo",
    "Активная конфигурация": "Active configuration",
    "Итоговый размер": "Output size",
    "Нет фото": "No photo",
    "Новая": "New",
    "Создать несколько": "Create multiple",
    "Сохранить": "Save",
    "Сохранено": "Saved",
    "Выберите или перетащите фото": "Choose or drop a photo",
    "JPG, PNG, WebP. Обработка только на устройстве.": "JPG, PNG, WebP. Processing stays on your device.",
    "Предпросмотр появится здесь": "Preview will appear here",
    "Загрузите фото и настройте размер, прозрачность и позицию водяного знака.": "Upload a photo and configure the watermark size, opacity, and position.",
    "Основное": "General",
    "Название": "Name",
    "Ширина, px": "Width, px",
    "Высота, px": "Height, px",
    "Увеличивать маленькие фото": "Upscale small photos",
    "Водяной знак": "Watermark",
    "Тип": "Type",
    "Текст": "Text",
    "Картинка": "Image",
    "Текст + картинка": "Text + image",
    "Выбрать картинку": "Choose image",
    "Картинка не выбрана": "No image selected",
    "Убрать картинку": "Remove image",
    "Размер текста": "Text size",
    "Размер картинки": "Image size",
    "Прозрачность, %": "Opacity, %",
    "Поворот": "Rotation",
    "Позиция": "Position",
    "Снизу справа": "Bottom right",
    "Снизу слева": "Bottom left",
    "Сверху справа": "Top right",
    "Сверху слева": "Top left",
    "По центру": "Center",
    "Плиткой": "Tile",
    "Отступ": "Margin",
    "Цвет текста": "Text color",
    "Скачивание": "Download",
    "Формат": "Format",
    "Качество": "Quality",
    "Обмен настройками": "Settings exchange",
    "Конфигурацию можно скачать JSON-файлом, отправить другу, а он импортирует её в расширении.": "Download a configuration as JSON, share it, and import it into another extension.",
    "Скачать конфигурацию": "Download configuration",
    "Импортировать": "Import",
    "Выбрать": "Select",
    "Скачать": "Download",
    "Удалить": "Delete",
    "Внешний вид": "Appearance",
    "Настройте Watermark Studio так же, как интерфейс RedRav3n Mail.": "Customize Watermark Studio to match the RedRav3n Mail interface.",
    "Акцентный цвет": "Accent color",
    "Красный RedRav3n": "RedRav3n red",
    "Синий": "Blue",
    "Зелёный": "Green",
    "Фиолетовый": "Violet",
    "Масштаб интерфейса": "Interface scale",
    "Компактный режим": "Compact mode",
    "Уменьшает отступы и высоту элементов.": "Reduces spacing and control height.",
    "Фоновое свечение": "Background glow",
    "Показывать мягкое фирменное свечение.": "Show the soft brand glow.",
    "Движение": "Motion",
    "Режим анимаций": "Animation mode",
    "Полные": "Full",
    "Уменьшенные": "Reduced",
    "Выключены": "Off",
    "Используются короткие переходы RedRav3n Mail и плавный вход панелей.": "Uses short RedRav3n Mail transitions and smooth panel entrances.",
    "Язык": "Language",
    "Язык интерфейса": "Interface language",
    "Русский": "Russian",
    "Українська": "Ukrainian",
    "English": "English",
    "Настройки сохраняются автоматически на этом устройстве.": "Settings are saved automatically on this device.",
    "Telegram": "Telegram",
    "Откройте Telegram, чтобы посмотреть интеграции, инструменты и полезные ссылки RedRav3n.": "Open Telegram to view RedRav3n integrations, tools, and useful links.",
    "Отмена": "Cancel",
    "Перейти в Telegram": "Open Telegram",
    "Введите названия по одному в строке. Для каждой будут скопированы текущие настройки.": "Enter one name per line. Current settings will be copied to each one.",
    "Названия": "Names",
    "Создать": "Create",
    "Закрыть": "Close",
    "Без названия": "Untitled",
    "Новая конфигурация": "New configuration",
    "Не удалось открыть фото": "Could not open photo"
  },
  uk: {
    "Студия": "Студія",
    "Фото и водяной знак": "Фото та водяний знак",
    "Конфигурации": "Конфігурації",
    "Импорт и экспорт": "Імпорт та експорт",
    "Настройки": "Налаштування",
    "Интерфейс и язык": "Інтерфейс і мова",
    "Интеграции": "Інтеграції",
    "Конфигурация": "Конфігурація",
    "Скачать фото": "Завантажити фото",
    "Активная конфигурация": "Активна конфігурація",
    "Итоговый размер": "Підсумковий розмір",
    "Нет фото": "Немає фото",
    "Новая": "Нова",
    "Создать несколько": "Створити кілька",
    "Сохранить": "Зберегти",
    "Сохранено": "Збережено",
    "Выберите или перетащите фото": "Виберіть або перетягніть фото",
    "JPG, PNG, WebP. Обработка только на устройстве.": "JPG, PNG, WebP. Обробка лише на пристрої.",
    "Предпросмотр появится здесь": "Попередній перегляд з’явиться тут",
    "Загрузите фото и настройте размер, прозрачность и позицию водяного знака.": "Завантажте фото та налаштуйте розмір, прозорість і позицію водяного знака.",
    "Основное": "Основне",
    "Название": "Назва",
    "Ширина, px": "Ширина, px",
    "Высота, px": "Висота, px",
    "Увеличивать маленькие фото": "Збільшувати маленькі фото",
    "Водяной знак": "Водяний знак",
    "Тип": "Тип",
    "Текст": "Текст",
    "Картинка": "Зображення",
    "Текст + картинка": "Текст + зображення",
    "Выбрать картинку": "Вибрати зображення",
    "Картинка не выбрана": "Зображення не вибрано",
    "Убрать картинку": "Прибрати зображення",
    "Размер текста": "Розмір тексту",
    "Размер картинки": "Розмір зображення",
    "Прозрачность, %": "Прозорість, %",
    "Поворот": "Поворот",
    "Позиция": "Позиція",
    "Снизу справа": "Знизу праворуч",
    "Снизу слева": "Знизу ліворуч",
    "Сверху справа": "Зверху праворуч",
    "Сверху слева": "Зверху ліворуч",
    "По центру": "По центру",
    "Плиткой": "Плиткою",
    "Отступ": "Відступ",
    "Цвет текста": "Колір тексту",
    "Скачивание": "Завантаження",
    "Формат": "Формат",
    "Качество": "Якість",
    "Обмен настройками": "Обмін налаштуваннями",
    "Конфигурацию можно скачать JSON-файлом, отправить другу, а он импортирует её в расширении.": "Конфігурацію можна завантажити JSON-файлом, надіслати іншому користувачу та імпортувати в розширенні.",
    "Скачать конфигурацию": "Завантажити конфігурацію",
    "Импортировать": "Імпортувати",
    "Выбрать": "Вибрати",
    "Скачать": "Завантажити",
    "Удалить": "Видалити",
    "Внешний вид": "Зовнішній вигляд",
    "Настройте Watermark Studio так же, как интерфейс RedRav3n Mail.": "Налаштуйте Watermark Studio у стилі інтерфейсу RedRav3n Mail.",
    "Акцентный цвет": "Акцентний колір",
    "Красный RedRav3n": "Червоний RedRav3n",
    "Синий": "Синій",
    "Зелёный": "Зелений",
    "Фиолетовый": "Фіолетовий",
    "Масштаб интерфейса": "Масштаб інтерфейсу",
    "Компактный режим": "Компактний режим",
    "Уменьшает отступы и высоту элементов.": "Зменшує відступи та висоту елементів.",
    "Фоновое свечение": "Фонове світіння",
    "Показывать мягкое фирменное свечение.": "Показувати м’яке фірмове світіння.",
    "Движение": "Рух",
    "Режим анимаций": "Режим анімацій",
    "Полные": "Повні",
    "Уменьшенные": "Зменшені",
    "Выключены": "Вимкнені",
    "Используются короткие переходы RedRav3n Mail и плавный вход панелей.": "Використовуються короткі переходи RedRav3n Mail і плавна поява панелей.",
    "Язык": "Мова",
    "Язык интерфейса": "Мова інтерфейсу",
    "Русский": "Російська",
    "Українська": "Українська",
    "English": "English",
    "Настройки сохраняются автоматически на этом устройстве.": "Налаштування автоматично зберігаються на цьому пристрої.",
    "Откройте Telegram, чтобы посмотреть интеграции, инструменты и полезные ссылки RedRav3n.": "Відкрийте Telegram, щоб переглянути інтеграції, інструменти та корисні посилання RedRav3n.",
    "Отмена": "Скасувати",
    "Перейти в Telegram": "Перейти в Telegram",
    "Введите названия по одному в строке. Для каждой будут скопированы текущие настройки.": "Введіть назви по одній у рядку. Для кожної буде скопійовано поточні налаштування.",
    "Названия": "Назви",
    "Создать": "Створити",
    "Закрыть": "Закрити",
    "Без названия": "Без назви",
    "Новая конфигурация": "Нова конфігурація",
    "Не удалось открыть фото": "Не вдалося відкрити фото"
  }
};

let uiSettings = { ...uiDefaults };
const originalText = new WeakMap();
const originalAttrs = new WeakMap();

initUiSettings();

async function initUiSettings() {
  const saved = await chrome.storage.local.get(UI_SETTINGS_KEY);
  uiSettings = { ...uiDefaults, ...(saved[UI_SETTINGS_KEY] || {}) };
  bindSettingsNavigation();
  bindSettingsControls();
  applyUiSettings();
  observeDynamicText();
}

function bindSettingsNavigation() {
  const settingsBtn = document.querySelector('[data-view="settings"]');
  const settingsView = document.getElementById("settingsView");
  if (!settingsBtn || !settingsView) return;

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      const isSettings = button.dataset.view === "settings";
      settingsView.classList.toggle("active", isSettings);
      if (!isSettings) return;
      document.querySelectorAll(".view").forEach((view) => {
        if (view !== settingsView) view.classList.remove("active");
      });
      document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item === settingsBtn));
      const title = document.getElementById("pageTitle");
      if (title) title.textContent = "Настройки";
      translateDocument(uiSettings.language);
    });
  });
}

function bindSettingsControls() {
  const language = document.getElementById("uiLanguage");
  const accent = document.getElementById("uiAccent");
  const motion = document.getElementById("uiMotion");
  const compact = document.getElementById("uiCompact");
  const glow = document.getElementById("uiGlow");
  const scale = document.getElementById("uiScale");

  if (language) language.addEventListener("change", () => updateUiSetting("language", language.value));
  if (accent) accent.addEventListener("change", () => updateUiSetting("accent", accent.value));
  if (motion) motion.addEventListener("change", () => updateUiSetting("motion", motion.value));
  if (compact) compact.addEventListener("change", () => updateUiSetting("compact", compact.checked));
  if (glow) glow.addEventListener("change", () => updateUiSetting("glow", glow.checked));
  if (scale) scale.addEventListener("change", () => updateUiSetting("scale", scale.value));
}

async function updateUiSetting(key, value) {
  uiSettings[key] = value;
  await chrome.storage.local.set({ [UI_SETTINGS_KEY]: uiSettings });
  applyUiSettings();
}

function applyUiSettings() {
  const root = document.documentElement;
  const accent = accentMap[uiSettings.accent] || accentMap.red;
  root.style.setProperty("--rr-accent", accent[0]);
  root.style.setProperty("--red", accent[0]);
  root.style.setProperty("--rr-accent-hover", accent[1]);
  root.style.setProperty("--rr-accent-light", accent[2]);
  root.style.setProperty("--rr-accent-soft", accent[3]);
  root.style.setProperty("--ui-scale", `${Number(uiSettings.scale || 100) / 100}`);
  root.dataset.motion = uiSettings.motion;
  root.dataset.compact = String(Boolean(uiSettings.compact));
  root.dataset.glow = String(Boolean(uiSettings.glow));
  root.lang = uiSettings.language === "uk" ? "uk" : uiSettings.language;

  setControlValue("uiLanguage", uiSettings.language);
  setControlValue("uiAccent", uiSettings.accent);
  setControlValue("uiMotion", uiSettings.motion);
  setControlValue("uiScale", uiSettings.scale);
  setControlChecked("uiCompact", uiSettings.compact);
  setControlChecked("uiGlow", uiSettings.glow);
  translateDocument(uiSettings.language);
}

function setControlValue(id, value) {
  const node = document.getElementById(id);
  if (node) node.value = value;
}

function setControlChecked(id, value) {
  const node = document.getElementById(id);
  if (node) node.checked = Boolean(value);
}

function translateDocument(language) {
  document.querySelectorAll("body *").forEach((node) => {
    if (node.children.length === 0 && node.textContent.trim()) translateNode(node, language);
    ["placeholder", "aria-label", "title"].forEach((attr) => translateAttribute(node, attr, language));
  });
}

function translateNode(node, language) {
  if (!originalText.has(node)) originalText.set(node, node.textContent);
  const base = originalText.get(node);
  const trimmed = base.trim();
  if (language === "ru") {
    node.textContent = base;
    return;
  }
  const translated = translations[language]?.[trimmed];
  if (translated) node.textContent = base.replace(trimmed, translated);
}

function translateAttribute(node, attr, language) {
  if (!node.hasAttribute?.(attr)) return;
  let stored = originalAttrs.get(node);
  if (!stored) {
    stored = {};
    originalAttrs.set(node, stored);
  }
  if (!(attr in stored)) stored[attr] = node.getAttribute(attr);
  const base = stored[attr];
  if (language === "ru") {
    node.setAttribute(attr, base);
    return;
  }
  node.setAttribute(attr, translations[language]?.[base] || base);
}

function observeDynamicText() {
  const observer = new MutationObserver(() => translateDocument(uiSettings.language));
  observer.observe(document.body, { childList: true, subtree: true });
}
