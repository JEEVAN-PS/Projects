import { useState } from "react";
import api from "../services/api";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      await api.post("/auth/change-password", {
        oldPassword,
        newPassword
      });

      alert("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err.response?.data || "Error changing password");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto" }}>
      <h2>🔐 Change Password</h2>

      <div style={{ position: "relative", marginBottom: "10px" }}>
        <input
          type={showOldPassword ? "text" : "password"}
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", boxSizing: "border-box", paddingRight: "40px" }}
        />
        <button
          onClick={() => setShowOldPassword(!showOldPassword)}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "18px"
          }}
        >
          {showOldPassword ? "👁️" : "👁️‍🗨️"}
        </button>
      </div>

      <div style={{ position: "relative", marginBottom: "10px" }}>
        <input
          type={showNewPassword ? "text" : "password"}
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", boxSizing: "border-box", paddingRight: "40px" }}
        />
        <button
          onClick={() => setShowNewPassword(!showNewPassword)}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "18px"
          }}
        >
          {showNewPassword ? "👁️" : "👁️‍🗨️"}
        </button>
      </div>

      <div style={{ position: "relative", marginBottom: "10px" }}>
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", boxSizing: "border-box", paddingRight: "40px" }}
        />
        <button
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "18px"
          }}
        >
          {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
        </button>
      </div>

      <button
        onClick={handleChangePassword}
        style={{ width: "100%", padding: "10px", backgroundColor: "#10b981", color: "white", border: "none", cursor: "pointer", marginBottom: "10px" }}
      >
        Change Password
      </button>

      <p style={{ textAlign: "center", color: "#666" }}>
        Password must be at least 6 characters long
      </p>
    </div>
  );
}

export default ChangePassword;