# Modern Interiors

> **Modern Interiors** is a luxury furniture and interior design e-commerce and consultation web platform built on the MERN stack (MongoDB, Express, React, Node.js) with Vite.

---

## 📑 Table of Contents
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Tracking Updates & Releases](#tracking-updates--releases)

---

## 🏛 Architecture Overview

```
modern-interiors/
├── client/          # Frontend (React 19, Vite, Tailwind/CSS, Lucide, Framer Motion)
├── server/          # Backend (Node.js, Express, MongoDB Mongoose, Razorpay, JWT)
├── CHANGELOG.md     # Version history & update logs
├── package.json     # Monorepo root runner
└── .gitignore       # Root security & ignore configuration
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **npm** (v9+)
- **MongoDB** instance (Atlas URI or Local MongoDB)

### 2. Installation
Install all dependencies across the root, client, and server in one command:
```bash
npm run install:all
```

### 3. Environment Configuration
Copy the template file to set up your environment variables:
```bash
# Windows PowerShell
copy server\.env.example server\.env
```
Open `server/.env` and configure your MongoDB URI, JWT secret, Razorpay credentials, and SMTP details.

### 4. Run the Full Stack
Start both frontend and backend development servers concurrently:
```bash
npm run dev
```
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## ⚙️ Environment Variables

The server requires configuration defined in `server/.env`. See `server/.env.example` for details:

| Variable | Description |
| :--- | :--- |
| `PORT` | Backend server port (default `5000`) |
| `MONGO_URI` | MongoDB connection connection string |
| `JWT_SECRET` | Secret key for signing authentication tokens |
| `RAZORPAY_KEY_ID` | Razorpay API Key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API Secret |
| `SMTP_HOST` | Email SMTP host (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | Email SMTP port (e.g. `587`) |
| `SMTP_USER` | Email address for sending OTP emails |
| `SMTP_PASS` | Gmail App Password |

---

## 📜 Available Scripts

From the root directory (`modern-interiors/`):

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `concurrently ...` | Runs both client & server concurrently |
| `npm run dev:client` | `npm run dev --prefix client` | Runs only Vite frontend (Port 5173) |
| `npm run dev:server` | `npm run dev --prefix server` | Runs only Express backend (Port 5000) |
| `npm run install:all` | Installs root, server, and client packages |
| `npm run build` | `npm run build --prefix client` | Builds client production bundle |
| `npm run lint` | `npm run lint --prefix client` | Lints frontend codebase |

---

## 🔄 Tracking Updates & Releases

To ensure all new updates are easily recognizable and maintainable:

1. **Check Git Status & Diffs**:
   ```bash
   git status
   git diff
   ```
2. **Commit Changes with Conventional Commit Messages**:
   - `feat: add new living room 3D preview`
   - `fix: resolve cart count calculation on checkout`
   - `chore: update dependencies`
3. **Log Changes in [CHANGELOG.md](./CHANGELOG.md)**:
   Add your updates under the `[Unreleased]` section so the team always knows what has changed.
