package com.hireiq.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@Slf4j
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token-expiry:900000}")
    private long accessExpiry;

    @Value("${jwt.refresh-token-expiry:604800000}")
    private long refreshExpiry;

    public String generateAccessToken(UserDetails user) {
        return generateAccessToken(Map.of("type", "ACCESS"), user);
    }

    public String generateAccessToken(Map<String, Object> extra, UserDetails user) {
        return buildToken(extra, user, accessExpiry);
    }

    public String generateRefreshToken(UserDetails user) {
        return buildToken(Map.of("type", "REFRESH"), user, refreshExpiry);
    }

    private String buildToken(Map<String, Object> claims, UserDetails user, long expiry) {
        return Jwts.builder()
            .claims(claims)
            .subject(user.getUsername())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expiry))
            .signWith(signingKey())
            .compact();
    }

    public boolean isTokenValid(String token, UserDetails user) {
        return extractUsername(token).equals(user.getUsername()) && !isExpired(token);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        return resolver.apply(parseToken(token));
    }

    private boolean isExpired(String token) {
        return parseToken(token).getExpiration().before(new Date());
    }

    private Claims parseToken(String token) {
        return Jwts.parser()
            .verifyWith(signingKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    private SecretKey signingKey() {
        String b64 = Base64.getEncoder().encodeToString(secret.getBytes());
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(b64));
    }
}
