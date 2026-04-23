package com.hospital.dto;

public class AppointmentResponse {
    private Long id;
    private String patientName;
    private String doctorName;
    private Integer queue;
    private String status;
    private String appointmentDate; // ✅ NEW FIELD

    // ✅ Updated constructor with 6 parameters
    public AppointmentResponse(Long id, String patientName, String doctorName, Integer queue, String status, String appointmentDate) {
        this.id = id;
        this.patientName = patientName;
        this.doctorName = doctorName;
        this.queue = queue;
        this.status = status;
        this.appointmentDate = appointmentDate;
    }

    // Default constructor
    public AppointmentResponse() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public Integer getQueue() { return queue; }
    public void setQueue(Integer queue) { this.queue = queue; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(String appointmentDate) { this.appointmentDate = appointmentDate; }

    @Override
    public String toString() {
        return "AppointmentResponse{" +
                "id=" + id +
                ", patientName='" + patientName + '\'' +
                ", doctorName='" + doctorName + '\'' +
                ", queue=" + queue +
                ", status='" + status + '\'' +
                ", appointmentDate='" + appointmentDate + '\'' +
                '}';
    }
}