package com.hospital.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hospital.model.Doctor;
import com.hospital.repository.DoctorRepository;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    // Get all doctors
    public List<Doctor> getAllDoctors() {
        System.out.println("📋 Fetching all doctors from database...");
        List<Doctor> doctors = doctorRepository.findAll();
        System.out.println("✅ Found " + doctors.size() + " doctors");
        return doctors;
    }

    // Get doctor by ID
    public Doctor getDoctorById(Long id) {
        System.out.println("🔍 Fetching doctor with ID: " + id);
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + id));
    }

    // Add new doctor with validation
    public Doctor addDoctor(Doctor doctor) {
        System.out.println("➕ Adding new doctor: " + doctor.getName());
        
        // Validate inputs
        if (doctor.getName() == null || doctor.getName().trim().isEmpty()) {
            throw new RuntimeException("Doctor name is required");
        }
        if (doctor.getSpecialization() == null || doctor.getSpecialization().trim().isEmpty()) {
            throw new RuntimeException("Specialization is required");
        }
        if (doctor.getExperience() < 0) {
            throw new RuntimeException("Experience cannot be negative");
        }
        if (doctor.getAvailableDay() == null || doctor.getAvailableDay().trim().isEmpty()) {
            throw new RuntimeException("At least one available day is required");
        }
        if (doctor.getStartTime() == null || doctor.getEndTime() == null) {
            throw new RuntimeException("Start time and end time are required");
        }

        // Save to database
        Doctor savedDoctor = doctorRepository.save(doctor);
        System.out.println("✅ Doctor saved successfully with ID: " + savedDoctor.getId());
        System.out.println("📅 Available days: " + savedDoctor.getAvailableDay());
        
        return savedDoctor;
    }

    // Update existing doctor
    public Doctor updateDoctor(Doctor doctor) {
        System.out.println("✏️ Updating doctor with ID: " + doctor.getId());
        
        // Check if doctor exists
        if (!doctorRepository.existsById(doctor.getId())) {
            throw new RuntimeException("Doctor not found with ID: " + doctor.getId());
        }

        // Validate inputs
        if (doctor.getName() == null || doctor.getName().trim().isEmpty()) {
            throw new RuntimeException("Doctor name is required");
        }
        if (doctor.getAvailableDay() == null || doctor.getAvailableDay().trim().isEmpty()) {
            throw new RuntimeException("At least one available day is required");
        }

        // Update in database
        Doctor updatedDoctor = doctorRepository.save(doctor);
        System.out.println("✅ Doctor updated successfully");
        System.out.println("📅 Available days: " + updatedDoctor.getAvailableDay());
        
        return updatedDoctor;
    }

    // Delete doctor
    public void deleteDoctor(Long id) {
        System.out.println("🗑️ Deleting doctor with ID: " + id);
        
        if (!doctorRepository.existsById(id)) {
            throw new RuntimeException("Doctor not found with ID: " + id);
        }

        doctorRepository.deleteById(id);
        System.out.println("✅ Doctor deleted successfully");
    }

    // Get doctors available on specific day
    public List<Doctor> getDoctorsAvailableOnDay(String day) {
        System.out.println("📅 Fetching doctors available on: " + day);
        List<Doctor> allDoctors = doctorRepository.findAll();
        
        List<Doctor> availableDoctors = allDoctors.stream()
                .filter(doctor -> doctor.isAvailableOn(day))
                .collect(Collectors.toList());
        
        System.out.println("✅ Found " + availableDoctors.size() + " doctors available on " + day);
        return availableDoctors;
    }

    // Count doctors
    public long countDoctors() {
        return doctorRepository.count();
    }
}