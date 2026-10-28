# Deliverable 6: Comprehensive Feature List & Capabilities Matrix
## Project Name: CareerCoachAI — Intelligent Career Readiness Platform
**Evaluation Stage:** 48-Hour Hackathon Final Deliverables  

---

## 1. Feature Matrix Summary Table

| Module | Feature Name | Technology / Model | Implementation Status | Core Benefit |
| :--- | :--- | :--- | :---: | :--- |
| **Resume** | Magic Byte PDF Ingestion | Node.js `pdf-parse`, Buffer | ✅ Complete | Rejects non-PDFs & corrupt files before AI ingestion |
| **Resume** | Anti-Hallucination Fact Extraction | Google Gemini 2.0/3.x Flash | ✅ Complete | Only extracts facts evidenced in resume text |
| **Resume** | Dual-Axis Defect Isolation | Prompt Engineering & Schema | ✅ Complete | Separates presentation defects from skill gaps |
| **Resume** | Comprehensive ATS Score (0–100) | Gemini Structured JSON | ✅ Complete | Quantifies candidate pass probability through ATS |
| **Speech** | Web Audio Microphone Streaming | Web Audio API / Multer | ✅ Complete | Captures real candidate vocal responses up to 20MB |
| **Speech** | Acoustic Pacing Engine (WPM) | Gemini Multimodal + JS Math | ✅ Complete | Calculates exact speaking speed & categorizes pace |
| **Speech** | Filler Word Acoustic Detector | Verbatim Transcript Analysis | ✅ Complete | Counts `um`, `uh`, `like`, `you know`, `actually` |
| **Speech** | Vocal Clarity & Coherence Index | Weighted Speech Algorithm | ✅ Complete | Provides actionable tips on vocal projection and pauses |
| **Interview**| Dynamic Question Synthesis | Gemini Role Prompting | ✅ Complete | Generates 5 distinct questions based on role & seniority |
| **Interview**| On-Device Face Landmark HUD | MediaPipe Tasks Vision | ✅ Complete | Real-time framing & eye-openness tracking (WASM/GPU) |
| **Interview**| STAR Methodology Scoring | Gemini Structured JSON | ✅ Complete | Verifies Situation, Task, Action, and Result checkboxes |
| **Interview**| Weighted Answer Evaluation | Deterministic Composite Math| ✅ Complete | 35% Relevance + 30% Clarity + 35% Correctness |
| **Roadmap** | Job Description Skill Gap Matcher | Gemini Competency Compare | ✅ Complete | Parses raw job posting vs candidate skills |
| **Roadmap** | Verification & Closing Strategy | AI Competency Mapping | ✅ Complete | Provides concrete projects/courses to close gaps |
| **Gamification**| Career Coins & XP Economy | Account-Scoped LocalStorage | ✅ Complete | Rewards daily practice, resume uploads, and drills |
| **Gamification**| Idempotent Transaction Ledger | Unique Hash Reference Check | ✅ Complete | Prevents duplicate reward claims on network retries |
| **Gamification**| Career Readiness Radar Index | Multi-Axis Composite Index | ✅ Complete | Visualizes holistic readiness across 4 career pillars |
| **Auth** | Multi-Tier Persistence | MongoDB Atlas + File Backup | ✅ Complete | Cloud Mongoose database with offline dev fallback |
| **Auth** | Salted Scrypt Cryptography | Node.js Native `crypto` | ✅ Complete | High-security password hashing with timing-safe checks |
| **Auth** | 7-Day Bearer Session Engine | Expirable UUID Tokens | ✅ Complete | Secure session validation and automatic logout |

---

## 2. Detailed Module Breakdown

### 2.1 Module 1: Evidence-Based Resume Analyzer & ATS Optimizer
- **Magic Byte Verification:** Inspects the first 5 bytes of every uploaded file for `%PDF-`, preventing spoofed extensions or malicious executable uploads.
- **Text Layer Validation:** Enforces a minimum 120-character threshold. Unreadable image-only or scanned documents return a clear alert instructing the user that OCR is required.
- **Section Detection & Extraction:**
  - Contact Information
  - Professional Summary
  - Education (Degree, Field, Institution, Year)
  - Experience (Company, Role, Duration, Bullet Highlights)
  - Projects (Name, Tech Stack, Description)
  - Technical Skills & Toolsets
  - Certifications & Achievements
- **Dual-Axis Gap Analysis:**
  - *Presentation Defects:* Identifies passive verbs, missing metrics, formatting inconsistencies, or missing summaries.
  - *Competency Gaps:* Identifies genuine missing technical requirements for the target role (e.g., "Candidate lacks demonstrated experience in Kubernetes and CI/CD pipelines").
- **Automatic 30-Minute In-Memory Buffer Cleanup:** Uploaded PDF buffers stay in server memory only during the active analysis window and are purged after 30 minutes.

---

### 2.2 Module 2: Acoustic Speech & Communication Coach
- **Low-Latency Microphone Capture:** Browser Web Audio API records audio in native formats (`audio/webm`, `wav`, `mp3`, `ogg`) and streams up to 20 MB directly to the backend.
- **Gemini Multimodal Speech Transcription:** Sends audio directly to Gemini without third-party speech APIs, yielding verbatim, uncensored transcripts.
- **Pacing Engine (Words-Per-Minute):**
  - **Too Slow (< 110 WPM):** Triggers coaching to increase energy and momentum.
  - **Optimal (110 – 160 WPM):** Highlights balanced, articulate executive cadence.
  - **Too Fast (> 160 WPM):** Alerts candidate to slow down, pause, and breathe.
- **Filler Word Tagging & Density Rate:** Identifies exact occurrences and percentages of habitual filler words (`um`, `uh`, `like`, `you know`, `actually`, `basically`, `sort of`, `right`).
- **Verbal Polish Recommendations:** Provides actionable guidance on sentence ending inflections, thought structuring, and vocal pauses.

---

### 2.3 Module 3: Computer Vision AI Mock Interview Simulation
- **Seniority-Adaptive Question Synthesis:** Generates exactly five distinct behavioral, technical, situational, and experience questions tailored to the candidate's target role and experience level (Entry, Mid, Senior).
- **Client-Side MediaPipe FaceLandmarker:**
  - Runs in-browser using WebAssembly and WebGL GPU acceleration.
  - Computes 478 3D facial mesh points in real-time.
  - **Face Centering:** Detects horizontal and vertical displacement from optimal camera framing.
  - **Eye Engagement / Openness:** Approximates visual attention to the camera without making pseudo-scientific claims about personality or honesty.
  - **100% Privacy Guarantee:** Video frames are processed entirely in browser memory; no video is ever sent over the network.
- **STAR Methodology Audit:**
  - **Situation:** Did the candidate describe the specific business or project scenario?
  - **Task:** Was the candidate's exact role or goal clearly outlined?
  - **Action:** Were concrete technical decisions and individual contributions detailed?
  - **Result:** Were quantitative outcomes, performance improvements, or lessons learned presented?
- **Deterministic Composite Scoring:**
  $$\text{Score} = (\text{Relevance} \times 0.35) + (\text{Clarity} \times 0.30) + (\text{Correctness} \times 0.35)$$

---

### 2.4 Module 4: Job Description Competency Matcher & Roadmap
- **Raw Job Description Parsing:** Analyzes full job postings (up to 6,000 characters).
- **Competency Status Classification:**
  - `demonstrated`: Evidenced in candidate background.
  - `partially_demonstrated`: Foundational or adjacent skill identified.
  - `not_demonstrated`: Critical requirement missing.
  - `needs_confirmation`: Nuanced competency requiring user confirmation.
- **Closing Strategy & Verification Methods:** Recommends specific capstone projects, open-source contributions, or certifications to close identified gaps before applying.

---

### 2.5 Module 5: Gamified Economy, Wallet & Career Readiness Index
- **Career Coins Rewards:**
  - Resume Upload & Audit: `+50 Coins`
  - Audio Speech Drill Completed: `+30 Coins`
  - Mock Interview Completed: `+100 Coins`
  - 3-Day Practice Streak: `+150 Coins`
- **Account-Scoped Local Ledger:** Prevents multiple user accounts on the same computer from sharing or corrupting wallet balances.
- **Idempotent Transaction Handling:** Stable idempotency hashes ensure network retries or component re-renders cannot duplicate payouts.
- **Holistic Career Readiness Index (CRI):** Dynamic 0–100 composite index calculated from the 4 primary assessment dimensions:
  1. Resume ATS Score
  2. Speech & Communication Score
  3. Technical Competency Score
  4. Mock Interview Performance Score

---

### 2.6 Module 6: Secure Authentication & Hybrid Persistence
- **Dual-Storage Engine:**
  - Primary: Cloud MongoDB Atlas using Mongoose 9 with SRV DNS resolution and automatic retry logic.
  - Secondary: Local encrypted file storage (`server/data/users.json`) for seamless zero-config development.
- **Cryptographic Security:** Salted `scrypt` password hashing (16-byte random salt, 64-byte key) with timing-safe comparison.
- **Session Control:** Expirable Bearer session tokens with 7-day TTL and instant revocation upon logout.
