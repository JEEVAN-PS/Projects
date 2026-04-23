import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { publicApi, privateApi } from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalAppointments: 0,
    activeAppointments: 0,
    cancelledAppointments: 0,
    loading: true
  });

  const [appointments, setAppointments] = useState([]);

  const loadData = async () => {
    try {
      // 🔐 SECURED API (requires token)
      const doctorsRes = await publicApi.get("/doctors");

      // 🌐 PUBLIC API
      const appointmentsRes = await publicApi.get("/appointments");

      const allAppointments = appointmentsRes.data;

      const active = allAppointments.filter(a => a.status === "BOOKED").length;
      const cancelled = allAppointments.filter(a => a.status === "CANCELLED").length;

      setAppointments(allAppointments);

      setStats({
        totalDoctors: doctorsRes.data.length,
        totalAppointments: allAppointments.length,
        activeAppointments: active,
        cancelledAppointments: cancelled,
        loading: false
      });

    } catch (err) {
      console.error("❌ Dashboard load error:", err);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    loadData();

    const interval = setInterval(loadData, 5000); // ⏱️ reduced spam (was 2s)
    return () => clearInterval(interval);
  }, []);

  // Derived data
  const activeAppointments = appointments.filter(a => a.status === "BOOKED");
  const cancelledAppointments = appointments.filter(a => a.status === "CANCELLED");

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back! Here's your hospital management overview</h1>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">👨‍⚕️</div>
          <div className="stat-content">
            <h3>Total Doctors</h3>
            <div className="stat-number">
              {stats.loading ? "..." : stats.totalDoctors}
            </div>
            <p>Available specialists</p>
          </div>
        </div>

        <div className="stat-card stat-card-secondary">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Total Appointments</h3>
            <div className="stat-number">
              {stats.loading ? "..." : stats.totalAppointments}
            </div>
            <p>All bookings</p>
          </div>
        </div>

        <div className="stat-card stat-card-success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Active</h3>
            <div className="stat-number">
              {stats.loading ? "..." : stats.activeAppointments}
            </div>
            <p>Confirmed bookings</p>
          </div>
        </div>

        <div className="stat-card stat-card-danger">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>Cancelled</h3>
            <div className="stat-number">
              {stats.loading ? "..." : stats.cancelledAppointments}
            </div>
            <p>Cancelled bookings</p>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="dashboard-cards">
        <div className="card card-feature">
          <div className="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="card-body">
            <div className="actions-grid">
              <Link to="/doctors" className="action-button">👨‍⚕️ View Doctors</Link>
              <Link to="/appointments" className="action-button">📅 Book Appointment</Link>
              <Link to="/change-password" className="action-button">🔐 Account Settings</Link>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE */}
      {activeAppointments.length > 0 && (
        <div className="card card-feature">
          <h2>Recent Active Appointments</h2>
          {activeAppointments.map(apt => (
            <div key={apt.id} className="appointment-item active">
              <h4>{apt.patientName}</h4>
              <p>Doctor: {apt.doctorName}</p>
              <p>Queue: #{apt.queue}</p>
            </div>
          ))}
        </div>
      )}

      {/* CANCELLED */}
      {cancelledAppointments.length > 0 && (
        <div className="card card-feature">
          <h2>Cancelled Appointments</h2>
          {cancelledAppointments.map(apt => (
            <div key={apt.id} className="appointment-item cancelled">
              <h4>{apt.patientName}</h4>
              <p>Doctor: {apt.doctorName}</p>
              <p>Queue: #{apt.queue}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;