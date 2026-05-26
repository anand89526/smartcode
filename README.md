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

## Environment Variables

Frontend root `.env.local`:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

Backend `backend/.env`:

```text
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/smartcode
CORS_ORIGIN=http://localhost:3000
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

## Deployment

The simplest production setup for this project is:

- Frontend on Vercel
- Backend on Render or Railway
- Database on MongoDB Atlas

### 1. Deploy MongoDB

Create a free MongoDB Atlas cluster and copy the connection string.

### 2. Deploy the backend

Create a new Web Service from the `backend` folder.

- Build command: `npm install`
- Start command: `npm start`
- Required environment variables:
  - `PORT=5000`
  - `MONGODB_URI=<your atlas connection string>`
  - `CORS_ORIGIN=<your frontend url>`
  - `OPENAI_API_KEY=<optional>`
  - `OPENAI_MODEL=gpt-4.1-mini`

After deployment, copy the backend public URL.

### 3. Deploy the frontend

Import the root project into Vercel.

- Framework: Next.js
- Root directory: project root
- Required environment variable:
  - `NEXT_PUBLIC_API_BASE_URL=<your backend public url>`

After deployment, Vercel gives you the public frontend URL that users can open directly.

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
