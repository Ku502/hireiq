<div align="center">
<img src="https://img.shields.io/badge/HireIQ-AI%20Mock%20Interview-00e5ff?style=for-the-badge&logo=artificial-intelligence&logoColor=white" alt="HireIQ"/>
HireIQ — AI Mock Interview Platform
> Practice smarter. Land faster.
HireIQ is a full-stack AI-powered mock interview platform built for freshers and developers who want to prepare seriously. Pick a role, the AI generates real interview questions, answer them, and get instant detailed feedback — score, keywords, confidence, sentiment, model answer, and a study plan. No recycled question banks. No fluff.
![Live Demo](https://img.shields.io/badge/Live%20Demo-hireiq--interview.netlify.app-00e5ff?style=for-the-badge&logo=netlify)
![Backend API](https://img.shields.io/badge/Backend%20API-Render-46e3b7?style=for-the-badge&logo=render)
![GitHub](https://img.shields.io/badge/GitHub-Ku502%2Fhireiq-181717?style=for-the-badge&logo=github)
</div>
---
Tech Stack
<div align="center">
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=white)
![Java](https://img.shields.io/badge/Java_17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.2-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=spring-security&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL_8-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_AI-LLaMA_3.3_70B-ff6b35?style=for-the-badge)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)
![Render](https://img.shields.io/badge/Render-46e3b7?style=for-the-badge&logo=render&logoColor=white)
</div>
---
Architecture
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
│        │             │             │              │             │
│   ┌────▼─────────────▼─────────────▼──────────────▼──────┐     │
│   │                  SERVICE LAYER                         │     │
│   │  AuthService │ InterviewService │ DashboardService    │     │
│   │              │  PracticeService │                     │     │
│   └────┬─────────────────┬──────────────────┬────────────┘     │
│        │                 │                  │                   │
└────────┼─────────────────┼──────────────────┼───────────────────┘
         │                 │                  │
┌────────▼──────┐  ┌───────▼──────┐  ┌───────▼──────────────────┐
│  MySQL 8      │  │  Redis       │  │   Groq API               │
│  Clever Cloud │  │  Upstash     │  │   LLaMA 3.3 70B          │
│               │  │              │  │                          │
│  interviews   │  │  Sessions    │  │  • Question Generation   │
│  users        │  │  OTP Cache   │  │  • Answer Evaluation     │
│  user_stats   │  │  Rate Limit  │  │  • Report Generation     │
│  skill_scores │  │              │  │  • MCQ Generation        │
└───────────────┘  └──────────────┘  └──────────────────────────┘
```
---
What It Does
You open the app, pick a role like "Java Backend Developer" or "Full Stack Developer", choose your difficulty and interview type, and start. The AI generates fresh questions every time based on your role. You type your answer, hit evaluate, and within seconds you get:
Evaluation Layer	What You Get
🎯 Score	Out of 100, calibrated to difficulty
🏆 Grade	Excellent / Good / Average / Poor / Skipped
💬 Feedback	Specific comments on what you said and missed
🔑 Keywords	Keywords you hit and keywords you missed
📖 Model Answer	How an expert would have answered
❓ Follow-up	A deeper follow-up question
📊 Confidence	Confidence score based on your response
😊 Sentiment	Positive / Neutral / Negative analysis
At the end of the session you get a full performance report with:
2-week improvement plan
Readiness level (Beginner → Expert)
Weak areas identified
Recommended topics to study
Score history chart
---
Features
🤖 AI Interview Engine
Role-based question generation — Java, Full Stack, Frontend, DevOps, Data Analyst, Android, and any custom role
5 interview types — Technical, Behavioral, HR Round, Mixed, System Design
4 difficulty levels — Easy, Medium, Hard, Expert
Company style presets — Standard, FAANG, Startup, Product-based, Service-based
8-layer answer evaluation per question
Full session report with readiness level and improvement plan
💻 Practice Module
AI-Generated MCQ — Fresh role-specific questions every time (10/15/20/50 questions)
Coding Practice — 20 LeetCode-style problems with in-browser compiler
Piston API code execution (Java, Python, JavaScript, C++)
Test case validation with pass/fail results
Per-problem countdown timer
Category and difficulty filters
📹 Proctoring System
Real-time webcam feed with face detection
Look-away counter (tracks how often you look away)
Tab switch detection with warnings
Proctoring log with timestamps
Visual-only — no penalties
🔐 Auth & Security
JWT authentication with 7-day token expiry
BCrypt password hashing
Refresh token rotation
Brute force protection (rate limiting on login)
CORS configured for production
📊 Dashboard & Analytics
Total interviews, average score, best score, streak tracking
Score history chart (Recharts)
Skill breakdown by domain with level progression
Recent sessions with status
⚡ Performance
Redis caching for session management
HikariCP connection pooling
Docker containerized backend with JVM memory optimization
UptimeRobot keeps free-tier backend alive 24/7
---
Project Structure
```
hireiq/
├── backend/
│   ├── src/
│   │   ├── main/java/com/hireiq/
│   │   │   ├── ai/              # Groq AI service (question gen, evaluation, reports)
│   │   │   ├── config/          # Security, Redis, WebSocket, CORS config
│   │   │   ├── controller/      # REST API endpoints
│   │   │   ├── dto/             # Request/Response DTOs with validation
│   │   │   ├── model/           # JPA entities (User, Interview, InterviewAnswer)
│   │   │   ├── repository/      # Spring Data JPA repositories
│   │   │   ├── security/        # JWT filter, auth provider, login attempt service
│   │   │   └── service/         # Business logic layer
│   │   └── test/java/com/hireiq/
│   │       ├── ai/              # GeminiAIService tests (6 tests)
│   │       └── service/         # InterviewService, DashboardService tests (7 tests)
│   ├── Dockerfile
│   └── pom.xml
└── frontend/
    └── src/
        ├── components/
        │   ├── interview/       # ScoreRing, FeedbackPanel, QuestionDots
        │   └── ui/              # WebcamPreview, Skeletons, ErrorBoundary
        ├── data/                # LeetCode problems dataset (20 problems)
        ├── pages/               # LandingPage, Dashboard, Interview, Practice, Results, Report
        ├── services/            # Axios API client with JWT interceptor
        └── store/               # Zustand stores (auth, interview session)
```
---
API Endpoints
Method	Endpoint	Description
POST	`/api/auth/register`	Register new user
POST	`/api/auth/login`	Login and get JWT
POST	`/api/auth/refresh`	Refresh access token
POST	`/api/interviews/start`	Start interview (AI generates questions)
POST	`/api/interviews/{id}/answer`	Submit and evaluate answer
POST	`/api/interviews/{id}/complete`	Complete and generate report
GET	`/api/interviews/{id}/report`	Get interview report
GET	`/api/interviews`	List paginated interviews
GET	`/api/dashboard/stats`	Get user statistics
GET	`/api/dashboard/skills`	Get skill breakdown
GET	`/api/practice/mcq`	Generate AI MCQ questions
---
Local Setup
Prerequisites
Java 17+
Node.js 18+
MySQL 8
Redis
Docker (optional)
Backend
```bash
cd backend

# Set environment variables
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

# Run
./mvnw spring-boot:run
```
Frontend
```bash
cd frontend

# Set environment variables
echo "VITE_API_URL=http://localhost:8080/api" > .env.local

# Install and run
npm install
npm run dev
```
Docker
```bash
docker-compose up --build
```
---
Database Schema
```
users              → id, full_name, username, email, password, role
interviews         → id, user_id, title, target_role, type, difficulty, status, score
interview_answers  → id, interview_id, question, answer, score, grade, feedback
user_stats         → id, user_id, total_interviews, avg_score, best_score, streak
skill_scores       → id, user_id, skill, score, level
refresh_tokens     → id, user_id, token, expiry
```
---
Environment Variables
Variable	Description
`DB_HOST`	MySQL host
`DB_PORT`	MySQL port (3306)
`DB_NAME`	Database name
`DB_USER`	Database username
`DB_PASSWORD`	Database password
`REDIS_HOST`	Redis host
`REDIS_PORT`	Redis port (6379)
`REDIS_PASSWORD`	Redis password
`AI_GROQ_API_KEY`	Groq API key
`JWT_SECRET`	JWT secret (min 32 chars)
---
Author
<div align="center">
Kunal Verma
B.Tech Computer Science Engineering — Mahakal Institute of Technology, Ujjain (2026)
![LinkedIn](https://img.shields.io/badge/LinkedIn-kunal--verma-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-Ku502-181717?style=for-the-badge&logo=github&logoColor=white)
![Email](https://img.shields.io/badge/Email-kv692949%40gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)
</div>
---
<div align="center">
⭐ Star this repo if you found it useful!
Made with ☕ and too many Stack Overflow tabs
</div>
