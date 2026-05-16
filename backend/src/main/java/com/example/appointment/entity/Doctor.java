package com.example.appointment.entity;

import jakarta.persistence.*;

@Entity
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String phone;

    private Integer experience;

    private Boolean available = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "specialization_id")
    private Specialization specialization;

    // Getters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public Integer getExperience() {
        return experience;
    }

    public Boolean getAvailable() {
        return available;
    }

    public Specialization getSpecialization() {
        return specialization;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setExperience(Integer experience) {
        this.experience = experience;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public void setSpecialization(Specialization specialization) {
        this.specialization = specialization;
    }
}