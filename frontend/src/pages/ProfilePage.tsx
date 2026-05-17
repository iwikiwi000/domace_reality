import { useEffect, useState } from "react";
import MyRealities from "../components/profile/MyRealities";
import MyFavorites from "../components/profile/MyFavorites";
import { useNavigate } from "react-router-dom";
import {
  type Nehnutelnost,
  nehnutelnostiService,
} from "../services/nehnutelnostiService";
import { usersService } from "../services/usersServices";
import { useAuth } from "../context/useAuth";
import Settings from "../components/profile/Settings";
import OffersTab from "../components/profile/OffersTab";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Moje inzeráty");
  const [realities, setRealities] = useState<Nehnutelnost[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [realityData, userData] = await Promise.all([
          nehnutelnostiService.getAll(),
          usersService.getMe(),
        ]);
        setRealities(realityData);
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
    } else {
      setFavorites((prev) => [...prev, realityId]);
    }
  };

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const userRealities = realities.filter(
    (item) =>
      typeof item.author === "object" && item.author?._id === user?.userId,
  );

  const userFavorites = realities.filter((item) =>
    favorites.includes(item._id),
  );

  return (
    <div className="profile-page-wrapper">
      {/* Mobilný header */}
      <div className="profile-mobile-header">
        <button
          className="profile-hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h2>Môj profil</h2>
        <div className="profile-header-spacer"></div>
      </div>

      {/* Overlay pre mobil */}
      {mobileMenuOpen && (
        <div
          className="profile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`profile-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <div className="profile-sidebar-inner">
          <div className="profile-info">
            <p className="profile-email">{user?.email || "user@example.com"}</p>
            <div className="profile-badge">Používateľ</div>
          </div>

          <nav className="profile-nav">
            <div className="profile-nav-top">
              <button className="nav-item" onClick={() => navigate("/")}>
                <span className="nav-icon">🏠</span>
                <span>Domov</span>
              </button>

              <button
                className={`nav-item ${activeTab === "offers" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("offers");
                  setMobileMenuOpen(false);
                }}
              >
                <span className="nav-icon">📩</span>
                <span>Prijaté ponuky</span>
              </button>

              <button
                className={`nav-item ${activeTab === "Moje inzeráty" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("Moje inzeráty");
                  setMobileMenuOpen(false);
                }}
              >
                <span className="nav-icon">📋</span>
                <span>Moje inzeráty</span>
              </button>

              <button
                className={`nav-item ${activeTab === "Obľúbené" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("Obľúbené");
                  setMobileMenuOpen(false);
                }}
              >
                <span className="nav-icon">❤️</span>
                <span>Obľúbené</span>
              </button>

              <button
                className="nav-item"
                onClick={() => {
                  navigate("/reality/add");
                  setMobileMenuOpen(false);
                }}
              >
                <span className="nav-icon">➕</span>
                <span>Pridať inzerát</span>
              </button>
            </div>

            <div className="profile-nav-bottom">
              <button
                className={`nav-item ${activeTab === "Nastavenia" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("Nastavenia");
                  setMobileMenuOpen(false);
                }}
              >
                <span className="nav-icon">⚙️</span>
                <span>Nastavenia</span>
              </button>

              <button className="nav-item logout" onClick={handleLogout}>
                <span className="nav-icon">🚪</span>
                <span>Odhlásiť sa</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Hlavný obsah */}
      <div className="profile-main-content">
        {activeTab === "offers" && (
          <div className="tab-content">
            <div className="tab-header">
              <h1>Prijaté ponuky</h1>
              <p className="tab-description">
                Prehľad všetkých ponúk na vaše nehnuteľnosti
              </p>
            </div>
            <OffersTab />
          </div>
        )}

        {activeTab === "Moje inzeráty" && (
          <div className="tab-content">
            <div className="tab-header">
              <h1>Moje inzeráty</h1>
              <p className="tab-description">
                Správa vašich vlastných nehnuteľností
              </p>
            </div>
            <div className="content-area">
              {userRealities.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h3>Žiadne inzeráty</h3>
                  <p>Zatiaľ ste nevytvorili žiadny inzerát.</p>
                  <button
                    className="empty-action-btn"
                    onClick={() => navigate("/reality/add")}
                  >
                    + Pridať prvý inzerát
                  </button>
                </div>
              ) : (
                <div className="realities-grid">
                  <MyRealities
                    realities={userRealities}
                    favorites={favorites}
                    onFavChange={handleFavChange}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "Obľúbené" && (
          <div className="tab-content">
            <div className="tab-header">
              <h1>Moje obľúbené</h1>
              <p className="tab-description">
                Zoznam vašich obľúbených nehnuteľností
              </p>
            </div>
            <div className="content-area">
              <MyFavorites
                realities={realities}
                favorites={favorites}
                onFavChange={handleFavChange}
              />
            </div>
          </div>
        )}

        {activeTab === "Nastavenia" && (
          <div className="tab-content">
            <div className="tab-header">
              <h1>Nastavenia účtu</h1>
              <p className="tab-description">
                Správa vášho profilu a nastavení
              </p>
            </div>
            <div className="content-area">
              <Settings />
            </div>
          </div>
        )}
      </div>

      <style>{`
        :root {
          --primary-color: #0d47a1;
          --primary-hover: #0d47a1;
          --primary-light: #eff6ff;
          --text-dark: #111827;
          --text-gray: #6b7280;
          --text-light: #9ca3af;
          --border-light: #e5e7eb;
          --bg-white: #ffffff;
          --bg-gray: #f9fafb;
          --danger: #dc2626;
          --danger-light: #fef2f2;
          --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* Wrapper */
        .profile-page-wrapper {
          display: flex;
          align-items: flex-start;
          min-height: 100vh;
          background: var(--bg-gray);
        }

        /* Mobilný header */
        .profile-mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: var(--bg-white);
          padding: 1rem;
          box-shadow: var(--shadow-sm);
          z-index: 1000;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-light);
        }

        .profile-mobile-header h2 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-dark);
        }

        .profile-header-spacer {
          width: 30px;
        }

        /* Hamburger menu */
        .profile-hamburger {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .profile-hamburger span {
          width: 22px;
          height: 2px;
          background: var(--text-dark);
          border-radius: 2px;
          transition: 0.3s;
        }

        /* Sidebar - NO SCROLL */
        .profile-sidebar {
          width: 280px;
          background: var(--bg-white);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          align-self: flex-start;
          min-height: 100vh;
          height: auto;
          overflow-y: visible;
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }

        .profile-sidebar-inner {
          padding: 0.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        /* Profile info */
        .profile-info {
          text-align: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-light);
          flex-shrink: 0;
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          background: var(--primary-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 600;
          color: white;
          margin: 0 auto 1rem;
        }

        .profile-email {
          font-size: 0.85rem;
          color: var(--text-gray);
          margin-bottom: 0.5rem;
          word-break: break-all;
        }

        .profile-badge {
          display: inline-block;
          background: var(--primary-light);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.7rem;
          color: var(--primary-color);
          font-weight: 500;
        }

        /* Navigation - NO SCROLL */
        .profile-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: visible;
        }

        .profile-nav-top,
        .profile-nav-bottom {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .profile-nav-bottom {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-light);
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.7rem 1rem;
          background: none;
          border: none;
          color: var(--text-gray);
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          width: 100%;
          text-align: left;
        }

        .nav-item:hover {
          background: var(--bg-gray);
          color: var(--text-dark);
        }

        .nav-item.active {
          background: var(--primary-light);
          color: var(--primary-color);
          font-weight: 500;
        }

        .nav-icon {
          font-size: 1.2rem;
          min-width: 28px;
        }

        .nav-item.logout:hover {
          background: var(--danger-light);
          color: var(--danger);
        }

        /* Overlay */
        .profile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 99;
          display: none;
        }

        /* Main content */
        .profile-main-content {
          flex: 1;
          padding: 2rem;
          min-width: 0;
        }

        .tab-content {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .tab-header {
          margin-bottom: 2rem;
        }

        .tab-header h1 {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
        }

        .tab-description {
          color: var(--text-gray);
          font-size: 0.9rem;
        }

        .content-area {
          background: var(--bg-white);
          border-radius: 16px;
          padding: 1.5rem;
        }

        /* Realities grid */
        .realities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        /* Empty state */
        .empty-state {
          text-align: center;
          padding: 3rem;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.6;
        }

        .empty-state h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: var(--text-gray);
          margin-bottom: 1.5rem;
        }

        .empty-action-btn {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 10px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .empty-action-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .profile-mobile-header {
            display: flex;
          }

          .profile-sidebar {
            position: fixed;
            transform: translateX(-100%);
            top: 0;
            left: 0;
            z-index: 100;
            height: 100vh;
            overflow-y: auto;
          }

          .profile-sidebar.open {
            transform: translateX(0);
            box-shadow: var(--shadow-lg);
          }

          .profile-overlay {
            display: block;
          }

          .profile-main-content {
            padding: 5rem 1rem 2rem;
          }

          .realities-grid {
            grid-template-columns: 1fr;
          }

          .content-area {
            padding: 1rem;
          }

          .tab-header h1 {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .empty-state {
            padding: 2rem 1rem;
          }
          
          .empty-icon {
            font-size: 3rem;
          }
          
          .empty-state h3 {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
