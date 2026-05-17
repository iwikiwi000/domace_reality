import Categories from "../components/home/Categories";
import Search from "../components/Search";
import MyFavorites from "../components/profile/MyFavorites";
import LatestRealities from "../components/home/Latest";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  type Nehnutelnost,
  nehnutelnostiService,
} from "../services/nehnutelnostiService";
import { useAuth } from "../context/useAuth";
import { usersService } from "../services/usersServices";
import Hero from "../components/home/Hero";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState({
    location: "",
    state: "",
    type: "",
    priceMin: "",
    priceMax: "",
  });
  const [realities, setRealities] = useState<Nehnutelnost[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { user } = useAuth();

  const navigate = useNavigate();

  // HomePage.tsx – oprav handleSearch aby bral aktuálne hodnoty
  const handleSearch = (data?: {
    location: string;
    state: string;
    type: string;
    priceMin: string;
    priceMax: string;
  }) => {
    const term = data ?? searchTerm;
    const query = new URLSearchParams();
    if (term.location) query.append("location", term.location);
    if (term.state) query.append("state", term.state);
    if (term.type) query.append("type", term.type);
    if (term.priceMin) query.append("priceMin", term.priceMin);
    if (term.priceMax) query.append("priceMax", term.priceMax);
    navigate(`/reality?${query.toString()}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const realityData = await nehnutelnostiService.getAll();
        setRealities(realityData);

        if (user) {
          const userData = await usersService.getMe();
          setFavorites(userData.favorites ?? []);
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error("Chyba pri načítaní:", error);
      }
    };

    fetchData();
  }, [user]);

  const handleFavChange = (realityId: string, isLiked: boolean) => {
    if (!isLiked) {
      setFavorites((prev) => prev.filter((id) => id !== realityId));
    } else {
      setFavorites((prev) => [...prev, realityId]);
    }
  };

  return (
    <>
      <section className="hero-section-container">
        <Hero />
      </section>
      <section className="homepage-search">
        <Search setSearchTerm={setSearchTerm} onSearch={handleSearch} />
      </section>
      <section className="content">
        <Categories />
      </section>

      {user ? (
        <section className="content">
          <MyFavorites
            realities={realities}
            favorites={favorites}
            onFavChange={handleFavChange}
          />
        </section>
      ) : (
        <section className="content">
          <LatestRealities
            realities={realities}
            favorites={favorites}
            onFavChange={handleFavChange}
          />
        </section>
      )}

      <div className="homepage-cta">
        <div className="cta-container">
          <div className="cta-left">
            <h2>Predajte svoju nehnuteľnosť rýchlo a jednoducho</h2>
            <p>
              Pridajte inzerát zdarma a oslovte tisíce potenciálnych kupujúcich.
            </p>
            <button
              className="cta-button"
              onClick={() => navigate("/reality/add")}
            >
              Pridať inzerát
            </button>
          </div>

          <div className="cta-center">
            <img src="/cta_home.png" alt="Domček" />

            {/* Kartičky okolo domčeka */}
            <div className="stat-card stat-card-1">
              <div className="stat-icon">⚡</div>
              <div className="stat-text">
                <h3>Rýchle zverejnenie</h3>
                <p>Online do 5 minút</p>
              </div>
            </div>

            <div className="stat-card stat-card-2">
              <div className="stat-icon">📢</div>
              <div className="stat-text">
                <h3>Široký dosah</h3>
                <p>Tisíce návštevníkov</p>
              </div>
            </div>

            <div className="stat-card stat-card-3">
              <div className="stat-icon">📈</div>
              <div className="stat-text">
                <h3>Záujem o ponuku</h3>
                <p className="highlight-value">+125 %</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
