# ACASTM – Adaptive Context-Aware Social Engineering Threat Mitigation Model

> **Master's Research Prototype** | Department of Computer Science | Socio-Technical Security Systems

A fully interactive, browser-based prototype demonstrating the ACASTM security model — a context-aware, behaviorally adaptive framework for mitigating social engineering threats in academic and corporate environments.

---

## Quick Start — New Machine Setup

### Prerequisites
- **Windows 10 / 11**
- **Node.js LTS** (v18 or later) — download from [nodejs.org](https://nodejs.org)
- **Git** — download from [git-scm.com](https://git-scm.com)

---

### Step 1 — Clone the Repository

Open PowerShell and run:

```powershell
git clone https://github.com/BhekumusaEric/Adaptive-Human-Centric-Socio-Technical-Security-Model-AHCSSM-.git
cd Adaptive-Human-Centric-Socio-Technical-Security-Model-AHCSSM-
```

---

### Step 2 — Run the Setup Script (First Time Only)

Double-click `setup.ps1` OR run in PowerShell:

```powershell
.\setup.ps1
```

This will automatically:
1. Verify Node.js is installed
2. Install all backend dependencies
3. Install all frontend dependencies
4. Launch the backend API server
5. Launch the frontend dev server
6. Open the application in your browser

> If PowerShell blocks the script, run this first:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```

---

### Step 3 — Daily Use (After First Setup)

Every time you want to run the app, just double-click `start.ps1` OR:

```powershell
.\start.ps1
```

The app will be available at: **http://localhost:5173**

---

## Application Overview

### Multi-Role Split-Screen Demo Layout

The prototype opens in a **three-column split-screen** designed for live supervisory demonstrations on a single PC:

| Column | Role | Purpose |
|--------|------|---------|
| **Left** | End-User (Employee) | Security standing, inbox simulator, training modules |
| **Centre** | Security Administrator | Comparative model analysis, corporate risk posture, risk trajectory charts |
| **Right** | Presenter (Simulation Control) | Inject context anomalies, trigger threat events, view telemetry stream |

---

### ACASTM Key Interactions to Demonstrate

| Action | What to do | What happens |
|--------|-----------|-------------|
| **Context Anomaly** | Check "Off-Hours" + "Unusual IP" in right column | Context risk jumps: +40 and +60 |
| **Phishing Click** | Click "Click Phishing" in right column | Cognitive risk rises, anomaly score triggers |
| **Zero-Trust Lockdown** | Risk score reaches ≥ 75 | Inbox suspends, Zero-Trust alert activates |
| **Remediation** | Click "Complete" on assigned module | Risk drops, inbox access restored |
| **Reporting** | Click "Report Phishing" on email | Reporting rate improves, risk lowers |

---

### Composite Risk Formula (ACASTM Algorithm)

```
Risk Score = (0.5 × Cognitive Risk) + (0.3 × Anomaly Score) + (0.2 × Context Risk)

Where:
  Cognitive Risk = f(cognitive_bias_score, click_rate, reporting_rate)
  Anomaly Score  = 80 if phishing_clicked AND click_rate > 0.2; else 50 if click_rate > 0.5
  Context Risk   = +40 if off_hours; +60 if unusual_location (capped at 100)

Thresholds:
  Risk ≥ 75  → HIGH tier   → account_restricted = true  (Zero-Trust Lockdown)
  Risk ≥ 40  → MEDIUM tier → mandatory refresher training assigned
  Risk < 40  → LOW tier    → workspace fully active
```

---

## Project Structure

```
ACASTM/
├── setup.ps1              ← ONE-CLICK setup for new machines
├── start.ps1              ← Daily use quick-start script
├── presentation.html      ← Supervisor slide deck (open in browser)
├── README.md
├── SYSTEM_ARCHITECTURE.md
│
├── backend_node/          ← Node.js/Express API Server
│   ├── server.js          ← ACASTM Adaptive Risk Engine
│   └── package.json
│
└── frontend/              ← React/Vite Application
    └── src/
        ├── App.jsx        ← Main shell (split-screen layout)
        ├── config.js      ← API base URL configuration
        └── components/
            ├── UserDashboard.jsx      ← Employee workspace
            ├── PhishingSimulator.jsx  ← Inbox threat sandbox
            ├── AdminDashboard.jsx     ← Governance & analytics
            └── DemoConsole.jsx        ← Presenter control panel
```

---

## Demo Personas (Pre-loaded)

| Name | Risk Tier | Click Rate | Profile |
|------|-----------|-----------|---------|
| **Alice Smith** | LOW (10.0) | 5% | Security-aware control group |
| **Bob Jones** | MEDIUM (45.0) | 40% | Average susceptibility baseline |
| **Charlie Davis** | HIGH (80.0) | 80% | High-risk, already restricted |

---

## Presentation Slides

Open `presentation.html` directly in any web browser for the 9-slide supervisor deck covering:
- Research motivation
- ACASTM six-layer architecture
- Comparative proof (Legacy vs. ACASTM)
- Live prototype demonstration guide
- Conclusions and future work

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend UI | React 18 + Vite |
| Styling | Vanilla CSS (flat dark theme) |
| Charts | Recharts |
| Backend API | Node.js + Express |
| Risk Engine | Custom ACASTM Algorithm (JavaScript) |
| Data Store | In-memory mock DB (resets per session) |
