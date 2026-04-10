import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function AdminRegister() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      await api.post("/admin/auth/register", {
        username,
        email,
        password,
      });

      alert("Admin registered successfully! Please login");
      navigate("/admin/login");
    } catch (err) {
      alert(err.response?.data || "Registration failed");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto" }}>
      <h2>👨‍💼 Admin Register</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px", boxSizing: "border-box" }}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px", boxSizing: "border-box" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px", boxSizing: "border-box" }}
      />

      <button 
        onClick={handleRegister}
        style={{ width: "100%", padding: "10px", backgroundColor: "#2563eb", color: "white", border: "none", cursor: "pointer" }}
      >
        Register
      </button>

      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Already have an account? <Link to="/admin/login">Login here</Link>
      </p>
    </div>
  );
}

export default AdminRegister;
