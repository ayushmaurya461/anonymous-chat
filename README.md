# 💬 AnonChat — Anonymous Real‑Time Chat with Rooms (Go + React)

Meet **AnonChat**, a full‑stack, real‑time chat app where people can **chat anonymously**, meet strangers, and join **topic‑based rooms** to share opinions. Users can optionally **create an account** if they want to keep their 1:1 chats; **room chats are ephemeral and designed to be deleted after 24 hours** to encourage open conversation.


---

## ✨ Features

- **Anonymous chat (guest mode)** — jump in with a single click; no sign‑up required.
- **Optional accounts** — create an account if you want your DMs to persist across sessions.
- **Rooms for group chat** — create/join rooms; ideal for sharing opinions anonymously.
- **Ephemeral room messages** — *by design*, messages in rooms are retained for **24 hours**, then pruned (see **Message Retention**).
- **Real‑time messaging** — bi‑directional **WebSockets** for instant delivery.
- **Unread counts & read status** — the backend tracks unread counts and allows marking as read.
- **Search & discovery** — search rooms by name.
- **Responsive UI** — modern React + Vite + TypeScript setup.
- **Dockerized** — one command to boot the stack.

---

## 🧰 Tech Stack

**Frontend**
- React 18 + TypeScript (Vite)
- Context + custom hooks (`use-auth`, `use-chat`, `use-websocket`)
- Axios, Lucide Icons, Tailwind CSS utilities

**Backend**
- Go (Gin) + Gorilla WebSocket
- PostgreSQL (via `pgx` pool)
- Layered: Router → Controllers → Models → DB

**DevOps**
- Docker & Docker Compose
- Hot‑reload with `air` for Go
- .env‑driven configuration

---

## 🏗 Architecture Overview

```
React (Vite, TS)
  ├─ Context (Auth/Chat)
  ├─ Hooks (use-websocket, use-chat, use-auth)
  └─ UI (Rooms, Sidebar, Chat Window)
            ⇅  WebSocket: ws://{SERVER}/ws?user_id={uid}
            ⇅  REST API:  http://{SERVER}/...

Go (Gin)
  ├─ router/ (routes)
  ├─ controllers/ (auth, rooms, messages)
  ├─ models/ (User, Room, Message, Hub/Client WS)
  ├─ internal/ws/ (websocket handler)
  └─ db/ (pgx pool)
          └─ PostgreSQL
```

---

## 📂 Project Structure

```
re/
├── docker-compose.yaml
├── server/                 # Go backend
│   ├── main.go
│   ├── router/
│   ├── controllers/
│   ├── models/
│   ├── internal/ws/
│   ├── db/
│   ├── air.toml
│   ├── Dockerfile
│   └── .env                # contains DB_URI (you provide your own)
└── frontend/               # React + TS client
    ├── src/
    │   ├── authenticated/components/
    │   ├── unauthenticated/components/
    │   ├── context/
    │   ├── hooks/
    │   ├── models/
    │   ├── App.tsx, AppRoutes.tsx
    │   └── main.tsx
    ├── Dockerfile
    └── package.json
```

---

## ⚡ Quick Start

### Option A — Docker (recommended)

> **Note:** The provided `docker-compose.yaml` in the repo points to `./client`. Change it to `./frontend` as shown below.

```yaml
# docker-compose.yaml (fixed)
services:
  server:
    container_name: "anonChat"
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    volumes:
      - ./server:/app
    env_file:
      - ./server/.env
    restart: unless-stopped

  client:
    container_name: "anonChatClient"
    build:
      context: ./frontend   # <- make sure this points to ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: ["npm", "run", "dev"]
    depends_on:
      - server
    restart: unless-stopped
```

1) **PostgreSQL**: provision a DB (local or cloud).  
2) **Backend env**: in `server/.env` set:
```
DB_URI=postgres://USER:PASS@HOST:PORT/DB?sslmode=require
```
3) **Frontend env**: create `frontend/.env` with:
```
VITE_WS_URL=ws://localhost:8080/    # used by the WebSocket client
# API base URL is currently http://localhost:8080 in src/api/auth.ts
# change it there if you deploy behind another host/port
```
4) Boot:
```bash
docker compose up --build
```

- Frontend: http://localhost:3000  
- Backend:  http://localhost:8080

### Option B — Run locally

**Backend**
```bash
cd server
go mod tidy
# ensure DB_URI is set (export or .env)
go run main.go
```

**Frontend**
```bash
cd frontend
npm install
npm run dev # runs on port 3000 (configured in package.json)
```

---

## 🔐 Security & Privacy Model

- **Anonymous by default**: guest users get a non‑identifying UID.
- **Optional registration**: if you want persistence for DMs, create an account.
- **Ephemeral rooms**: room messages are **short‑lived (24h)** by design.
- **In‑transit encryption**: use HTTPS/WSS in production via a reverse proxy.

---

## 🔗 API Reference (high‑level)

### Auth
- `POST /api/register` — `{ username, email, password }` → creates user
- `POST /api/login` — `{ username, password }` → authenticates
- `POST /api/guest` — no payload → returns guest user object

### Users
- `GET /user/users/:user_id` — list users + per‑user unread counts for `:user_id`
- `POST /user/mark-read?user_id=:id` — mark all messages to `:id` as read

### Messages
- `GET /user/messages?type={user|room}&c_user_id={me}&user_id={peer}&room_id={room}&limit=&offset=` — fetch paginated messages

### Rooms
- `GET  /rooms/:user_id` — rooms the user has joined
- `POST /rooms/create` — `{ name, description, user_id }`
- `POST /rooms/join` — `{ room_id, user_id }`
- `POST /rooms/leave` — `{ room_id, user_id }`
- `GET  /rooms/search?query={text}` — search rooms

### WebSocket
- **Endpoint**: `ws://{HOST}:8080/ws?user_id={uid}`  
- **Payload (example)**:
```json
{
  "id": "uuid",
  "sender_id": "me-uuid",
  "receiver_id": "peer-uuid",   // for DM
  "room_id": "room-uuid",       // for room message
  "content": "Hello world",
  "type": "text",
  "created_at": "2025-08-17T12:00:00Z"
}
```

> The frontend uses `VITE_WS_URL` and the helper `getSocket()` to open the connection.

---

## 🧹 Message Retention (24h)

AnonChat is designed so **room messages are ephemeral**. In production, configure a retention job at the **database level** (recommended) to prune room messages older than 24h. Example (PostgreSQL):

```sql
-- Prune room messages older than 24 hours
DELETE FROM messages
WHERE room_id IS NOT NULL
  AND created_at < NOW() - INTERVAL '24 hours';
```

You can schedule this via:
- **pg_cron** (PostgreSQL extension)
- a simple **cron** job that runs `psql -c "<above SQL>"`
- a lightweight background worker/service

> Direct‑message (1:1) retention can be configured separately according to your policy.

---

## 🧪 Notes for Reviewers (Recruiter‑friendly)

- Real‑time experience: typed messages appear instantly for connected peers.
- Clean separation of concerns (router/controllers/models) on the backend.
- Idiomatic React with hooks and Context on the frontend.
- Clear, minimal API surface; easy to extend (e.g., attachments, presence).
- Dockerized dev loop with hot reload for Go.

---

## 🛣️ Roadmap / Ideas

- JWT auth & refresh tokens
- Presence & typing indicators
- File sharing & media messages
- Social sign‑in (Google/GitHub)
- Moderation tools (report, ban, rate‑limits)
- CI/CD with GitHub Actions
- Infra as code (Terraform) for cloud deploy

