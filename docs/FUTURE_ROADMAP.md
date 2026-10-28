# Deliverable 8: Strategic Product & Engineering Roadmap (2026 – 2028)
## Project Name: CareerCoachAI — Intelligent Career Readiness Platform
**Target Horizon:** 4 Execution Phases across 18 Months  

---

## 1. Roadmap Overview & Vision

The strategic goal of **CareerCoachAI** is to evolve from a high-performance multimodal hackathon MVP into the world’s definitive **Automated Talent Acceleration Infrastructure**.

```
+-----------------------------------------------------------------------------------------------+
|                             STRATEGIC HORIZON (2026 - 2028)                                   |
+-----------------------------------------------------------------------------------------------+
|  PHASE 1 (Q4 2026)      PHASE 2 (Q1 2027)      PHASE 3 (Q2 2027)        PHASE 4 (Q3-Q4 2027)  |
|  Hackathon Core MVP     Bidirectional Voice    B2B Campus Portal        Immersive Spatial XR  |
|  ──────────────────     ───────────────────    ─────────────────        ────────────────────  |
|  • Live Gemini AI       • Gemini Live WebRTC   • Multi-Tenant SaaS      • WebXR 3D Boardroom  |
|  • MediaPipe Vision     • Follow-up Interrup.  • Cohort Analytics       • AI Panel Avatars    |
|  • Resume ATS Parser    • 1-Click ATS Sync     • LMS Integrations       • Soulbound Creds     |
|  • Scoped Coin Ledger   • Google/OAuth Login   • Automated Ranking      • Real-Time Biometric |
+-----------------------------------------------------------------------------------------------+
```

---

## 2. Phase-by-Phase Milestone Breakdown

### Phase 1: Hackathon Foundation & Production Hardening (Current — Q4 2026)
*Objective: Deliver a robust, zero-mock, evidence-grounded multimodal foundation with real models.*

- [x] **Strict PDF Parsing & ATS Scoring:** Magic byte `%PDF-` validation and anti-hallucination Gemini prompt engineering.
- [x] **Acoustic Speech Fluency Engine:** Real microphone capture, Gemini audio transcription, words-per-minute (WPM) pacing, and filler word detection.
- [x] **Client-Side MediaPipe Vision HUD:** WebAssembly and GPU-accelerated facial landmarking for real-time centering and eye engagement tracking without transmitting video.
- [x] **STAR Methodology Evaluation:** Automated detection and scoring of Situation, Task, Action, and Result indicators with 35/30/35 composite scoring.
- [x] **Hybrid Persistence:** MongoDB Atlas Mongoose integration with automated local encrypted storage fallback.
- [x] **Account-Scoped Gamification:** Career Coins, XP, streak tracking, and idempotent transaction accounting.

---

### Phase 2: Real-Time Bidirectional Voice & ATS Synchronization (Q1 2027)
*Objective: Transform turn-based question answering into fluid, lifelike conversational interviews with realistic interruptions and ATS exports.*

- [ ] **Bidirectional Conversational Streaming (Gemini Live API):**
  - Upgrade audio recording to full-duplex WebRTC streaming via the Gemini Multimodal Live API.
  - Implement dynamic follow-up questioning: The AI interviewer can interrupt gracefully if the candidate rambles or ask clarifying questions ("Can you explain how you handled the database lock in that scenario?").
- [ ] **1-Click ATS Resume Export & Optimization Engine:**
  - In-browser PDF generation (`jspdf` / LaTeX compiler) allowing candidates to export a tailored, 100% ATS-compliant PDF resume formatted specifically for target job descriptions.
- [ ] **Expanded OAuth & Social Identity:**
  - Google OAuth 2.0, GitHub login, and LinkedIn profile sync with verified educational and work histories.
- [ ] **OCR Engine for Scanned Resumes:**
  - Integrate Tesseract.js / Google Cloud Vision OCR for legacy image-only scanned PDF resumes.

---

### Phase 3: University & Enterprise B2B SaaS Platform (Q2 2027)
*Objective: Scale the platform across institutional partners with administrative management and cohort telemetry.*

- [ ] **Multi-Tenant University Placement Portal:**
  - Dedicated institutional subdomains (e.g., `stanford.careercoach.ai`).
  - Role-Based Access Control (RBAC): SuperAdmin, Career Placement Officer, Department Chair, Student.
- [ ] **Cohort-Level Telemetry & Analytics Dashboard:**
  - High-level heatmaps showing student strengths and weaknesses by major/department (e.g., "Computer Science cohort scores 88% on technical correctness but only 52% on STAR Result quantification").
- [ ] **Learning Management System (LMS) Integration:**
  - LTI 1.3 compliance for seamless integration with Canvas, Blackboard, and Moodle.
  - Automatic assignment grade syncing for career preparation courses.
- [ ] **Enterprise Pre-Screening API:**
  - Public REST & GraphQL API for corporate recruiting platforms (Greenhouse, Lever, Workday) to dispatch automated technical mock assessments to applicants.

---

### Phase 4: Spatial WebXR Simulation & Cryptographic Credentials (Q3 – Q4 2027)
*Objective: Pioneer the future of immersive interview readiness with virtual reality and tamper-proof verification.*

- [ ] **WebXR Immersive 3D Interview Boardroom:**
  - Candidate can don a Meta Quest or Apple Vision Pro headset to enter a simulated corporate boardroom.
  - Realistic 3D photorealistic interviewer avatars driven by Three.js and text-to-speech phoneme lipsync.
- [ ] **Real-Time Stress & Vocal Cadence Biometrics:**
  - Optional integration with wearable heart-rate telemetry (Apple Watch / WearOS) to help candidates master physiological stress regulation under high-stakes questioning.
- [ ] **Soulbound Web3 Career Readiness Badges:**
  - Issue non-transferable, cryptographically signed verifiable credentials (W3C standard) proving a candidate has demonstrated >85% STAR fluency and technical competence without leaking personal data.
- [ ] **Global Peer-to-Peer Mock Network:**
  - AI-moderated peer mock interviews matching candidates across the world with complementary skillsets.

---

## 3. Technology Evolution & Infrastructure Roadmap

| Architecture Layer | Phase 1 (Now) | Phase 2 (Q1 2027) | Phase 3 (Q2 2027) | Phase 4 (Q3-Q4 2027) |
| :--- | :--- | :--- | :--- | :--- |
| **Speech Processing**| Turn-based Web Audio | WebRTC Full-Duplex Stream | WebRTC with Voice Activity (VAD) | Spatial 3D Audio & Phonemes |
| **AI Models** | Gemini 2.0/3.x Flash | Gemini Multimodal Live API | Fine-tuned Industry LoRA Models | On-device Edge SLM + Cloud LLM |
| **Vision Tracking** | MediaPipe FaceLandmarker | MediaPipe Holistic (Hands/Gaze) | MediaPipe Body Pose & Posture | WebXR Spatial Head Tracking |
| **Database** | MongoDB Atlas | MongoDB Atlas + Redis Cache | Multi-tenant PostgreSQL / Citus | Hybrid Cloud + Cryptographic Ledger |
| **Target Scale** | 1,000 Users | 25,000 Users | 500,000 Students | 5,000,000+ Global Candidates |
