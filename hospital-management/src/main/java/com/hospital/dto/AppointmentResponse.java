package com.hospital.dto;

public class AppointmentResponse {

    private final Long id;
    private final String patientName;
    private final Long doctorId;
    private final String doctorName;
    private final int queue;
    private final String status;

    public AppointmentResponse(Long id, String patientName, Long doctorId,
                               String doctorName, int queue, String status) {
        this.id = id;
        this.patientName = patientName;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.queue = queue;
        this.status = status;
    }

    public Long getId() { return id; }
    public String getPatientName() { return patientName; }
    public Long getDoctorId() { return doctorId; }
    public String getDoctorName() { return doctorName; }
    public int getQueue() { return queue; }
    public String getStatus() { return status; }
}