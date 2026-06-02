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
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Backend `backend/.env`:

```text
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/smartcode
CORS_ORIGIN=http://localhost:3000
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
OPENAI_API_URL=https://api.openai.com/v1/responses
```

## Deployment

The fastest production setup for this project is:

- Frontend on Vercel
- Backend on Render
- Database on MongoDB Atlas

### 1. Deploy MongoDB Atlas

Create a cluster, add a database user, and allow access from Render and Vercel. Copy the connection string into the backend `MONGODB_URI`.

### 2. Deploy the backend on Render

Create a new Web Service and point it to the `backend` folder.

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

Set these environment variables in Render:

- `MONGODB_URI=<your atlas connection string>`
- `CORS_ORIGIN=<your frontend production url>`
- `OPENAI_MODEL=gpt-4.1-mini`
- `OPENAI_API_KEY=<optional, only needed for the AI coach>`
- `OPENAI_API_URL=https://api.openai.com/v1/responses`

Notes:

- Do not hardcode `PORT` on Render unless you specifically need to. Render provides the runtime port automatically.
- If you still test locally, you can temporarily set `CORS_ORIGIN=http://localhost:3000,https://your-frontend-domain.vercel.app`. For production-only use, keep only the live frontend domain.

### 3. Deploy the frontend on Vercel

Import the repository root into Vercel.

- Framework Preset: `Next.js`
- Root Directory: project root
- Build Command: `npm run build`

Set this environment variable in Vercel:

- `NEXT_PUBLIC_API_BASE_URL=<your Render backend url>`
- `NEXT_PUBLIC_SITE_URL=<your Vercel production url>`

Example:

```text
NEXT_PUBLIC_API_BASE_URL=https://smartcode-backend.onrender.com
```

After Vercel deploys, copy the frontend public URL and update the backend `CORS_ORIGIN` in Render to match it exactly.

### 4. Production wiring order

Use this order to avoid broken requests during launch:

1. Deploy backend to Render
2. Copy the Render backend URL
3. Deploy frontend to Vercel with `NEXT_PUBLIC_API_BASE_URL` set to that backend URL
4. Copy the Vercel frontend URL
5. Update `CORS_ORIGIN` in Render to that frontend URL
6. Redeploy backend once more if Render asks for it

### 5. Optional OpenAI coach setup

If you want the in-problem coach feature to use OpenAI instead of the local fallback:

1. Go to `https://platform.openai.com/`
2. Create an API key from the API keys page
3. Add billing if your account requires it
4. Paste the key into Render as `OPENAI_API_KEY`
5. Set `OPENAI_API_URL=https://api.openai.com/v1/responses`

If `OPENAI_API_KEY` is empty, the app still works and uses the built-in fallback coach response instead of calling OpenAI.

## Redeploy Commands

### Frontend

Local verification:

```bash
npm install
npm run lint
npm run build
```

Deploy to Vercel:

```bash
npm install -g vercel
vercel login
vercel env add NEXT_PUBLIC_API_BASE_URL production
vercel env add NEXT_PUBLIC_SITE_URL production
vercel --prod
```

### Backend

Local verification:

```bash
cd backend
npm install
npm start
```

Render redeploy:

```bash
git add .
git commit -m "Improve responsive UX, SEO, and performance"
git push origin <your-branch>
```

Then in Render:

1. Open the backend service.
2. Go to `Environment`.
3. Set `MONGODB_URI`, `CORS_ORIGIN`, `OPENAI_API_KEY`, `OPENAI_MODEL`, and `OPENAI_API_URL`.
4. Click `Manual Deploy` -> `Deploy latest commit`.

### MongoDB Atlas

Atlas does not use deploy commands for app code. Update it through the dashboard:

1. Open your cluster.
2. Go to `Network Access` and allow your Render outbound access as needed.
3. Go to `Database Access` and verify the app user credentials.
4. Copy the connection string into Render as `MONGODB_URI`.

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
