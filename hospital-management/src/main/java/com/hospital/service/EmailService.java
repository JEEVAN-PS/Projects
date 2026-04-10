package com.hospital.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendAppointmentConfirmation(String toEmail, String doctorId, String time) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Appointment Confirmation");

        message.setText(
                "Your appointment has been booked successfully.\n\n" +
                "Doctor ID: " + doctorId + "\n" +
                "Appointment Time: " + time + "\n\n" +
                "Thank you.\nHospital Management System"
        );

        mailSender.send(message);
    }
}