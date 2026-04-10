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

    // ✅ GET ALL (WITH DOCTOR NAME)
    public List<AppointmentResponse> getAllAppointments() {

        List<Appointment> appointments = appointmentRepository.findAll();

        return appointments.stream().map(appt -> {

            String doctorName = "Unknown Doctor";
            Long doctorId = null;
            if (appt.getDoctor() != null) {
                doctorId = appt.getDoctor().getId();
                doctorName = appt.getDoctor().getName();
            }

            return new AppointmentResponse(
                    appt.getId(),
                    appt.getPatientName(),
                    doctorId,
                    doctorName,
                    appt.getQueue(),
                    appt.getStatus()
            );

        }).collect(Collectors.toList());
    }

    // ✅ CANCEL + QUEUE REORDER
    public Appointment cancelAppointment(Long id) {

        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        Long doctorId = appt.getDoctor() != null ? appt.getDoctor().getId() : null;
        int cancelledQueue = appt.getQueue();

        // mark cancelled
        appt.setStatus("CANCELLED");
        appointmentRepository.save(appt);

        // ⭐ Get all BOOKED appointments after the cancelled one
        List<Appointment> appointmentsAfter = appointmentRepository
                .findByDoctor_IdAndQueueGreaterThanAndStatus(doctorId, cancelledQueue, "BOOKED");

        // Decrease their queue numbers by 1
        for (Appointment a : appointmentsAfter) {
            a.setQueue(a.getQueue() - 1);
            appointmentRepository.save(a);
        }

        return appt;
    }

    // ✅ BOOK APPOINTMENT - ⭐ WITH DEBUG LOGGING
    public Appointment bookAppointment(Appointment appointment) {

        System.out.println("📌 BOOKING APPOINTMENT");
        System.out.println("Patient Name: " + appointment.getPatientName());
        System.out.println("Doctor ID from request: " + (appointment.getDoctor() != null ? appointment.getDoctor().getId() : "NULL"));

        // ⭐ FETCH DOCTOR FROM DATABASE
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

        appointment.setDoctor(doctor);  // ⭐ SET THE FETCHED DOCTOR

        // Get count of BOOKED appointments only
        long count = appointmentRepository.countByDoctor_IdAndStatus(doctor.getId(), "BOOKED");
        int queue = (int) count + 1;

        System.out.println("📊 Queue number assigned: " + queue);

        appointment.setQueue(queue);
        appointment.setStatus("BOOKED");

        Appointment saved = appointmentRepository.save(appointment);
        System.out.println("💾 Appointment saved with ID: " + saved.getId());

        return saved;
    }
}