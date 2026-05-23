package com.hireiq.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Simple in-memory rate limiter for AI endpoints.
 * 30 requests per minute per IP. No external dependency needed.
 * Production: replace with Redis-backed rate limiting.
 */
@Component
public class RateLimitFilter implements Filter {

    private static final int MAX_REQUESTS = 30;
    private static final int WINDOW_MINUTES = 1;

    private record Window(AtomicInteger count, LocalDateTime start) {}
    private final Map<String, Window> windows = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest  request  = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;
        String uri = request.getRequestURI();

        if (uri.contains("/interviews/") &&
            (uri.contains("/answer") || uri.contains("/complete") || uri.contains("/start"))) {

            String ip = getClientIp(request);

            if (isRateLimited(ip)) {
                response.setStatus(429);
                response.setContentType("application/json");
                response.getWriter().write(
                    "{\"message\":\"Too many requests. Please wait a minute.\",\"retryAfter\":60}");
                return;
            }
        }

        chain.doFilter(req, res);
    }

    private boolean isRateLimited(String ip) {
        LocalDateTime now = LocalDateTime.now();
        Window window = windows.computeIfAbsent(ip,
            k -> new Window(new AtomicInteger(0), now));

        // Reset window if expired
        if (window.start().plusMinutes(WINDOW_MINUTES).isBefore(now)) {
            windows.put(ip, new Window(new AtomicInteger(1), now));
            return false;
        }

        return window.count().incrementAndGet() > MAX_REQUESTS;
    }

    private String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
