import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./ModernAuth.css";

function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await api.post("/user/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (err) {
      setError(err.response?.data || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container user-login">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">👤</div>
          <h1>Patient Portal</h1>
          <p>Sign In to Your Account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="auth-divider">
          <span>New to MediCare?</span>
        </div>

        <div className="auth-links">
          <Link to="/user/register" className="btn btn-secondary btn-block">
            Create Account
          </Link>
          <Link to="/user/forgot-password" className="forgot-link">
            Forgot Password?
          </Link>
        </div>

        <div className="auth-footer">
          <p>Professional Healthcare Management</p>
          <Link to="/admin/login" className="admin-switch">
            Are you an administrator?
          </Link>
        </div>
      </div>

      <div className="auth-background"></div>
    </div>
  );
}

export default UserLogin;