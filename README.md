# HireIQ — AI Mock Interview Platform

> Practice smarter. Land faster.

HireIQ is a full-stack AI-powered mock interview platform built for freshers and developers who want to prepare seriously. You pick a role, the AI generates real interview questions, you answer them, and get instant detailed feedback — score, keywords, confidence, sentiment, model answer, and a study plan. No recycled question banks. No fluff.

---

## Live Demo

| | URL |
|---|---|
| Frontend | https://hireiq-interview.netlify.app |
| Backend API | https://hireiq-hu7b.onrender.com |
| GitHub | https://github.com/Ku502/hireiq |

---

## What It Does

You open the app, pick a role like "Java Backend Developer" or "Full Stack Developer", choose your difficulty and interview type, and start. The AI generates fresh questions every time based on your role. You type your answer, hit evaluate, and within seconds you get:

- A score out of 100
- A grade (Excellent / Good / Average / Poor)
- Specific feedback on what you said and what you missed
- Keywords you hit and keywords you missed
- A model answer showing how an expert would respond
- A follow-up question to go deeper
- Confidence and sentiment analysis

At the end of the session you get a full performance report with a 2-week improvement plan, readiness level, weak areas, and recommended topics to study.

---

## Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS
- Framer Motion
- React Router

**Backend**
- Java 17 + Spring Boot 3.2
- Spring Security + JWT Authentication
- Spring Data JPA + Hibernate
- WebSocket (STOMP)
- Docker

**Database & Caching**
- MySQL 8 (Clever Cloud)
- Redis (Upstash) — question caching, session management

**AI**
- Groq API — LLaMA 3.3 70B model
- Question generation, answer evaluation, final report generation

**Deployment**
- Backend — Render (Docker containerized)
- Frontend — Netlify (CI/CD from GitHub)
- Monitoring — UptimeRobot (5-minute pings)

---

## Features


**Core**
- Role-based AI question generation (Java, Full Stack, Frontend, DevOps, Data Analyst, Android)
- 5 interview types — Technical, Behavioral, HR Round, Mixed, System Design
- 3 difficulty levels — Easy, Medium, Hard
- Company style presets — Standard, FAANG, Startup, Product-based, Service-based
- 8-layer answer evaluation — score, grade, feedback, keywords, confidence, sentiment, model answer, follow-up
- Full session report with readiness level and improvement plan
- Interview history and performance tracking
- In-browser code compiler for technical rounds (Java, Python, JavaScript, C++)
- Webcam mode for simulating real interview conditions

**Auth & Security**
- JWT authentication with 7-day token expiry
- BCrypt password hashing
- Refresh token rotation
- Brute force protection (rate limiting on login)
- CORS configured for production

**Performance**
- Redis caching for repeated role+difficulty question sets
- HikariCP connection pooling
- Docker containerized backend with JVM memory optimization
- UptimeRobot keeps free-tier backend alive 24/7

## Project Structure
hireiq/
├── backend/
│   ├── src/main/java/com/hireiq/
│   │   ├── ai/              # Groq AI service
│   │   ├── config/          # Security, Redis, WebSocket config
│   │   ├── controller/      # REST API endpoints
│   │   ├── dto/             # Request/Response DTOs
│   │   ├── model/           # JPA entities
│   │   ├── repository/      # Spring Data repositories
│   │   ├── security/        # JWT, filters, auth
│   │   └── service/         # Business logic
│   ├── Dockerfile
│   └── pom.xml
└── frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Route pages
│   ├── store/           # Zustand state management
│   └── services/        # API calls
└── vite.config.js


Made By :
**Kunal Verma**
