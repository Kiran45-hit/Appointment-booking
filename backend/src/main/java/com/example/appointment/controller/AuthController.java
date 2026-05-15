package com.example.appointment.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.appointment.auth.AuthResponse;
import com.example.appointment.auth.LoginRequest;
import com.example.appointment.auth.RegisterRequest;
import com.example.appointment.entity.Role;
import com.example.appointment.entity.User;
import com.example.appointment.jwt.JwtUtil;
import com.example.appointment.repository.UserRepository;

@RestController

@RequestMapping("/auth")

@CrossOrigin(origins = "http://localhost:3000")

public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // =========================
    // REGISTER
    // =========================

    @PostMapping("/register")

    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request
    ) {

        // ✅ EMAIL EXISTS

        if (

                userRepository.existsByEmail(
                        request.getEmail()
                )
        ) {

            return ResponseEntity

                    .badRequest()

                    .body(
                            "Email already registered"
                    );
        }

        // ✅ CREATE USER

        User user = new User();

        user.setName(
                request.getName()
        );

        user.setEmail(
                request.getEmail()
        );

        user.setPassword(

                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setRole(

                Role.valueOf(
                        request.getRole()
                )
        );

        userRepository.save(user);

        return ResponseEntity.ok(

                "User Registered Successfully ✅"
        );
    }

    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")

    public ResponseEntity<?> login(
            @RequestBody LoginRequest request
    ) {

        Optional<User> userOptional =

                userRepository.findByEmail(
                        request.getEmail()
                );

        // ❌ USER NOT FOUND

        if (userOptional.isEmpty()) {

            return ResponseEntity

                    .badRequest()

                    .body("Invalid Email");
        }

        User user = userOptional.get();

        // ❌ WRONG PASSWORD

        if (

                !passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                )
        ) {

            return ResponseEntity

                    .badRequest()

                    .body("Invalid Password");
        }

        // ✅ GENERATE JWT

        String token =

                jwtUtil.generateToken(
                        user.getEmail()
                );

        return ResponseEntity.ok(

                new AuthResponse(

                        token,

                        user.getRole().name()
                )
        );
    }

    // =========================
    // GET ALL DOCTORS
    // =========================

    @GetMapping("/doctors")

    public ResponseEntity<?> getDoctors() {

        List<User> doctors =

                userRepository.findByRole(
                        Role.ROLE_ADMIN
                );

        List<String> doctorNames =

                doctors.stream()

                        .map(User::getName)

                        .toList();

        return ResponseEntity.ok(
                doctorNames
        );
    }
}