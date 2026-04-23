import { useEffect, useState } from "react";
import { publicApi, privateApi } from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalAppointments: 0,
    activeAppointments: 0
  });

  const [recentAppointments, setRecentAppointments] = useState([]);

  const loadData = () => {
    // ✅ Public endpoint (if doctors is public)
    publicApi.get("/doctors")
      .then(res => {
        setStats(prev => ({ ...prev, totalDoctors: res.data.length }));
      })
      .catch(err => console.log(err));

    // ✅ Use privateApi if appointments need auth
    privateApi.get("/appointments")
      .then(res => {
        const appointments = res.data;
        const active = appointments.filter(a => a.status === "BOOKED").length;
        
        setStats(prev => ({
          ...prev,
          totalAppointments: appointments.length,
          activeAppointments: active
        }));

        setRecentAppointments(appointments.slice(0, 5));
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    loadData();
    
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">
            Welcome back! Here's your hospital management overview
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card doctors-stat">
          <div className="stat-icon">👨‍⚕️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalDoctors}</div>
            <div className="stat-label">Total Doctors</div>
          </div>
        </div>

        <div className="stat-card appointments-stat">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalAppointments}</div>
            <div className="stat-label">Total Appointments</div>
          </div>
        </div>

        <div className="stat-card active-stat">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.activeAppointments}</div>
            <div className="stat-label">Active Appointments</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="appointments-section">
          <div className="section-header">
            <h2>Recent Appointments</h2>
            <span className="badge">{recentAppointments.length}</span>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No appointments yet</p>
            </div>
          ) : (
            <div className="appointments-list">
              {recentAppointments.map((apt, idx) => (
                <div key={apt.id} className="appointment-card">
                  <div className="appointment-header">
                    <h3>{apt.patientName}</h3>
                    <span className={`status ${apt.status.toLowerCase()}`}>
                      {apt.status === "BOOKED" ? "✓ Active" : "✕ Cancelled"}
                    </span>
                  </div>

                  <div className="appointment-details">
                    <div className="detail-item">
                      <span className="label">👨‍⚕️ Doctor</span>
                      <span className="value">{apt.doctorName || "Unassigned"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">🎫 Queue</span>
                      <span className="value">#{apt.queue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="info-section">
          <div className="info-card">
            <h3>Quick Stats</h3>
            <div className="quick-stat">
              <span className="stat-name">Avg Queue Length</span>
              <span className="stat-number">
                {stats.totalAppointments > 0 
                  ? Math.ceil(stats.totalAppointments / Math.max(stats.totalDoctors, 1))
                  : 0}
              </span>
            </div>
            <div className="quick-stat">
              <span className="stat-name">System Status</span>
              <span className="stat-status online">● Online</span>
            </div>
          </div>

          <div className="info-card">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <a href="/appointments" className="action-btn">
                📅 Book Appointment
              </a>
              <a href="/doctors" className="action-btn">
                👨‍⚕️ View Doctors
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;