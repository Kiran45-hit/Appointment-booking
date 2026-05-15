package com.example.appointment.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.appointment.entity.Role;
import com.example.appointment.entity.User;

@Repository
public interface UserRepository
        extends JpaRepository<User, Long> {

    // =========================
    // FIND USER BY EMAIL
    // =========================

    Optional<User> findByEmail(
            String email
    );

    // =========================
    // CHECK EMAIL EXISTS
    // =========================

    boolean existsByEmail(
            String email
    );

    // =========================
    // GET ALL DOCTORS
    // =========================

    List<User> findByRole(
            Role role
    );
}