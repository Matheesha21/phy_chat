# Frontend — USJ Physics Department AI Assistant

React + TypeScript single-page app for the AI chat assistant, quiz competition, and leaderboard. See the [root README](../README.md) for the full project overview and architecture.

## Tech Stack

- React 18 + TypeScript
- Vite — dev server and build tool
- React Router — client-side routing
- Axios — API requests
- Tailwind CSS — styling
- Google OAuth (`@react-oauth/google`) — SSO login

## Project Structure

```
src/
├── components/    Reusable UI components (Auth, Chat, Layout)
├── context/       React context providers (Auth, Chat, Theme)
├── pages/         Route-level pages (Chat, Competition, Leaderboard, Login, About)
├── services/      API client and per-feature service modules
├── App.tsx        Routes and top-level layout
└── index.tsx      App entry point
```

## Prerequisites

- Node.js 18+
- The backend running (see [../backend/README.md](../backend/README.md)) and reachable at the URL you set below

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file (copy `.env.example`) and set:

```
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## Run

Start the dev server:

```bash
npm run dev
```

The app is served at `http://localhost:5173`.

## Other commands

```bash
npm run build      # production build to dist/
npm run preview    # preview the production build locally
npm run lint       # run ESLint
```
