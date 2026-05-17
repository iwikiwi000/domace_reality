import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    const randomToken = Math.random().toString(36).substring(2);
    authService.saveToken(randomToken);
    navigate("/", { replace: true });
  };

  return (
    <div className="signin-card card mt-2 p-4">
      <h1>Registrácia</h1>
      <div>
        <input
          className="styled-input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <input
          className="styled-input"
          placeholder="Heslo"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="styled-button" onClick={handleSignup}>
        Signup
      </button>
    </div>
  );
}

export default SignupPage;
