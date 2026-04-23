import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Appointments.css";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    patientName: "",
    doctorId: "",
    appointmentDate: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadDoctors();
    loadAppointments();

    const interval = setInterval(() => {
      loadAppointments();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Load Doctors
  const loadDoctors = () => {
    api.get("/doctors")
      .then((res) => {
        console.log("✅ Doctors loaded:", res.data);
        setDoctors(res.data);
      })
      .catch((err) => {
        console.error("❌ Error loading doctors:", err);
      });
  };

  // Load Appointments
  const loadAppointments = () => {
    api.get("/appointments")
      .then((res) => {
        console.log("✅ Appointments loaded:", res.data);
        setAppointments(res.data);
      })
      .catch((err) => {
        console.error("❌ Error loading appointments:", err);
      });
  };

  // Extract backend error safely
  const getErrorMessage = (err, fallback) => {
    return (
      err.response?.data?.message ||
      err.response?.data?.error ||
      (typeof err.response?.data === "string"
        ? err.response.data
        : null) ||
      fallback
    );
  };

  // Book Appointment
  const handleBookAppointment = async (e) => {
    e.preventDefault();

    if (
      !formData.patientName ||
      !formData.doctorId ||
      !formData.appointmentDate
    ) {
      setError("Please fill all fields including appointment date");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const appointmentData = {
        patientName: formData.patientName,
        appointmentDate: formData.appointmentDate,
        doctor: {
          id: parseInt(formData.doctorId)
        }
      };

      console.log("📤 Sending appointment data:", appointmentData);

      const res = await api.post("/appointments", appointmentData);

      console.log("✅ Appointment booked:", res.data);

      setSuccess(
        `Appointment booked! Queue number: ${res.data?.queue ?? "N/A"}`
      );

      setFormData({
        patientName: "",
        doctorId: "",
        appointmentDate: ""
      });

      loadAppointments();
    } catch (err) {
      console.error("❌ Error booking appointment:", err);
      setError(getErrorMessage(err, "Error booking appointment"));
    } finally {
      setLoading(false);
    }
  };

  // Cancel Appointment
  const handleCancelAppointment = async (appointmentId) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this appointment?"
      )
    ) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("🗑️ Cancelling appointment ID:", appointmentId);

      await api.put(`/appointments/cancel/${appointmentId}`);

      console.log("✅ Appointment cancelled successfully");

      setSuccess("Appointment cancelled successfully!");

      loadAppointments();
    } catch (err) {
      console.error("❌ Error cancelling appointment:", err);
      setError(getErrorMessage(err, "Error cancelling appointment"));
    } finally {
      setLoading(false);
    }
  };

  // Prevent selecting past date
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="appointments-container">
      {/* Header */}
      <div className="appointments-header">
        <h1>📅 Appointments</h1>
        <p>Book and manage your medical appointments</p>
      </div>

      {/* Messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="appointments-grid">

        {/* LEFT SIDE - BOOK APPOINTMENT */}
        <div className="booking-section">
          <h2>Book New Appointment</h2>

          <form
            onSubmit={handleBookAppointment}
            className="booking-form"
          >

            {/* Patient Name */}
            <div className="form-group">
              <label>Patient Name</label>

              <input
                type="text"
                placeholder="Your full name"
                value={formData.patientName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    patientName: e.target.value
                  })
                }
                disabled={loading}
              />
            </div>

            {/* Doctor Dropdown with Days + Timings */}
            <div className="form-group">
              <label>Select Doctor</label>

              <select
                value={formData.doctorId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    doctorId: e.target.value
                  })
                }
                disabled={loading}
              >
                <option value="">
                  -- Select a Doctor --
                </option>

                {doctors.map((doctor) => (
                  <option
                    key={doctor.id}
                    value={doctor.id}
                  >
                    Dr. {doctor.name} - {doctor.specialization} |
                    Days: {doctor.availableDay} |
                    Time: {doctor.startTime} - {doctor.endTime}
                  </option>
                ))}
              </select>
            </div>

            {/* Appointment Date */}
            <div className="form-group">
              <label>Select Appointment Date</label>

              <input
                type="date"
                min={today}
                value={formData.appointmentDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    appointmentDate: e.target.value
                  })
                }
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-book"
              disabled={loading}
            >
              {loading ? "Booking..." : "Book Appointment"}
            </button>

          </form>
        </div>

        {/* RIGHT SIDE - APPOINTMENTS LIST */}
        <div className="list-section">
          <h2>Your Appointments</h2>

          {appointments.length === 0 ? (
            <p className="no-appointments">
              No appointments booked
            </p>
          ) : (
            <div className="appointments-list">

              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className={`appointment-item ${appointment.status?.toLowerCase()}`}
                >
                  <div className="appointment-info">

                    <h3>{appointment.patientName}</h3>

                    <p>
                      <strong>👨‍⚕️ Doctor:</strong>{" "}
                      {appointment.doctorName || "Not assigned"}
                    </p>

                    <p>
                      <strong>📅 Date:</strong>{" "}
                      {appointment.appointmentDate || "Not Selected"}
                    </p>

                    <p>
                      <strong>📍 Queue Number:</strong>{" "}
                      {appointment.queue}
                    </p>

                    <p>
                      <strong>📊 Status:</strong>{" "}
                      <span
                        className={`status-badge ${appointment.status?.toLowerCase()}`}
                      >
                        {appointment.status === "BOOKED"
                          ? "✅ ACTIVE"
                          : "❌ CANCELLED"}
                      </span>
                    </p>

                  </div>

                  {/* Cancel Button */}
                  {appointment.status === "BOOKED" && (
                    <button
                      className="btn-cancel"
                      onClick={() =>
                        handleCancelAppointment(
                          appointment.id
                        )
                      }
                      disabled={loading}
                    >
                      ❌ Cancel
                    </button>
                  )}
                </div>
              ))}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Appointments;