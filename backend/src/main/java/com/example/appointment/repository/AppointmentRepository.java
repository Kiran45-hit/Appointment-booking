package com.example.appointment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.appointment.entity.Appointment;

@Repository
public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    // 🔍 Search patient by name
    List<Appointment> findByNameContainingIgnoreCase(String name);

    // 📅 Filter appointments by date
    List<Appointment> findByDate(String date);

    // 👨‍⚕️ Filter by doctor
    List<Appointment> findByDoctor(String doctor);

    // 🏥 Filter by specialization
    List<Appointment> findBySpecialization(String specialization);

    // 🚨 Filter by priority
    List<Appointment> findByPriority(String priority);

    // 📌 Filter by status
    List<Appointment> findByStatus(String status);

    // 🚫 Prevent duplicate slot
    boolean existsByDateAndTime(String date, String time);

    // 🤖 Smart doctor + slot checking
    boolean existsByDoctorAndDateAndTime(
            String doctor,
            String date,
            String time
    );
}