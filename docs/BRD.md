# Deliverable 2: Business Requirements Document (BRD)
## Project Name: CareerCoachAI — Intelligent Career Readiness & Interview Acceleration Platform
**Version:** 1.0.0  
**Project Lead:** Team CareerCoachAI  
**Target Delivery:** 48-Hour Hackathon Evaluation  
**Status:** Approved & Implemented  

---

## 1. Document Control & Executive Summary

### 1.1 Document Overview
This Business Requirements Document (BRD) establishes the business rationale, functional specifications, system behaviors, and operational requirements for **CareerCoachAI**. CareerCoachAI is an AI-driven, end-to-end career enablement system designed to bridge the critical gap between academic education/job seeking and competitive corporate hiring standards.

### 1.2 Executive Summary
Over 73% of job applicants are filtered out by modern Applicant Tracking Systems (ATS) or fail technical and behavioral interviews due to unstructured communication, lack of STAR methodology, unoptimized resumes, and poor real-time presentation. Existing career coaching services cost between $150–$400/hour, making professional guidance inaccessible to the majority of college graduates, bootcamp attendees, and transitioning professionals.

**CareerCoachAI solves this crisis** by democratizing personalized, multimodal career coaching. By orchestrating Google Gemini Multimodal LLMs, MediaPipe client-side computer vision, and speech acoustic analysis, the platform provides:
1. **Instant, Evidence-Grounded Resume ATS Audits:** Eliminating hallucinations and identifying actionable skill gaps.
2. **Real-Time Speech & Communication Coaching:** Tracking words-per-minute (WPM), speech pauses, and filler word density.
3. **Interactive AI Mock Interviews with Vision:** Generating dynamic situational questions, evaluating behavioral responses with the STAR framework, and analyzing camera framing and engagement.
4. **Targeted Job Description Matching:** Comparing user competencies directly against real job postings.
5. **Gamified Habit Formation:** Driving consistent interview practice through Career Coins, XP, and daily streaks.

---

## 2. Business Problem Statement

```
+------------------------------------------------------------------------------------+
|                                THE EMPLOYABILITY CRISIS                           |
+------------------------------------------------------------------------------------+
| 1. The Resume Blindspot:                                                           |
|    Job seekers submit generic resumes that fail ATS parsers and miss critical      |
|    competency keywords without understanding why they are rejected.                |
|                                                                                    |
| 2. The Mock Interview Bottleneck:                                                  |
|    Human mock interviews are expensive, non-scalable, stressful, and rarely offer  |
|    objective, quantifiable feedback on speech pace, filler words, or structure.    |
|                                                                                    |
| 3. The Preparation Vacuum:                                                         |
|    Candidates practice in silos without measurable metrics, leading to interview   |
|    anxiety, poor delivery, and repeated rejections.                                |
+------------------------------------------------------------------------------------+
```

### Key Business Metrics Affected:
- Average time-to-hire for entry-level tech candidates exceeds **5.4 months**.
- University career placement cells have an average ratio of **1 counselor per 450 students**, making 1-on-1 personalized mock sessions impossible.
- Over 65% of candidates report high anxiety during virtual video interviews due to a lack of camera familiarity and unguided articulation.

---

## 3. Project Goals & Target Success Metrics (KPIs)

| Business Objective | Metric / KPI | Target Goal |
| :--- | :--- | :--- |
| **Resume ATS Optimization** | Resume Quality & ATS Pass Score | Boost candidate average resume score from <55% to >85% |
| **Communication Fluency** | Filler Word Reduction | Reduce filler words to <3 per 100 words spoken |
| **Pacing Control** | Speech Delivery Pace | Guide candidate speech into optimal 120–160 WPM band |
| **STAR Method Mastery** | STAR Component Presence | Ensure >80% of answers exhibit Situation, Task, Action, and Result |
| **User Retention** | 7-Day Practice Streak Rate | Achieve >40% weekly recurring practice adherence via gamification |
| **Placement Readiness** | Overall Career Readiness Score | Achieve >75 Readiness Index before live corporate interviews |

---

## 4. User Personas & Stakeholder Analysis

### Persona A: "The Campus Graduate" (Arjun Patel, 21)
- **Background:** Final year Computer Science student preparing for campus recruitment.
- **Pain Points:** Good technical knowledge, but struggles with behavioral questions ("Tell me about a time you had a conflict in a team"), speaks too fast under pressure, and has an unformatted resume.
- **Needs:** Realistic, low-pressure mock interview simulations with instantaneous, constructive feedback.

### Persona B: "The Career Transitioner" (Sarah Jenkins, 29)
- **Background:** Marketing specialist transitioning into Data Science and Analytics.
- **Pain Points:** Unclear on how her existing skills map to technical job listings; unsure which gaps are dealbreakers vs. easily learnable.
- **Needs:** Direct job description skill comparison, customized learning roadmaps, and targeted technical interview questions.

### Persona C: "The University Placement Officer" (Dr. Robert Chen, 48)
- **Background:** Director of Student Career Placement at a university with 3,500 graduating seniors.
- **Pain Points:** Unable to conduct individual mock interviews for all students; lacks centralized telemetry on which cohorts are interview-ready.
- **Needs:** Scalable, automated coaching platform with measurable student readiness benchmarks.

---

## 5. System Scope & Functional Requirements (FRD)

### 5.1 Module 1: Evidence-Based Resume Analyzer & Auditor
- **FR 1.1:** System shall accept text-based PDF uploads up to 8 MB with magic byte `%PDF-` validation.
- **FR 1.2:** System shall reject non-resume documents, corrupted files, and scanned image-only PDFs with explicit, actionable error messaging.
- **FR 1.3:** System shall extract candidate profile, educational history, professional experience, technical competencies, frameworks, and projects.
- **FR 1.4:** System shall generate an evidence-grounded ATS score (0–100) and distinguish **presentation/formatting issues** from **genuine skill gaps**.

### 5.2 Module 2: Real-Time Audio Communication & Speech Coach
- **FR 2.1:** System shall record browser microphone audio and transmit WebM/WAV/MP3 buffers up to 20 MB to the backend.
- **FR 2.2:** Backend shall transcribe spoken speech via Gemini Multimodal API without hallucination.
- **FR 2.3:** System shall calculate words per minute (WPM) and classify speech pace (Slow: <110 WPM, Balanced: 110–160 WPM, Fast: >160 WPM).
- **FR 2.4:** System shall identify and count filler words (`um`, `uh`, `like`, `you know`, `actually`, `basically`, `sort of`).
- **FR 2.5:** System shall compute an aggregate Communication Score and provide actionable tips.

### 5.3 Module 3: AI Mock Interview Simulator with Computer Vision
- **FR 3.1:** System shall dynamically generate 5 role-specific interview questions tailored to target role and candidate seniority (Entry, Mid, Senior).
- **FR 3.2:** System shall run in-browser MediaPipe Face Landmarker via WebAssembly/GPU to observe face presence, framing centering, and eye openness during the interview.
- **FR 3.3:** System shall evaluate submitted candidate answers on:
  - **Relevance (35% weight):** Direct responsiveness to the prompt.
  - **Clarity (30% weight):** Coherent, concise structure.
  - **Correctness (35% weight):** Technical and situational substance.
- **FR 3.4:** System shall audit answers for the presence of the **STAR framework** (Situation, Task, Action, Result) with boolean indicators.

### 5.4 Module 4: Job Description Skill Gap & Roadmap Matcher
- **FR 4.1:** System shall compare candidate confirmed skills against raw job postings (up to 6,000 characters).
- **FR 4.2:** System shall classify each required skill into:
  - `demonstrated`
  - `partially_demonstrated`
  - `not_demonstrated`
  - `needs_confirmation`
- **FR 4.3:** System shall provide closing strategies, verification methods, and an aggregate Match Percentage (0–100%).

### 5.5 Module 5: Gamified Progression & Career Coins Economy
- **FR 5.1:** System shall award Career Coins and XP for completing milestones (Resume upload: +50 coins, First mock interview: +100 coins, 3-day streak: +150 coins).
- **FR 5.2:** System shall maintain an immutable, account-scoped transaction ledger with idempotency keys preventing duplicate coin claims.
- **FR 5.3:** System shall calculate an aggregate Career Readiness Index (0–100) updated in real-time as users complete assessments.

### 5.6 Module 6: Authentication & Security
- **FR 6.1:** System shall support email and password registration with salted `scrypt` hashing.
- **FR 6.2:** System shall support MongoDB Atlas persistence with automatic graceful fallback to local encrypted files for offline environments.
- **FR 6.3:** System shall issue 7-day secure Bearer session tokens with server-side validation.

---

## 6. Non-Functional Requirements (NFR)

### 6.1 Performance & Latency
- **NFR 1.1:** Audio transcription and feedback computation must complete within **< 4.0 seconds**.
- **NFR 1.2:** Browser face landmark inference must execute at **>= 24 FPS** on modern hardware without causing video lag.
- **NFR 1.3:** Resume text extraction and classification must return within **< 6.0 seconds**.

### 6.2 Security & Data Privacy
- **NFR 2.1:** **Zero Video Storage:** Camera video frames shall be processed entirely inside client browser memory using MediaPipe; no raw video footage is ever uploaded or stored on servers.
- **NFR 2.2:** **Temporary Audio Lifetime:** Uploaded audio buffers in server memory must be securely purged within **30 minutes**.
- **NFR 2.3:** **Credential Isolation:** API keys (Gemini, MongoDB) must reside exclusively in backend environment variables and must never be exposed to client bundles.

### 6.3 Usability & Accessibility
- **NFR 3.1:** User interface must comply with WCAG 2.1 Level AA color contrast guidelines.
- **NFR 3.2:** Fully responsive layout across mobile, tablet, and desktop viewports.

---

## 7. Assumptions & Constraints

1. **OCR Scope:** Current PDF parser assumes text-layer documents; scanned image-only PDFs return an explicit OCR requirement alert.
2. **AI Model Connectivity:** Live AI functionality requires an active internet connection and a valid Google Gemini API key.
3. **Browser Permissions:** Webcam and microphone access require explicit user browser permissions over `localhost` or `HTTPS`.
