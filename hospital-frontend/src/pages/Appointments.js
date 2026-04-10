import { useEffect, useState } from "react";
import api from "../services/api";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const loadAppointments = () => {
    api.get("/appointments")
      .then(res => {
        console.log("Appointments loaded:", res.data);
        setAppointments(res.data);
      })
      .catch(err => console.log("Error loading appointments:", err));
  };

  const loadDoctors = () => {
    api.get("/doctors")
      .then(res => setDoctors(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    loadAppointments();
    loadDoctors();
    
    const interval = setInterval(() => {
      loadAppointments();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const bookAppointment = async () => {
    if (!patientName.trim()) {
      alert("Enter patient name");
      return;
    }

    if (!selectedDoctor) {
      alert("Please select a doctor");
      return;
    }

    try {
      console.log("Booking appointment for doctor ID:", selectedDoctor);
      
      await api.post("/appointments", {
        patientName,
        doctor: {
          id: parseInt(selectedDoctor)
        }
      });

      setPatientName("");
      setSelectedDoctor("");
      
      setTimeout(() => {
        loadAppointments();
      }, 500);
      
      alert("Appointment booked successfully");
    } catch (err) {
      console.error("Booking error:", err);
      alert("Error booking appointment: " + err.response?.data);
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.put(`/appointments/cancel/${id}`);
      
      setTimeout(() => {
        loadAppointments();
      }, 500);
      
      alert("Appointment cancelled");
    } catch (err) {
      console.error(err);
      alert("Error cancelling appointment");
    }
  };

  return (
    <div>
      <h2>📅 Appointments</h2>

      <div style={{ backgroundColor: "#f0f0f0", padding: "20px", marginBottom: "20px", borderRadius: "8px" }}>
        <h3>Book Appointment</h3>

        <input
          placeholder="Patient Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box" }}
        />

        <select
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box" }}
        >
          <option value="">-- Select Doctor --</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name} - {doctor.specialization}
            </option>
          ))}
        </select>

        <button 
          onClick={bookAppointment}
          style={{ width: "100%", padding: "10px", backgroundColor: "#10b981", color: "white", border: "none", cursor: "pointer" }}
        >
          Book Appointment
        </button>
      </div>

      <h3>All Appointments</h3>

      {appointments.length === 0 ? (
        <p>No appointments</p>
      ) : (
        appointments.map((a) => (
          <div style={{ backgroundColor: "#fff", padding: "15px", marginBottom: "10px", borderRadius: "8px", border: "1px solid #ddd" }} key={a.id}>
            <h3>{a.patientName}</h3>

            <p>Doctor: {a.doctorName || "Not Assigned"}</p>

            <p>Queue No: {a.queue}</p>

            <p>
              Status: {a.status === "CANCELLED" ? "❌ Cancelled" : "✅ Active"}
            </p>

            <button 
              onClick={() => handleCancel(a.id)}
              style={{ backgroundColor: a.status === "CANCELLED" ? "#10b981" : "#ef4444", color: "white", padding: "8px 15px", border: "none", cursor: "pointer" }}
            >
              {a.status === "CANCELLED" ? "Undo" : "Cancel"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Appointments;
