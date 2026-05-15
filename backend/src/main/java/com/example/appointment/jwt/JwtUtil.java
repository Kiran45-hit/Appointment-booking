package com.example.appointment.jwt;

import java.util.Date;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    // =========================
    // SECRET KEY
    // =========================

    private static final String SECRET =
            "mysecretkeymysecretkeymysecretkey123456";

    private final SecretKey key =
            Keys.hmacShaKeyFor(SECRET.getBytes());

    // =========================
    // GENERATE TOKEN
    // =========================

    public String generateToken(String email) {

        return Jwts.builder()

                .setSubject(email)

                .setIssuedAt(new Date())

                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                + 1000 * 60 * 60 * 24
                        )
                )

                .signWith(key)

                .compact();
    }

    // =========================
    // EXTRACT EMAIL
    // =========================

    public String extractEmail(String token) {

        return extractClaims(token)
                .getSubject();
    }

    // =========================
    // VALIDATE TOKEN
    // =========================

    public boolean validateToken(
            String token,
            String email
    ) {

        return extractEmail(token)
                .equals(email)

                &&

                !extractClaims(token)
                        .getExpiration()
                        .before(new Date());
    }

    // =========================
    // EXTRACT CLAIMS
    // =========================

    private Claims extractClaims(String token) {

        return Jwts.parserBuilder()

                .setSigningKey(key)

                .build()

                .parseClaimsJws(token)

                .getBody();
    }
}