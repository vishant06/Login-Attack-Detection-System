# Login Attack Detection System

A college-ready full stack web application that demonstrates brute force attack detection, suspicious activity monitoring, account lockout, and security logging.

## Tech Stack

- **Frontend:** React + React Router + Axios + CSS (Vite)
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose

## Features

- Login API that tracks failed attempts per user.
- Warning at 3 failed attempts.
- Account lock for 2 minutes at 5 failed attempts.
- Suspicious activity detection for too many requests from same IP in short time.
- Security logs stored in MongoDB for every login attempt.
- Dashboard with total attempts, failed attempts, and currently locked accounts.
- Admin tools to unlock account and clear logs.

## Project Structure

```bash
/client   # React frontend
/server   # Express + MongoDB backend
```

## Backend Setup

1. Go to backend folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Update `MONGO_URI` if needed.
4. Run backend in dev mode:
   ```bash
   npm run dev
   ```

Backend runs at `http://localhost:5000`.

## Frontend Setup

1. Open a new terminal and go to frontend folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
4. Run frontend in dev mode:
   ```bash
   npm run dev
   ```

Frontend runs at `http://localhost:5173`.

## Demo Credentials (auto-seeded)

- `student1 / password123`
- `admin / admin123`

## API Endpoints

- `POST /api/auth/login`
- `GET /api/logs`
- `GET /api/stats`
- `POST /api/admin/unlock`
- `POST /api/admin/clear-logs`

## Viva Explanation Summary

- **Brute force detection:** increment `failedAttempts` per user and enforce lock policy.
- **Rate/suspicious detection:** in-memory IP attempt tracker inside time window.
- **Account lockout:** `lockedUntil` timestamp checked before password verification.
- **Security logging:** each attempt and admin action is stored in `Log` collection.

