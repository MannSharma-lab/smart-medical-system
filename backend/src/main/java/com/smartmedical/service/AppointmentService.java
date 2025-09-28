package com.smartmedical.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import com.smartmedical.model.Appointment;
import com.smartmedical.model.Patient;

public interface AppointmentService {
    Appointment createAppointment(Appointment appointment);
    List<Appointment> getAllAppointments();
    Optional<Appointment> getAppointmentById(Long id);
    Appointment updateAppointment(Long id, Appointment appointment);
    void deleteAppointment(Long id);
    List<Appointment> getAppointmentsByPatient(Patient patient);
    List<Appointment> getUpcomingAppointments();
    List<Appointment> getAppointmentsBetween(LocalDateTime start, LocalDateTime end);
    Appointment cancelAppointment(Long id);
}