# Deliverable 10: Demo Video Script, Screenplay & Walkthrough Guide
## Project Name: CareerCoachAI — Intelligent Career Readiness Platform
**Video Duration:** 3 Minutes 30 Seconds (Standard Hackathon Pitch Video Format)  
**Tone:** Confident, energetic, technical yet accessible  
**Key Goal:** Showcase live multimodal AI in action (Resume, Speech, Vision, Interview, Dashboard)  

---

## 1. Video Production Quick Reference

- **Resolution:** 1080p (1920x1080) at 60 FPS
- **Recording Tools:** OBS Studio, Loom, or QuickTime Screen Recorder
- **Audio:** High-quality external USB condenser microphone with noise suppression
- **Browser:** Google Chrome at 100% zoom with clean bookmarks bar
- **URL Tested:** `http://localhost:5173` with backend running on `http://localhost:8787`

---

## 2. Scene-by-Scene Screenplay & Storyboard

### Scene 1: The Hook & Problem (0:00 – 0:35)
- **Visual on Screen:**
  - Fast cuts of generic job rejection emails ("Unfortunately, we have decided to pursue other candidates...").
  - Switch to CareerCoachAI Hero Landing Page (`/`) with smooth scrolling highlighting the headline: *"Bridging the Employability Gap with Real-Time Multimodal AI"*.
- **Speaker Narration:**
  > *"Every single year, millions of bright, qualified students and job seekers submit hundreds of resumes, only to be rejected by automated ATS filters. And when they finally get an interview, anxiety, nervous pacing, and unstructured answers cost them their dream job. Professional career coaches charge $250 an hour. Today, we are changing that forever. Welcome to CareerCoachAI: the multimodal AI copilot that brings private, executive career acceleration to everyone."*

---

### Scene 2: Evidence-Grounded Resume ATS Audit (0:35 – 1:15)
- **Visual on Screen:**
  - Navigate to `/resume`.
  - Drag-and-drop a sample PDF resume into the dropzone.
  - Show the fast processing spinner and the instant reveal of the ATS Diagnostic Report.
  - Hover over the **ATS Score gauge (e.g. 84/100)**, the **Extracted Skills**, and the **Presentation Defects vs. Competency Gaps** cards.
- **Speaker Narration:**
  > *"Let's start with the resume. Unlike typical tools that hallucinate skills or run basic regex, CareerCoachAI performs strict, evidence-grounded parsing. It validates the PDF's magic bytes, extracts the actual text, and uses Google Gemini to audit the document. Notice how it cleanly separates cosmetic presentation flaws—like passive verbs—from actual technical competency gaps. In seconds, the candidate knows exactly what to fix before clicking apply."*

---

### Scene 3: Acoustic Speech & Communication Coach (1:15 – 1:55)
- **Visual on Screen:**
  - Navigate to `/communication`.
  - Click "Start Recording" on the microphone widget.
  - The narrator speaks a 10-second sample answer: *"Um, I think my greatest strength is, like, problem solving because, you know, I always debug systematically."*
  - Click "Analyze Speech".
  - Show the real-time waveform, words-per-minute (WPM) gauge, and the immediate detection of the 3 filler words (`um`, `like`, `you know`).
- **Speaker Narration:**
  > *"Now, let's sharpen communication. In our Speech Coach, the candidate speaks naturally into their microphone. Our backend streams the audio to Gemini for transcription, and our acoustic algorithms measure words-per-minute pacing and count filler words. Here, it immediately flagged my 'um', 'like', and 'you know', calculating my speaking cadence and giving me concrete tips to sound more articulate and authoritative."*

---

### Scene 4: AI Mock Interview Simulation with Vision (1:55 – 2:45)
- **Visual on Screen:**
  - Navigate to `/interview`.
  - Select "Software Engineer" and "Entry Level", then click "Generate Interview".
  - The webcam activates, showing the candidate video feed with the **MediaPipe Heads-Up Display (HUD)** overlays:
    - `Face Centered: 96%`
    - `Eye Openness: Optimal`
  - Show question 1: *"Describe a challenging bug you diagnosed and how you resolved it."*
  - The narrator delivers an answer following the STAR method.
  - Click "Submit Answer" and reveal the instant AI evaluation:
    - **Composite Score:** `88/100` (Relevance: 90, Clarity: 85, Correctness: 90)
    - **STAR Checkmarks:** Situation ✓, Task ✓, Action ✓, Result ✓
    - Actionable recommendations quoting phrases from the candidate's answer.
- **Speaker Narration:**
  > *"Now, for our crown jewel: the AI Mock Interview Room. Notice that my webcam is active, and right here on screen, Google MediaPipe is tracking my facial centering and eye engagement. And here is the crucial engineering decision: all video inference runs 100% inside the browser on WebAssembly and GPU. Zero video frames are ever uploaded, ensuring total privacy. Once I submit my answer, our AI audits my response against the gold-standard STAR framework, verifying that I described the Situation, Task, Action, and quantified the Result."*

---

### Scene 5: Gamified Economy, Wallet & Dashboard (2:45 – 3:15)
- **Visual on Screen:**
  - Navigate to `/wallet` and `/rewards`.
  - Show the Career Coins balance increasing, the transaction ledger with unique idempotency hashes, and the unlocked achievement badges.
  - Navigate to `/dashboard` to showcase the **Career Readiness Radar** visualizing Resume, Speech, Technical, and Interview metrics.
- **Speaker Narration:**
  > *"Job hunting can be exhausting, so we turned preparation into a motivating daily habit. Every practice session awards Career Coins and builds streaks. Our idempotent ledger ensures zero double-counting, and our holistic Career Readiness Index gives candidates clear, objective proof that they are truly ready to ace their interviews."*

---

### Scene 6: Architecture, Tech Stack & Closing Pitch (3:15 – 3:30)
- **Visual on Screen:**
  - Cut to the high-level Architecture Diagram (Mermaid diagram from `docs/4_ARCHITECTURE_DIAGRAMS.md`).
  - Display team contact info, GitHub repo link, and closing banner: *"CareerCoachAI — Empowering Every Candidate."*
- **Speaker Narration:**
  > *"Built with React, Vite, Node.js Express, Google Gemini, MediaPipe, and MongoDB Atlas, CareerCoachAI is ready to deploy for universities, bootcamps, and millions of job seekers. Thank you, judges, and we look forward to your questions!"*

---

## 3. Demo Video Checklist for Presenter

- [ ] Ensure `.env` contains a valid `GEMINI_API_KEY`.
- [ ] Confirm both `npm run api` and `npm run dev` are running without errors.
- [ ] Have a sample PDF resume ready on your desktop (e.g. `Sample_Software_Engineer_Resume.pdf`).
- [ ] Test webcam and microphone permissions in Chrome before starting the recording.
- [ ] Clear browser cache/localStorage if you want to start with a fresh demo account.
- [ ] Keep speech answers between 10–25 seconds during the video for fast, dynamic pacing.
