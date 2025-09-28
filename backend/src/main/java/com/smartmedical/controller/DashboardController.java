package com.smartmedical.controller;

import com.smartmedical.dto.DashboardStats;
import com.smartmedical.model.Appointment;
import com.smartmedical.repository.AppointmentRepository;
import com.smartmedical.repository.PatientRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // frontend ke liye CORS
public class DashboardController {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    public DashboardController(PatientRepository patientRepository,
                               AppointmentRepository appointmentRepository) {
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping("/dashboard")
    public DashboardStats getDashboard() {
        DashboardStats out = new DashboardStats();

        long totalPatients = patientRepository.count();
        List<Appointment> appts = appointmentRepository.findAll();
        long totalAppointments = appts.size();

        // Upcoming = aaj/abhi ke baad wali SCHEDULED
        LocalDateTime now = LocalDateTime.now();
        long upcoming = appts.stream()
                .filter(a -> a.getAppointmentTime() != null
                        && a.getAppointmentTime().isAfter(now)
                        && a.getStatus() != null
                        && a.getStatus().equalsIgnoreCase("SCHEDULED"))
                .count();

        // Status breakdown
        Map<String, Long> statusMap = appts.stream()
                .collect(Collectors.groupingBy(
                        a -> Optional.ofNullable(a.getStatus()).orElse("UNKNOWN"),
                        Collectors.counting()
                ));

        // Doctor wise count
        Map<String, Long> doctorMap = appts.stream()
                .collect(Collectors.groupingBy(
                        a -> Optional.ofNullable(a.getDoctorName()).orElse("Unknown"),
                        Collectors.counting()
                ));

        // Per-day line chart data (yyyy-MM-dd)
        Map<String, Long> perDayMap = appts.stream()
                .filter(a -> a.getAppointmentTime() != null)
                .collect(Collectors.groupingBy(
                        a -> a.getAppointmentTime().toLocalDate().toString(),
                        Collectors.counting()
                ));

        out.setTotalPatients(totalPatients);
        out.setTotalAppointments(totalAppointments);
        out.setUpcomingAppointments(upcoming);
        out.setStatusBreakdown(sortByKey(statusMap));
        out.setAppointmentsPerDoctor(sortByValueDesc(doctorMap));
        out.setAppointmentsPerDay(sortByKey(perDayMap)); // date asc

        return out;
    }

    // helper: sort map by key (ascending)
    private static Map<String, Long> sortByKey(Map<String, Long> map) {
        return map.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (a, b) -> a,
                        LinkedHashMap::new
                ));
    }

    // helper: sort by value desc
    private static Map<String, Long> sortByValueDesc(Map<String, Long> map) {
        return map.entrySet().stream()
                .sorted(Collections.reverseOrder(Map.Entry.comparingByValue()))
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (a, b) -> a,
                        LinkedHashMap::new
                ));
    }
}