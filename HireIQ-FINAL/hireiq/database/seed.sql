USE hireiq_db;
INSERT INTO users (email, password_hash, full_name, username, is_verified, plan, target_role, experience_level) VALUES
('demo@hireiq.ai', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCjAfOzX8H3U9N2YRsH8RrS', 'Demo User', 'demo', TRUE, 'FREE', 'Java Backend Developer', 'FRESHER');

INSERT INTO user_stats (user_id, total_interviews, total_questions, avg_score, best_score) VALUES (1, 0, 0, 0, 0);
