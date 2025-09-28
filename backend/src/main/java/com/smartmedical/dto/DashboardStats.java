package com.smartmedical.dto;

import java.util.Map;

public class DashboardStats {
    private long totalPatients;
    private long totalAppointments;
    private long upcomingAppointments; // next-time insight
    private Map<String, Long> appointmentsPerDoctor;
    private Map<String, Long> statusBreakdown;
    private Map<String, Long> appointmentsPerDay; // yyyy-MM-dd -> count

    public long getTotalPatients() { return totalPatients; }
    public void setTotalPatients(long totalPatients) { this.totalPatients = totalPatients; }

    public long getTotalAppointments() { return totalAppointments; }
    public void setTotalAppointments(long totalAppointments) { this.totalAppointments = totalAppointments; }

    public long getUpcomingAppointments() { return upcomingAppointments; }
    public void setUpcomingAppointments(long upcomingAppointments) { this.upcomingAppointments = upcomingAppointments; }

    public Map<String, Long> getAppointmentsPerDoctor() { return appointmentsPerDoctor; }
    public void setAppointmentsPerDoctor(Map<String, Long> appointmentsPerDoctor) { this.appointmentsPerDoctor = appointmentsPerDoctor; }

    public Map<String, Long> getStatusBreakdown() { return statusBreakdown; }
    public void setStatusBreakdown(Map<String, Long> statusBreakdown) { this.statusBreakdown = statusBreakdown; }

    public Map<String, Long> getAppointmentsPerDay() { return appointmentsPerDay; }
    public void setAppointmentsPerDay(Map<String, Long> appointmentsPerDay) { this.appointmentsPerDay = appointmentsPerDay; }
}