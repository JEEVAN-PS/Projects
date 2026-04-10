package com.hospital.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hospital.model.Appointment;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    long countByDoctor_IdAndStatus(Long doctorId, String status);
    
    List<Appointment> findByDoctorIdOrderByQueueAsc(Long doctorId);
    
    List<Appointment> findByDoctor_IdAndQueueGreaterThanAndStatus(Long doctorId, int queue, String status);
    
   
    List<Appointment> findByDoctor_Id(Long doctorId);
}