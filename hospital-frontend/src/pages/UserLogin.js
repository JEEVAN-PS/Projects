import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await api.post("/user/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      alert("User login successful");
      
      setTimeout(() => {
        window.location.href = "/";
      }, 500);

    } catch (err) {
      alert(err.response?.data || "Invalid credentials");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto" }}>
      <h2>👤 User Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px", boxSizing: "border-box" }}
      />

      <div style={{ position: "relative", marginBottom: "10px" }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        onClick={handleLogin}
        style={{ width: "100%", padding: "10px", backgroundColor: "#10b981", color: "white", border: "none", cursor: "pointer" }}
      >
        User Login
      </button>

      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Don't have an account? <Link to="/user/register">Register here</Link>
      </p>

      <p style={{ textAlign: "center" }}>
        <Link to="/user/forgot-password">Forgot Password?</Link>
      </p>

      <p style={{ textAlign: "center" }}>
        <Link to="/admin/login">Admin Login →</Link>
      </p>
    </div>
  );
}

export default UserLogin;