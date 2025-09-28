// dashboard.jsx
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { Table } from "react-bootstrap";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/dashboard")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch((e) => console.error("Dashboard load error:", e))
      .finally(() => setLoading(false));

    fetch("http://localhost:8080/api/appointments")
      .then((r) => r.json())
      .then((data) => {
        const sorted = data.sort(
          (a, b) => new Date(b.appointmentTime) - new Date(a.appointmentTime)
        );
        setAppointments(sorted.slice(0, 5));
        setFilteredAppointments(sorted.slice(0, 5));
      })
      .catch((e) => console.error("Appointments load error:", e));
  }, []);

  if (loading) return <div className="container mt-4">⏳ Loading dashboard...</div>;
  if (!stats) return <div className="container mt-4">❌ Failed to load dashboard.</div>;

  // Export to CSV
  const exportToCSV = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Patients", stats.totalPatients],
      ["Total Appointments", stats.totalAppointments],
      ["Upcoming Appointments", stats.upcomingAppointments],
      ["--- Recent Appointments ---", ""],
      ["Patient", "Doctor", "Date/Time", "Status"],
      ...appointments.map((a) => [
        a.patient?.name || "Unknown",
        a.doctorName,
        new Date(a.appointmentTime).toLocaleString(),
        a.status,
      ]),
    ];

    let csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "dashboard_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Smart Medical System - Dashboard Report", 14, 20);

    doc.setFontSize(12);
    doc.text("Summary Stats:", 14, 30);
    autoTable(doc, {
      startY: 35,
      head: [["Metric", "Value"]],
      body: [
        ["Total Patients", stats.totalPatients],
        ["Total Appointments", stats.totalAppointments],
        ["Upcoming Appointments", stats.upcomingAppointments],
      ],
    });

    let finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 60;
    doc.text("Recent Appointments:", 14, finalY + 10);
    autoTable(doc, {
      startY: finalY + 15,
      head: [["Patient", "Doctor", "Date/Time", "Status"]],
      body: appointments.map((a) => [
        a.patient?.name || "Unknown",
        a.doctorName,
        new Date(a.appointmentTime).toLocaleString(),
        a.status,
      ]),
    });

    doc.save("dashboard_report.pdf");
  };

  const doctorData = Object.entries(stats.appointmentsPerDoctor || {}).map(
    ([name, value]) => ({ name, value })
  );
  const statusData = Object.entries(stats.statusBreakdown || {}).map(
    ([name, value]) => ({ name, value })
  );
  const perDayData = Object.entries(stats.appointmentsPerDay || {}).map(
    ([date, value]) => ({ date, value })
  );
  const COLORS = ["#28a745", "#007bff", "#ffc107", "#dc3545"];

  return (
    <motion.div
      className="container mt-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="mb-4">📊 Smart Dashboard</h2>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <motion.div className="col-md-3" whileHover={{ scale: 1.05 }}>
          <div className="card shadow-sm p-3 bg-light border-0">
            <h6 className="text-muted mb-1">Total Patients</h6>
            <h3 className="mb-0 text-primary">{stats.totalPatients}</h3>
          </div>
        </motion.div>
        <motion.div className="col-md-3" whileHover={{ scale: 1.05 }}>
          <div className="card shadow-sm p-3 bg-light border-0">
            <h6 className="text-muted mb-1">Total Appointments</h6>
            <h3 className="mb-0 text-success">{stats.totalAppointments}</h3>
          </div>
        </motion.div>
        <motion.div className="col-md-3" whileHover={{ scale: 1.05 }}>
          <div className="card shadow-sm p-3 bg-light border-0">
            <h6 className="text-muted mb-1">Upcoming (Scheduled)</h6>
            <h3 className="mb-0 text-warning">{stats.upcomingAppointments}</h3>
          </div>
        </motion.div>
      </div>

      {/* Today's Snapshot */}
      <div className="row g-3 mb-4">
        <motion.div className="col-md-4" whileHover={{ scale: 1.05 }}>
          <div className="card shadow-sm p-3 bg-white border-0">
            <h6 className="text-muted mb-1">Today's Appointments</h6>
            <h3 className="mb-0 text-primary">{stats.todayAppointments || 0}</h3>
          </div>
        </motion.div>
        <motion.div className="col-md-4" whileHover={{ scale: 1.05 }}>
          <div className="card shadow-sm p-3 bg-white border-0">
            <h6 className="text-muted mb-1">Today Completed</h6>
            <h3 className="mb-0 text-success">{stats.todayCompleted || 0}</h3>
          </div>
        </motion.div>
        <motion.div className="col-md-4" whileHover={{ scale: 1.05 }}>
          <div className="card shadow-sm p-3 bg-white border-0">
            <h6 className="text-muted mb-1">Today Pending</h6>
            <h3 className="mb-0 text-warning">{stats.todayPending || 0}</h3>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm p-3 h-100">
            <h5 className="mb-3">Appointments per Doctor</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={doctorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Appointments" fill="#007bff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card shadow-sm p-3 h-100">
            <h5 className="mb-3">Status Breakdown</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {statusData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-12">
          <div className="card shadow-sm p-3">
            <h5 className="mb-3">Appointments per Day</h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={perDayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Appointments"
                  stroke="#28a745"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="row g-3 mt-4">
        {doctorData.some((doc) => doc.value > 20) && (
          <div className="col-12">
            <div className="alert alert-danger shadow-sm">
              ⚠ Some doctors have more than 20 appointments today!
            </div>
          </div>
        )}
        {(() => {
          const total = statusData.reduce((sum, s) => sum + s.value, 0);
          const cancelled = statusData.find((s) => s.name === "CANCELLED")?.value || 0;
          const ratio = total > 0 ? (cancelled / total) * 100 : 0;
          if (ratio > 30) {
            return (
              <div className="col-12">
                <div className="alert alert-warning shadow-sm">
                  ⚠ Cancellation rate is high ({ratio.toFixed(1)}%) — please investigate.
                </div>
              </div>
            );
          }
          return null;
        })()}
      </div>

      {/* Recent Appointments */}
      <div className="card shadow-sm p-3 mt-4">
        <h5 className="mb-3">📅 Recent Appointments</h5>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date/Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appt) => (
                <tr key={appt.id}>
                  <td>{appt.patient?.name || "Unknown"}</td>
                  <td>{appt.doctorName}</td>
                  <td>{new Date(appt.appointmentTime).toLocaleString()}</td>
                  <td>{appt.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No appointments found</td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Export Dropdown */}
        <div className="mt-4 text-end dropdown">
          <button
            className="btn btn-outline-primary dropdown-toggle"
            type="button"
            id="exportMenu"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            ⏬ Export Dashboard
          </button>
          <ul className="dropdown-menu" aria-labelledby="exportMenu">
            <li>
              <button className="dropdown-item" onClick={exportToCSV}>
                Export as CSV
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={exportToPDF}>
                Export as PDF
              </button>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;