package com.example.appointment.entity;

import jakarta.persistence.*;

import jakarta.validation.constraints.*;

@Entity
public class Appointment {

    @Id
    @GeneratedValue(
            strategy =
            GenerationType.IDENTITY
    )
    private Long id;

    // =========================
    // PATIENT NAME
    // =========================

    @NotBlank(
            message =
            "Patient name is required"
    )
    private String name;

    // =========================
    // PATIENT EMAIL
    // =========================

    @NotBlank(
            message =
            "Email is required"
    )

    @Email(
            message =
            "Enter valid email"
    )

    private String email;

    // =========================
    // APPOINTMENT DATE
    // =========================

    @NotBlank(
            message =
            "Date is required"
    )

    @Pattern(
            regexp =
            "\\d{4}-\\d{2}-\\d{2}",

            message =
            "Date must be in yyyy-MM-dd format"
    )

    private String date;

    // =========================
    // APPOINTMENT TIME
    // =========================

    @NotBlank(
            message =
            "Time is required"
    )

    @Pattern(
            regexp =
            "^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$",

            message =
            "Time must be like 10:30 AM"
    )

    private String time;

    // =========================
    // DOCTOR NAME
    // =========================

    @NotBlank(
            message =
            "Doctor name is required"
    )

    private String doctor;

    // =========================
    // SPECIALIZATION
    // =========================

    @NotBlank(
            message =
            "Specialization is required"
    )

    private String specialization;

    // =========================
    // SYMPTOMS
    // =========================

    @NotBlank(
            message =
            "Symptoms are required"
    )

    private String symptoms;

    // =========================
    // PRIORITY
    // =========================

    @NotBlank(
            message =
            "Priority is required"
    )

    private String priority;

    // =========================
    // APPOINTMENT STATUS
    // =========================

    private String status =
            "Active";

    /*
        Possible Values:

        Active
        Completed
        Deleted
        Cancelled
    */

    // =========================
    // PREDICTED WAIT TIME
    // =========================

    private Integer waitTime;

    // =========================
    // GETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getDate() {
        return date;
    }

    public String getTime() {
        return time;
    }

    public String getDoctor() {
        return doctor;
    }

    public String getSpecialization() {
        return specialization;
    }

    public String getSymptoms() {
        return symptoms;
    }

    public String getPriority() {
        return priority;
    }

    public String getStatus() {
        return status;
    }

    public Integer getWaitTime() {
        return waitTime;
    }

    // =========================
    // SETTERS
    // =========================

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public void setDoctor(String doctor) {
        this.doctor = doctor;
    }

    public void setSpecialization(
            String specialization
    ) {

        this.specialization =
                specialization;
    }

    public void setSymptoms(
            String symptoms
    ) {

        this.symptoms = symptoms;
    }

    public void setPriority(
            String priority
    ) {

        this.priority = priority;
    }

    public void setStatus(
            String status
    ) {

        this.status = status;
    }

    public void setWaitTime(
            Integer waitTime
    ) {

        this.waitTime = waitTime;
    }
}