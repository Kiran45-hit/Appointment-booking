package com.example.appointment.service;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.mail.SimpleMailMessage;

import org.springframework.mail.javamail.JavaMailSender;

import org.springframework.scheduling.annotation.Async;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // =========================
    // SEND EMAIL ASYNC
    // =========================

    @Async
    public void sendAppointmentEmail(

            String toEmail,

            String patientName,

            String doctor,

            String date,

            String time,

            String priority
    ) {

        try {

            SimpleMailMessage message =
                    new SimpleMailMessage();

            message.setTo(toEmail);

            message.setSubject(
                    "Appointment Confirmation - AI Smart Clinic"
            );

            message.setText(

                    "Dear "

                    + patientName

                    + ",\n\n"

                    + "Your appointment has been successfully booked.\n\n"

                    + "Doctor: " + doctor + "\n"

                    + "Date: " + date + "\n"

                    + "Time: " + time + "\n"

                    + "Priority: " + priority + "\n\n"

                    + "Thank you for choosing AI Smart Clinic.\n\n"

                    + "Regards,\n"

                    + "AI Smart Clinic Team"
            );

            mailSender.send(message);

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
    }
}