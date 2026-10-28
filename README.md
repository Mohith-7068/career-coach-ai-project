# 🚀 CareerCoachAI — Intelligent Career Readiness & Multimodal AI Coaching Platform

[![Production Status](https://img.shields.io/badge/Production-Live%20on%20Vercel%20%26%20Render-success)](https://career-coach-ai-iarw.vercel.app)
[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B%20%7C%2020%2B%20%7C%2024%2B-blue)](https://nodejs.org)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas%20Cloud-green)](https://www.mongodb.com/atlas)
[![AI Engine](https://img.shields.io/badge/AI-Google%20Gemini%20Multimodal-orange)](https://deepmind.google/technologies/gemini/)
[![Computer Vision](https://img.shields.io/badge/Vision-MediaPipe%20WASM%20(100%25%20In--Browser)-purple)](https://developers.google.com/mediapipe)
[![License](https://img.shields.io/badge/License-MIT-lightgrey)](LICENSE)

> **CareerCoachAI** is an AI-powered career enablement platform combining an evidence-grounded ATS resume intelligence auditor, real-time acoustic speech coach, and webcam-enabled mock interview studio with STAR-framework evaluation and gamified habit tracking.

---

## 🌐 Live Production Deployments

- **Frontend Application (Vercel):** [https://career-coach-ai-iarw.vercel.app](https://career-coach-ai-iarw.vercel.app)
- **Backend API Service (Render):** [https://career-coach-ai-kai0.onrender.com](https://career-coach-ai-kai0.onrender.com)
- **Backend Health Check:** [https://career-coach-ai-kai0.onrender.com/api/health](https://career-coach-ai-kai0.onrender.com/api/health)

---

## 📑 Complete Deliverables Master Index

All required project submission deliverables are organized below:

| # | Deliverable | Location | Description |
| :-: | :--- | :--- | :--- |
| **1** | **Complete Source Code** | [`src/`](src/) & [`server/`](server/) | React 18, Vite 6, TailwindCSS, Express 4, Mongoose 9, MediaPipe |
| **2** | **BRD / Project Documentation** | [`docs/BRD.md`](docs/BRD.md) & [`docs/PROJECT_DOCUMENTATION.md`](docs/PROJECT_DOCUMENTATION.md) | Business Requirements, User Stories, Architecture, Data Models |
| **3** | **Presentation Deck (PPT/PPTX)** | [`presentation/Career_Coach_AI_Project_Presentation.pptx`](presentation/Career_Coach_AI_Project_Presentation.pptx) | 15-Slide Pitch Deck with speaker notes, HTML, and slide catalog |
| **4** | **Architecture Diagrams** | [`diagrams/system-architecture.svg`](diagrams/system-architecture.svg) & [`diagrams/`](diagrams/) | System topology, data flow, and user workflow sequence diagrams |
| **5** | **Installation Guide** | [`docs/INSTALLATION_GUIDE.md`](docs/INSTALLATION_GUIDE.md) | Local development setup, MongoDB Atlas, Render, and Vercel guides |
| **6** | **Feature List** | [`docs/FEATURE_LIST.md`](docs/FEATURE_LIST.md) | Categorized matrix of verified features across all 6 core modules |
| **7** | **Business Use Case** | [`docs/BUSINESS_USE_CASE.md`](docs/BUSINESS_USE_CASE.md) | Market analysis ($15.8B TAM), B2B university & candidate economics |
| **8** | **Future Roadmap** | [`docs/FUTURE_ROADMAP.md`](docs/FUTURE_ROADMAP.md) | 4-Phase strategic roadmap (WebXR VR, bidirectional voice, LMS) |
| **9** | **Testing & Validation Report** | [`docs/TESTING_AND_VALIDATION.md`](docs/TESTING_AND_VALIDATION.md) | Verification results for Stage A, B, and C automated test suites |
| **10** | **Demo Video Guide (Optional)** | [`demo/DEMO_SCRIPT.md`](demo/DEMO_SCRIPT.md) & [`demo/STORYBOARD.md`](demo/STORYBOARD.md) | 3:30 demo video script, screenplay, narration, and storyboard |

---

## 🏛️ System Architecture Preview

```
[Candidate Browser (React 18 SPA + Vite)]
   │   ├── MediaPipe WASM/WebGL (100% In-Browser Facial Landmarker)
   │   └── Web Audio API (Microphone Capture & WPM Analyzer)
   │
   ▼ HTTPS / TLS + Bearer Authentication
[Express 4 Orchestration API (Render Cloud)]
   │   ├── Auth Service (Salted Scrypt Hashing + 14-day Sessions)
   │   ├── Multer In-Memory Buffer & pdf-parse (Magic Byte Validation)
   │   └── Gemini Multimodal Prompt Orchestrator
   │
   ├──▶ [Google Gemini 2.5 / 1.5 Flash (AI Reasoning)]
   │
   └──▶ [MongoDB Atlas Cloud Database (Users, Sessions & Career Entities)]
```

*For complete SVG vector graphics and Mermaid source specifications, see [`diagrams/`](diagrams/).*

---

## ⚡ Quickstart & Local Installation

### Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **MongoDB Atlas** connection string or local MongoDB instance
- **Google Gemini API Key** ([Google AI Studio](https://aistudio.google.com/))

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Mohith-7068/career-coach-ai-project.git
cd career-coach-ai-project
npm install
```

### 2. Configure Environment Variables
Copy the provided `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your credentials:
```ini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/career_coach?retryWrites=true&w=majority
FRONTEND_ORIGIN=http://localhost:5173
API_PORT=8787
VITE_API_BASE_URL=http://localhost:8787
```

### 3. Start Development Servers
Start backend API server (runs on `http://localhost:8787`):
```bash
npm run api
```
In a second terminal, start the frontend (runs on `http://localhost:5173`):
```bash
npm run dev
```

### 4. Run Test Suites
```bash
# Stage A: Auth & MongoDB verification
node --env-file-if-exists=.env server/test_stage_a_auth.mjs

# Stage B: Cloud persistence & user isolation
node --env-file-if-exists=.env server/test_stage_b_persistence.mjs

# Stage C: Authenticated interview & CORS validation
node --env-file-if-exists=.env server/test_stage_c_auth_interview.mjs

# ESLint & Production build validation
npm run lint
npm run build
```

---

## 🔒 Security & Privacy Architecture

- **Zero-Storage Video Privacy:** Video frames processed by MediaPipe run 100% locally on WebAssembly/WebGL inside the client's browser. Raw video is never recorded or streamed to servers.
- **Salted Scrypt Hashing:** Passwords hashed with `node:crypto` scrypt (N=16384, r=8, p=1) and verified using constant-time timing-safe comparison.
- **Strict User Isolation:** All entity queries (`ResumeAnalysis`, `InterviewSession`, `SpeechSession`, `CareerState`) are strictly scoped by MongoDB Atlas `userId`.
- **Zero Exposed Secrets:** Scanned with automated secret audit tools; zero credentials or API keys in tracked files.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
