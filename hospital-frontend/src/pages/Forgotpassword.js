import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [userRole, setUserRole] = useState("user"); // user or admin
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      alert("Please enter email");
      return;
    }

    try {
      await api.post("/auth/send-otp", { email });
      alert("OTP sent to your email!");
      setStep(2);
    } catch (err) {
      alert(err.response?.data || "Error sending OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      await api.post("/auth/verify-otp", { email, otp });
      alert("OTP verified!");
      setStep(3);
    } catch (err) {
      alert(err.response?.data || "Invalid OTP");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      alert("Please enter new password");
      return;
    }

    try {
      await api.post("/auth/reset-password", { email, newPassword });
      alert("Password reset successfully! Please login.");
      navigate(userRole === "admin" ? "/admin/login" : "/user/login");
    } catch (err) {
      alert(err.response?.data || "Error resetting password");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto" }}>
      <h2>🔐 Reset Password</h2>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "20px" }}>
          <input
            type="radio"
            value="user"
            checked={userRole === "user"}
            onChange={(e) => setUserRole(e.target.value)}
          />
          User
        </label>
        <label>
          <input
            type="radio"
            value="admin"
            checked={userRole === "admin"}
            onChange={(e) => setUserRole(e.target.value)}
          />
          Admin
        </label>
      </div>

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px", boxSizing: "border-box" }}
          />
          <button
            onClick={handleSendOtp}
            style={{ width: "100%", padding: "10px", backgroundColor: "#3b82f6", color: "white", border: "none", cursor: "pointer" }}
          >
            Send OTP
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <p>OTP has been sent to {email}</p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px", boxSizing: "border-box" }}
          />
          <button
            onClick={handleVerifyOtp}
            style={{ width: "100%", padding: "10px", backgroundColor: "#3b82f6", color: "white", border: "none", cursor: "pointer" }}
          >
            Verify OTP
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <p>Enter your new password</p>
          <div style={{ position: "relative", marginBottom: "10px" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ width: "100%", padding: "10px", boxSizing: "border-box", paddingRight: "40px" }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
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
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          <button
            onClick={handleResetPassword}
            style={{ width: "100%", padding: "10px", backgroundColor: "#10b981", color: "white", border: "none", cursor: "pointer" }}
          >
            Reset Password
          </button>
        </>
      )}

      <p style={{ textAlign: "center", marginTop: "20px" }}>
        <Link to={userRole === "admin" ? "/admin/login" : "/user/login"}>Back to Login</Link>
      </p>
    </div>
  );
}

export default ForgotPassword;