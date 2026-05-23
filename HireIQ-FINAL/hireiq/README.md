# 🎯 HireIQ — AI Interview Intelligence Platform

> The world's most advanced AI-powered interview coaching platform.  
> Built for the 2026 generation of developers who refuse to settle.

---

## 🏗 Architecture Overview

```
HireIQ/
├── frontend/          → React 18 + Vite + TailwindCSS
├── backend/           → Spring Boot 3.x + Spring Security + JWT
├── database/          → MySQL (schema + migrations)
├── ai-engine/         → Gemini Pro + custom evaluation pipeline
└── docs/              → API specs, deployment guide
```

## ⚡ Tech Stack

### Frontend
- React 18 + Vite
- TailwindCSS + Framer Motion
- Zustand (state management)
- Recharts (analytics)
- Socket.io-client (real-time)
- React Query (data fetching)

### Backend
- Java 17 + Spring Boot 3.2
- Spring Security + JWT (RS256)
- Spring WebSocket (real-time feedback)
- Spring Data JPA + Hibernate
- HikariCP connection pool
- Redis (session cache + rate limiting)

### Database
- MySQL 8.0 (primary)
- Redis 7 (cache + queues)

### AI/ML Engine
- Google Gemini Pro API (question gen + evaluation)
- Custom NLP scoring pipeline
- Sentiment analysis on answers
- Skill gap detection algorithm
- Confidence score via response pattern analysis

### DevOps
- Docker + Docker Compose
- Render (backend)
- Netlify (frontend)
- Clever Cloud (MySQL)
- UptimeRobot (health monitoring)

---

## 🚀 Features

### Core
- 🤖 AI-generated questions by role, level, domain
- 🎙 Voice answer recording (Web Speech API)
- ⚡ Real-time answer evaluation with streaming feedback
- 📊 Deep analytics dashboard (score trends, weak areas)
- 🏆 Leaderboard (opt-in)
- 📝 Interview history + replay mode
- 🧠 Adaptive difficulty (gets harder as you improve)
- 💬 AI interviewer persona (multiple styles: Google, FAANG, startup)

### AI Features
- Answer quality scoring (0–100)
- Keyword coverage analysis
- Confidence level detection
- Follow-up question generation
- Personalized improvement roadmap
- Company-specific interview prep mode

### User
- JWT authentication (access + refresh tokens)
- Role-based access (FREE / PRO / ENTERPRISE)
- Interview scheduling
- Resume upload → auto role detection
- Shareable interview report cards

---

## 🛠 Setup & Run

### Prerequisites
- Java 17+
- Node 18+
- MySQL 8+
- Redis 7+
- Gemini API Key

### Backend
```bash
cd backend
cp src/main/resources/application.example.yml src/main/resources/application.yml
# Edit application.yml with your DB + API credentials
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
cp .env.example .env
# Edit .env with your backend URL
npm install
npm run dev
```

### Docker (Full Stack)
```bash
docker-compose up --build
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login + get JWT |
| POST | /api/auth/refresh | Refresh token |
| GET | /api/interviews | Get user interviews |
| POST | /api/interviews/start | Start new interview |
| POST | /api/interviews/{id}/answer | Submit answer |
| GET | /api/interviews/{id}/report | Get full report |
| GET | /api/questions/generate | AI generate questions |
| GET | /api/analytics/dashboard | User analytics |
| GET | /api/leaderboard | Global leaderboard |
| WS | /ws/interview | WebSocket for real-time |

---

## 🎨 Design Language

- **Theme**: Dark glassmorphism + electric cyan accents
- **Font**: Space Grotesk (display) + JetBrains Mono (code)
- **Motion**: Framer Motion spring physics
- **Grid**: 12-col responsive

---

## 🧑‍💻 Built By

Kunal — MIT Ujjain, 2026 Batch  
Full Stack Java Developer  
Portfolio: [inspirefund.netlify.app](https://inspirefund.netlify.app)

---

*HireIQ is not just a project. It's a statement.*
