# Watermark Studio

## Назначение

Chrome-расширение Manifest V3 для локального изменения размеров изображений и добавления текстовых или графических водяных знаков.

## Стек и запуск

- HTML, CSS и JavaScript без сборщика.
- Canvas API; обработка выполняется в браузере.
- Chrome APIs: `storage`, `downloads`, `windows`.
- Для запуска загрузить директорию как unpacked extension на `chrome://extensions`.

## Структура

- `manifest.json` — разрешения и точки входа.
- `popup.*`, `background.js` — запуск отдельного окна.
- `app.html`, `styles.css`, `app.js` — редактор, preview и конфигурации.
- `canvas-renderer.js` — расчёт выходного размера и отрисовка Canvas.
- `redrav3n_error_monitor/monitor.js` — независимый монитор UI, service worker и API.
- `icons/` — локальные ресурсы.

Публичный ключ Chrome Web Store закреплён в `manifest.json`; постоянный ID расширения — `bjfmphiolpmjmipnenfogdhofipcbklg`.

## Данные и безопасность

Изображения не загружаются на сервер. Конфигурации и графический водяной знак сохраняются только в локальном хранилище Chrome. Импорт конфигурации нормализуется перед использованием; экспорт выполняется по явному действию пользователя. Монитор передаёт только санированные технические ошибки, без изображений и конфигураций.

## Мониторинг

Ошибки Canvas/UI, service worker, rejected promises и сетевые сбои поступают через RedRav3n Mail в существующий Telegram-RedRav3n Error Monitor. Используются дедупликация и ограниченная повторная доставка.

## Проверка

```bash
python3 -m json.tool manifest.json
node --check app.js
node --check canvas-renderer.js
node --check background.js
node --check popup.js
node --check redrav3n_error_monitor/monitor.js
```
