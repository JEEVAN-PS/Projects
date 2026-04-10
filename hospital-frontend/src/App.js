import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import ForgotPassword from "./pages/Forgotpassword";
import ChangePassword from "./pages/Changepassword";
import "./App.css";

function App() {
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    
    setToken(storedToken);
    setRole(storedRole);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/user/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/user/login" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  if (role === "ADMIN") {
    return (
      <BrowserRouter>
        <Routes>
          <Route 
            path="/admin" 
            element={
              <>
                <div style={{ backgroundColor: "#1e293b", padding: "15px", display: "flex", gap: "20px", alignItems: "center" }}>
                  <h3 style={{ color: "white", margin: 0 }}>Admin Panel</h3>
                  <Link to="/change-password" style={{ color: "white", textDecoration: "none", marginLeft: "auto" }}>🔐 Change Password</Link>
                  <button 
                    onClick={() => {
                      localStorage.clear();
                      setRole(null);
                      setToken(null);
                      window.location.href = "/admin/login";
                    }}
                    style={{ backgroundColor: "#ef4444", color: "white", padding: "8px 15px", border: "none", cursor: "pointer" }}
                  >
                    Logout
                  </button>
                </div>
                <div style={{ padding: "20px" }}>
                  <Admin />
                </div>
              </>
            }
          />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <>
              <div style={{ backgroundColor: "#1e293b", padding: "15px", display: "flex", gap: "20px", alignItems: "center" }}>
                <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>Dashboard</Link>
                <Link to="/doctors" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>Doctors</Link>
                <Link to="/appointments" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>Appointments</Link>
                <Link to="/change-password" style={{ color: "white", textDecoration: "none", marginLeft: "auto" }}>🔐 Change Password</Link>
                <button 
                  onClick={() => {
                    localStorage.clear();
                    setRole(null);
                    setToken(null);
                    window.location.href = "/user/login";
                  }}
                  style={{ backgroundColor: "#ef4444", color: "white", padding: "8px 15px", border: "none", cursor: "pointer" }}
                >
                  Logout
                </button>
              </div>
              <div style={{ padding: "20px" }}>
                <Dashboard />
              </div>
            </>
          }
        />
        
        <Route 
          path="/doctors" 
          element={
            <>
              <div style={{ backgroundColor: "#1e293b", padding: "15px", display: "flex", gap: "20px", alignItems: "center" }}>
                <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>Dashboard</Link>
                <Link to="/doctors" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>Doctors</Link>
                <Link to="/appointments" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>Appointments</Link>
                <Link to="/change-password" style={{ color: "white", textDecoration: "none", marginLeft: "auto" }}>🔐 Change Password</Link>
                <button 
                  onClick={() => {
                    localStorage.clear();
                    setRole(null);
                    setToken(null);
                    window.location.href = "/user/login";
                  }}
                  style={{ backgroundColor: "#ef4444", color: "white", padding: "8px 15px", border: "none", cursor: "pointer" }}
                >
                  Logout
                </button>
              </div>
              <div style={{ padding: "20px" }}>
                <Doctors />
              </div>
            </>
          }
        />

        <Route 
          path="/appointments" 
          element={
            <>
              <div style={{ backgroundColor: "#1e293b", padding: "15px", display: "flex", gap: "20px", alignItems: "center" }}>
                <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>Dashboard</Link>
                <Link to="/doctors" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>Doctors</Link>
                <Link to="/appointments" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>Appointments</Link>
                <Link to="/change-password" style={{ color: "white", textDecoration: "none", marginLeft: "auto" }}>🔐 Change Password</Link>
                <button 
                  onClick={() => {
                    localStorage.clear();
                    setRole(null);
                    setToken(null);
                    window.location.href = "/user/login";
                  }}
                  style={{ backgroundColor: "#ef4444", color: "white", padding: "8px 15px", border: "none", cursor: "pointer" }}
                >
                  Logout
                </button>
              </div>
              <div style={{ padding: "20px" }}>
                <Appointments />
              </div>
            </>
          }
        />

        <Route path="/change-password" element={<ChangePassword />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;