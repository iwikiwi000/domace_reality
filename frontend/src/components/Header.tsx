import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function Header() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  const token = authService.getToken();
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserName(payload.name || "Používateľ");
    } catch (error) {
      console.error("Error parsing token:", error);
    }
  }
  const handleLogout = () => {
    authService.removeToken();
    navigate("/auth/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <header>
      <div className="header-content">
        <Link to="/">Home</Link>
        <Link to="/reality">Reality</Link>
      </div>
      <div className="header-content">
        <span className="user-name">{userName}</span>
        <div className="user-icon-wrapper" onClick={handleProfileClick}>
          <img src="/User.png" alt="User" className="user-icon" />
        </div>
        <button className="styled-button" onClick={handleLogout}>
          Odhlásiť sa
        </button>
      </div>
    </header>
  );
}
