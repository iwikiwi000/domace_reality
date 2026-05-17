import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import Footer from "./Footer";
import { useAuth } from "../context/useAuth";
import { UserRole } from "../types/user-role.enum";

export default function Layout() {
  const navigate = useNavigate();
  const { logout, user, userRole, hasAnyRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const handleProfileClick = () => {
    if (hasAnyRole(UserRole.ADMIN)) {
      navigate("/admin");
    } else {
      navigate("/profile");
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header>
        <button
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>

        <div className="header-logo-container">
          <img
            src="/domace-reality-logo-blue.png"
            alt="Logo"
            className="header-logo"
            onClick={() => navigate("/")}
          />
        </div>

        <div className="header-center desktop-menu">
          <Link to="/">Domov</Link>
          <Link to="/reality">Ponuka</Link>
          <Link to="/about">O nás</Link>
        </div>

        <div className="header-right desktop-menu">
          {user && (
            <span className="user-email" onClick={handleProfileClick}>
              {user.email.split("@")[0]}
            </span>
          )}
          <button className="styled-button" onClick={handleLogout}>
            {user ? "Odhlásiť sa" : "Prihlásiť sa"}
            <img src="/User-white.png" alt="Logout" className="button-icon" />
          </button>
        </div>

        {!user && (
          <button
            className="mobile-login-button desktop-hidden"
            onClick={() => navigate("/auth/login")}
          >
            Prihlásiť
          </button>
        )}
      </header>

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
        {user && (
          <>
            <span onClick={handleProfileClick}>
              {user.email.split("@")[0]} ({userRole})
            </span>
            <button className="styled-button" onClick={handleLogout}>
              Odhlásiť sa
            </button>
          </>
        )}
        {!user && (
          <button
            className="styled-button"
            onClick={() => navigate("/auth/login")}
          >
            Prihlásiť sa
          </button>
        )}
      </div>

      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
