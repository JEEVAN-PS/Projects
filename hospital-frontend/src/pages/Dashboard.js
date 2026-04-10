import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalAppointments: 0,
    activeAppointments: 0
  });

  const loadData = () => {
    api.get("/doctors")
      .then(res => {
        setStats(prev => ({ ...prev, totalDoctors: res.data.length }));
      })
      .catch(err => console.log(err));

    api.get("/appointments")
      .then(res => {
        const appointments = res.data;
        const active = appointments.filter(a => a.status === "BOOKED").length;
        
        setStats(prev => ({
          ...prev,
          totalAppointments: appointments.length,
          activeAppointments: active
        }));
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    loadData();
    
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>📊 Dashboard</h2>

      <div style={{ backgroundColor: "#fff", padding: "20px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #ddd" }}>
        <h3>Total Doctors</h3>
        <p style={{ fontSize: "32px", fontWeight: "bold", color: "#2563eb" }}>{stats.totalDoctors}</p>
      </div>

      <div style={{ backgroundColor: "#fff", padding: "20px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #ddd" }}>
        <h3>Total Appointments</h3>
        <p style={{ fontSize: "32px", fontWeight: "bold", color: "#7c3aed" }}>{stats.totalAppointments}</p>
      </div>

      <div style={{ backgroundColor: "#fff", padding: "20px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #ddd" }}>
        <h3>Active Appointments</h3>
        <p style={{ fontSize: "32px", fontWeight: "bold", color: "#10b981" }}>{stats.activeAppointments}</p>
      </div>
    </div>
  );
}

export default Dashboard;
