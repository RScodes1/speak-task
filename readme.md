# Voice-Enabled Task Tracker

## 1. Project Setup

### a. Prerequisites
- Node.js version: `v16.16.0`
- MongoDB version: `8.0.16`
- React.js version: `19.2.0`
- AI API Keys: (e.g., OpenAI API key)
- Email configuration: SMTP credentials or third-party email service

### b. Installation Steps

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd backend
npm install
```

#### Environment Variables
```bash
 Backend
PORT=4500
mongoURL=****************************************************************
OPENAI_API_KEY=**********************************************************************
```

### c. Running Locally
```bash 
- Backend
cd backend
npm run dev

Runs backend on http://localhost:4500

- Frontend
cd frontend
npm start

Runs frontend on http://localhost:3000
```

## 2. Tech Stack

### Frontend, Backend, DB, AI

-Frontend: React, Tailwind CSS, Create React App (CRA), Zustand (state), Lucide-React (icons), Lodash

-Backend: Node.js, Express

-Database: MongoDB (local or Atlas)

-AI Provider: OpenAI (voice parsing & chat completions)

-Drag & Drop: @hello-pangea/dnd

-Other libs: chrono-node (natural date parsing), stream utilities

-Cloud deployment - Backend on render, Frontend on Vercel 

## 3. API Documentation

Base URL: http://localhost:4500/api

-Get All Tasks

Method: GET
Path: /api/tasks
Query Params (optional):
search — text
status — to-do | in-progress | done
priority — low | medium | high
due_date — YYYY-MM-DD
page, limit, sort, order

Success (200):
```bash
{
  "page": 1,
  "limit": 10,
  "total": 50,
  "tasks": [ /* task objects */ ]
}
```
```bash
Error (500):

{ "error": "Failed to fetch tasks" }
```

-Get Single Task
Method: GET
Path: /api/tasks/task/:id
Success (200):

```bash
{ "data": { /* task object */ } }
```
-Add Task
Method: POST
Path: /api/tasks/add-task
Body (JSON);
```bash
{
  "title": "Task title",
  "description": "Task description",
  "priority": "medium",
  "status": "to-do",
  "due_date": "2025-12-05T10:00:00.000Z"
}
```
```bash
Success (201):
{ "message": "Task created successfully", "task": { /* created task */ } }
```
```bash
Validation Error (400):
{ "message": "Title is required" }
```

-Update Task
Method: PUT
Path: /api/tasks/update-task/:id
Body: same shape as Add Task (partial allowed depending on implementation)

Success (200):
```bash
{ "message": "Task updated", "task": { /* updated */ } }
```

-Delete Task
Method: DELETE

Path: /api/tasks/delete-task/:id
Success (200):
```bash
{ "message": "Task deleted" }

Audio/Voice Parsing Endpoint
Method: POST
Path: /api/audio/parse
Body: multipart/form-data with field audio (file)

Success (200):
```bash
{
  "title": "...",
  "due_date": "2025-12-05T00:00:00.000Z",
  "priority": "medium",
  "status": "to-do",
  "raw_text": "..." 
}
```
```bash
Error (4xx/5xx):
{ "error": "Voice parsing failed" }
```

## ⚖️ 4. Decisions & Assumptions

### Key design decisions

-Kanban board UI is the primary interface for task lifecycle (to-do, in-progress, done).
-Drag-and-drop implemented via @hello-pangea/dnd.
-Voice-to-task: upload audio → backend uses OpenAI transcription + chat completion to extract structured fields.
-Dark mode UI inspired by Linear (consistent palette, minimal, high contrast).
-Zustand used for global state and debounced server-side filtering.

### Implementation assumptions

-Voice input: English language input assumed for reliable parsing.
-Timezones: due dates stored in ISO; presented to user in local timezone.
-Email: optional, uses SMTP or services like SendGrid/Nodemailer if configured.
-Authentication: MVP may not include complex auth — add JWT/OAuth if required later.

## 5. AI Tools Usage

### Tools used

-OpenAI — audio transcription & parsing (model used in backend)

-ChatGPT — design suggestions, code snippets, debugging assistance

### How AI helped 

-Converting raw transcription into title, due_date, priority, status JSON.
-Generating prompt templates and parsing rules (chrono-node for dates).
-UX and component suggestions (modals, toasts, dark theme).

### Notable prompts / approaches

-"Extract title, due_date, priority, status from this transcript and return only JSON"

-"Create a dark Linear-like Kanban board in React with Tailwind and drag-and-drop"

### Learnings

-Use careful validation for dates vs statuses (e.g., TODO must be future date; DONE must have today's date; IN-PROGRESS any date).
-Debounce searches at the state/store layer for better UX and fewer API calls.
-Always parse the fetch response JSON only once; centralized API helpers are helpful.

## Tips & Notes

-Do not commit build/ folder — let Vercel or your provider build the app.
-Case sensitivity: ensure file/folder names match imports exactly (KanbanBoard.jsx vs kanbanBoard.jsx) — Vercel CI uses case-sensitive FS.
-Security: never expose sensitive API keys from the frontend. Use server-side env vars and a proxy for protected calls.

## Suggested Repo Structure
```bash
/frontend
  /src
    /components
      /Controls
        SearchBar.jsx
        FilterBar.jsx
      /Modals
        TaskFormModal.jsx
        VoicePreviewModal.jsx
      /Taskboard
        KanbanBoard.jsx
        KanbanColumn.jsx
        TaskCard.jsx
    /hooks
      useTasks.js
      useVoice.js
    App.jsx
/backend
  /routes
    task.routes.js
  index.js
  models
    TaskModel.js
```
