package com.example.appointment.repository;

import com.example.appointment.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecializationId(Long specializationId);

    List<Doctor> findByAvailableTrue();
}