## VideoPlayer

Веб-платформа для хостинга и просмотра видеоконтента с системой разграничения прав доступа.

### Технологический стек

**Backend:**
* **Runtime:** .NET 9.0 (ASP.NET Core Minimal API)
* **Database:** PostgreSQL (через Entity Framework Core)
* **Auth:** JWT (JSON Web Token)
* **Password Hashing:** BCrypt.Net-Next

**Frontend:**
* **Framework:** Tailwind CSS + Vite
* **Architecture:** Feature-Based (модульная)
* **Language:** Vanilla JS

---

### Архитектура сервера

```text
server/
├── Data/            # Контекст базы данных (AppDbContext) и модели сущностей
├── Dtos/            # Объекты передачи данных (Data Transfer Objects)
├── Migrations/      # Файлы миграций Entity Framework
├── wwwroot/         # Статические файлы
│   └── uploads/     # Хранилище загруженных видео (игнорируется git)
├── .env             # Переменные окружения (JWT_KEY, DB_CONNECTION)
├── Program.cs       # Настройка сервисов, Middleware и эндпоинты
└── server.http      # Тесты API
```


### Архитектура клиента
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

---

### Таблица API эндпоинтов

| Модуль | Метод | Путь | Auth | Описание |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/auth/register` | Нет | Регистрация нового аккаунта (роль по умолчанию "User") |
| **Auth** | `POST` | `/auth/login` | Нет | Вход в систему, выдача JWT токена |
| **Videos** | `GET` | `/videos` | JWT | Список всех публичных видео с метаданными (лайки, комментарии) |
| **Videos** | `POST` | `/videos/upload` | JWT | Загрузка файла (`.mp4`, `.mov`) через Multipart Form |
| **Videos** | `POST` | `/videos/{id}/react` | JWT | Оценка видео: `true` для лайка, `false` для дизлайка |
| **Videos** | `POST` | `/videos/{id}/comments` | JWT | Добавление текстового комментария под ролик |
| **Videos** | `DELETE`| `/videos/{id}` | JWT | Удаление (доступно владельцу видео или админу) |
| **Admin** | `GET` | `/admin/users/{id}/videos`| JWT (Admin) | Просмотр всех роликов пользователя для модерации |
| **Admin** | `PATCH`| `/admin/videos/{id}/restrict`| JWT (Admin) | Бан видео (скрытие из общего доступа) с указанием причины |

---

### Безопасность и инфраструктура
1.  **CORS:** Настроен на прием запросов с `http://localhost:5173` (Vite).
2.  **Static Files:** Папка `wwwroot/uploads` доступна напрямую по HTTP для воспроизведения видео в плеере.
3.  **Logging:** Внедрен Middleware для логирования HTTP-методов, путей, статус-кодов и времени выполнения запросов в консоль сервера.
4.  **Environment:** Все чувствительные данные (строка подключения, секретный ключ JWT) вынесены в файл `.env`.

### Инструкция по развертыванию
1.  Создать файл `.env` в корне сервера с ключами `JWT_KEY` и `DB_CONNECTION`.
2.  Выполнить `Update-Database` для применения миграций.
3.  Убедиться в наличии папки `wwwroot/uploads`.
