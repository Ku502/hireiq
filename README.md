# HireIQ — AI Mock Interview Platform

> Practice smarter. Land faster.

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.2-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Java](https://img.shields.io/badge/Java_17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL_8-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

**Live Demo:** https://hireiq-interview.netlify.app | **Backend:** https://hireiq-hu7b.onrender.com

HireIQ is a full-stack AI-powered mock interview platform built for freshers and developers who want to prepare seriously. Pick a role, the AI generates real interview questions, answer them, and get instant detailed feedback — score, keywords, confidence, sentiment, model answer, and a study plan. No recycled question banks. No fluff.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, Zustand |
| Backend | Java 17, Spring Boot 3.2, Spring Security, JWT, WebSocket |
| Database | MySQL 8 (Clever Cloud), Redis (Upstash) |
| AI | Groq API — LLaMA 3.3 70B |
| Deployment | Render (Docker), Netlify, UptimeRobot |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│   React 18 + Vite + Tailwind CSS + Framer Motion               │
│   Zustand (State) │ React Router │ React Query                  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS / JWT
┌────────────────────────────▼────────────────────────────────────┐
│                        API GATEWAY                               │
│         Spring Boot 3.2 + Spring Security                       │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│   │   Auth   │  │Interview │  │Dashboard │  │ Practice │      │
│   │Controller│  │Controller│  │Controller│  │Controller│      │
│   └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘      │
│        └─────────────┴─────────────┴──────────────┘            │
│                      SERVICE LAYER                              │
│        AuthService │ InterviewService │ DashboardService        │
└────────┬─────────────────┬──────────────────┬───────────────────┘
         │                 │                  │
┌────────▼──────┐  ┌───────▼──────┐  ┌───────▼──────────────────┐
│  MySQL 8      │  │  Redis       │  │   Groq API               │
│  Clever Cloud │  │  Upstash     │  │   LLaMA 3.3 70B          │
│               │  │              │  │                          │
│  interviews   │  │  Sessions    │  │  • Question Generation   │
│  users        │  │  Rate Limit  │  │  • Answer Evaluation     │
│  user_stats   │  │              │  │  • Report Generation     │
└───────────────┘  └──────────────┘  └──────────────────────────┘
```

---

## What It Does

You open the app, pick a role like **"Java Backend Developer"** or **"Full Stack Developer"**, choose your difficulty and interview type, and start. The AI generates fresh questions every time. You answer, hit evaluate, and within seconds you get:

| Evaluation Layer | What You Get |
|---|---|
| 🎯 Score | Out of 100, calibrated to difficulty |
| 🏆 Grade | Excellent / Good / Average / Poor |
| 💬 Feedback | Specific comments on what you said and missed |
| 🔑 Keywords | Keywords you hit and keywords you missed |
| 📖 Model Answer | How an expert would have answered |
| ❓ Follow-up | A deeper follow-up question |
| 📊 Confidence | Confidence score based on your response |
| 😊 Sentiment | Positive / Neutral / Negative analysis |

---

## Features

### 🤖 AI Interview Engine
- Role-based question generation — Java, Full Stack, Frontend, DevOps, Data Analyst, Android, any custom role
- 5 interview types — Technical, Behavioral, HR Round, Mixed, System Design
- 4 difficulty levels — Easy, Medium, Hard, Expert
- Company style presets — Standard, FAANG, Startup, Product-based, Service-based
- 8-layer answer evaluation per question
- Full session report with readiness level and 2-week improvement plan

### 💻 Practice Module
- **AI-Generated MCQ** — Fresh role-specific questions every time (10/15/20/50 questions)
- **Coding Practice** — 20 LeetCode-style problems with in-browser compiler
  - Piston API code execution (Java, Python, JavaScript, C++)
  - Test case validation with pass/fail results
  - Per-problem countdown timer

### 📹 Proctoring System
- Real-time webcam feed with face detection
- Look-away counter and tab switch detection
- Warning toasts on violations
- Proctoring log with timestamps
- Visual-only — no penalties

### 🔐 Auth & Security
- JWT authentication with 7-day token expiry
- BCrypt password hashing
- Refresh token rotation
- Brute force protection

### 📊 Dashboard & Analytics
- Total interviews, average score, best score, streak tracking
- Score history chart
- Skill breakdown by domain
- Recent sessions with status

---

## Project Structure

```
hireiq/
├── backend/
│   ├── src/
│   │   ├── main/java/com/hireiq/
│   │   │   ├── ai/              # Groq AI service
│   │   │   ├── config/          # Security, Redis, WebSocket config
│   │   │   ├── controller/      # REST API endpoints
│   │   │   ├── dto/             # Request/Response DTOs
│   │   │   ├── model/           # JPA entities
│   │   │   ├── repository/      # Spring Data repositories
│   │   │   ├── security/        # JWT, filters, auth
│   │   │   └── service/         # Business logic
│   │   └── test/java/com/hireiq/
│   │       ├── ai/              # GeminiAIServiceTest (6 tests)
│   │       └── service/         # InterviewServiceTest, DashboardServiceTest (7 tests)
│   ├── Dockerfile
│   └── pom.xml
└── frontend/
    └── src/
        ├── components/          # Reusable UI components + WebcamPreview
        ├── data/                # LeetCode problems dataset
        ├── pages/               # All route pages
        ├── services/            # Axios API client
        └── store/               # Zustand state management
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/interviews/start` | Start interview (AI generates questions) |
| POST | `/api/interviews/{id}/answer` | Submit and evaluate answer |
| POST | `/api/interviews/{id}/complete` | Complete and generate report |
| GET | `/api/interviews/{id}/report` | Get interview report |
| GET | `/api/interviews` | List paginated interviews |
| GET | `/api/dashboard/stats` | Get user statistics |
| GET | `/api/dashboard/skills` | Get skill breakdown |
| GET | `/api/practice/mcq` | Generate AI MCQ questions |

---

## Local Setup

### Prerequisites
- Java 17+, Node.js 18+, MySQL 8, Redis, Docker (optional)

### Backend
```bash
cd HireIQ-FINAL/hireiq/backend

export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=hireiq
export DB_USER=root
export DB_PASSWORD=yourpassword
export REDIS_HOST=localhost
export REDIS_PORT=6379
export REDIS_PASSWORD=yourpassword
export AI_GROQ_API_KEY=your_groq_api_key
export JWT_SECRET=your_jwt_secret_min_32_chars

./mvnw spring-boot:run
```

### Frontend
```bash
cd HireIQ-FINAL/hireiq/frontend

echo "VITE_API_URL=http://localhost:8080/api" > .env.local

npm install
npm run dev
```

---

## Author

**Kunal Verma** — B.Tech CSE, Mahakal Institute of Technology, Ujjain (2026)

- LinkedIn: https://linkedin.com/in/kunal-verma-2617262b
- GitHub: https://github.com/Ku502
- Email: kv692949@gmail.com

---

⭐ Star this repo if you found it useful!
