import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useAuth } from "../context/useAuth";
import { useState } from "react";

function MinimalLayout() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <header>
        {/* Hamburger button - vľavo na mobile */}
        <button
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>

        {/* Logo - na mobile v strede, na desktop vľavo */}
        <div className="header-left">
          <img
            src="/domace-reality-logo-blue.png"
            alt="Logo"
            className="header-logo"
            onClick={() => navigate("/")}
          />
        </div>

        {/* Desktop menu - stred (vycentrované) */}
        <div className="header-center desktop-menu">
          <Link to="/">Domov</Link>
          <Link to="/reality">Ponuka</Link>
          <Link to="/about">O nás</Link>
        </div>

        {/* Pravá strana - prázdna pre vyváženie */}
        <div className="header-right desktop-menu">
          <button
            className="styled-button"
            onClick={() => navigate("/auth/login")}
          >
            Prihlásiť sa
          </button>
        </div>

        {/* Mobilné tlačidlo pre prihlásenie */}
        <button
          className="mobile-login-button desktop-hidden"
          onClick={() => navigate("/auth/login")}
        >
          Prihlásiť
        </button>
      </header>

      {/* Mobile menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? "show" : ""}`}>
        <Link to="/" onClick={() => setMobileMenuOpen(false)}>
          Domov
        </Link>
        <Link to="/reality" onClick={() => setMobileMenuOpen(false)}>
          Ponuka
        </Link>
        <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
          O nás
        </Link>
        <button
          className="styled-button"
          onClick={() => navigate("/auth/login")}
        >
          Prihlásiť sa
        </button>
      </div>

      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MinimalLayout;
