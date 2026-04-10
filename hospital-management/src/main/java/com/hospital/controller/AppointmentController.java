package com.hospital.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.dto.AppointmentResponse;
import com.hospital.model.Appointment;
import com.hospital.service.AppointmentService;

@RestController
@RequestMapping("/appointments")
@CrossOrigin
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // ✅ GET ALL APPOINTMENTS
    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> getAll() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    // ✅ BOOK APPOINTMENT - ⭐ RETURN AppointmentResponse
    @PostMapping
    public ResponseEntity<?> book(@RequestBody Appointment appointment) {

        if (appointment.getPatientName() == null || appointment.getPatientName().isEmpty()) {
            return ResponseEntity.badRequest().body("Patient name required");
        }

        if (appointment.getDoctor() == null || appointment.getDoctor().getId() == null) {
            return ResponseEntity.badRequest().body("Doctor is required");
        }

        try {
            Appointment booked = appointmentService.bookAppointment(appointment);
            
            // ⭐ CONVERT TO AppointmentResponse
            AppointmentResponse response = new AppointmentResponse(
                    booked.getId(),
                    booked.getPatientName(),
                    booked.getDoctor().getId(),
                    booked.getDoctor().getName(),
                    booked.getQueue(),
                    booked.getStatus()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // ✅ CANCEL APPOINTMENT - RESEQUENCES QUEUE - ⭐ RETURN AppointmentResponse
    @PutMapping("/cancel/{id}")
    public ResponseEntity<?> cancel(@PathVariable Long id) {
        try {
            Appointment cancelled = appointmentService.cancelAppointment(id);
            
            // ⭐ CONVERT TO AppointmentResponse
            AppointmentResponse response = new AppointmentResponse(
                    cancelled.getId(),
                    cancelled.getPatientName(),
                    cancelled.getDoctor() != null ? cancelled.getDoctor().getId() : null,
                    cancelled.getDoctor() != null ? cancelled.getDoctor().getName() : "Unknown",
                    cancelled.getQueue(),
                    cancelled.getStatus()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}