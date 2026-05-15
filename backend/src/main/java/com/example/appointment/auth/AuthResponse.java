package com.example.appointment.auth;

public class AuthResponse {

    private String token;

    private String role;

    public AuthResponse(String token, String role) {

        this.token = token;

        this.role = role;
    }

    // =========================
    // GETTERS
    // =========================

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }
}
