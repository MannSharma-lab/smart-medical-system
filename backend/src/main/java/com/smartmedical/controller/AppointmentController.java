package com.smartmedical.controller;

import com.smartmedical.model.Appointment;
import com.smartmedical.model.Patient;
import com.smartmedical.service.AppointmentService;
import com.smartmedical.repository.PatientRepository;
import com.smartmedical.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    // Create appointment
    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody Appointment appointment) {
        if (appointment.getPatient() != null && appointment.getPatient().getId() != null) {
            Optional<Patient> p = patientRepository.findById(appointment.getPatient().getId());
            if (p.isEmpty())
                return ResponseEntity.badRequest()
                        .body("Patient not found with id: " + appointment.getPatient().getId());
            appointment.setPatient(p.get());
        }
        Appointment saved = appointmentService.createAppointment(appointment);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<Appointment> listAll() {
        return appointmentService.getAllAppointments();
    }

    // Upcoming appointments
    @GetMapping("/upcoming")
    public List<Appointment> upcoming() {
        return appointmentService.getUpcomingAppointments();
    }

    // Get by patient id
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getByPatient(@PathVariable Long patientId) {
        Optional<Patient> p = patientRepository.findById(patientId);
        if (p.isEmpty()) return ResponseEntity.badRequest().body("Patient not found");
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(p.get()));
    }

    // Between range
    @GetMapping("/range")
    public List<Appointment> range(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        return appointmentService.getAppointmentsBetween(from, to);
    }

    //  Filter by status and sort by appointment time (ascending)
    @GetMapping("/filter")
    public List<Appointment> filterAppointments(@RequestParam String status) {
        return appointmentRepository.findByStatusOrderByAppointmentTimeAsc(status);
    }

    //  Filter by status + date range + optional doctor name
    @GetMapping("/filterByStatusAndDate")
    public ResponseEntity<?> filterByStatusAndDate(
            @RequestParam String status,
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(required = false) String doctorName
    ) {
        try {
            List<Appointment> results;

            if (doctorName != null && !doctorName.trim().isEmpty()) {
                results = appointmentRepository
                        .findByStatusAndDoctorNameAndAppointmentTimeBetweenOrderByAppointmentTimeAsc(status, doctorName, from, to);
            } else {
                results = appointmentRepository
                        .findByStatusAndAppointmentTimeBetweenOrderByAppointmentTimeAsc(status, from, to);
            }

            return ResponseEntity.ok(results);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("❌ Invalid request. Please use date format: yyyy-MM-ddTHH:mm:ss (example: 2025-08-14T00:00:00)");
        }
    }

    //  Paginated, Sortable Appointment List
    @GetMapping("/paged")
    public ResponseEntity<?> getPagedAppointments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "appointmentTime") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String status
    ) {
        Sort sort = direction.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Appointment> result;

        if (status != null && !status.isEmpty()) {
            result = appointmentRepository.findByStatus(status, pageable);
        } else {
            result = appointmentRepository.findAll(pageable);
        }

        return ResponseEntity.ok(result);
    }

    //  Update appointment
    @PutMapping("/{id:\\d+}") // only matches numbers
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Appointment appointment) {
        try {
            Appointment updated = appointmentService.updateAppointment(id, appointment);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    //  Delete appointment
    @DeleteMapping("/{id:\\d+}") // only matches numbers
    public ResponseEntity<?> delete(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok("Deleted");
    }

    //  Get appointment by ID (number only)
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //  Cancel appointment
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Appointment> cancelAppointment(@PathVariable Long id) {
        Appointment cancelled = appointmentService.cancelAppointment(id);
        return ResponseEntity.ok(cancelled);
    }
}