package com.hospital.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
@CrossOrigin(origins = "http://localhost:3000")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> getAllAppointments() {
        try {
            return ResponseEntity.ok(appointmentService.getAllAppointments());
        } catch (Exception e) {
            System.err.println("❌ Error in getAllAppointments: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<?> bookAppointment(@RequestBody Appointment appointment) {
        try {
            System.out.println("📅 Starting bookAppointment...");
            System.out.println("Patient: " + appointment.getPatientName());
            System.out.println("Doctor: " + appointment.getDoctor());
            
            Appointment booked = appointmentService.bookAppointment(appointment);
            
            System.out.println("✅ Appointment booked, creating response...");
            
            AppointmentResponse response = new AppointmentResponse(
                booked.getId(),
                booked.getPatientName(),
                booked.getDoctor().getName(),
                booked.getQueue(),
                booked.getStatus()
            );
            
            System.out.println("✅ Response created: " + response.getPatientName());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌❌❌ CRITICAL ERROR in bookAppointment:");
            System.err.println("Message: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id) {
        try {
            Appointment cancelled = appointmentService.cancelAppointment(id);
            AppointmentResponse response = new AppointmentResponse(
                cancelled.getId(),
                cancelled.getPatientName(),
                cancelled.getDoctor().getName(),
                cancelled.getQueue(),
                cancelled.getStatus()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error cancelling: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointmentById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(appointmentService.getAppointmentById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        try {
            return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(doctorId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}