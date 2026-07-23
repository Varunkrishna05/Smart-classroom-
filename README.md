# Cognitive Smart Classroom & Adaptive Timetable Ecosystem

A next-generation, enterprise-grade EdTech platform that combines **Edge AI Computer Vision**, **IoT Environmental Automation**, **Dynamic Graph Constraint-Satisfaction Scheduling**, **Generative AI Tutor/Summarizers**, and **Multi-Objective Spatial Optimization**.

---

## 🌟 Key Features

### 1. 🤖 AI Adaptive Timetable Engine
- Dynamically shifts schedules based on student concentration levels, subject difficulty, upcoming exams, teacher availability, and weather conditions.
- Uses a multi-constrained optimization algorithm (Genetic Algorithm + CSP).

### 2. 📹 Real-Time Emotion & Engagement Detection
- Powered by OpenCV & YOLOv8 facial recognition.
- Real-time classification of student states: *Focused*, *Confused*, *Bored*, *Sleepy*, and *Distracted*.
- Generates classroom attention heatmaps and automatically triggers rest break suggestions.

### 3. 🌐 3D Smart Classroom Spatial Monitor
- Built with **Three.js** WebGL for dynamic 3D spatial visualization.
- Interactive desk aura lighting showing real-time cognitive focus states per desk node.

### 4. 🪑 Smart AI Seat Recommender
- Multi-objective placement matrix balancing visual/auditory accessibility needs, focus zones, and peer-tutoring pairs.

### 5. ⚡ IoT Environmental Automation
- Integrated with ESP32 nodes (DHT22, MQ-135 CO₂, BH1750 Lux, PIR motion sensors).
- Closed-loop automated control for AC, LED lighting grids, and CO₂ ventilation dampers to maximize cognitive focus.

### 6. 👥 Multi-Role Enterprise Dashboards
- **Administrator**: Institutional metrics, resource utilization, 3D spatial monitor, global timetable solver.
- **Faculty**: Live CV emotion detector feed, face-recognition attendance scan, smart seating matrix, IoT controls.
- **Student**: Personalized performance index, AI lecture summaries, auto-generated flashcards/MCQs, XP gamification badges.
- **Parent**: Weekly focus trends, academic progress trackers, and AI growth recommendations.

---

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).

### Running Locally
1. Clone this repository:
   ```bash
   git clone https://github.com/Varunkrishna05/Smart-classroom-.git
   cd Smart-classroom-
   ```
2. Open `index.html` directly in your browser, or run a local HTTP server:
   ```bash
   python -m http.server 8080
   ```
3. Visit `http://localhost:8080` in your web browser.

---

## 📂 Repository Structure

```
Smart-classroom-/
├── index.html                           # Single-Page Web App & Role Dashboards
├── styles.css                           # Glassmorphic CSS Design System & Theme Engine
├── app.js                               # Three.js 3D Visualizer, Chart.js & AI Engine
├── smart_classroom_system_architecture.md # Master Technical Specification & Architecture
└── README.md                            # Project Overview & Setup Instructions
```

---

## 📜 Documentation

For full architectural blueprints, microservice specifications, database ER diagrams, REST/WebSocket API schemas, and deployment manifests, refer to [smart_classroom_system_architecture.md](./smart_classroom_system_architecture.md).

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.
