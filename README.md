# Nebula - AI Chatbot Web App

Nebula is a clean, modern ChatGPT/Claude-style AI chatbot web application built strictly using the **MERN stack** (MongoDB, Express.js, React, Node.js) and powered by the Google Gemini API.

---

## Features

- **Chat Interface**: Centered conversation column, rounded message bubbles with soft contrast, user messages on the right, and AI responses on the left with an avatar.
- **AI Integration**: Express backend calls the Google Gemini API (free tier) and returns responses.
- **Chat History**: Sidebar listing past conversations with active chat highlighting, New Chat button, hover states, and per-chat deletion.
- **Persistent Storage**: Chats and messages are stored in MongoDB via Mongoose with the first user message used as the conversation title.
- **Polished UI/UX**:
  - Dark theme with a refined palette and good text contrast.
  - Inter font from Google Fonts.
  - Pill-style input pinned at the bottom with an integrated send button.
  - Auto-growing textarea (up to 5 lines) with `Enter` to send and `Shift+Enter` for new lines.
  - Centered empty state with greeting ("Nebula - How can I help you today?").
  - Animated 3-dot typing indicator during AI generation.
  - Smooth 150–200ms transitions and auto-scroll to the latest message.
  - Friendly inline error messages without intrusive alert popups.
  - Responsive mobile drawer navigation.

---

## Tech Stack & Architecture

- **Frontend**: React (Vite, JavaScript), plain CSS (`App.css`), inline SVGs.
- **Backend**: Node.js, Express.js, `@google/generative-ai`.
- **Database**: MongoDB with Mongoose (`Chat` model: `title`, `messages: [{ role, content }]`, `createdAt`).

```
AI CHAT BOX PROJECT/
├── client/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       └── components/
│           ├── Sidebar.jsx
│           ├── ChatWindow.jsx
│           ├── MessageBubble.jsx
│           ├── ChatInput.jsx
│           └── TypingIndicator.jsx
├── server/
│   ├── package.json
│   ├── server.js
│   ├── .env.example
│   ├── .env
│   ├── models/
│   │   └── Chat.js
│   └── routes/
│       └── chatRoutes.js
├── README.md
└── .gitignore
```

---

## Setup & Running

### 1. Prerequisites
- **Node.js** (v18+ or v20+)
- **MongoDB** (local MongoDB instance running on port 27017 or a MongoDB Atlas connection URI)
- **Google Gemini API Key** (Free tier available at [Google AI Studio](https://aistudio.google.com/))

### 2. Configure Environment Variables
Copy the example environment file in `/server`:

```bash
cd server
cp .env.example .env
```

Open `server/.env` and add your settings:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/nebula
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

### 3. Install Dependencies

In the **server** directory:
```bash
cd server
npm install
```

In the **client** directory:
```bash
cd ../client
npm install
```

### 4. Run Locally

**Option A: Single Command from Root (Recommended)**
```bash
npm run dev
# Starts both Express server (port 5000) and React client (port 5173) together
```

**Option B: One-Click on Windows**
Double-click `start.bat` in the project root. It will start both services and open your browser automatically.

**Option C: Run Separately**
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## API Endpoints

- `POST /api/chat` - Send a message, get the AI reply, and persist both to MongoDB.
- `GET /api/chats` - List all past chats.
- `GET /api/chats/:id` - Fetch messages for a specific chat.
- `DELETE /api/chats/:id` - Delete a chat session.
