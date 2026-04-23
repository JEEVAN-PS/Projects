package com.hospital.dto;

public class AppointmentResponse {
    private Long id;
    private String patientName;
    private String doctorName;
    private Integer queue;
    private String status;

    // Constructor with 5 parameters (id, patientName, doctorName, queue, status)
    public AppointmentResponse(Long id, String patientName, String doctorName, Integer queue, String status) {
        this.id = id;
        this.patientName = patientName;
        this.doctorName = doctorName;
        this.queue = queue;
        this.status = status;
    }

    // Default constructor
    public AppointmentResponse() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public int getQueue() {
        return queue;
    }

    public void setQueue(int queue) {
        this.queue = queue;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "AppointmentResponse{" +
                "id=" + id +
                ", patientName='" + patientName + '\'' +
                ", doctorName='" + doctorName + '\'' +
                ", queue=" + queue +
                ", status='" + status + '\'' +
                '}';
    }
}