# CourseAdvisor

> **Intelligent Academic Planning Engine**  
> Document ID: `ARCH-2026-v2.1` | Classification: Confidential / Official

CourseAdvisor is an intelligent academic planning application designed to calculate optimal, personalized semester class schedules. Unlike traditional static degree-audit tools, CourseAdvisor uses a dual-engine architecture:
1. **Backward Chaining Inference Engine** operating over a **Directed Acyclic Graph (DAG)** of prerequisite trees.
2. **Mamdani Fuzzy Inference System (Workload Scoring)** translating student confidence ratings into safe credit bounds and stress indices.

---

## 🌟 Key Features

- **Backward Chaining Prerequisite Solver**: Select a career specialization (e.g., *AI & Machine Learning Engineer*, *Full-Stack Systems Architect*, *Cybersecurity Specialist*, or *Big Data Architect*) or any capstone course ($V_{target}$), and the engine traverses backwards to automatically identify all required dependencies.
- **Transcript Integration**: Enter passed courses; the engine satisfies prerequisites and automatically skips them from future terms.
- **Topological Tier Assignment & Kahn's Algorithm**: Arranges prerequisite courses into sequential levels (Tier 0 to Tier $N$).
- **Mamdani Fuzzy Workload & Stress Engine**:
  - Inputs: Student Confidence ($C \in [1, 10]$) across Math, Coding, Systems, and Theory, plus Subject Difficulty ($D \in [1, 10]$).
  - Evaluates triangular and trapezoidal membership distributions across 9 fuzzy rules.
  - Applies Centroid Defuzzification to compute crisp Max Recommended Credit Bounds (12–18 hrs) and Semester Stress Index (0–100%).
- **Interactive Prerequisite DAG Visualizer**: Pan, zoom, and inspect course nodes. Clicking any course highlights upstream prerequisites and downstream dependent courses.
- **Semester Stress Meter**: Real-time radial arc gauge with color-coded safety indicators (Green: Balanced, Amber: Challenging, Red: Overload Risk).
- **Transparent Reasoning Cards**: Explains why each course was placed in a specific semester and which downstream courses it unlocks.
- **Edge Case Protection**:
  - **Loop / Circular Dependency Interception**: Detects cycles ($A \leftrightarrow B$) with cycle path tracing to prevent recursion failure.
  - **Unsatisfiable Goal / Critical Path Check**: Automatically alerts students if their desired graduation timeline is shorter than the physical Critical Path Length.
- **Offline-First Persistence**: Persists student settings, confidence sliders, and transcripts locally via `localStorage`.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📐 System Pipeline Architecture

```mermaid
graph TD
    A[Choose Your Goal] --> B[Add Passed Classes]
    B --> C{Is there a loop?}
    C -- Yes --> D[Stop and Warn: Circular Dependency]
    C -- No --> E[Work Backward: Prereq Stack Traversal]
    E --> F[Put Classes in Levels: Topological Tiers]
    F --> G[Check Stress: Mamdani FIS]
    G --> H{Enough Semesters?}
    H -- No --> I[Add Semesters: Critical Path Resolution]
    H -- Yes --> J[Build the Schedule: Credit-Constrained Solver]
    J --> K[Show Your Plan: Interactive Map & Meters]
    K --> L[You Change It: Sliders or Manual Shifts]
    L --> C
```

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Vanilla Modern CSS Design System (Cyber Academic Dark Mode, Glassmorphism, CSS Custom Properties)
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti, SVG Gauges, CSS Cubic-Bezier Transitions
