# Deliverable 5: Comprehensive Installation & Deployment Guide
## Project Name: CareerCoachAI — Intelligent Career Readiness Platform
**Target Environment:** Local Workstations, Cloud VMs (Ubuntu/Debian), macOS, Windows  
**Estimated Setup Time:** < 5 Minutes  

---

## 1. System Requirements & Prerequisites

Before starting, ensure your system meets the following specifications:

| Requirement | Minimum Specification | Recommended Specification |
| :--- | :--- | :--- |
| **Node.js** | v20.x or v22.x LTS | v22.13.0 or higher |
| **Package Manager** | npm v10.x | npm v10.9.x |
| **Operating System**| macOS 13+, Ubuntu 22.04+, Windows 11 (WSL2 recommended) | macOS Sonoma or Ubuntu 24.04 LTS |
| **Browser** | Chrome 110+, Edge 110+, Safari 16+, Firefox 115+ | Google Chrome (Optimal WebAssembly/WebGL MediaPipe performance) |
| **Webcam & Mic** | Standard built-in camera & microphone | 720p+ webcam, external noise-cancelling microphone |
| **API Credentials** | Google Gemini API Key | Gemini 2.0 / 3.x Flash enabled key |

---

## 2. Step-by-Step Installation

### Step 1: Clone or Navigate to the Project Directory
Open your terminal and change directory to the project root:
```bash
cd CareerCoachAI
```

### Step 2: Configure Environment Variables
Create your local environment file by copying `.env.example`:

**On macOS / Linux:**
```bash
cp .env.example .env
```

**On Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

Open `.env` in your editor and configure your keys:
```env
# Mandatory for Live AI features (Resume, Speech, Interview Questions, Evaluation)
GEMINI_API_KEY=your_actual_google_gemini_api_key_here

# Optional: Override default Gemini model (defaults to auto-fallback list)
GEMINI_MODEL=gemini-2.0-flash

# Backend server port (defaults to 8787)
API_PORT=8787

# Frontend origin for CORS policy
FRONTEND_ORIGIN=https://career-coach-ai-iarw.vercel.app

# Optional: MongoDB Atlas URI. If omitted or unreachable, system automatically
# falls back to local encrypted storage in server/data/users.json
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/career_coach?retryWrites=true&w=majority

# Environment mode
NODE_ENV=development
```

> [!IMPORTANT]
> **API Key Safety:** Never prefix backend secrets with `VITE_` or commit `.env` to Git. Keep `GEMINI_API_KEY` strictly in `.env`.

---

### Step 3: Install Dependencies
Install all required Node.js dependencies for both frontend and backend:
```bash
npm install
```

This installs:
- Frontend: `react`, `vite`, `tailwindcss`, `@mediapipe/tasks-vision`, `lucide-react`, `recharts`, `framer-motion`
- Backend: `express`, `cors`, `multer`, `pdf-parse`, `mongoose`

---

## 3. Running the Application

To run the complete system, you need two terminal windows:

### Terminal 1: Launch the Backend API Server
```bash
npm run api
```
**Expected Output:**
```
Connecting to MongoDB at mongodb+srv://***:***@cluster0...
✓ Successfully connected to MongoDB Atlas
Career Coach API listening on https://career-coach-ai-kai0.onrender.com
```
*(If `MONGODB_URI` is omitted, it will display a warning and use the local encrypted storage engine without failing).*

---

### Terminal 2: Launch the Frontend Vite Development Server
```bash
npm run dev
```
**Expected Output:**
```
  VITE v4.5.x  ready in 320 ms

  ➜  Local:   https://career-coach-ai-iarw.vercel.app/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

---

### Step 4: Open and Explore
Navigate to [https://career-coach-ai-iarw.vercel.app](https://career-coach-ai-iarw.vercel.app) in Google Chrome or your preferred browser.

---

## 4. System Verification & Health Checks

The codebase includes built-in verification scripts to audit database connectivity, linting, and syntax:

### 1. Verify Database Health
```bash
npm run db:check
```
Checks if MongoDB Atlas is reachable or verifies local storage health.

### 2. Verify Backend Syntax
```bash
node --check server/index.mjs
node --check server/authService.mjs
node --check server/db.mjs
```

### 3. Run Production Build Validation
```bash
npm run build
```
Creates an optimized production bundle inside `dist/`.

---

## 5. Troubleshooting & Frequently Asked Questions (FAQ)

### Q1: `Error: listen EADDRINUSE: address already in use :::8787`
**Cause:** Another process is occupying port 8787.  
**Solution:** Either kill the existing process or change the port in `.env`:
```bash
# macOS/Linux: Find and kill process on 8787
lsof -ti :8787 | xargs kill -9
```
Or set `API_PORT=8788` in `.env` and restart.

### Q2: MediaPipe Face Landmarker fails to load in video interview
**Cause:** MediaPipe downloads its WASM model files from Google CDNs (`cdn.jsdelivr.net`) on first launch.  
**Solution:** Ensure internet connectivity during the initial interview page load. The model is cached by your browser for subsequent offline/instant runs.

### Q3: Camera / Microphone permissions denied
**Cause:** Browsers block camera and microphone access on insecure origins.  
**Solution:**
- Always access via `https://career-coach-ai-iarw.vercel.app` or `http://127.0.0.1:5173` (browsers treat localhost as secure).
- If hosting remotely, run behind HTTPS or use an SSL tunnel (`./start-tunnel.sh`).
- Check browser address bar icon to grant camera and mic permissions.

### Q4: `GEMINI_API_KEY is not configured on the backend`
**Cause:** Missing or incorrectly named key in `.env`.  
**Solution:** Check that `.env` has `GEMINI_API_KEY=AIzaSy...` and restart `npm run api`.

### Q5: "Uploaded resume expired" (410 Error)
**Cause:** In-memory PDF buffers are temporarily stored for 30 minutes for security and privacy.  
**Solution:** Re-upload the resume PDF and run analysis.
