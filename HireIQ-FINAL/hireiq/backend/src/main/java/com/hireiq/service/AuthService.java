package com.hireiq.service;

import com.hireiq.dto.request.LoginRequest;
import com.hireiq.dto.request.RegisterRequest;
import com.hireiq.dto.response.AuthResponse;
import com.hireiq.dto.response.UserResponse;
import com.hireiq.exception.ConflictException;
import com.hireiq.exception.UnauthorizedException;
import com.hireiq.model.RefreshToken;
import com.hireiq.model.User;
import com.hireiq.model.UserStats;
import com.hireiq.repository.RefreshTokenRepository;
import com.hireiq.repository.UserRepository;
import com.hireiq.repository.UserStatsRepository;
import com.hireiq.security.LoginAttemptService;
import com.hireiq.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthService {

    private final UserRepository          userRepo;
    private final RefreshTokenRepository  tokenRepo;
    private final UserStatsRepository     statsRepo;
    private final JwtService              jwtService;
    private final PasswordEncoder         passwordEncoder;
    private final AuthenticationManager   authManager;
    private final LoginAttemptService     loginAttemptService;

    @Value("${jwt.refresh-token-expiry:604800000}")
    private long refreshExpiry;

    public AuthResponse register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail()))
            throw new ConflictException("Email already registered");
        if (userRepo.existsByUsername(req.getUsername()))
            throw new ConflictException("Username already taken");

        User user = User.builder()
            .email(req.getEmail())
            .passwordHash(passwordEncoder.encode(req.getPassword()))
            .fullName(req.getFullName())
            .username(req.getUsername())
            .targetRole(req.getTargetRole())
            .isVerified(true)
            .build();
        user = userRepo.save(user);
        statsRepo.save(UserStats.builder().user(user).build());
        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest req) {
        // FIX 6: brute force check
        String ip = req.getEmail(); // use email as key (IP available in filter)
        if (loginAttemptService.isBlocked(ip)) {
            int remaining = loginAttemptService.remainingMinutes(ip);
            throw new UnauthorizedException(
                "Too many failed attempts. Try again in " + remaining + " minutes.");
        }

        try {
            authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        } catch (BadCredentialsException e) {
            loginAttemptService.loginFailed(ip);
            throw new UnauthorizedException("Invalid email or password");
        }

        loginAttemptService.loginSucceeded(ip);
        User user = userRepo.findByEmail(req.getEmail())
            .orElseThrow(() -> new UnauthorizedException("User not found"));
        user.setLastLogin(LocalDateTime.now());
        userRepo.save(user);
        return buildAuthResponse(user);
    }

    // FIX 7: Refresh token rotation - old token revoked, new one issued
    public AuthResponse refresh(String token) {
        RefreshToken rt = tokenRepo.findByToken(token)
            .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (rt.getRevoked() || rt.isExpired()) {
            // If someone tries to reuse a revoked token - revoke ALL tokens for this user
            // (possible token theft scenario)
            if (rt.getRevoked()) {
                log.warn("Revoked token reuse detected for user ID: {}", rt.getUser().getId());
                tokenRepo.revokeAllByUserId(rt.getUser().getId());
            }
            throw new UnauthorizedException("Refresh token expired or revoked");
        }

        // Rotate: revoke old, issue new
        rt.setRevoked(true);
        tokenRepo.save(rt);
        return buildAuthResponse(rt.getUser());
    }

    public void logout(String token) {
        tokenRepo.findByToken(token).ifPresent(rt -> {
            rt.setRevoked(true);
            tokenRepo.save(rt);
        });
    }

    private AuthResponse buildAuthResponse(User user) {
        String access  = jwtService.generateAccessToken(user);
        String refresh = jwtService.generateRefreshToken(user);

        RefreshToken rt = RefreshToken.builder()
            .user(user)
            .token(refresh)
            .expiresAt(LocalDateTime.now().plusSeconds(refreshExpiry / 1000))
            .build();
        tokenRepo.save(rt);

        return AuthResponse.builder()
            .user(toUserResponse(user))
            .accessToken(access)
            .refreshToken(refresh)
            .build();
    }

    private UserResponse toUserResponse(User u) {
        return UserResponse.builder()
            .id(u.getId()).email(u.getEmail()).fullName(u.getFullName())
            .username(u.getUsername()).avatarUrl(u.getAvatarUrl())
            .plan(u.getPlan().name()).targetRole(u.getTargetRole())
            .experienceLevel(u.getExperienceLevel().name())
            .build();
    }
}
