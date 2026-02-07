## Chat Room Application

### Overview

This is a simple real‑time group chat application built with **Spring Boot** and **WebSockets (STOMP over SockJS)** on the backend, and a lightweight **HTML/CSS/JavaScript** frontend.  
Users can join the chat with a username and exchange messages in a shared public room.

The app is intentionally minimal and is a good starting point for experimenting with WebSocket messaging, STOMP, and basic real‑time features.

---

### Features

- **Join with a username**: Users enter a display name before joining the room.
- **Public group chat**: All messages are broadcast to everyone subscribed to the public topic.
- **Real‑time messaging**: Messages are delivered via WebSockets using STOMP over SockJS.
- **Simple UI**:
  - Join card to enter a username.
  - Chat window showing your name, messages, and basic layout for conversation.
- **Join event backend support**:
  - Backend distinguishes between `CHAT`, `JOIN`, and `LEAVE` message types.
  - Client currently sends a `JOIN` event on connect (UI handling for this is still minimal / TODO).

---

### Tech Stack

- **Backend**
  - Java
  - Spring Boot
  - Spring WebSocket / STOMP
  - SockJS
- **Frontend**
  - Static `index.html`
  - `script.js` using SockJS + STOMP JavaScript client
  - `style.css` for a simple modern dark‑themed UI

---

### Project Structure

Key files/directories under `src/main`:

- **Java backend**
  - `java/com/xebec/chat_app/ChatApplication.java`
    - Spring Boot main application entry point.
  - `java/com/xebec/chat_app/config/WebSocketConfig.java`
    - Enables STOMP over WebSocket.
    - Registers endpoint `/ws` (with SockJS fallback).
    - Sets application destination prefix `/app`.
    - Enables simple in‑memory broker on `/topic`.
  - `java/com/xebec/chat_app/controller/ChatController.java`
    - Handles incoming STOMP messages:
      - `@MessageMapping("/chat.sendMessage")` → `@SendTo("/topic/public")`
        - Broadcasts chat messages.
      - `@MessageMapping("/chat.addUser")` → `@SendTo("/topic/public")`
        - Stores username in the WebSocket session and broadcasts a join event.
  - `java/com/xebec/chat_app/chat/ChatMessage.java`
    - Message payload model with fields:
      - `content: String`
      - `sender: String`
      - `type: MessageType`
  - `java/com/xebec/chat_app/chat/MessageType.java`
    - Enum of message types:
      - `CHAT`
      - `JOIN`
      - `LEAVE`
- **Resources**
  - `resources/application.properties`
    - Basic Spring Boot configuration (`spring.application.name=chat`).
  - `resources/static/index.html`
    - Static landing page and chat UI markup.
    - Loads SockJS, STOMP client, and `script.js`.
  - `resources/static/script.js`
    - Connects to the backend WebSocket endpoint `/ws` via SockJS.
    - Uses STOMP client to:
      - Subscribe to `/topic/public`.
      - Send messages to `/app/chat.sendMessage`.
      - Send join events to `/app/chat.addUser`.
    - Renders chat messages into the DOM.
  - `resources/static/style.css`
    - Styles join card, chat box, message layout, and overall dark theme.

---

### Future Improvements

- **Private messaging / direct messages**
  - Add per‑user destinations (e.g., `/user/queue/messages`) using Spring’s user‑specific messaging support.
  - Extend `ChatMessage` to include target information (e.g., `recipient` or `private` flag).
  - Add a UI element (user list or dropdown) to select a recipient and send private messages that only the sender and recipient can see.

- **Online users and presence**
  - Maintain a list of active users in memory or a backing store.
  - Broadcast updates when users join/leave so clients can render an “Online users” sidebar and update the `Online:` count.
  - Show presence indicators next to usernames.

- **Typing indicators**
  - Add lightweight “typing” events (e.g., send a STOMP message when a user is typing).
  - Show “`<username> is typing...`” in the UI for a short duration.

- **Message timestamps and formatting**
  - Extend `ChatMessage` with a timestamp field.
  - Format timestamps (e.g., `HH:mm`) in the UI for each message.
  - Optionally group messages by day or sender.

- **Message history and persistence**
  - Store messages in a database (e.g., H2, PostgreSQL, MySQL).
  - On client connect, load recent history for the room.
  - Add simple pagination or “load more” for older messages.

- **Multiple rooms / channels**
  - Support multiple topics (e.g., `/topic/general`, `/topic/random`, `/topic/support`).
  - Add room selection in the UI and route messages to the selected room.
  - Optionally allow users to create custom rooms.

- **Authentication and security**
  - Add login (e.g., Spring Security with form login or OAuth2).
  - Tie usernames to authenticated user identities instead of free‑text input.
  - Add basic authorization rules if needed (e.g., who can join certain rooms).

- **Improved error handling and UX**
  - Implement `onError` in `script.js` to display connection errors or reconnect attempts.
  - Show a banner or status indicator if the WebSocket connection is lost.
  - Validate username input (non‑empty, length limits, etc.).

- **Testing and quality**
  - Add unit tests for `ChatController` and WebSocket config.
  - Add integration tests for messaging flows (e.g., using Spring’s STOMP test support).
  - Add basic frontend tests for message rendering behavior.

- **Deployment and configuration**
  - Externalize configuration (port, allowed origins, etc.) in `application.properties` or profiles.
  - Add Docker support or deployment instructions for common environments (local Docker, cloud, etc.).
