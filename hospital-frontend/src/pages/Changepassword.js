import { useState } from "react";
import api from "../services/api";
import "./ModernAuth.css";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be 6+ characters");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/auth/change-password", { oldPassword, newPassword });
      setSuccess("Password changed successfully!");
      setTimeout(() => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }, 2000);
    } catch (err) {
      setError(err.response?.data || "Error changing password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto", padding: "2rem", background: "white", borderRadius: "12px" }}>
      <h2>🔐 Change Password</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="auth-form">
        <div className="form-group">
          <label>Old Password</label>
          <input type="password" placeholder="Enter old password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} disabled={loading} />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={loading} />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} />
        </div>

        <button className="btn btn-primary btn-block" onClick={handleChangePassword} disabled={loading}>
          {loading ? "Changing..." : "Change Password"}
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;