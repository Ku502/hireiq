package com.hireiq.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    private static final Logger log = LoggerFactory.getLogger(LoginAttemptService.class);
    private static final int MAX_ATTEMPTS  = 5;
    private static final int BLOCK_MINUTES = 15;

    private record AttemptRecord(int count, LocalDateTime firstAttempt) {}

    private final Map<String, AttemptRecord> attempts = new ConcurrentHashMap<>();

    public void loginSucceeded(String key) {
        attempts.remove(key);
    }

    public void loginFailed(String key) {
        attempts.compute(key, (k, rec) -> {
            if (rec == null || isExpired(rec)) {
                return new AttemptRecord(1, LocalDateTime.now());
            }
            return new AttemptRecord(rec.count() + 1, rec.firstAttempt());
        });
        log.warn("Failed login attempt for key: {} (count: {})", key, attempts.get(key).count());
    }

    public boolean isBlocked(String key) {
        AttemptRecord rec = attempts.get(key);
        if (rec == null) return false;
        if (isExpired(rec)) { attempts.remove(key); return false; }
        return rec.count() >= MAX_ATTEMPTS;
    }

    public int remainingMinutes(String key) {
        AttemptRecord rec = attempts.get(key);
        if (rec == null) return 0;
        long elapsed = java.time.Duration.between(rec.firstAttempt(), LocalDateTime.now()).toMinutes();
        return (int) Math.max(0, BLOCK_MINUTES - elapsed);
    }

    private boolean isExpired(AttemptRecord rec) {
        return rec.firstAttempt().plusMinutes(BLOCK_MINUTES).isBefore(LocalDateTime.now());
    }
}
