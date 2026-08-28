Object.assign(translations.en, {
  "Интерфейс": "Interface",
  "Фирменный красный или дополнительная палитра.": "Brand red or an alternative accent palette.",
  "Размер элементов и текста.": "Size of interface elements and text.",
  "Анимации": "Animations",
  "Локализация": "Localization",
  "Перевод применяется ко всему интерфейсу расширения.": "Translation is applied to the entire extension interface.",
  "Локальное изменение размера фото с сохранением пропорций и водяным знаком.": "Resize photos locally while preserving proportions and applying a watermark.",
  "Открыть студию": "Open studio",
  "Фото обрабатываются локально · без загрузки на сервер": "Photos are processed locally · no server upload"
});

Object.assign(translations.uk, {
  "Интерфейс": "Інтерфейс",
  "Фирменный красный или дополнительная палитра.": "Фірмовий червоний або додаткова палітра акцентів.",
  "Размер элементов и текста.": "Розмір елементів і тексту.",
  "Анимации": "Анімації",
  "Локализация": "Локалізація",
  "Перевод применяется ко всему интерфейсу расширения.": "Переклад застосовується до всього інтерфейсу розширення.",
  "Локальное изменение размера фото с сохранением пропорций и водяным знаком.": "Локальна зміна розміру фото зі збереженням пропорцій і водяним знаком.",
  "Открыть студию": "Відкрити студію",
  "Фото обрабатываются локально · без загрузки на сервер": "Фото обробляються локально · без завантаження на сервер"
});

const reverseTranslations = {};
Object.values(translations).forEach((dictionary) => {
  Object.entries(dictionary).forEach(([base, translated]) => {
    reverseTranslations[translated] = base;
  });
});

function resolveBaseText(value) {
  const trimmed = String(value || "").trim();
  return reverseTranslations[trimmed] || trimmed;
}

translateNode = function translateNodeSafe(node, language) {
  const current = node.textContent;
  const trimmed = current.trim();
  if (!trimmed) return;
  const base = resolveBaseText(trimmed);
  const next = language === "ru" ? base : (translations[language]?.[base] || base);
  if (trimmed !== next) node.textContent = current.replace(trimmed, next);
};

translateAttribute = function translateAttributeSafe(node, attr, language) {
  if (!node.hasAttribute?.(attr)) return;
  const current = node.getAttribute(attr) || "";
  const base = resolveBaseText(current);
  const next = language === "ru" ? base : (translations[language]?.[base] || base);
  if (current !== next) node.setAttribute(attr, next);
};

observeDynamicText = function observeDynamicTextSafe() {
  let translating = false;
  const observer = new MutationObserver(() => {
    if (translating) return;
    translating = true;
    observer.disconnect();
    translateDocument(uiSettings.language);
    observer.observe(document.body, { childList: true, characterData: true, subtree: true });
    translating = false;
  });
  observer.observe(document.body, { childList: true, characterData: true, subtree: true });
};
