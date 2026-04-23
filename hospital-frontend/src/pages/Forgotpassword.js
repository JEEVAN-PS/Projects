import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./ModernAuth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter email");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/send-otp", { email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter OTP");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/verify-otp", { email, otp });
      setStep(3);
    } catch (err) {
      setError(err.response?.data || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      setError("Please enter new password");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/reset-password", { email, newPassword });
      window.location.href = "/user/login";
    } catch (err) {
      setError(err.response?.data || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container user-login">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🔐</div>
          <h1>Reset Password</h1>
          <p>Recover Your Account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {step === 1 && (
          <div className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <button className="btn btn-primary btn-block" onClick={handleSendOtp} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="auth-form">
            <p>OTP sent to {email}</p>
            <div className="form-group">
              <label>Enter OTP</label>
              <input
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
              />
            </div>
            <button className="btn btn-primary btn-block" onClick={handleVerifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="auth-form">
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <button className="btn btn-primary btn-block" onClick={handleResetPassword} disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}

        <div className="auth-footer">
          <Link to="/user/login" className="admin-switch">
            Back to Login
          </Link>
        </div>
      </div>
      <div className="auth-background"></div>
    </div>
  );
}

export default ForgotPassword;