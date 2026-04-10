import { useEffect, useState } from "react";
import api from "../services/api";

function Admin() {
  const [doctors, setDoctors] = useState([]);
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [availableDay, setAvailableDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const loadDoctors = () => {
    api.get("/doctors")
      .then(res => setDoctors(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const addDoctor = async () => {
    if (!name.trim() || !specialization.trim() || !experience || !availableDay || !startTime || !endTime) {
      alert("Fill all fields");
      return;
    }

    try {
      await api.post("/doctors", {
        name,
        specialization,
        experience: parseInt(experience),
        availableDay,
        startTime,
        endTime
      });

      setName("");
      setSpecialization("");
      setExperience("");
      setAvailableDay("");
      setStartTime("");
      setEndTime("");
      loadDoctors();
      alert("Doctor added successfully");
    } catch (err) {
      console.error(err);
      alert("Error adding doctor");
    }
  };

  const deleteDoctor = async (id, doctorName) => {
    if (window.confirm(`Delete Dr. ${doctorName}?`)) {
      try {
        await api.delete(`/doctors/${id}`);
        alert("Doctor deleted");
        loadDoctors();
      } catch (err) {
        alert("Error deleting doctor");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>👨‍💼 Admin Panel - Manage Doctors</h2>

      <div style={{ backgroundColor: "#f0f0f0", padding: "20px", marginBottom: "20px", borderRadius: "8px" }}>
        <h3>Add New Doctor</h3>

        <input
          placeholder="Doctor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box" }}
        />

        <input
          placeholder="Specialization"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box" }}
        />

        <input
          type="number"
          placeholder="Experience (years)"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box" }}
        />

        <select
          value={availableDay}
          onChange={(e) => setAvailableDay(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box" }}
        >
          <option value="">-- Select Available Day --</option>
          <option value="MONDAY">Monday</option>
          <option value="TUESDAY">Tuesday</option>
          <option value="WEDNESDAY">Wednesday</option>
          <option value="THURSDAY">Thursday</option>
          <option value="FRIDAY">Friday</option>
          <option value="SATURDAY">Saturday</option>
          <option value="SUNDAY">Sunday</option>
        </select>

        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box" }}
        />

        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box" }}
        />

        <button 
          onClick={addDoctor}
          style={{ width: "100%", padding: "10px", backgroundColor: "#2563eb", color: "white", border: "none", cursor: "pointer" }}
        >
          Add Doctor
        </button>
      </div>

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

            <button
              onClick={() => deleteDoctor(d.id, d.name)}
              style={{ backgroundColor: "#ef4444", color: "white", padding: "8px 15px", border: "none", cursor: "pointer" }}
            >
              Delete Doctor
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Admin;
