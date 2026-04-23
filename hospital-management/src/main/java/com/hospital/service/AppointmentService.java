package com.hospital.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hospital.dto.AppointmentResponse;
import com.hospital.model.Appointment;
import com.hospital.model.Doctor;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DoctorRepository;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    // ✅ GET ALL APPOINTMENTS
    public List<AppointmentResponse> getAllAppointments() {
        System.out.println("📋 Fetching all appointments...");
        List<Appointment> appointments = appointmentRepository.findAll();

        List<AppointmentResponse> response = appointments.stream().map(appt -> {
            String doctorName = "Not assigned";
            if (appt.getDoctor() != null) {
                doctorName = appt.getDoctor().getName();
            }

            return new AppointmentResponse(
                    appt.getId(),
                    appt.getPatientName(),
                    doctorName,
                    appt.getQueue(),
                    appt.getStatus()
            );

        }).collect(Collectors.toList());
        
        System.out.println("✅ Found " + response.size() + " appointments");
        return response;
    }

    // ✅ CANCEL APPOINTMENT + RESEQUENCE QUEUE
    public Appointment cancelAppointment(Long id) {
        System.out.println("🗑️ Cancelling appointment ID: " + id);
        
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        Long doctorId = appt.getDoctor() != null ? appt.getDoctor().getId() : null;
        int cancelledQueue = appt.getQueue();

        // Mark as cancelled
        appt.setStatus("CANCELLED");
        appointmentRepository.save(appt);
        System.out.println("✅ Appointment marked as CANCELLED");

        // Resequence queue
        if (doctorId != null) {
            List<Appointment> appointmentsAfter = appointmentRepository
                    .findByDoctor_IdAndQueueGreaterThanAndStatus(doctorId, cancelledQueue, "BOOKED");

            System.out.println("🔄 Resequencing " + appointmentsAfter.size() + " appointments");
            
            for (Appointment a : appointmentsAfter) {
                a.setQueue(a.getQueue() - 1);
                appointmentRepository.save(a);
            }
        }

        return appt;
    }

    // ✅ BOOK APPOINTMENT
    public Appointment bookAppointment(Appointment appointment) {
        System.out.println("📌 BOOKING APPOINTMENT");
        System.out.println("Patient Name: " + appointment.getPatientName());
        System.out.println("Doctor ID from request: " + (appointment.getDoctor() != null ? appointment.getDoctor().getId() : "NULL"));

        if (appointment.getDoctor() == null || appointment.getDoctor().getId() == null) {
            System.out.println("❌ Doctor is NULL or Doctor ID is NULL");
            throw new RuntimeException("Doctor must be selected");
        }

        Long doctorId = appointment.getDoctor().getId();
        System.out.println("🔍 Fetching doctor with ID: " + doctorId);

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> {
                    System.out.println("❌ Doctor not found with ID: " + doctorId);
                    return new RuntimeException("Doctor not found");
                });

        System.out.println("✅ Doctor found: " + doctor.getName());

        appointment.setDoctor(doctor);

        long count = appointmentRepository.countByDoctor_IdAndStatus(doctor.getId(), "BOOKED");
        int queue = (int) count + 1;

        System.out.println("📊 Queue number assigned: " + queue);

        appointment.setQueue(queue);
        appointment.setStatus("BOOKED");

        Appointment saved = appointmentRepository.save(appointment);
        System.out.println("💾 Appointment saved with ID: " + saved.getId());

        return saved;
    }

    // ✅ GET APPOINTMENT BY ID
    public AppointmentResponse getAppointmentById(Long id) {
        System.out.println("🔍 Fetching appointment ID: " + id);
        
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        String doctorName = "Not assigned";
        if (appointment.getDoctor() != null) {
            doctorName = appointment.getDoctor().getName();
        }
        
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getPatientName(),
                doctorName,
                appointment.getQueue(),
                appointment.getStatus()
        );
    }

    // ✅ GET APPOINTMENTS BY DOCTOR
    public List<AppointmentResponse> getAppointmentsByDoctor(Long doctorId) {
        System.out.println("👨‍⚕️ Fetching appointments for doctor ID: " + doctorId);
        
        List<Appointment> appointments = appointmentRepository.findByDoctor_Id(doctorId);
        
        return appointments.stream().map(appt -> {
            String doctorName = "Not assigned";
            if (appt.getDoctor() != null) {
                doctorName = appt.getDoctor().getName();
            }
            
            return new AppointmentResponse(
                    appt.getId(),
                    appt.getPatientName(),
                    doctorName,
                    appt.getQueue(),
                    appt.getStatus()
            );
        }).collect(Collectors.toList());
    }

    // ✅ COUNT TOTAL APPOINTMENTS
    public long countTotalAppointments() {
        return appointmentRepository.count();
    }

    // ✅ COUNT ACTIVE APPOINTMENTS
    public long countActiveAppointments() {
        return appointmentRepository.countByStatus("BOOKED");
    }

    // ✅ COUNT CANCELLED APPOINTMENTS
    public long countCancelledAppointments() {
        return appointmentRepository.countByStatus("CANCELLED");
    }
}