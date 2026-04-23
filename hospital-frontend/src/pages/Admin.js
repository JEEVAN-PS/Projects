import { useState, useEffect } from "react";
import api from "../services/api";
import "./Admin.css";

function Admin() {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    experience: "",
    availableDays: [],
    startTime: "09:00",
    endTime: "17:00"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Load doctors
  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = () => {
    api.get("/doctors")
      .then(res => setDoctors(res.data))
      .catch(err => console.log(err));
  };

  // Handle day selection with range
  const handleDayChange = (day) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  // Select range from startDay to endDay
  const selectDayRange = (startDay, endDay) => {
    const startIndex = daysOfWeek.indexOf(startDay);
    const endIndex = daysOfWeek.indexOf(endDay);
    
    if (startIndex === -1 || endIndex === -1) return;
    
    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);
    const selectedDays = daysOfWeek.slice(start, end + 1);
    
    setFormData(prev => ({
      ...prev,
      availableDays: selectedDays
    }));
  };

  // Quick select buttons
  const quickSelect = (pattern) => {
    switch(pattern) {
      case "weekdays":
        selectDayRange("Monday", "Friday");
        break;
      case "weekends":
        setFormData(prev => ({
          ...prev,
          availableDays: ["Saturday", "Sunday"]
        }));
        break;
      case "all":
        setFormData(prev => ({
          ...prev,
          availableDays: [...daysOfWeek]
        }));
        break;
      case "clear":
        setFormData(prev => ({
          ...prev,
          availableDays: []
        }));
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.specialization || !formData.experience || formData.availableDays.length === 0) {
      setError("Please fill all fields and select at least one day");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const doctorData = {
        name: formData.name,
        specialization: formData.specialization,
        experience: parseInt(formData.experience),
        availableDay: formData.availableDays.join(", "),
        startTime: formData.startTime,
        endTime: formData.endTime
      };

      await api.post("/doctors", doctorData);
      setSuccess("Doctor added successfully!");
      
      setFormData({
        name: "",
        specialization: "",
        experience: "",
        availableDays: [],
        startTime: "09:00",
        endTime: "17:00"
      });

      loadDoctors();
    } catch (err) {
      setError(err.response?.data || "Error adding doctor");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this doctor?")) {
      try {
        await api.delete(`/doctors/${id}`);
        loadDoctors();
      } catch (err) {
        alert(err.response?.data || "Error deleting doctor");
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>👨‍⚕️ Admin Panel - Manage Doctors</h2>
      </div>

      {error && <div className="admin-error">{error}</div>}
      {success && <div className="admin-success">{success}</div>}

      <div className="admin-form-section">
        <h3>➕ Add New Doctor</h3>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label>Doctor Name</label>
              <input
                type="text"
                placeholder="Dr. John Smith"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Specialization</label>
              <input
                type="text"
                placeholder="e.g., Cardiologist"
                value={formData.specialization}
                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Experience (years)</label>
              <input
                type="number"
                placeholder="5"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                disabled={loading}
              />
            </div>
          </div>

          <div className="days-section">
            <label className="section-label">📅 Available Days</label>
            
            {/* Quick Select Buttons */}
            <div className="quick-select">
              <button type="button" className="quick-btn weekdays" onClick={() => quickSelect("weekdays")}>
                Weekdays (Mon-Fri)
              </button>
              <button type="button" className="quick-btn weekends" onClick={() => quickSelect("weekends")}>
                Weekends (Sat-Sun)
              </button>
              <button type="button" className="quick-btn all" onClick={() => quickSelect("all")}>
                All Days
              </button>
              <button type="button" className="quick-btn clear" onClick={() => quickSelect("clear")}>
                Clear All
              </button>
            </div>

            {/* Day Selection Grid */}
            <div className="days-grid">
              {daysOfWeek.map((day) => (
                <label key={day} className={`day-checkbox ${formData.availableDays.includes(day) ? "selected" : ""}`}>
                  <input
                    type="checkbox"
                    checked={formData.availableDays.includes(day)}
                    onChange={() => handleDayChange(day)}
                    disabled={loading}
                  />
                  <span>{day}</span>
                </label>
              ))}
            </div>

            {/* Selected Days Display */}
            {formData.availableDays.length > 0 && (
              <div className="selected-days">
                <strong>Selected:</strong> {formData.availableDays.join(", ")}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-submit" disabled={loading}>
            {loading ? "Adding Doctor..." : "Add Doctor"}
          </button>
        </form>
      </div>

      <div className="doctors-list-section">
        <h3>👨‍⚕️ All Doctors ({doctors.length})</h3>
        <div className="doctors-list">
          {doctors.length === 0 ? (
            <p className="no-doctors">No doctors added yet</p>
          ) : (
            doctors.map((doctor) => (
              <div key={doctor.id} className="doctor-card">
                <div className="doctor-info">
                  <h4>👨‍⚕️ {doctor.name}</h4>
                  <p><strong>Specialization:</strong> {doctor.specialization}</p>
                  <p><strong>Experience:</strong> {doctor.experience} years</p>
                  <p><strong>Available Days:</strong> {doctor.availableDay}</p>
                  <p><strong>Timing:</strong> {doctor.startTime} - {doctor.endTime}</p>
                </div>
                <button 
                  className="btn btn-delete" 
                  onClick={() => handleDelete(doctor.id)}
                  disabled={loading}
                >
                  🗑️ Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;