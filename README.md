# VideoPlayer

архитектура - **Feature-Based (модульная)**
```text
src/
├── assets/          # Иконки (SVG), стили
├── components/      # UI-кит: Button, Slider, Tooltip (общие компоненты)
├── features/        # Сами модули плеера
│   ├── player/      # Ядро: <video> тег, инициализация, контекст/стейт
│   ├── controls/    # Кнопки Play, Volume, Progress Bar
│   └── playlist/    # (Опционально) Список видео
├── hooks/           # Общая логика (useVideoPlayer, useKeyboardShortcuts)
├── utils/           # Хелперы (форматирование времени: 00:00)
├── App.js           # Точка сборки
└── main.js          # Инициализация Vite
```