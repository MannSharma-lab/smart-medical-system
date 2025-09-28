import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import AppointmentBoard from "./components/AppointmentBoard";
import AddAppointment from "./components/AddAppointment";
import AddPatient from "./components/AddPatient";
import Dashboard from "./pages/Dashboard"; 
import ChatBot from "./pages/ChatBot"; 

function App() {

  return (
      <div className="container text-center mt-4">
        {/* Heading */}
        <h1 className="mb-4">🏥 Smart Medical System</h1>

        {/* Navigation buttons */}
        <div className="mb-4">
          <Link to="/dashboard" className="btn btn-warning mx-2">
            📊 Dashboard
          </Link>
		   <Link to="/chatbot" className="btn btn-primary mx-2">
            🤖 ChatBot
          </Link>
          <Link to="/appointments" className="btn btn-primary mx-2">
           🩺 Appointments
          </Link>
          <Link to="/add-appointment" className="btn btn-success mx-2">
            ✔ + Add Appointment
          </Link>
          <Link to="/add-patient" className="btn btn-info mx-2">
           🤧 + Add Patient
          </Link>
        </div>

        {/* Routes */}
        <div className="mt-3">
          <Routes>
            <Route
              path="/"
              element={<h2>Welcome to Smart Medical System 🚀</h2>}
            />
            <Route path="/dashboard" element={<Dashboard />} />
			<Route path="/chatbot" element={<ChatBot />} />
            <Route path="/appointments" element={<AppointmentBoard />} />
            <Route path="/add-appointment" element={<AddAppointment />} />
            <Route path="/add-patient" element={<AddPatient />} />
          </Routes>
        </div>
      </div>
  );
}

export default App;