// components/home/LatestRealities.tsx
import { useNavigate } from "react-router-dom";
import { type Nehnutelnost } from "../../services/nehnutelnostiService";
import RealityCard from "../cards/RealityCard";

type LatestRealitiesProps = {
  realities: Nehnutelnost[];
  favorites?: string[];
  onFavChange?: (realityId: string, isLiked: boolean) => void;
};

export default function LatestRealities({
  realities,
  favorites = [],
  onFavChange,
}: LatestRealitiesProps) {
  const navigate = useNavigate();

  const latestRealities = [...realities]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  if (latestRealities.length === 0) {
    return (
      <div className="latest-realities-container">
        <h1>Najnovšie inzeráty</h1>
        <div className="no-realities">
          <p>Žiadne nehnuteľnosti na zobrazenie.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="latest-realities-container">
      <div className="section-header">
        <h1>Najnovšie inzeráty</h1>
      </div>
      <div className="realities-list">
        {latestRealities.map((reality) => (
          <RealityCard
            key={reality._id}
            reality={reality}
            favorites={favorites}
            onFavChange={onFavChange}
          />
        ))}
      </div>
      <div className="view-all-container">
        <button className="styled-button" onClick={() => navigate("/reality")}>
          Zobraziť všetky ponuky →
        </button>
      </div>
    </div>
  );
}
