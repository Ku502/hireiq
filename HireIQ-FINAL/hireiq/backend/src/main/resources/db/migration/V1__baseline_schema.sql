-- Flyway migration V1 — HireIQ baseline schema
-- Replaces ddl-auto: update (a production red flag)

CREATE TABLE IF NOT EXISTS users (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    email            VARCHAR(255) NOT NULL UNIQUE,
    password_hash    VARCHAR(255) NOT NULL,
    full_name        VARCHAR(150) NOT NULL,
    username         VARCHAR(80)  NOT NULL UNIQUE,
    avatar_url       VARCHAR(500),
    plan             ENUM('FREE','PRO','ENTERPRISE') DEFAULT 'FREE',
    is_verified      BOOLEAN DEFAULT TRUE,
    resume_url       VARCHAR(500),
    target_role      VARCHAR(150),
    experience_level ENUM('FRESHER','JUNIOR','MID','SENIOR') DEFAULT 'FRESHER',
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login       TIMESTAMP,
    is_active        BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT NOT NULL,
    token      VARCHAR(512) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked    BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token(64))
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS interviews (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    title           VARCHAR(255),
    target_role     VARCHAR(150) NOT NULL,
    company_style   VARCHAR(100),
    interview_type  ENUM('TECHNICAL','BEHAVIORAL','HR','MIXED','SYSTEM_DESIGN') NOT NULL,
    difficulty      ENUM('EASY','MEDIUM','HARD','EXPERT') DEFAULT 'MEDIUM',
    status          ENUM('IN_PROGRESS','COMPLETED','ABANDONED') DEFAULT 'IN_PROGRESS',
    total_questions INT NOT NULL,
    completed_count INT DEFAULT 0,
    skipped_count   INT DEFAULT 0,
    overall_score   DECIMAL(5,2),
    ai_summary      TEXT,
    strengths       JSON,
    weaknesses      JSON,
    improvement_plan TEXT,
    readiness_level ENUM('NOT_READY','DEVELOPING','ALMOST_READY','INTERVIEW_READY'),
    duration_secs   INT,
    started_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at    TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_status (user_id, status),
    INDEX idx_started_at (started_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS interview_answers (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    interview_id      BIGINT NOT NULL,
    question_text     TEXT NOT NULL,
    question_category VARCHAR(100),
    question_type     VARCHAR(50),
    answer_text       TEXT,
    score             INT,
    grade             ENUM('EXCELLENT','GOOD','AVERAGE','POOR','SKIPPED'),
    ai_feedback       TEXT,
    strength_note     VARCHAR(255),
    improvement_note  VARCHAR(255),
    keyword_hits      JSON,
    keyword_misses    JSON,
    confidence_score  INT,
    sentiment         ENUM('POSITIVE','NEUTRAL','NEGATIVE'),
    model_answer      TEXT,
    follow_up_q       TEXT,
    follow_up_ans     TEXT,
    time_taken_secs   INT,
    position          INT,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE,
    INDEX idx_interview_pos (interview_id, position)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_stats (
    id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id            BIGINT NOT NULL UNIQUE,
    total_interviews   INT DEFAULT 0,
    total_questions    INT DEFAULT 0,
    avg_score          DECIMAL(5,2) DEFAULT 0.00,
    best_score         DECIMAL(5,2) DEFAULT 0.00,
    streak_days        INT DEFAULT 0,
    last_practice_date DATE,
    total_time_mins    INT DEFAULT 0,
    badges             JSON,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS skill_scores (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    domain      VARCHAR(100) NOT NULL,
    score       INT DEFAULT 0,
    level       ENUM('NOVICE','BEGINNER','INTERMEDIATE','ADVANCED','EXPERT') DEFAULT 'NOVICE',
    last_tested TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_domain (user_id, domain)
) ENGINE=InnoDB;
