import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Stránka nenájdená</h2>
        <p>
          Ups, vyzerá to tak, že stránka,
          <br />
          ktorú hľadáte, neexistuje alebo bola presunutá.
        </p>
        <div className="not-found-buttons">
          <button
            className="not-found-btn primary"
            onClick={() => navigate("/")}
          >
            Späť na domov
          </button>
        </div>
      </div>
    </div>
  );
}
