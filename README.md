# EcoSphere 🌐 | Carbon Footprint Tracker & Quest Engine

EcoSphere is an enterprise-grade, highly secure, accessible, and gamified Carbon Footprint Quest Engine. It turns the complex, abstract challenge of personal carbon footprints into a motivating, structured, and action-oriented daily routine.

---

## 📌 Problem Statement
Many individuals want to combat climate change but face significant hurdles in taking action:
1.  **Carbon Confusion**: Greenhouse gas metrics (metric tons of CO2e) are highly abstract. Most people do not know how many tons of CO2 they emit or how daily choices relate to global benchmarks.
2.  **The "Audit" Fatigue**: Traditional carbon calculators act like tax audits—they demand complex utility bills, guilt-trip users with scores, and offer zero actionable continuation.
3.  **Lack of Inclusion & Accessibility**: Most environmental tools fail to support screen-readers, lack high-contrast modes, and exclude visually or physically impaired users.
4.  **Operational Vulnerabilities & Inefficiency**: Many calculators are bloated with tracking dependencies or vulnerable to automated spam inputs.

---

## 💡 The EcoSphere Solution
EcoSphere addresses these problems through a unified, secure, and highly accessible web application:

### 1. Interactive Multi-Step Calculator
EcoSphere calculates annual footprints across four vectors: **Transportation**, **Home Energy**, **Dietary Profiles**, and **Shopping Spending**. It provides immediate, clear visual outputs without requiring database registration.

### 2. The Gamified Quest Engine
Instead of passive tracking, EcoSphere recommends a **Daily Quest** targeted at the user's highest emission category (e.g., transit quests if transit footprint is highest). Completing challenges rewards users with points and builds sustainable habits.

### 3. Real-Time Action Simulator & Projections (2026 - 2030)
Users can toggle green habits (e.g., switching to LEDs, car-free days, cold-water washing) to see their future footprint trajectory drop in real-time on our custom forecasting line charts.

### 4. Audio Narrator & Accessibility Control Console
EcoSphere is fully WCAG 2.1 compliant. A built-in text-to-speech engine summarizes carbon levels and action tips out loud. Visual theme adjustments include high-contrast and text size scales.

### 5. Production-Ready Security Stack
Features helmet protection headers, strict `zod` input payload sanitization, Express rate-limiting, and centralized secure error handling.

---

## 🚀 Live Demo
The application is hosted on Google Cloud Run:
**[Launch EcoSphere](https://ecosphere-240382199210.europe-west1.run.app)**

---

## 📦 Technical Architecture & Stack
*   **Backend API**: Node.js, Express, TypeScript, Zod, Helmet
*   **Frontend UI**: React, TypeScript, HSL CSS variables, Custom SVG rendering engines
*   **Deployment**: Multi-stage `Dockerfile` (optimized Alpine build) running on Google Cloud Run
*   **Testing**: Vitest for math algorithms

---

## 🛠️ Local Development

### Prerequisites
*   Node.js (v18+)
*   npm (v9+)

### Installation
1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server (hot-reloading + backend proxy):
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
5. Start the production server:
   ```bash
   npm start
   ```

### Running Tests
Verify calculation math:
```bash
npm run test
```

---

## 📄 License & Safety Notice
This repository is licensed under a proprietary "All Rights Reserved" model to protect its unique design patterns. Unauthorized copying or hosting of this application is prohibited.
