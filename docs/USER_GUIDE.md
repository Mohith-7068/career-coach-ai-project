# Deliverable: CareerCoachAI End-to-End User Guide
## Comprehensive Walkthrough for Job Seekers, Students, and Evaluators

---

## 1. Getting Started & Account Creation

### 1.1 Accessing the Application
- **Production Web Application:** [https://career-coach-ai-iarw.vercel.app](https://career-coach-ai-iarw.vercel.app)
- **Production API Backend:** [https://career-coach-ai-kai0.onrender.com](https://career-coach-ai-kai0.onrender.com)

### 1.2 Sign Up & Sign In
1. Navigate to `/register` or click **Log in** from the navigation bar.
2. Enter your full name, email address, and a secure password (minimum 8 characters).
3. Click **Create Account**. Your session token is stored securely in browser storage and authenticated with the cloud backend.
4. If you already have an account, enter your credentials on `/login`.

---

## 2. Resume Intelligence Studio (`/resume`)

1. **Upload Resume:**
   - Drag and drop a text-based PDF resume (under 8 MB) or click **Upload PDF Resume**.
   - The platform verifies the PDF structure and securely uploads the file.
2. **Select Target Role:**
   - Choose your intended career role (e.g. *Senior Backend Engineer*, *Full Stack Developer*, *Product Manager*).
3. **Execute ATS Diagnostic Audit:**
   - Click **Analyze Resume**.
   - Review your **ATS Score (0–100)**, extracted technical skills, missing sections, and formatting vs. capability gaps.
4. **Targeted Job Matching:**
   - Paste a real job description into the Job Matcher panel.
   - Click **Match Job** to inspect matched skills, missing competencies, and a tailored learning roadmap.

---

## 3. Communication Practice Coach (`/communication`)

1. **Select Practice Prompt:**
   - Choose from pre-configured interview prompts (e.g. *"Tell me about yourself"*, *"Describe your greatest technical challenge"*).
2. **Record Response:**
   - Click **Start Recording** and allow microphone access.
   - Speak naturally for 15–60 seconds.
3. **Inspect Real-Time Acoustic Feedback:**
   - Click **Analyze Speech**.
   - View your **Words Per Minute (WPM)** cadence gauge (optimal: 120–160 WPM).
   - Review detected filler words (`um`, `like`, `you know`, `actually`) and density metrics.
   - Receive concrete coaching suggestions to sound more articulate.

---

## 4. AI Mock Interview Studio (`/interview`)

1. **Configure Interview Session:**
   - Select your target role, experience level (*Entry*, *Mid*, *Senior*), and choose between **Standard**, **Microphone**, or **Video** mode.
2. **Video & Vision Engagement (Video Mode):**
   - In video mode, your camera activates with in-browser Google MediaPipe face tracking.
   - View real-time heads-up metrics on **Face Centering** and **Eye Openness**.
   - *Note: All video frames are processed 100% locally on your device for total privacy.*
3. **Answer Questions & STAR Evaluation:**
   - Practice realistic situational and behavioral interview questions grounded in your uploaded resume skills.
   - Deliver your answer and click **Submit Answer**.
   - Inspect instant evaluation across **Relevance (35%)**, **Clarity (30%)**, and **STAR Correctness (35%)**.
   - Review checkmarks for Situation, Task, Action, and Result components.
4. **Session Deep Review:**
   - Complete all 5 questions to receive a comprehensive performance report, overall score, and earned Career Coins.

---

## 5. Progression Studio & Gamification (`/dashboard`, `/wallet`, `/rewards`)

1. **Career Readiness Score:**
   - Track your holistic readiness index combining resume, communication, and interview performance.
2. **Career Coin Wallet:**
   - Earn Career Coins and XP for every practice session, resume upload, and streak day.
   - View your immutable ledger history with unique transaction hashes.
3. **Daily Quests & Streaks:**
   - Complete daily challenges to maintain practice streaks and unlock career rewards.
