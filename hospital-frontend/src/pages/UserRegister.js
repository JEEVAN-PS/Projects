import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function UserRegister() {
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
      await api.post("/user/auth/register", {
        username,
        email,
        password,
      });

      alert("User registered successfully! Please login");
      navigate("/user/login");
    } catch (err) {
      alert(err.response?.data || "Registration failed");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto" }}>
      <h2>👤 User Register</h2>

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
        style={{ width: "100%", padding: "10px", backgroundColor: "#10b981", color: "white", border: "none", cursor: "pointer" }}
      >
        Register
      </button>

      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Already have an account? <Link to="/user/login">Login here</Link>
      </p>
    </div>
  );
}

export default UserRegister;
