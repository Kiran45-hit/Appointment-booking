package com.example.appointment.controller;

import com.example.appointment.entity.Doctor;
import com.example.appointment.entity.Specialization;
import com.example.appointment.repository.DoctorRepository;
import com.example.appointment.repository.SpecializationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class DoctorController {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private SpecializationRepository specializationRepository;

    // =========================
    // GET ALL SPECIALIZATIONS
    // =========================
    @GetMapping("/specializations")
    public List<Specialization> getAllSpecializations() {
        return specializationRepository.findAll();
    }

    // =========================
    // GET DOCTORS BY SPECIALIZATION
    // =========================
    @GetMapping("/doctors/by-specialization/{specializationId}")
    public List<Doctor> getDoctorsBySpecialization(@PathVariable Long specializationId) {
        return doctorRepository.findBySpecializationId(specializationId);
    }

    // =========================
    // GET ALL DOCTORS
    // =========================
    @GetMapping("/doctors")
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // =========================
    // ADD SPECIALIZATION (Admin)
    // =========================
    @PostMapping("/specializations")
    public ResponseEntity<Specialization> addSpecialization(@RequestBody Specialization specialization) {
        Specialization saved = specializationRepository.save(specialization);
        return ResponseEntity.ok(saved);
    }

    // =========================
    // ADD DOCTOR (Admin)
    // =========================
    @PostMapping("/doctors")
    public ResponseEntity<Doctor> addDoctor(@RequestBody Doctor doctor) {
        Doctor saved = doctorRepository.save(doctor);
        return ResponseEntity.ok(saved);
    }

    // =========================
    // DELETE DOCTOR (Admin)
    // =========================
    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<String> deleteDoctor(@PathVariable Long id) {
        doctorRepository.deleteById(id);
        return ResponseEntity.ok("Doctor deleted successfully");
    }

    // =========================
    // DELETE SPECIALIZATION (Admin)
    // =========================
    @DeleteMapping("/specializations/{id}")
    public ResponseEntity<String> deleteSpecialization(@PathVariable Long id) {
        specializationRepository.deleteById(id);
        return ResponseEntity.ok("Specialization deleted successfully");
    }

    // =========================
    // TOGGLE DOCTOR AVAILABILITY
    // =========================
    @PutMapping("/doctors/{id}/toggle-availability")
    public ResponseEntity<Doctor> toggleAvailability(@PathVariable Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setAvailable(!doctor.getAvailable());
        return ResponseEntity.ok(doctorRepository.save(doctor));
    }
}