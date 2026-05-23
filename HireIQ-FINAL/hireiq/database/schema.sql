-- ============================================
-- HireIQ Database Schema
-- MySQL 8.0+
-- ============================================

CREATE DATABASE IF NOT EXISTS hireiq_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hireiq_db;

-- ─────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────
CREATE TABLE users (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(150) NOT NULL,
    username      VARCHAR(80)  NOT NULL UNIQUE,
    avatar_url    VARCHAR(500),
    role          ENUM('FREE','PRO','ENTERPRISE','ADMIN') DEFAULT 'FREE',
    is_verified   BOOLEAN DEFAULT FALSE,
    resume_url    VARCHAR(500),
    target_role   VARCHAR(150),
    experience_level ENUM('FRESHER','JUNIOR','MID','SENIOR') DEFAULT 'FRESHER',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login    TIMESTAMP,
    is_active     BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_username (username)
);

-- ─────────────────────────────────────────
-- REFRESH TOKENS
-- ─────────────────────────────────────────
CREATE TABLE refresh_tokens (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    token       VARCHAR(512) NOT NULL UNIQUE,
    expires_at  TIMESTAMP NOT NULL,
    revoked     BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token)
);

-- ─────────────────────────────────────────
-- QUESTION BANK
-- ─────────────────────────────────────────
CREATE TABLE questions (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    content       TEXT NOT NULL,
    category      VARCHAR(100) NOT NULL,
    domain        VARCHAR(100) NOT NULL,          -- Java, Python, SQL, DSA etc
    difficulty    ENUM('EASY','MEDIUM','HARD','EXPERT') DEFAULT 'MEDIUM',
    type          ENUM('TECHNICAL','BEHAVIORAL','HR','SYSTEM_DESIGN','CODING') NOT NULL,
    ideal_answer  TEXT,
    keywords      JSON,                            -- ["OOP","polymorphism","interface"]
    follow_ups    JSON,                            -- AI-generated follow-up questions
    avg_score     DECIMAL(4,2) DEFAULT 0,
    attempt_count INT DEFAULT 0,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_domain (domain),
    INDEX idx_type (type),
    INDEX idx_difficulty (difficulty)
);

-- ─────────────────────────────────────────
-- INTERVIEWS
-- ─────────────────────────────────────────
CREATE TABLE interviews (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id           BIGINT NOT NULL,
    title             VARCHAR(255),
    target_role       VARCHAR(150) NOT NULL,
    company_style     VARCHAR(100),               -- FAANG, Startup, Product, Service
    interview_type    ENUM('TECHNICAL','BEHAVIORAL','HR','MIXED','SYSTEM_DESIGN') NOT NULL,
    difficulty        ENUM('EASY','MEDIUM','HARD','EXPERT') DEFAULT 'MEDIUM',
    status            ENUM('IN_PROGRESS','COMPLETED','ABANDONED') DEFAULT 'IN_PROGRESS',
    total_questions   INT NOT NULL,
    completed_count   INT DEFAULT 0,
    skipped_count     INT DEFAULT 0,
    overall_score     DECIMAL(5,2),
    ai_summary        TEXT,
    strengths         JSON,
    weaknesses        JSON,
    improvement_plan  TEXT,
    duration_seconds  INT,
    started_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at      TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_target_role (target_role)
);

-- ─────────────────────────────────────────
-- INTERVIEW ANSWERS
-- ─────────────────────────────────────────
CREATE TABLE interview_answers (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    interview_id        BIGINT NOT NULL,
    question_id         BIGINT,
    question_text       TEXT NOT NULL,
    answer_text         TEXT,
    answer_audio_url    VARCHAR(500),
    score               INT,                      -- 0–100
    grade               ENUM('EXCELLENT','GOOD','AVERAGE','POOR','SKIPPED'),
    ai_feedback         TEXT,
    keyword_hits        JSON,                     -- matched keywords
    keyword_misses      JSON,                     -- missed keywords
    confidence_score    INT,                      -- AI-detected answer confidence
    sentiment           ENUM('POSITIVE','NEUTRAL','NEGATIVE'),
    time_taken_seconds  INT,
    follow_up_asked     TEXT,
    follow_up_answer    TEXT,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE SET NULL,
    INDEX idx_interview_id (interview_id)
);

-- ─────────────────────────────────────────
-- USER ANALYTICS (aggregated)
-- ─────────────────────────────────────────
CREATE TABLE user_analytics (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id             BIGINT NOT NULL UNIQUE,
    total_interviews    INT DEFAULT 0,
    total_questions     INT DEFAULT 0,
    avg_score           DECIMAL(5,2) DEFAULT 0,
    best_score          DECIMAL(5,2) DEFAULT 0,
    best_domain         VARCHAR(100),
    weak_domain         VARCHAR(100),
    streak_days         INT DEFAULT 0,
    last_practice       DATE,
    total_time_minutes  INT DEFAULT 0,
    rank_position       INT,
    badges              JSON,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────
-- LEADERBOARD SNAPSHOTS (weekly)
-- ─────────────────────────────────────────
CREATE TABLE leaderboard (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    username    VARCHAR(80) NOT NULL,
    avatar_url  VARCHAR(500),
    score       DECIMAL(5,2) NOT NULL,
    rank        INT NOT NULL,
    domain      VARCHAR(100) DEFAULT 'overall',
    week_start  DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_week_domain (week_start, domain),
    INDEX idx_rank (rank)
);

-- ─────────────────────────────────────────
-- SKILL ASSESSMENTS (per user per domain)
-- ─────────────────────────────────────────
CREATE TABLE skill_scores (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    domain      VARCHAR(100) NOT NULL,
    score       INT DEFAULT 0,              -- 0–100
    level       ENUM('NOVICE','BEGINNER','INTERMEDIATE','ADVANCED','EXPERT') DEFAULT 'NOVICE',
    last_tested TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_domain (user_id, domain)
);

-- ─────────────────────────────────────────
-- SCHEDULED INTERVIEWS
-- ─────────────────────────────────────────
CREATE TABLE scheduled_interviews (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    title           VARCHAR(255) NOT NULL,
    target_role     VARCHAR(150),
    scheduled_at    TIMESTAMP NOT NULL,
    reminder_sent   BOOLEAN DEFAULT FALSE,
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────
-- SEED DATA — Starter Questions
-- ─────────────────────────────────────────
INSERT INTO questions (content, category, domain, difficulty, type, keywords) VALUES
('What is polymorphism in Java? Explain with a real-world example.', 'OOP', 'Java', 'EASY', 'TECHNICAL', '["polymorphism","overriding","overloading","runtime","compile-time"]'),
('Explain the difference between HashMap and ConcurrentHashMap.', 'Collections', 'Java', 'MEDIUM', 'TECHNICAL', '["HashMap","ConcurrentHashMap","thread-safe","synchronization","segments"]'),
('How does Spring Boot auto-configuration work internally?', 'Spring', 'Java', 'HARD', 'TECHNICAL', '["@EnableAutoConfiguration","spring.factories","@Conditional","@Bean","classpath"]'),
('Design a URL shortener like bit.ly. What is your approach?', 'System Design', 'Architecture', 'HARD', 'SYSTEM_DESIGN', '["hashing","base62","database","cache","CDN","scalability"]'),
('Tell me about a time you handled a conflict in your team.', 'Teamwork', 'Behavioral', 'MEDIUM', 'BEHAVIORAL', '["conflict resolution","communication","empathy","outcome","learning"]'),
('What is the difference between REST and GraphQL?', 'API Design', 'Web', 'MEDIUM', 'TECHNICAL', '["REST","GraphQL","over-fetching","under-fetching","schema","endpoints"]'),
('Explain JWT authentication flow in a Spring Boot application.', 'Security', 'Java', 'MEDIUM', 'TECHNICAL', '["JWT","header","payload","signature","filter","SecurityContext"]'),
('How would you optimize a slow SQL query?', 'Database', 'SQL', 'MEDIUM', 'TECHNICAL', '["index","EXPLAIN","JOIN","N+1","query plan","normalization"]'),
('What are SOLID principles? Give an example for each.', 'OOP', 'Java', 'MEDIUM', 'TECHNICAL', '["Single Responsibility","Open Closed","Liskov","Interface Segregation","Dependency Inversion"]'),
('Where do you see yourself in 5 years?', 'Career', 'HR', 'EASY', 'HR', '["growth","goals","learning","leadership","contribution"]');

COMMIT;
