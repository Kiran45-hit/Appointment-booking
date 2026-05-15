package com.example.appointment.auth;

public class LoginRequest {

    private String email;

    private String password;

    // =========================
    // GETTERS & SETTERS
    // =========================

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
