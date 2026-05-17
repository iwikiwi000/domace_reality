import RealityCard from "../cards/RealityCard";
import { type Nehnutelnost } from "../../services/nehnutelnostiService";
import { useNavigate } from "react-router-dom";

export default function MyRealities({
  realities,
  favorites = [],
  onFavChange,
}: {
  realities: Nehnutelnost[];
  favorites: string[];
  onFavChange?: (realityId: string, isLiked: boolean) => void;
}) {
  const navigate = useNavigate();
  if (realities.length === 0) {
    return (
      <div className="realities-empty">
        <div className="empty-state">
          <h3>Žiadne inzeráty</h3>
          <p>Zatiaľ ste nevytvorili žiadny inzerát.</p>
          <button
            className="styled-button"
            onClick={() => navigate("/reality/add")}
          >
            Pridať prvý inzerát
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-realities-wrapper">
      <div className="realities-list">
        {realities.map((item) => (
          <RealityCard
            key={item._id}
            reality={item}
            favorites={favorites}
            onFavChange={onFavChange}
          />
        ))}
      </div>
    </div>
  );
}
