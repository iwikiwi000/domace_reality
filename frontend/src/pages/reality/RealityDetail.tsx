import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import houseImg from "/house-placeholder.jpg";
import ImageSlider from "../../components/ImageSlider";
import {
  type Nehnutelnost,
  nehnutelnostiService,
} from "../../services/nehnutelnostiService";
import { UserRole } from "../../types/user-role.enum";
import { useAuth } from "../../context/useAuth";
import { usersService } from "../../services/usersServices";
import Modal from "../../components/Modal";
import OfferModal from "../../components/OfferModla";

export default function RealityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasAnyRole } = useAuth();

  const [reality, setReality] = useState<Nehnutelnost | null>(null);
  const [loading, setLoading] = useState(true);
  const [sliderOpen, setSliderOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showOfferModal, setShowOfferModal] = useState(false);

  useEffect(() => {
    const fetchReality = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await nehnutelnostiService.getById(id);
        setReality(data);

        if (user?.userId) {
          const userData = await usersService.getMe();
          setLiked((userData.favorites ?? []).includes(id));
        }
      } catch (error) {
        console.error("Chyba pri načítaní nehnuteľnosti:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReality();
  }, [id, user?.userId]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.userId) {
      setShowLoginModal(true);
      return;
    }
    try {
      await usersService.toggleFav(id!);
      setLiked((prev) => !prev);
    } catch (error) {
      console.error("Chyba pri aktualizácii obľúbených:", error);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (
      !window.confirm("Ste si istí, že chcete tuto nehnuteľnosť odstrániť?")
    ) {
      return;
    }
    try {
      await nehnutelnostiService.delete(id!);
      navigate("/reality");
    } catch (error) {
      console.error("Chyba pri odstraňovaní nehnuteľnosti:", error);
    }
  };

  if (loading)
    return (
      <div className="detail-loading">Načítavam detail nehnuteľnosti...</div>
    );

  if (!reality) {
    return (
      <div className="container mt-2">
        <p>Nehnuteľnosť nebola nájdená</p>
      </div>
    );
  }

  const formatLocation = () => {
    if (!reality.location) return "Nezadaná adresa";
    const { city, street, houseNumber } = reality.location;
    if (city && street) return `${city}, ${street} ${houseNumber || ""}`;
    if (city) return city;
    return "Nezadaná adresa";
  };

  const formatAddress = () => {
    if (!reality.location) return "Nezadaná adresa";
    const { street, houseNumber, city, postalCode } = reality.location;
    const parts = [];
    if (street) parts.push(street);
    if (houseNumber) parts.push(houseNumber);
    if (city) parts.push(city);
    if (postalCode) parts.push(postalCode);
    return parts.join(", ");
  };

  const authorId =
    typeof reality.author === "string" ? reality.author : reality.author?._id;
  const canEdit =
    user && (hasAnyRole(UserRole.ADMIN) || user.userId === authorId);

  const images = reality.images?.length
    ? reality.images.map((img) => `http://localhost:3000${img}`)
    : [houseImg];

  const mainImage = reality.images?.[0]
    ? `http://localhost:3000${reality.images[0]}`
    : houseImg;

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
    setSliderOpen(true);
  };

  return (
    <>
      {showLoginModal && <Modal onClose={() => setShowLoginModal(false)} />}
      {sliderOpen && (
        <ImageSlider
          images={images}
          onClose={() => setSliderOpen(false)}
          startIndex={currentImageIndex}
        />
      )}

      <div className="reality-detail-page">
        {/* Header s názvom a srdiečkom */}
        <div className="detail-header">
          {user && !canEdit && (
            <button
              className="styled-button"
              onClick={() => setShowOfferModal(true)}
            >
              Odoslať ponuku
            </button>
          )}
          <h1 className="detail-title">{reality.title}</h1>
          <div className="detail-like-button" onClick={handleLike}>
            <button className="like-button">
              <img
                src={liked ? "/Heart-filled.png" : "/Heart.png"}
                alt="Like"
              />
              Pridať do obľúbených
            </button>
          </div>
        </div>

        {/* Cena a lokalita */}
        <div className="detail-price-location">
          <div className="detail-location">
            <span className="location-icon"></span>
            <span>{formatLocation()}</span>
          </div>
          <div className="detail-price">
            <span className="price-value">
              {reality.price.toLocaleString()} €
            </span>
          </div>
        </div>

        {/* Dvojstĺpcový layout */}
        <div className="detail-two-columns">
          {/* Ľavý stĺpec - Obrázky a popis */}
          <div className="detail-left">
            {/* Hlavný obrázok */}
            <div className="detail-main-image">
              <img
                src={mainImage}
                alt={reality.title}
                onClick={() => setSliderOpen(true)}
              />
              {images.length > 1 && (
                <div
                  className="image-count"
                  onClick={() => setSliderOpen(true)}
                >
                  {images.length} fotografií
                </div>
              )}
            </div>

            {/* Náhľady obrázkov */}
            {images.length > 1 && (
              <div className="detail-thumbnails">
                {images.slice(0, 6).map((img, index) => (
                  <div
                    key={index}
                    className="thumbnail"
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img src={img} alt={`Náhľad ${index + 1}`} />
                  </div>
                ))}
                {images.length > 6 && (
                  <div
                    className="thumbnail more"
                    onClick={() => setSliderOpen(true)}
                  >
                    <div className="more-overlay">
                      <span>+{images.length - 6}</span>
                    </div>
                    <img src={images[6]} alt="Ďalšie" />
                  </div>
                )}
              </div>
            )}

            {/* Popis - samostatná kartička */}
            <div className="detail-card">
              <h3>Popis nehnuteľnosti</h3>
              <p>{reality.desc}</p>
            </div>
          </div>

          {/* Pravý stĺpec - Info a kontakt */}
          <div className="detail-right">
            {/* Základné informácie - kartička */}
            <div className="detail-card">
              <h3>Základné informácie</h3>
              <table className="detail-info-table">
                <tbody>
                  <tr>
                    <td className="info-label">Typ nehnuteľnosti</td>
                    <td className="info-value">
                      {reality.type === "byt"
                        ? "Byt"
                        : reality.type === "dom"
                          ? "Rodinný dom"
                          : "Pozemok"}
                    </td>
                  </tr>
                  <tr>
                    <td className="info-label">Ponuka</td>
                    <td className="info-value">
                      {reality.state === "predaj" ? "Na predaj" : "Na prenájom"}
                    </td>
                  </tr>
                  <tr>
                    <td className="info-label">Úžitková plocha</td>
                    <td className="info-value">{reality.area} m²</td>
                  </tr>
                  {reality.rooms && (
                    <tr>
                      <td className="info-label">Počet izieb</td>
                      <td className="info-value">{reality.rooms}</td>
                    </tr>
                  )}
                  {reality.bathrooms && (
                    <tr>
                      <td className="info-label">Kúpeľne</td>
                      <td className="info-value">{reality.bathrooms}</td>
                    </tr>
                  )}
                  {reality.constructionYear && (
                    <tr>
                      <td className="info-label">Rok výstavby</td>
                      <td className="info-value">{reality.constructionYear}</td>
                    </tr>
                  )}
                  {reality.condition && (
                    <tr>
                      <td className="info-label">Stav</td>
                      <td className="info-value">{reality.condition}</td>
                    </tr>
                  )}
                  {reality.landType && (
                    <tr>
                      <td className="info-label">Typ pozemku</td>
                      <td className="info-value">{reality.landType}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Vybavenie - kartička (ak existuje) */}
            {(reality.hasGarage ||
              reality.hasBalcony ||
              reality.hasTerrace ||
              reality.hasElevator) && (
              <div className="detail-card">
                <h3>Vybavenie</h3>
                <div className="detail-features">
                  {reality.hasGarage && <span className="feature">Garáž</span>}
                  {reality.hasBalcony && (
                    <span className="feature">Balkón</span>
                  )}
                  {reality.hasTerrace && (
                    <span className="feature">Terasa</span>
                  )}
                  {reality.hasElevator && (
                    <span className="feature">Výťah</span>
                  )}
                </div>
              </div>
            )}

            {showOfferModal && reality && (
              <OfferModal
                nehnutelnostId={reality._id}
                originalPrice={reality.price}
                onClose={() => setShowOfferModal(false)}
              />
            )}

            {/* Adresa - kartička */}
            <div className="detail-card">
              <h3>Adresa</h3>
              <div className="detail-address">{formatAddress()}</div>
            </div>

            {/* Kontakt - kartička */}
            {/* <div className="detail-card">
              <h3>Kontaktovať makléra</h3>
              <div className="contact-info">
                <div className="contact-name">
                  <strong>
                    {typeof reality.author === "object"
                      ? reality.author.name
                      : "Realitná kancelária"}
                  </strong>
                </div>
                <div className="contact-email">
                  {" "}
                  {typeof reality.author === "object"
                    ? reality.author.email
                    : "info@domacerealty.sk"}
                </div>
              </div>
            </div> */}

            <div className="detail-card">
              <h3>Kontakt</h3>
              <div className="contact-info">
                <div className="contact-info-img">
                  <img
                    src="/makler.png"
                    alt="Maklér"
                    className="contact-avatar"
                  />
                </div>

                <div className="contact-name">
                  <strong>
                    <p>Ing. Stanislav Lauro</p>
                  </strong>
                  <p>Konatel, maklér</p>
                </div>
                <div className="contact-email">
                  <p>+421 907 26 61 </p>
                  <p>0907 26 61 61 </p>
                </div>
              </div>
            </div>

            {/* Tlačidlá pre úpravu (len pre admina/majiteľa) */}
            {canEdit && (
              <div className="detail-admin-actions">
                <button
                  className="styled-button"
                  onClick={() => navigate(`/reality/${id}/edit`)}
                >
                  Upraviť
                </button>
                <button className="btn-delete" onClick={handleDelete}>
                  Odstrániť
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
