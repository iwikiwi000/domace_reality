import { useEffect, useState } from "react";
import RealityCard from "../cards/RealityCard";
import {
  type Nehnutelnost,
  nehnutelnostiService,
} from "../../services/nehnutelnostiService";
import { usersService } from "../../services/usersServices";
import { useAuth } from "../../context/useAuth";

export default function Favorites() {
  const { user } = useAuth();
  const [realities, setRealities] = useState<Nehnutelnost[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allRealities, userData] = await Promise.all([
          nehnutelnostiService.getAll(),
          usersService.getMe(),
        ]);
        setRealities(allRealities);
        setFavorites(userData.favorites ?? []);
      } catch (error) {
        console.error("Chyba pri načítaní:", error);
      }
    };

    if (user?.userId) fetchData();
  }, [user?.userId]);

  const handleFavChange = (realityId: string, isLiked: boolean) => {
    if (!isLiked) {
      setFavorites((prev) => prev.filter((id) => id !== realityId));
    }
  };

  const myFavorites = realities.filter((r) => favorites.includes(r._id));

  return (
    <div className="categories-container">
      <h1>Obľúbené</h1>
      <div className="realities-list">
        {myFavorites.length === 0 ? (
          <p>Nemáte žiadne obľúbené inzeráty</p>
        ) : (
          myFavorites.map((reality) => (
            <RealityCard
              key={reality._id}
              reality={reality}
              favorites={favorites}
              onFavChange={handleFavChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
