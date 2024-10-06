
**Spy Game** – це мультиплатформенна онлайн-гра для мобільних і веб-користувачів, де гравці взаємодіють один з одним у реальному часі через голосовий чат і текстові повідомлення. Гра розроблена на основі трьох технологій: **React** для веб-фронтенду, **Node.js** для серверної частини, і **Flutter** для мобільних пристроїв.

### Основні функції:
- **Мультиплатформенність**: Гравці можуть приєднуватися через браузери на ПК і мобільних пристроях або через нативний додаток на Android та iOS.
- **Голосовий чат**: Використання WebRTC для створення голосового чату, що дозволяє гравцям спілкуватися під час гри.
- **Кімнати для гравців**: Можливість створювати приватні кімнати для ігор, що дозволяє тільки запрошеним гравцям приєднуватися.
- **Гра на основі реальних локацій і ролей**: Перед кожним раундом гравці отримують карту з роллю (шпигун чи ні) і локацією.
- **Нативний мобільний додаток**: Flutter реалізує мобільну оболонку, яка відкриває веб-додаток через WebView або нативну інтеграцію з сервером через API.

### Архітектура:
- **Node.js** відповідає за керування сесіями гравців, чатами, кімнатами, і обробку реальних підключень через WebSocket.
- **React** забезпечує інтерактивний інтерфейс гри, адаптований для роботи на всіх пристроях, з використанням веб-браузера.
- **Flutter** дозволяє мобільним користувачам взаємодіяти з грою через нативний додаток на Android та iOS з підтримкою WebView для завантаження веб-гри.

### Основні технології:
- **React**: Фронтенд-фреймворк для створення динамічного веб-інтерфейсу гри.
- **Node.js + Express**: Серверний бекенд для обробки геймплейної логіки, голосового чату, керування кімнатами та API.
- **Socket.io**: Для обробки реальних підключень і обміну даними між гравцями.
- **Flutter**: Нативний фреймворк для мобільних пристроїв, який відкриває веб-гру через WebView або взаємодіє з сервером напряму через API.

Проект пропонує гравцям цікавий досвід взаємодії в реальному часі, поєднуючи всі основні веб і мобільні технології для забезпечення гнучкості та доступності на будь-якому пристрої.

---
