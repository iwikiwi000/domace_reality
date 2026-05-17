import RealityCard from "../cards/RealityCard";
import { type Nehnutelnost } from "../../services/nehnutelnostiService";
import { useNavigate, useLocation } from "react-router-dom";

export default function MyFavorites({
  realities,
  favorites = [],
  onFavChange,
}: {
  realities: Nehnutelnost[];
  favorites: string[];
  onFavChange?: (realityId: string, isLiked: boolean) => void;
}) {
  const myFavorites = realities.filter((item) => favorites.includes(item._id));
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigateToProfile = () => {
    navigate("/profile", { state: { activeTab: "Obľúbené" } });
  };

  const isHomePage = location.pathname === "/";
  const displayedFavorites = isHomePage ? myFavorites.slice(0, 4) : myFavorites;

  if (myFavorites.length === 0) {
    return (
      <div className="favorites-empty">
        <div className="empty-state">
          <h3>Žiadne obľúbené</h3>
          <p>Zatiaľ ste si neoznačili žiadnu nehnuteľnosť ako obľúbenú.</p>
          {isHomePage && (
            <button
              className="styled-button"
              onClick={() => navigate("/reality")}
            >
              Prezerať nehnuteľnosti
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-wrapper">
      {isHomePage && <h1 className="favorites-title">Obľúbené inzeráty</h1>}
      <div className="realities-list">
        {displayedFavorites.map((item) => (
          <RealityCard
            key={item._id}
            reality={item}
            favorites={favorites}
            onFavChange={onFavChange}
          />
        ))}
      </div>

      {isHomePage && myFavorites.length > 4 && (
        <div className="view-all-container">
          <button className="styled-button" onClick={handleNavigateToProfile}>
            Zobraziť všetky ({myFavorites.length})
          </button>
        </div>
      )}
    </div>
  );
}
