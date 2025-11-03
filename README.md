# Chat-App

A minimal real-time chat application (MERN + Socket.IO) with image uploads (Cloudinary), JWT cookie authentication, and a Vite + React frontend.

This README gives you a practical quick-start, environment variable reference, and simple deployment notes (Railway + Vercel). It’s intentionally concise.

---

## Tech stack

- Frontend: React (Vite), TailwindCSS, Zustand
- Backend: Node.js, Express 5, Mongoose (MongoDB), Socket.IO
- Auth: JWT stored in httpOnly cookies
- Storage: Cloudinary for images

---

## Quick summary

- Local development: run backend and frontend separately.
- Production options:
  - Deploy backend to Railway (or similar). Deploy frontend to Vercel, Netlify, or serve the `frontend/dist` from the backend.
  - You can either deploy frontend and backend under one origin (via rewrites) or set the frontend to call the backend URL directly via an env variable.

---

## Repo layout

```
backend/
  src/
frontend/
  src/
```

---

## Prerequisites

- Node.js 18+ (the project sets engines >=18 for the backend)
- npm or yarn
- A MongoDB connection (Atlas or Railway plugin)
- Cloudinary account (if you want image uploads)

---

## Local development

1. Backend

```powershell
cd backend
npm ci
# Set env file: copy .env.example or create .env with values
npm run dev    # starts nodemon (src/index.js)
```

2. Frontend

```powershell
cd frontend
npm ci
# If you want the frontend to talk to a local backend, create frontend/.env.local with:
# VITE_REACT_APP_BACKEND_URL=http://localhost:4000
npm run dev
```

Open the frontend dev URL (Vite) in the browser. The frontend uses `withCredentials: true` for axios and will send cookies to the backend URL.

---

## Environment variables

Create a `.env` file in `backend/` and `frontend/` as needed. Important keys used by the app:

Backend (`backend/.env`)
- MONGO_URI=https://... (Mongo connection string)
- PORT=4000
- JWT_SECRET=your_jwt_secret
- NODE_ENV=development|production
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- CLIENT_URL=https://your-frontend-domain (used for CORS)
- COOKIE_SAMESITE=none|lax|strict (set `none` for cross-site cookies)
- COOKIE_SECURE=true|false (set `true` in production for Secure cookies)

Frontend (`frontend/.env`)
- VITE_REACT_APP_BACKEND_URL=https://your-backend-url (optional — used when not using rewrites)

Notes:
- Vite exposes client env variables prefixed with `VITE_`.
- If `VITE_REACT_APP_BACKEND_URL` isn’t set, the frontend uses `/api` (works if your host proxies `/api` to the backend).

---

## Production build (serve frontend from backend)

If you prefer the backend to serve the built frontend bundle:

1. Build frontend

```powershell
cd frontend
npm run build
```

2. Copy or deploy `frontend/dist` next to the backend and start backend in production:

```powershell
cd backend
npm ci
npm start
```

The backend code will serve static assets from `../frontend/dist` when `NODE_ENV === 'production'`.

Alternatively, deploy frontend to a static host (Vercel/Netlify) and backend to Railway and use rewrites or a direct backend URL.

---

## Deployment notes

- Backend (Railway):
  - Root directory: `backend`
  - Build command: `npm ci`
  - Start command: `npm start`
  - Environment variables: set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, Cloudinary keys, and `NODE_ENV=production`.

- Frontend (Vercel/Netlify):
  - Set `VITE_REACT_APP_BACKEND_URL` to your Railway backend URL, OR add rewrites so `/api` and `/socket.io` proxy to the backend.

Tip: This project enables `app.set('trust proxy', 1)` for production.

---

## Tips

- If the frontend can’t reach the backend, ensure either `VITE_REACT_APP_BACKEND_URL` is set or your host proxies `/api` to the backend.

---

## Socket.IO and real-time

- Socket connections use the same backend URL. If using different origins, set `VITE_REACT_APP_BACKEND_URL` and keep `withCredentials: true`.

---

## Tests and linting

This starter doesn’t include automated tests. Before deploying, run your usual linting and build steps:

```powershell
cd backend
npm ci
npm run build # if you add build steps

cd frontend
npm ci
npm run build
```

---

## Contributing

Contributions welcome. Keep changes small and focused. If you add dependencies, document them in the README and update any deployment instructions.

---

## License

This repository does not include a license file. Add one (e.g., MIT) if you intend to open source the code.

---
