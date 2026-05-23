# HireIQ — Complete Deployment Guide
## From zero to live URL, step by step

---

## WHAT WE ARE DEPLOYING

| Layer     | Service          | URL (after deploy)                        |
|-----------|------------------|-------------------------------------------|
| Frontend  | Netlify          | https://hireiq.netlify.app                |
| Backend   | Render           | https://hireiq-api.onrender.com           |
| Database  | Clever Cloud     | MySQL (auto URL provided)                 |
| Cache     | Upstash Redis    | Redis (auto URL provided)                 |
| AI        | Google Gemini    | API key from Google AI Studio             |

All free tier. Zero cost to start.

---

## STEP 1 — Get your Gemini API Key (5 minutes)

1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Select "Create API key in new project"
4. Copy the key — looks like: `AIzaSy...`
5. Save it somewhere safe — you need it in Step 4

---

## STEP 2 — Set up MySQL on Clever Cloud (10 minutes)

1. Go to: https://www.clever-cloud.com
2. Sign up with GitHub
3. Click "Create" → "An add-on" → "MySQL"
4. Choose: "DEV" plan (free)
5. Region: Paris (closest to Render)
6. Name: `hireiq-db`
7. Click "Create"

After creation, go to the add-on dashboard and copy:
- HOST (looks like: `bxxxxxxx-mysql.services.clever-cloud.com`)
- PORT (usually `3306`)
- DB_NAME
- USERNAME
- PASSWORD

8. Now run the schema. Click "phpMyAdmin" in Clever Cloud dashboard
9. Click your database → SQL tab → paste the entire contents of `database/schema.sql`
10. Click "Go" — tables will be created

---

## STEP 3 — Set up Redis on Upstash (5 minutes)

1. Go to: https://upstash.com
2. Sign up free
3. Click "Create Database"
4. Name: `hireiq-cache`
5. Region: `eu-west-1` (closest to Clever Cloud)
6. Click "Create"

Copy from the dashboard:
- REDIS_URL (looks like: `redis://default:xxxxx@eu1-xxx.upstash.io:xxxxx`)

Or separately:
- REDIS_HOST
- REDIS_PORT
- REDIS_PASSWORD

---

## STEP 4 — Deploy Backend to Render (15 minutes)

### 4a — Push code to GitHub first

```bash
# On your computer, inside the hireiq/ folder:
git init
git add .
git commit -m "Initial HireIQ commit"

# Create repo on github.com then:
git remote add origin https://github.com/YOUR_USERNAME/hireiq.git
git push -u origin main
```

### 4b — Create Render Web Service

1. Go to: https://render.com
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repo: `hireiq`
5. Fill in:

| Field              | Value                                      |
|--------------------|--------------------------------------------|
| Name               | `hireiq-api`                               |
| Root Directory     | `backend`                                  |
| Environment        | `Docker`                                   |
| Dockerfile Path    | `./Dockerfile`                             |
| Branch             | `main`                                     |
| Instance Type      | Free                                       |

6. Click "Add Environment Variables" and add ALL of these:

```
DB_HOST          = [your Clever Cloud host]
DB_PORT          = 3306
DB_NAME          = [your Clever Cloud db name]
DB_USER          = [your Clever Cloud username]
DB_PASSWORD      = [your Clever Cloud password]
REDIS_HOST       = [your Upstash host]
REDIS_PORT       = [your Upstash port]
REDIS_PASSWORD   = [your Upstash password]
JWT_SECRET       = HireIQ-2026-MySecretKey-ChangeThis-MakeItLong-AtLeast32Chars
GEMINI_API_KEY   = [your Gemini API key from Step 1]
CORS_ORIGINS     = https://hireiq.netlify.app,http://localhost:5173
```

7. Click "Create Web Service"
8. Wait 5-8 minutes for first build
9. Copy your Render URL: `https://hireiq-api.onrender.com`

### 4c — Add UptimeRobot ping (prevents Render free tier sleep)

1. Go to: https://uptimerobot.com — sign up free
2. Click "Add New Monitor"
3. Type: HTTP(s)
4. URL: `https://hireiq-api.onrender.com/api/actuator/health`
5. Interval: Every 5 minutes
6. Click Save

---

## STEP 5 — Deploy Frontend to Netlify (10 minutes)

### 5a — Add environment file

Create `frontend/.env.production`:
```
VITE_API_URL=https://hireiq-api.onrender.com/api
VITE_WS_URL=wss://hireiq-api.onrender.com/ws
```

Commit and push:
```bash
git add .
git commit -m "Add production env"
git push
```

### 5b — Deploy on Netlify

1. Go to: https://netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Connect GitHub → select `hireiq` repo
5. Fill in:

| Field              | Value                    |
|--------------------|--------------------------|
| Base directory     | `frontend`               |
| Build command      | `npm run build`          |
| Publish directory  | `frontend/dist`          |

6. Click "Add environment variables":
```
VITE_API_URL   = https://hireiq-api.onrender.com/api
VITE_WS_URL    = wss://hireiq-api.onrender.com/ws
```

7. Click "Deploy site"
8. Wait 2-3 minutes
9. Click "Domain settings" → rename to `hireiq` (or custom domain)

### 5c — Fix React Router (SPA routing)

Create `frontend/public/_redirects`:
```
/*    /index.html   200
```

Commit and push — Netlify will redeploy automatically.

---

## STEP 6 — Verify Everything Works

### Test backend health:
Open browser: `https://hireiq-api.onrender.com/api/actuator/health`
Should see: `{"status":"UP"}`

### Test API docs:
Open browser: `https://hireiq-api.onrender.com/api/swagger-ui.html`
You'll see all your endpoints documented.

### Test full flow:
1. Open `https://hireiq.netlify.app`
2. Click "Get started"
3. Register with email/password
4. Go to Setup → pick a role → Generate
5. Answer questions → get AI feedback
6. See Results page

---

## STEP 7 — Local Development Setup

If you want to run it locally before deploying:

### Prerequisites
```
Java 17+      → https://adoptium.net
Node 18+      → https://nodejs.org
MySQL 8+      → https://dev.mysql.com/downloads
Maven 3.9+    → https://maven.apache.org (or use ./mvnw)
```

### Backend locally
```bash
cd backend

# Copy and fill in your values
cp src/main/resources/application.yml src/main/resources/application-local.yml

# Create the DB
mysql -u root -p -e "CREATE DATABASE hireiq_db;"
mysql -u root -p hireiq_db < ../database/schema.sql
mysql -u root -p hireiq_db < ../database/seed.sql

# Set env vars then run
export GEMINI_API_KEY=your_key_here
export DB_PASSWORD=your_mysql_password
export JWT_SECRET=local-dev-secret-key-at-least-32-chars

./mvnw spring-boot:run
# Backend runs at http://localhost:8080
```

### Frontend locally
```bash
cd frontend

# Create local env
echo "VITE_API_URL=http://localhost:8080/api" > .env.local
echo "VITE_WS_URL=ws://localhost:8080/ws" >> .env.local

npm install
npm run dev
# Frontend runs at http://localhost:5173
```

---

## STEP 8 — After Deployment Checklist

- [ ] Backend health check returns `{"status":"UP"}`
- [ ] Can register a new user
- [ ] Can login and get JWT
- [ ] Interview generation works (Gemini API responding)
- [ ] Answer evaluation works
- [ ] Results page loads
- [ ] Dashboard shows stats
- [ ] UptimeRobot is pinging every 5 min

---

## TROUBLESHOOTING

### "CORS error" in browser
→ Check CORS_ORIGINS env var on Render includes your exact Netlify URL
→ No trailing slash: ✅ `https://hireiq.netlify.app` ❌ `https://hireiq.netlify.app/`

### "502 Bad Gateway" on Render
→ Backend is sleeping (free tier). UptimeRobot should prevent this.
→ Wait 30 seconds for cold start, then retry.

### "Gemini API error"
→ Check GEMINI_API_KEY is set correctly in Render env vars
→ Test key at: https://aistudio.google.com/app/apikey

### "Database connection refused"
→ Double check DB_HOST, DB_PORT, DB_USER, DB_PASSWORD on Render
→ Clever Cloud: ensure the DB add-on is running (green dot)

### Frontend shows blank page
→ Check browser console for errors
→ Ensure `frontend/public/_redirects` file exists
→ Redeploy on Netlify

### JWT errors
→ JWT_SECRET must be the SAME value on every deploy
→ Min 32 characters long

---

## ARCHITECTURE DIAGRAM

```
User Browser
     │
     ▼
┌─────────────┐     HTTPS      ┌──────────────────────┐
│   Netlify   │ ─────────────► │  Render (Spring Boot) │
│  (React 18) │                │     :8080/api         │
└─────────────┘                └──────────┬───────────┘
                                          │
                          ┌───────────────┼───────────────┐
                          ▼               ▼               ▼
                  ┌──────────────┐ ┌──────────┐ ┌─────────────────┐
                  │ Clever Cloud │ │ Upstash  │ │  Google Gemini  │
                  │   MySQL 8    │ │  Redis   │ │    Pro API      │
                  └──────────────┘ └──────────┘ └─────────────────┘
```

---

## TOTAL COST: ₹0/month on free tiers

| Service      | Free Tier Limits                              |
|--------------|-----------------------------------------------|
| Netlify      | 100GB bandwidth, 300 build minutes/month      |
| Render       | 512MB RAM, sleeps after 15min inactivity      |
| Clever Cloud | 5MB MySQL storage (enough for ~10K interviews)|
| Upstash      | 10K commands/day                              |
| UptimeRobot  | 50 monitors, 5min interval                    |
| Gemini API   | 60 requests/minute free                       |

When you're ready to show interviewers — upgrade Render to $7/month for always-on.

---

Built by Kunal — MIT Ujjain, 2026 Batch
