import { useEffect, useState } from "react";
import api from "../services/api";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [role, setRole] = useState(localStorage.getItem("role"));

  const loadDoctors = () => {
    api.get("/doctors")
      .then(res => setDoctors(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    const currentRole = localStorage.getItem("role");
    setRole(currentRole);
    loadDoctors();
  }, []);

  return (
    <div>
      <h2>👨‍⚕️ Doctors</h2>

      <h3>All Doctors</h3>

      {doctors.length === 0 ? (
        <p>No doctors available</p>
      ) : (
        doctors.map((d) => (
          <div style={{ backgroundColor: "#fff", padding: "15px", marginBottom: "10px", borderRadius: "8px", border: "1px solid #ddd" }} key={d.id}>
            <h4>{d.name}</h4>
            <p><strong>Specialization:</strong> {d.specialization}</p>
            <p><strong>Experience:</strong> {d.experience} years</p>
            <p><strong>Available:</strong> {d.availableDay} ({d.startTime} - {d.endTime})</p>

            {role === "ADMIN" && (
              <button
                style={{ backgroundColor: "#ef4444", color: "white", padding: "8px 15px", border: "none", cursor: "pointer" }}
              >
                Delete Doctor
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Doctors;
