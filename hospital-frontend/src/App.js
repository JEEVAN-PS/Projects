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
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import "./App.css";

function App() {
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    
    setToken(storedToken);
    setRole(storedRole);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader">
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
        </div>
        <p>Loading Healthcare Portal...</p>
      </div>
    );
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
          <Route path="/" element={<LandingPage />} />
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
              <AdminLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                <Admin />
              </AdminLayout>
            }
          />
          <Route path="/change-password" element={<AdminLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}><ChangePassword /></AdminLayout>} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}><Dashboard /></UserLayout>} />
        <Route path="/doctors" element={<UserLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}><Doctors /></UserLayout>} />
        <Route path="/appointments" element={<UserLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}><Appointments /></UserLayout>} />
        <Route path="/change-password" element={<UserLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}><ChangePassword /></UserLayout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Landing Page Component
function LandingPage() {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">🏥</span>
            <span className="logo-text">MediCare Pro</span>
          </div>
          <div className="nav-links">
            <Link to="/user/login" className="nav-link">Patient Login</Link>
            <Link to="/admin/login" className="nav-link admin-link">Admin Portal</Link>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Modern Healthcare Management</h1>
          <p className="hero-subtitle">Schedule appointments, manage doctors, and streamline your hospital operations with our advanced platform.</p>
          <div className="hero-buttons">
            <Link to="/user/login" className="btn btn-primary">Get Started</Link>
            <Link to="/user/register" className="btn btn-secondary">Register</Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2026 MediCare Pro. Transforming Healthcare Management.</p>
      </footer>
    </div>
  );
}

// Admin Layout
function AdminLayout({ children, sidebarOpen, setSidebarOpen }) {
  return (
    <div className="admin-layout">
      <nav className="admin-navbar">
        <div className="navbar-container">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <Link to="/admin" className="navbar-logo">
            <span className="logo-icon">🏥</span>
            <span className="logo-text">MediCare Admin</span>
          </Link>
          <div className="navbar-menu">
            <Link to="/change-password" className="navbar-link">
              <span className="link-icon">🔐</span>
              <span className="link-text">Change Password</span>
            </Link>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.href = "/admin/login";
              }}
              className="navbar-logout"
            >
              <span>🚪</span>
              <span className="link-text">Logout</span>
            </button>
          </div>
        </div>
      </nav>
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}

// User Layout
function UserLayout({ children, sidebarOpen, setSidebarOpen }) {
  return (
    <div className="user-layout">
      <nav className="user-navbar">
        <div className="navbar-container">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <Link to="/" className="navbar-logo">
            <span className="logo-icon">🏥</span>
            <span className="logo-text">MediCare</span>
          </Link>
          <div className="navbar-menu">
            <Link to="/change-password" className="navbar-link">
              <span className="link-icon">🔐</span>
              <span className="link-text">Account</span>
            </Link>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.href = "/user/login";
              }}
              className="navbar-logout"
            >
              <span>🚪</span>
              <span className="link-text">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="user-container">
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <h3>Navigation</h3>
          </div>
          <div className="sidebar-menu">
            <Link to="/" className="menu-item">
              <span className="menu-icon">📊</span>
              <span className="menu-text">Dashboard</span>
            </Link>
            <Link to="/doctors" className="menu-item">
              <span className="menu-icon">👨‍⚕️</span>
              <span className="menu-text">Doctors</span>
            </Link>
            <Link to="/appointments" className="menu-item">
              <span className="menu-icon">📅</span>
              <span className="menu-text">Appointments</span>
            </Link>
          </div>
        </aside>

        <main className="user-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default App;