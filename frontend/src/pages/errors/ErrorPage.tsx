import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-content">
        <h1>500</h1>
        <h2>Vyskytol sa error</h2>
        <p>
          Ups, niečo sa pokazilo.
          <br />
          Skúste to prosím neskôr alebo kontaktujte podporu.
        </p>
        <div className="error-buttons">
          <button className="error-btn primary" onClick={() => navigate("/")}>
            Späť na domov
          </button>
          <button
            className="error-btn secondary"
            onClick={() => window.location.reload()}
          >
            Obnoviť stránku
          </button>
        </div>
      </div>
    </div>
  );
}
