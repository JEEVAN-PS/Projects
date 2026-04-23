import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { publicApi } from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalAppointments: 0,
    activeAppointments: 0,
    cancelledAppointments: 0,
    loading: true
  });

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showDoctors, setShowDoctors] = useState(false);

  const loadData = async () => {
    try {
      const doctorsRes = await publicApi.get("/doctors");
      const appointmentsRes = await publicApi.get("/appointments");

      const allAppointments = appointmentsRes.data;
      const active = allAppointments.filter((a) => a.status === "BOOKED").length;
      const cancelled = allAppointments.filter((a) => a.status === "CANCELLED").length;

      setDoctors(doctorsRes.data);
      setAppointments(allAppointments);

      setStats({
        totalDoctors: doctorsRes.data.length,
        totalAppointments: allAppointments.length,
        activeAppointments: active,
        cancelledAppointments: cancelled,
        loading: false
      });
    } catch (err) {
      console.error("Dashboard load error:", err);
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeAppointments = appointments.filter((a) => a.status === "BOOKED");
  const cancelledAppointments = appointments.filter((a) => a.status === "CANCELLED");

  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's your hospital management overview</p>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👨‍⚕️</div>
          <div>
            <h3>Total Doctors</h3>
            <h2>{stats.loading ? "..." : stats.totalDoctors}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div>
            <h3>Total Appointments</h3>
            <h2>{stats.loading ? "..." : stats.totalAppointments}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div>
            <h3>Active Appointments</h3>
            <h2>{stats.loading ? "..." : stats.activeAppointments}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div>
            <h3>Cancelled</h3>
            <h2>{stats.loading ? "..." : stats.cancelledAppointments}</h2>
          </div>
        </div>
      </div>

      {/* ACTIVE APPOINTMENTS */}
      {activeAppointments.length > 0 && (
        <div className="card">
          <h2>Recent Active Appointments</h2>
          {activeAppointments.map((apt) => (
            <div key={apt.id} className="appointment-item">
              <h4>{apt.patientName}</h4>
              <p>Doctor: {apt.doctorName}</p>
              <p>Queue: #{apt.queue}</p>
              <p>Date: {apt.appointmentDate || "Not Selected"}</p>
            </div>
          ))}
        </div>
      )}

      {/* CANCELLED APPOINTMENTS */}
      {cancelledAppointments.length > 0 && (
        <div className="card">
          <h2>Cancelled Appointments</h2>
          {cancelledAppointments.map((apt) => (
            <div key={apt.id} className="appointment-item cancelled">
              <h4>{apt.patientName}</h4>
              <p>Doctor: {apt.doctorName}</p>
              <p>Queue: #{apt.queue}</p>
              <p>Date: {apt.appointmentDate || "Not Selected"}</p>
            </div>
          ))}
        </div>
      )}

      {/* DOCTORS LIST */}
      {showDoctors && (
        <div className="card">
          <h2>👨‍⚕️ All Doctors ({doctors.length})</h2>
          {doctors.length > 0 ? (
            doctors.map((doc) => (
              <div key={doc.id} className="appointment-item">
                <h4>👨‍⚕️ Dr. {doc.name}</h4>
                <p><strong>Specialization:</strong> {doc.specialization}</p>
                <p><strong>Experience:</strong> {doc.experience} years</p>
                <p><strong>Available Days:</strong> {doc.availableDay || "Not Available"}</p>
                <p><strong>Timing:</strong> {doc.startTime} - {doc.endTime}</p>
              </div>
            ))
          ) : (
            <p>No doctors available</p>
          )}

          {/* Book Appointment button inside doctors section */}
          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <button
              onClick={() => navigate("/appointments")}
              style={{
                padding: "10px 24px",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "600"
              }}
            >
              📅 Book Appointment
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM BUTTONS */}
      <div className="bottom-buttons" style={{
        display: "flex",
        gap: "16px",
        marginTop: "24px",
        justifyContent: "center"
      }}>
        <button
          onClick={() => navigate("/appointments")}
          style={{
            padding: "12px 28px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "600",
            textDecoration: "none"
          }}
        >
          📅 Book Appointment
        </button>

        <button
          onClick={() => setShowDoctors(!showDoctors)}
          style={{
            padding: "12px 28px",
            backgroundColor: showDoctors ? "#dc2626" : "#16a34a",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "600"
          }}
        >
          {showDoctors ? "❌ Hide Doctors" : "👨‍⚕️ View Doctors"}
        </button>
      </div>

    </div>
  );
}

export default Dashboard;