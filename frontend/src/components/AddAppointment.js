import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function AddAppointment() {
  const [patients, setPatients] = useState([]);
  const [newAppt, setNewAppt] = useState({
    patientId: "",
    doctorName: "",
    appointmentTime: "",
    reason: "",
  });
  const [suggestedDoctor, setSuggestedDoctor] = useState(""); // ⭐ new

  const navigate = useNavigate();

  // Load patients for dropdown
  useEffect(() => {
    fetch("http://localhost:8080/api/patients")
      .then((res) => res.json())
      .then((data) => setPatients(data))
      .catch((err) => console.error("Error fetching patients:", err));
  }, []);

  // Simple specialization mapping
  const doctorSuggestions = [
    { keyword: "cough", doctor: "Pulmonologist - Dr. Khushal Sharma" },
    { keyword: "breath", doctor: "Pulmonologist - Dr. Khushal Sharma" },
    { keyword: "heart", doctor: "Cardiologist - Dr. Bruce Banner" },
    { keyword: "fever", doctor: "General Physician - Dr. Elon Musk" },
    { keyword: "tooth", doctor: "Dentist - Dr. Strange" },
    { keyword: "skin", doctor: "Dermatologist - Dr. Tony Stark" },
  ];

  const handlePatientChange = (e) => {
    const selectedId = e.target.value;
    setNewAppt({ ...newAppt, patientId: selectedId });

    const selectedPatient = patients.find((p) => p.id.toString() === selectedId);

    if (selectedPatient && selectedPatient.medicalHistory) {
      const history = selectedPatient.medicalHistory;
      setNewAppt((prev) => ({ ...prev, reason: history }));

      let matchedDoctor = "";
      for (let item of doctorSuggestions) {
        if (history.toLowerCase().includes(item.keyword)) {
          matchedDoctor = item.doctor;
          break;
        }
      }
      if (matchedDoctor) {
        setSuggestedDoctor(matchedDoctor);
        setNewAppt((prev) => ({ ...prev, doctorName: matchedDoctor }));
      } else {
        setSuggestedDoctor("No specific suggestion, choose manually");
      }
    }
  };

  const handleAdd = () => {
    fetch("http://localhost:8080/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient: { id: newAppt.patientId },
        doctorName: newAppt.doctorName,
        appointmentTime: newAppt.appointmentTime + ":00",
        reason: newAppt.reason,
        status: "SCHEDULED",
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save appointment");
        return res.json();
      })
      .then(() => {
        alert("✅ Appointment Saved!");
        navigate("/"); // redirect to list
      })
      .catch((err) => alert("❌ Error: " + err.message));
  };

  return (
    <motion.div
      className="card p-4 shadow w-75 mx-auto" // ⭐ wider card
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h3 className="mb-3">➤ Add Appointment</h3>

      {/* Patient Dropdown */}
      <motion.select
        className="form-control mb-2 w-[8000px]"
        value={newAppt.patientId}
        onChange={handlePatientChange}
        required
        whileFocus={{ scale: 1.03, boxShadow: "0px 0px 8px #28a745" }}
      >
        <option value="">-- Select Patient --</option>
        {patients.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} (ID: {p.id})
          </option>
        ))}
      </motion.select>

      {/* Suggested Doctor Info */}
      {suggestedDoctor && (
        <motion.div
          className="alert alert-info p-2 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          💡 Suggested: <b>{suggestedDoctor}</b>
        </motion.div>
      )}

      <motion.input
        type="text"
        className="form-control mb-2"
        placeholder="Doctor Name"
        value={newAppt.doctorName}
        onChange={(e) =>
          setNewAppt({ ...newAppt, doctorName: e.target.value })
        }
        required
        whileFocus={{ scale: 1.03, boxShadow: "0px 0px 8px #28a745" }}
      />

      <motion.input
        type="datetime-local"
        className="form-control mb-2"
        value={newAppt.appointmentTime}
        onChange={(e) =>
          setNewAppt({ ...newAppt, appointmentTime: e.target.value })
        }
        required
        whileFocus={{ scale: 1.03, boxShadow: "0px 0px 8px #28a745" }}
      />

      <motion.input
        type="text"
        className="form-control mb-2"
        placeholder="Reason"
        value={newAppt.reason}
        onChange={(e) =>
          setNewAppt({ ...newAppt, reason: e.target.value })
        }
        required
        whileFocus={{ scale: 1.03, boxShadow: "0px 0px 8px #28a745" }}
      />

      <motion.button
        className="btn btn-success"
        onClick={handleAdd}
        whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px #28a745" }}
        whileTap={{ scale: 0.95 }}
      >
        Save Appointment
      </motion.button>
    </motion.div>
  );
}

export default AddAppointment;