import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserInjured, FaUserMd, FaClock, FaEdit, FaTrash } from "react-icons/fa";

function AppointmentBoard() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentAppt, setCurrentAppt] = useState(null);

  // Fetch appointments from backend
  useEffect(() => {
    fetch("http://localhost:8080/api/appointments")
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch((err) => console.error("Error fetching appointments:", err));
  }, []);

  // Format time
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case "SCHEDULED":
        return <span className="badge bg-primary">Scheduled</span>;
      case "COMPLETED":
        return <span className="badge bg-success">Completed</span>;
      case "CANCELLED":
        return <span className="badge bg-danger">Cancelled</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  // Open edit modal
  const handleEdit = (appt) => {
    setCurrentAppt({ ...appt });
    setShowModal(true);
  };

  // --- helper: normalize time to "yyyy-MM-ddTHH:mm:ss"
  const normalizeToSeconds = (t) => {
    if (!t) return null;
    // already with seconds -> keep
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(t)) return t;
    // from <input type="datetime-local"> -> "yyyy-MM-ddTHH:mm"
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(t)) return t + ":00";
    // Last fallback: trim to 19 chars if longer
    return t.slice(0, 19);
  };

  // Save (PUT)
  const handleSave = async () => {
    try {
      const payload = {
        id: currentAppt.id,
        doctorName: currentAppt.doctorName,
        reason: currentAppt.reason,
        status: currentAppt.status,
        appointmentTime: normalizeToSeconds(currentAppt.appointmentTime),
       
        patient: currentAppt.patient?.id ? { id: currentAppt.patient.id } : null,
      };

      const res = await fetch(
        `http://localhost:8080/api/appointments/${currentAppt.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} - ${text || "Update failed"}`);
      }

      const updated = await res.json();
      setAppointments((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
      setShowModal(false);
    } catch (err) {
      console.error("Error updating appointment:", err);
      alert(`Update failed: ${err.message}`);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?"))
      return;

    try {
      await fetch(`http://localhost:8080/api/appointments/${id}`, {
        method: "DELETE",
      });
      setAppointments(appointments.filter((appt) => appt.id !== id));
    } catch (err) {
      console.error("Error deleting appointment:", err);
    }
  };

  // Cancel
  const handleCancel = (id) => {
    if (!window.confirm("Cancel this appointment?")) return;

    fetch(`http://localhost:8080/api/appointments/${id}/cancel`, {
      method: "PUT",
    })
      .then((res) => res.json())
      .then(() => {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: "CANCELLED" } : a))
        );
      })
      .catch((err) => console.error("Error cancelling appointment:", err));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📅 Appointment Board</h2>

      {/* Search bar */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by Patient, Doctor, Patient ID, or Appointment ID..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {appointments.length === 0 ? (
        <div className="alert alert-info text-center">
          No appointments to show yet.
        </div>
      ) : (
        <table className="table table-striped table-bordered table-hover shadow">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Time</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments
              .filter((a) => {
                const q = filter.trim().toLowerCase();
                if (!q) return true;
                return (
                  a.patient?.name?.toLowerCase().includes(q) ||
                  a.doctorName?.toLowerCase().includes(q) ||
                  a.patient?.id?.toString().includes(q) ||
                  a.id?.toString().includes(q)
                );
              })
              .map((appt) => (
                <tr key={appt.id}>
                  <td>{appt.id}</td>
                  <td>
                    <FaUserInjured className="text-danger me-2" />
                    {appt.patient?.name || "Unknown"}
                    {appt.patient?.id != null ? ` (ID: ${appt.patient.id})` : ""}
                  </td>
                  <td>
                    <FaUserMd className="text-primary me-2" />
                    {appt.doctorName}
                  </td>
                  <td>
                    <FaClock className="text-warning me-2" />
                    {formatDate(appt.appointmentTime)}
                  </td>
                  <td>{appt.reason}</td>
                  <td>{getStatusBadge(appt.status)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(appt)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger me-2"
                      onClick={() => handleDelete(appt.id)}
                    >
                      <FaTrash />
                    </button>
                    {appt.status &&
                      appt.status.toUpperCase() === "SCHEDULED" && (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleCancel(appt.id)}
                        >
                          Cancel
                        </button>
                      )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      {showModal && currentAppt && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Appointment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <label>ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={currentAppt.id}
                    readOnly
                  />
                </div>

                {/* Patient Name read-only, because it belongs to Patient entity */}
                <div className="mb-2">
                  <label>Patient Name (read-only)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={currentAppt.patient?.name || ""}
                    readOnly
                  />
                  <small className="text-muted">
                    Edit all the changes correctly.
                  </small>
                </div>

                <div className="mb-2">
                  <label>Doctor Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={currentAppt.doctorName || ""}
                    onChange={(e) =>
                      setCurrentAppt({
                        ...currentAppt,
                        doctorName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-2">
                  <label>Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={
                      currentAppt.appointmentTime
                        ? currentAppt.appointmentTime.slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      setCurrentAppt({
                        ...currentAppt,
                        appointmentTime: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-2">
                  <label>Reason</label>
                  <input
                    type="text"
                    className="form-control"
                    value={currentAppt.reason || ""}
                    onChange={(e) =>
                      setCurrentAppt({ ...currentAppt, reason: e.target.value })
                    }
                  />
                </div>

                <div className="mb-2">
                  <label>Status</label>
                  <select
                    className="form-select"
                    value={currentAppt.status || "SCHEDULED"}
                    onChange={(e) =>
                      setCurrentAppt({ ...currentAppt, status: e.target.value })
                    }
                  >
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentBoard;