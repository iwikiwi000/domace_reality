import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <>
      <div className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">
              Nájdite svoj
              <br />
              vysnívaný domov
            </h1>
            <p className="hero-subtitle">
              Moderné bývanie, byty a domy
              <br />
              po celom Slovensku.
            </p>
            <div className="hero-buttons">
              <button
                className="hero-button primary"
                onClick={() => navigate("/reality")}
              >
                Prehliadať ponuky →
              </button>
              <button
                className="hero-button secondary"
                onClick={() => navigate("/reality/add")}
              >
                Predať nehnuteľnosť
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
