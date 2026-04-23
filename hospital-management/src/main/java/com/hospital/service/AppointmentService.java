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
        List<Appointment> appointments = appointmentRepository.findAll();
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
                    appt.getStatus(),
                    appt.getAppointmentDate() // ✅ include date
            );
        }).collect(Collectors.toList());
    }

    // ✅ BOOK APPOINTMENT
    public Appointment bookAppointment(Appointment appointment) {
        if (appointment.getDoctor() == null || appointment.getDoctor().getId() == null) {
            throw new RuntimeException("Doctor must be selected");
        }

        Long doctorId = appointment.getDoctor().getId();
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        appointment.setDoctor(doctor);

        long count = appointmentRepository.countByDoctor_IdAndStatus(doctor.getId(), "BOOKED");
        int queue = (int) count + 1;

        appointment.setQueue(queue);
        appointment.setStatus("BOOKED");

        return appointmentRepository.save(appointment);
    }

    // ✅ CANCEL APPOINTMENT + RESEQUENCE QUEUE
    public Appointment cancelAppointment(Long id) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        Long doctorId = appt.getDoctor() != null ? appt.getDoctor().getId() : null;
        int cancelledQueue = appt.getQueue();

        appt.setStatus("CANCELLED");
        appointmentRepository.save(appt);

        if (doctorId != null) {
            List<Appointment> appointmentsAfter = appointmentRepository
                    .findByDoctor_IdAndQueueGreaterThanAndStatus(doctorId, cancelledQueue, "BOOKED");
            for (Appointment a : appointmentsAfter) {
                a.setQueue(a.getQueue() - 1);
                appointmentRepository.save(a);
            }
        }

        return appt;
    }

    // ✅ GET APPOINTMENT BY ID
    public AppointmentResponse getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        String doctorName = appointment.getDoctor() != null ? appointment.getDoctor().getName() : "Not assigned";
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getPatientName(),
                doctorName,
                appointment.getQueue(),
                appointment.getStatus(),
                appointment.getAppointmentDate() // ✅ include date
        );
    }

    // ✅ GET APPOINTMENTS BY DOCTOR
    public List<AppointmentResponse> getAppointmentsByDoctor(Long doctorId) {
        List<Appointment> appointments = appointmentRepository.findByDoctor_Id(doctorId);
        return appointments.stream().map(appt -> {
            String doctorName = appt.getDoctor() != null ? appt.getDoctor().getName() : "Not assigned";
            return new AppointmentResponse(
                    appt.getId(),
                    appt.getPatientName(),
                    doctorName,
                    appt.getQueue(),
                    appt.getStatus(),
                    appt.getAppointmentDate() // ✅ include date
            );
        }).collect(Collectors.toList());
    }

    public long countTotalAppointments() { return appointmentRepository.count(); }
    public long countActiveAppointments() { return appointmentRepository.countByStatus("BOOKED"); }
    public long countCancelledAppointments() { return appointmentRepository.countByStatus("CANCELLED"); }
}