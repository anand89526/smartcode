# SmartCode

SmartCode is a coding practice platform built for learners who want more than a plain problem list. It combines a modern Next.js frontend with a lightweight Express and MongoDB backend to support authentication, problem browsing, dashboard flows, and coding-focused product pages such as battle mode, solve, and leaderboard views.

## Highlights

- Modern frontend built with Next.js App Router, React, TypeScript, and Tailwind CSS.
- Interactive UI with `framer-motion` animations and Monaco editor support.
- Authentication flow with signup and login pages connected to the backend API.
- Problem management API with routes for creating and fetching coding problems.
- Dedicated pages for dashboard, problems, solve, battle, leaderboard, login, and signup.

## Tech Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- UI: Framer Motion, Lucide React, Monaco Editor
- Backend: Node.js, Express, MongoDB, Mongoose

## Project Structure

```text
smartcode/
|- app/                 # Next.js app routes and pages
|- components/          # Shared frontend components
|- public/              # Static assets
|- backend/
|  |- models/           # Mongoose models
|  |- routes/           # Express API routes
|  |- server.js         # Backend entry point
|- package.json         # Frontend dependencies and scripts
```

## Local Setup

### 1. Install dependencies

Frontend:

```bash
npm install
```

Backend:

```bash
cd backend
npm install
```

### 2. Start MongoDB

Make sure MongoDB is running locally on:

```text
mongodb://127.0.0.1:27017/smartcode
```

The current backend is configured to connect to that local database directly in `backend/server.js`.

### 3. Run the backend

From the `backend` folder:

```bash
node server.js
```

The API runs on:

```text
http://localhost:5000
```

### 4. Run the frontend

From the project root:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:3000
```

## Available Frontend Routes

- `/` - landing page
- `/login` - login screen
- `/signup` - signup screen
- `/dashboard` - user dashboard
- `/problems` - problem list
- `/solve` - coding workspace
- `/battle` - battle mode page
- `/leaderboard` - leaderboard page

## Backend API

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`

### Problems

- `GET /api/problems`
- `POST /api/problems/add`

## Current Notes

- Authentication is currently basic and compares raw passwords in the database.
- The backend is configured for local development and expects a local MongoDB instance.
- There are no automated tests configured yet.

## Scripts

Frontend:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Backend:

```bash
node server.js
```

## Roadmap Ideas

- Secure authentication with password hashing and JWT or session support
- Online code execution and test-case validation
- Real-time multiplayer battles
- Progress tracking and performance analytics
- AI-assisted hints and learning recommendations

## Status

SmartCode is a strong early-stage foundation for a coding platform and is ready for continued feature development, UI refinement, and backend hardening.
