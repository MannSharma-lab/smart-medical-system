import React, { useState } from "react";
import { motion } from "framer-motion";

function AddPatient() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    medicalHistory: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        alert("✅ Patient Added!");
        setFormData({ name: "", age: "", email: "", phone: "", medicalHistory: "" });
      })
      .catch((err) => alert("❌ Error: " + err.message));
  };

  return (
    <motion.div
      className="card p-4 shadow"
      initial={{ opacity: 0, y: 50 }}   // page load par neeche se aayega
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.h3
        className="mb-3"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        ➕ Add Patient
      </motion.h3>

      <form onSubmit={handleSubmit}>
        <motion.input
          type="text"
          name="name"
          className="form-control mb-2"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          whileFocus={{ scale: 1.05, borderColor: "#28a745" }}
          required
        />
        <motion.input
          type="number"
          name="age"
          className="form-control mb-2"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          whileFocus={{ scale: 1.05, borderColor: "#28a745" }}
          required
        />
        <motion.input
          type="email"
          name="email"
          className="form-control mb-2"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          whileFocus={{ scale: 1.05, borderColor: "#28a745" }}
          required
        />
        <motion.input
          type="text"
          name="phone"
          className="form-control mb-2"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          whileFocus={{ scale: 1.05, borderColor: "#28a745" }}
          required
        />
        <motion.textarea
          name="medicalHistory"
          className="form-control mb-2"
          placeholder="Medical History"
          value={formData.medicalHistory}
          onChange={handleChange}
          whileFocus={{ scale: 1.05, borderColor: "#28a745" }}
          required
        />

        <motion.button
          type="submit"
          className="btn btn-success w-100"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Save Patient
        </motion.button>
      </form>
    </motion.div>
  );
}

export default AddPatient;