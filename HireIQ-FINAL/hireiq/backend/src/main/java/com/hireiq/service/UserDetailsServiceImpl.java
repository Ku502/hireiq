// FILE: service/AuthService.java
// ══════════════════════════════════════════════════════════════════════════════
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
import com.hireiq.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepo;
    private final RefreshTokenRepository tokenRepo;
    private final UserStatsRepository statsRepo;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;

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
            .isVerified(true) // auto-verify for now
            .build();
        user = userRepo.save(user);

        // init stats
        statsRepo.save(UserStats.builder().user(user).build());

        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest req) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        User user = userRepo.findByEmail(req.getEmail())
            .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
        user.setLastLogin(LocalDateTime.now());
        userRepo.save(user);

        return buildAuthResponse(user);
    }

    public AuthResponse refresh(String token) {
        RefreshToken rt = tokenRepo.findByToken(token)
            .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));
        if (rt.getRevoked() || rt.isExpired())
            throw new UnauthorizedException("Refresh token expired");

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
        String access = jwtService.generateAccessToken(user);
        String refresh = jwtService.generateRefreshToken(user);

        RefreshToken rt = RefreshToken.builder()
            .user(user).token(refresh)
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

