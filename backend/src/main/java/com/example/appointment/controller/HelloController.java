package com.example.appointment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.appointment.dto.PageResponse;
import com.example.appointment.entity.Appointment;
import com.example.appointment.repository.AppointmentRepository;
import com.example.appointment.service.EmailService;

import jakarta.validation.Valid;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/appointments")

@CrossOrigin(
    origins = "http://localhost:3000",
    methods = {
        RequestMethod.GET,
        RequestMethod.POST,
        RequestMethod.PUT,
        RequestMethod.DELETE
    }
)

public class HelloController {

    @Autowired
    private AppointmentRepository repo;

    @Autowired
    private EmailService emailService;

    // =========================
    // CREATE APPOINTMENT
    // =========================

    @PostMapping
    public ResponseEntity<?> save(

            @Valid
            @RequestBody
            Appointment appointment
    ) {

        // DUPLICATE SLOT CHECK

        if (

            repo.existsByDoctorAndDateAndTime(

                appointment.getDoctor(),

                appointment.getDate(),

                appointment.getTime()
            )
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(

                        "Slot already booked for "

                        + appointment.getDoctor()

                        + ". Suggested slot: 11:00 AM"
                    );
        }

        // =========================
        // AI PRIORITY LOGIC
        // =========================

        if (
            appointment.getSymptoms()
            != null
        ) {

            String symptoms =

                    appointment
                    .getSymptoms()
                    .toLowerCase();

            if (

                symptoms.contains("chest")

                ||

                symptoms.contains("breathing")

                ||

                symptoms.contains("heart")
            ) {

                appointment.setPriority(
                        "Emergency"
                );

                appointment.setWaitTime(5);

            }

            else {

                appointment.setPriority(
                        "Normal"
                );

                appointment.setWaitTime(15);
            }
        }

        // DEFAULT STATUS

        appointment.setStatus(
                "Active"
        );

        Appointment saved =
                repo.save(appointment);

        // =========================
        // SEND EMAIL
        // =========================

        try {

            emailService.sendAppointmentEmail(

                    appointment.getEmail(),

                    appointment.getName(),

                    appointment.getDoctor(),

                    appointment.getDate(),

                    appointment.getTime(),

                    appointment.getPriority()
            );

            System.out.println(
                    "Email sent successfully ✅"
            );
        }

        catch (Exception e) {

            System.out.println(
                    "Email sending failed ❌"
            );

            e.printStackTrace();
        }

        return ResponseEntity
                .status(201)
                .body(saved);
    }

    // =========================
    // AUTO COMPLETE LOGIC
    // =========================

    private void updateCompletedAppointments() {

        List<Appointment> allAppointments =
                repo.findAll();

        LocalDateTime now =
                LocalDateTime.now();

        for (Appointment appointment : allAppointments) {

            try {

                // SKIP DELETED / COMPLETED

                if (

                    "Deleted".equalsIgnoreCase(
                            appointment.getStatus()
                    )

                    ||

                    "Completed".equalsIgnoreCase(
                            appointment.getStatus()
                    )
                ) {

                    continue;
                }

                LocalDate appointmentDate =
                        LocalDate.parse(
                                appointment.getDate()
                        );

                LocalTime appointmentTime;

                try {

                    appointmentTime =
                            LocalTime.parse(

                                    appointment.getTime(),

                                    DateTimeFormatter.ofPattern(
                                            "h:mm a"
                                    )
                            );
                }

                catch (Exception e) {

                    appointmentTime =
                            LocalTime.parse(

                                    appointment.getTime(),

                                    DateTimeFormatter.ofPattern(
                                            "HH:mm"
                                    )
                            );
                }

                LocalDateTime appointmentDateTime =

                        LocalDateTime.of(
                                appointmentDate,
                                appointmentTime
                        );

                // AUTO COMPLETE

                if (
                    appointmentDateTime.isBefore(now)
                ) {

                    appointment.setStatus(
                            "Completed"
                    );

                    repo.save(appointment);
                }

            }

            catch (Exception e) {

                System.out.println(
                        "Time parsing error"
                );
            }
        }
    }

    // =========================
    // GET ACTIVE
    // =========================

    @GetMapping
    public ResponseEntity<PageResponse<Appointment>>
    getAll(

            @RequestParam(
                    name = "page",
                    defaultValue = "0"
            )
            int page,

            @RequestParam(
                    name = "size",
                    defaultValue = "5"
            )
            int size,

            @RequestParam(
                    name = "sortBy",
                    defaultValue = "id"
            )
            String sortBy,

            @RequestParam(
                    name = "direction",
                    defaultValue = "asc"
            )
            String direction
    ) {

        updateCompletedAppointments();

        Sort sort =

                direction.equalsIgnoreCase(
                        "desc"
                )

                ?

                Sort.by(sortBy).descending()

                :

                Sort.by(sortBy).ascending();

        Page<Appointment> result =

                repo.findAll(

                        PageRequest.of(
                                page,
                                size,
                                sort
                        )
                );

        List<Appointment> activeAppointments =

                result.getContent()

                        .stream()

                        .filter(a ->

                            "Active".equalsIgnoreCase(
                                    a.getStatus()
                            )
                        )

                        .toList();

        PageResponse<Appointment> response =

                new PageResponse<>(

                        activeAppointments,

                        result.getNumber(),

                        result.getTotalPages(),

                        result.getTotalElements()
                );

        return ResponseEntity.ok(response);
    }

    // =========================
    // HISTORY
    // =========================

    @GetMapping("/history")
    public ResponseEntity<?> getHistory() {

        List<Appointment> deletedAppointments =

                repo.findAll()

                        .stream()

                        .filter(a ->

                            "Deleted".equalsIgnoreCase(
                                    a.getStatus()
                            )
                        )

                        .toList();

        return ResponseEntity.ok(
                deletedAppointments
        );
    }

    // =========================
    // COMPLETED
    // =========================

    @GetMapping("/completed")
    public ResponseEntity<?> getCompleted() {

        updateCompletedAppointments();

        List<Appointment> completedAppointments =

                repo.findAll()

                        .stream()

                        .filter(a ->

                            "Completed".equalsIgnoreCase(
                                    a.getStatus()
                            )
                        )

                        .toList();

        return ResponseEntity.ok(
                completedAppointments
        );
    }

    // =========================
    // COMPLETE APPOINTMENT
    // =========================

    @PutMapping("/complete/{id}")
    public ResponseEntity<?> completeAppointment(

            @PathVariable("id")
            Long id
    ) {

        Optional<Appointment> existing =
                repo.findById(id);

        if (existing.isEmpty()) {

            return ResponseEntity
                    .status(404)
                    .body(
                            "Appointment not found"
                    );
        }

        Appointment appointment =
                existing.get();

        appointment.setStatus(
                "Completed"
        );

        repo.save(appointment);

        return ResponseEntity.ok(
                "Appointment completed ✅"
        );
    }

    // =========================
    // GET BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<Appointment>
    getById(

            @PathVariable("id")
            Long id
    ) {

        return repo.findById(id)

                .map(ResponseEntity::ok)

                .orElse(

                        ResponseEntity
                                .notFound()
                                .build()
                );
    }

    // =========================
    // DELETE
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(

            @PathVariable("id")
            Long id
    ) {

        Optional<Appointment> existing =
                repo.findById(id);

        if (existing.isEmpty()) {

            return ResponseEntity
                    .status(404)
                    .body(
                            "Appointment not found"
                    );
        }

        Appointment appointment =
                existing.get();

        appointment.setStatus(
                "Deleted"
        );

        repo.save(appointment);

        return ResponseEntity.ok(
                "Appointment moved to history ✅"
        );
    }
}