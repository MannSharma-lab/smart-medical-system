package com.smartmedical.service;

import com.smartmedical.model.Appointment;
import com.smartmedical.model.Patient;
import com.smartmedical.repository.AppointmentRepository;
import com.smartmedical.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Override
    public Appointment createAppointment(Appointment appointment) {
   
        if (appointment.getPatient() != null && appointment.getPatient().getId() != null) {
            Patient patient = patientRepository.findById(appointment.getPatient().getId())
                    .orElseThrow(() -> new RuntimeException("Patient not found with id " + appointment.getPatient().getId()));
            appointment.setPatient(patient);
        }

        // default status
        if (appointment.getStatus() == null) {
            appointment.setStatus("SCHEDULED");
        }

        return appointmentRepository.save(appointment);
    }

    @Override
    public List<Appointment> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();

        // Auto-update
        LocalDateTime now = LocalDateTime.now();
        for (Appointment appt : appointments) {
            if ("SCHEDULED".equalsIgnoreCase(appt.getStatus())
                && appt.getAppointmentTime().isBefore(now)) {
                appt.setStatus("COMPLETED");
                appointmentRepository.save(appt);
            }
        }

        return appointments;
    }

    @Override
    public Optional<Appointment> getAppointmentById(Long id) {
        Optional<Appointment> apptOpt = appointmentRepository.findById(id);

        // Auto-update for single appointment
        apptOpt.ifPresent(appt -> {
            if ("SCHEDULED".equalsIgnoreCase(appt.getStatus())
                && appt.getAppointmentTime().isBefore(LocalDateTime.now())) {
                appt.setStatus("COMPLETED");
                appointmentRepository.save(appt);
            }
        });

        return apptOpt;
    }

    @Override
    public Appointment updateAppointment(Long id, Appointment updated) {
        return appointmentRepository.findById(id).map(existing -> {
            existing.setDoctorName(updated.getDoctorName());
            existing.setAppointmentTime(updated.getAppointmentTime());
            existing.setReason(updated.getReason());
            existing.setStatus(updated.getStatus());

            if (updated.getPatient() != null && updated.getPatient().getId() != null) {
                Patient patient = patientRepository.findById(updated.getPatient().getId())
                        .orElseThrow(() -> new RuntimeException("Patient not found with id " + updated.getPatient().getId()));
                existing.setPatient(patient);
            }

            return appointmentRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Appointment not found with id " + id));
    }

    @Override
    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    @Override
    public List<Appointment> getAppointmentsByPatient(Patient patient) {
        List<Appointment> appointments = appointmentRepository.findByPatient(patient);

        // Auto-update patient ke appointments
        LocalDateTime now = LocalDateTime.now();
        for (Appointment appt : appointments) {
            if ("SCHEDULED".equalsIgnoreCase(appt.getStatus())
                && appt.getAppointmentTime().isBefore(now)) {
                appt.setStatus("COMPLETED");
                appointmentRepository.save(appt);
            }
        }

        return appointments;
    }

    @Override
    public List<Appointment> getUpcomingAppointments() {
        return appointmentRepository.findByAppointmentTimeAfterOrderByAppointmentTimeAsc(LocalDateTime.now());
    }

    @Override
    public List<Appointment> getAppointmentsBetween(LocalDateTime from, LocalDateTime to) {
        List<Appointment> appointments = appointmentRepository.findByAppointmentTimeBetween(from, to);

        // Auto-update between appointments
        LocalDateTime now = LocalDateTime.now();
        for (Appointment appt : appointments) {
            if ("SCHEDULED".equalsIgnoreCase(appt.getStatus())
                && appt.getAppointmentTime().isBefore(now)) {
                appt.setStatus("COMPLETED");
                appointmentRepository.save(appt);
            }
        }

        return appointments;
    }

    //  NEW: Cancel appointment method
    @Override
    public Appointment cancelAppointment(Long id) {
        return appointmentRepository.findById(id).map(existing -> {
            if ("COMPLETED".equalsIgnoreCase(existing.getStatus())) {
                throw new RuntimeException("Completed appointment cannot be cancelled");
            }
            existing.setStatus("CANCELLED");
            return appointmentRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Appointment not found with id " + id));
    }
}