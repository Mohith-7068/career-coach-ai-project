# Deliverable 1: Complete Source Code Overview & Repository Structure
## Project Name: CareerCoachAI (Career Readiness & Interview Intelligence Platform)
**Hackathon Event:** 48-Hour AI Hackathon  
**Submission Date:** October 2026  
**License:** MIT / Proprietary Hackathon Submission  

---

## 1. Executive Summary & Codebase Health
**CareerCoachAI** is a production-grade, full-stack AI career acceleration platform. It integrates Google Gemini Multimodal LLMs, MediaPipe computer vision face-landmarking, real-time client/server audio processing, evidence-grounded PDF resume parsing, role-competency roadmapping, and gamified career readiness telemetry.

Unlike typical hackathon projects with mocked prototypes or static dummy data, this repository features **fully implemented, live backend and frontend pipelines**:
- **Zero Mock AI:** All resume parsing, audio speech analysis, interview generation, STAR-method evaluation, and job matching execute against live Express endpoints and Google Gemini 1.5/2.0/3.0 models.
- **Client-Side Computer Vision:** Privacy-first browser facial and eye landmark analysis powered by Google MediaPipe Tasks Vision (`@mediapipe/tasks-vision`) running on WebAssembly/GPU.
- **Hybrid Storage & Auth Architecture:** Production-ready MongoDB Atlas persistence with Mongoose schemas and automated local fallback (salted `scrypt` hashing and session tokens).

---

## 2. Technology Stack Breakdown

| Layer | Technologies & Libraries | Key Responsibilities |
| :--- | :--- | :--- |
| **Frontend UI/UX** | React 18, Vite 4, Tailwind CSS, Lucide Icons | Responsive, accessible, high-performance single page application |
| **Component System**| Radix UI primitives, Framer Motion, Recharts | Accessible UI primitives, micro-animations, career readiness radar & bar charts |
| **Vision & AI Client**| `@mediapipe/tasks-vision`, Web Audio API, Canvas | Client-side facial landmark detection, audio recording & visualization |
| **Backend API** | Node.js (ESM), Express 4.21, Multer, CORS | RESTful API server, payload sanitization, rate-limiting & timeout protections |
| **AI Orchestration** | Google Gemini API (Multimodal 1.5 / 2.0 / 3.x Flash) | Resume analysis, audio transcription, mock interview questions, STAR evaluation |
| **Document Processing**| `pdf-parse`, Buffer Streams | Local text extraction, byte verification (`%PDF-`), tamper rejection |
| **Database & Auth** | MongoDB Atlas, Mongoose 9, Node.js `crypto` (`scrypt`) | Session management, credential encryption, account-scoped data isolation |

---

## 3. Repository Directory Structure

```plaintext
CareerCoachAI/
├── docs/                                # All Hackathon Deliverables (1 to 10)
│   ├── 1_COMPLETE_SOURCE_CODE_OVERVIEW.md
│   ├── 2_BUSINESS_REQUIREMENTS_DOCUMENT_BRD.md
│   ├── 3_PRESENTATION_DECK.md
│   ├── 3_PRESENTATION_DECK.html
│   ├── 4_ARCHITECTURE_DIAGRAMS.md
│   ├── 5_INSTALLATION_GUIDE.md
│   ├── 6_FEATURE_LIST.md
│   ├── 7_BUSINESS_USE_CASE.md
│   ├── 8_FUTURE_ROADMAP.md
│   ├── 9_SUBMISSION_SUMMARY.md
│   └── 10_DEMO_VIDEO_SCRIPT.md
├── server/                              # Node.js Express Backend API
│   ├── index.mjs                        # Primary REST API routes & Gemini integration
│   ├── authService.mjs                  # Authentication logic & session handling
│   ├── db.mjs                           # MongoDB Atlas connection manager & DNS fallback
│   ├── healthcheck.mjs                  # Automated database & API health verification
│   ├── migrate.mjs                      # File-to-Database data migration tool
│   ├── models/                          # Mongoose Schemas & Data Models
│   │   ├── User.mjs                     # User entity with scrypt password verification
│   │   └── Session.mjs                  # Expirable Bearer session token schema
│   └── data/                            # Local JSON storage fallback for offline dev
│       └── users.json
├── src/                                 # React Frontend Application
│   ├── main.jsx                         # Application bootstrapping
│   ├── App.jsx                          # Router configuration & protected routes
│   ├── index.css                        # Global design system & Tailwind directives
│   ├── api/
│   │   └── base44Client.js              # Centralized API SDK & HTTP client
│   ├── components/                      # Reusable UI & Feature Components
│   │   ├── Navbar.jsx                   # Global navigation bar & user profile status
│   │   ├── Footer.jsx                   # Application footer & system status
│   │   ├── VideoCapture.jsx             # MediaPipe browser vision capture & landmark analysis
│   │   ├── AudioRecorder.jsx            # Web Audio microphone capture & waveform
│   │   ├── SessionAnalysis.jsx          # Post-interview analytics & feedback report
│   │   ├── ReadinessRadar.jsx           # Multi-axis career readiness radar visualization
│   │   └── ui/                          # Radix UI design system primitives
│   ├── pages/                           # Application Views & Workflows
│   │   ├── Home.jsx                     # Hero landing page & capability overview
│   │   ├── Dashboard.jsx                # Holistic career readiness analytics & quick actions
│   │   ├── Resume.jsx                   # PDF upload, evidence-based parsing & ATS scoring
│   │   ├── Interview.jsx                # Real-time AI mock interview simulation with vision
│   │   ├── Communication.jsx            # Speech pitch, pace & filler-word coach
│   │   ├── Wallet.jsx                   # Career coins ledger, balance & spend transactions
│   │   ├── Rewards.jsx                  # Gamification achievements, badges & claims
│   │   ├── Login.jsx                    # User authentication
│   │   ├── Register.jsx                 # User registration
│   │   ├── ForgotPassword.jsx           # Password recovery workflow
│   │   └── Demo.jsx                     # Interactive labeled sample walkthrough
│   ├── lib/                             # Core State & Domain Logic
│   │   ├── careerState.js               # Account-scoped career progress & coin accounting
│   │   └── careerData.js                # Career milestones, roles & competency definitions
│   └── utils/                           # Formatting, calculations & helper utilities
├── public/                              # Static public assets, icons, model manifests
├── package.json                         # Node.js project manifest & scripts
├── vite.config.js                       # Vite configuration
├── tailwind.config.js                   # Tailwind CSS styling tokens & theming
└── README.md                            # Primary project README
```

---

## 4. Key Module Implementations & File Cross-References

### 4.1 Backend Engine (`server/index.mjs`)
- **Resume Upload & In-Memory Storage (`POST /api/resume/upload`):** Enforces PDF magic byte validation (`%PDF-`), extracts plain text via `pdf-parse`, protects against empty/scanned PDFs, assigns a secure UUID, and automatically sweeps memory after 30 minutes.
- **Evidence-Based Resume Analysis (`POST /api/resume/analyze`):** Employs strict prompt engineering preventing LLM hallucinations. Rejects non-resume documents, isolates presentation defects from genuine skill gaps, and returns normalized JSON.
- **Audio Upload & Speech Transcription (`POST /api/speech/upload` & `analyze`):** Streams up to 20 MB of audio to Google Gemini's multimodal transcription engine, computes words per minute (WPM), detects filler words (`um`, `uh`, `like`, `you know`), and assigns clarity scores.
- **Adaptive Mock Interview (`POST /api/ai/interview-questions` & `evaluate-answer`):** Synthesizes role-specific situational, technical, and behavioral interview questions based on candidate level. Evaluates answers on **Relevance (35%)**, **Clarity (30%)**, and **Correctness (35%)**, auditing answers against the **STAR (Situation, Task, Action, Result)** methodology.
- **Role Competency & Job Matcher (`POST /api/career/roadmap` & `match-job`):** Audits candidate competencies against raw job descriptions, producing quantified skill-gap closing strategies and match percentages.

### 4.2 Computer Vision Engine (`src/components/VideoCapture.jsx`)
- Leverages `@mediapipe/tasks-vision` `FaceLandmarker` initialized with GPU acceleration and automatic CPU fallback.
- Computes real-time geometric signals directly on video frames:
  - **Face Visibility Ratio:** Detects presence and framing.
  - **Centering Index:** Evaluates whether candidate is well-positioned in frame.
  - **Eye Aspect Ratio / Openness:** Approximates visual attentiveness without invasive pseudo-scientific emotion claims.

### 4.3 Client-Side State & Gamification Engine (`src/lib/careerState.js`)
- Enforces strict account scoping (`${key}:${userId}`) preventing data contamination between different users on shared hardware.
- Tracks Career Coins, XP, daily streaks, and readiness metrics across 4 key pillars:
  1. Resume Optimization Score
  2. Communication & Speech Fluency Score
  3. Technical Competency Score
  4. Real-time Interview Performance Score
- Idempotent transaction tracking prevents duplicate coin awards on network retries.

---

## 5. Verification & Code Quality Status
- **Syntax & Compilation:** All Node backend files (`server/index.mjs`, `authService.mjs`, `db.mjs`, `healthcheck.mjs`) pass `node --check`.
- **API Security:** Secrets are strictly server-side (`.env`). No sensitive keys leak to the client bundle.
- **Graceful Degradation:** The database subsystem automatically detects whether MongoDB Atlas is reachable; if offline in development mode, it fails over gracefully to local encrypted storage.
