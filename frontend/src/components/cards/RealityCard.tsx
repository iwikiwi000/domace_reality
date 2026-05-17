import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { UserRole } from "../../types/user-role.enum";
import houseImg from "/house-placeholder.jpg";
import {
  nehnutelnostiService,
  type Nehnutelnost,
} from "../../services/nehnutelnostiService";
import { usersService } from "../../services/usersServices";
import { useModal } from "../../context/ModalContext";

type RealityCardProps = {
  reality: Nehnutelnost;
  favorites?: string[];
  onFavChange?: (realityId: string, isLiked: boolean) => void;
};

export default function RealityCard({
  reality,
  favorites = [],
  onFavChange,
}: RealityCardProps) {
  const { _id, title, price, location, author, images = [] } = reality;
  const [liked, setLiked] = useState(favorites.includes(_id));
  const navigate = useNavigate();
  const { user, hasAnyRole } = useAuth();
  const { setShowLoginModal } = useModal();

  // RealityCard.tsx
  useEffect(() => {
    const isLiked = favorites.includes(_id);
    setLiked(isLiked);
  }, [favorites, _id]); // Toto je správne

  const authorId = typeof author === "string" ? author : author?._id;
  const canEdit =
    user && (hasAnyRole(UserRole.ADMIN) || user.userId === authorId);

  // RealityCard.tsx - časť s handleLike
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.userId) {
      setShowLoginModal(true);
      return;
    }

    try {
      // Použite nový endpoint bez userId v URL
      const result = await usersService.toggleFav(_id);

      const newLiked = !liked;
      setLiked(newLiked);
      onFavChange?.(_id, newLiked);
    } catch (error) {
      console.error("Chyba pri aktualizácii obľúbených:", error);
    }
  };

  const handleDelete = async () => {
    if (!user?.userId) return;
    if (
      !window.confirm("Ste si istí, že chcete tuto nehnuteľnost odstranit?")
    ) {
      return;
    }
    try {
      await nehnutelnostiService.delete(_id);
      navigate("/reality");
    } catch (error) {
      console.error("Chyba pri odstraňovaní nehnuteľnosti:", error);
    }
  };

  // Formátovanie adresy pre zobrazenie
  const formatLocation = () => {
    if (!location) return "Nezadaná adresa";
    if (typeof location === "string") return location;

    const city = location.city || "";
    const street = location.street || "";

    if (city && street) return `${city}, ${street}`;
    if (city) return city;
    if (street) return street;
    return location.country || "Nezadaná adresa";
  };

  return (
    <div
      className="reality-card"
      onClick={() => navigate(`/reality/${_id}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="reality-card-image">
        <img
          src={images[0] ? `http://localhost:3000${images[0]}` : houseImg}
          alt={title}
        />
      </div>

      <div className="card-content">
        <div className="card-header">
          <h4>{price?.toLocaleString()} €</h4>
          <img
            src={liked ? "/Heart-filled.png" : "/Heart.png"}
            className="heart-icon-inline"
            onClick={handleLike}
            alt="Like"
          />
        </div>
        <h5>{title}</h5>
        <p>{formatLocation()}</p>
        {canEdit && (
          <div className="modal-buttons">
            <button
              className="styled-button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/reality/${_id}/edit`);
              }}
            >
              Upraviť
            </button>
            <button className="styled-button" onClick={handleDelete}>
              Odstrániť
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
