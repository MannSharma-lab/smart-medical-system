package com.smartmedical.repository;

import com.smartmedical.model.Appointment;
import com.smartmedical.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Patient ke saare appointments
    List<Appointment> findByPatient(Patient patient);

    // Date range ke beech ke appointments
    List<Appointment> findByAppointmentTimeBetween(LocalDateTime from, LocalDateTime to);

    // Sirf status ke basis par
    List<Appointment> findByStatusOrderByAppointmentTimeAsc(String status);

    // Status + Date range
    List<Appointment> findByStatusAndAppointmentTimeBetweenOrderByAppointmentTimeAsc(
            String status, LocalDateTime from, LocalDateTime to
    );

    // Status + Doctor name + Date range
    List<Appointment> findByStatusAndDoctorNameAndAppointmentTimeBetweenOrderByAppointmentTimeAsc(
            String status, String doctorName, LocalDateTime from, LocalDateTime to
    );

    // Sirf upcoming appointments
    List<Appointment> findByAppointmentTimeAfterOrderByAppointmentTimeAsc(LocalDateTime now);

    // Pagination support
    Page<Appointment> findByStatus(String status, Pageable pageable);
}