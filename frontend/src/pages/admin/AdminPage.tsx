import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/useAuth";
import { usersService } from "../../services/usersServices";
import { UserRole } from "../../types/user-role.enum";
import {
  nehnutelnostiService,
  type Nehnutelnost,
} from "../../services/nehnutelnostiService";
import RealityCard from "../../components/cards/RealityCard";
import Settings from "../../components/profile/Settings";
import OffersTab from "../../components/profile/OffersTab";

type User = {
  _id: string;
  id?: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export default function AdminPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: "", role: "" });
  const [activeTab, setActiveTab] = useState("users");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { isAdmin, user } = useAuth();

  const [realities, setRealities] = useState<Nehnutelnost[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchRealitiesAndFavorites();
  }, []);

  useEffect(() => {
    if (editingUser && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [editingUser]);

  const fetchUsers = async () => {
    try {
      const data = await usersService.getAll();
      const usersWithId = data.map((u: any) => ({
        ...u,
        id: u._id || u.id,
      }));
      setUsers(usersWithId);
    } catch (error) {
      console.error("Chyba pri načítaní používateľov:", error);
      toast.error("Nepodarilo sa načítať používateľov");
    } finally {
      setLoading(false);
    }
  };

  const fetchRealitiesAndFavorites = async () => {
    try {
      const [allRealities, userData] = await Promise.all([
        nehnutelnostiService.getAll(),
        usersService.getMe(),
      ]);
      setRealities(allRealities);
      setFavorites(userData.favorites ?? []);
    } catch (error) {
      console.error("Chyba pri načítaní dát:", error);
    }
  };

  const handleFavChange = (realityId: string, isLiked: boolean) => {
    if (!isLiked) {
      setFavorites((prev) => prev.filter((id) => id !== realityId));
    } else {
      setFavorites((prev) => [...prev, realityId]);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditForm({ name: user.name, role: user.role });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const userId = editingUser._id || editingUser.id;
    if (!userId) {
      toast.error("Neplatné ID používateľa");
      return;
    }

    try {
      await usersService.update(userId, editForm);
      toast.success("Používateľ bol upravený");
      setShowEditModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Chyba pri úprave:", error);
      toast.error("Nepodarilo sa upraviť používateľa");
    }
  };

  const handleDeleteClick = (user: User) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;

    const userId = deletingUser._id || deletingUser.id;
    if (!userId) {
      toast.error("Neplatné ID používateľa");
      return;
    }

    try {
      await usersService.delete(userId);
      toast.success("Používateľ bol zmazaný");
      setShowDeleteModal(false);
      setDeletingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Chyba pri mazaní:", error);
      toast.error("Nepodarilo sa zmazať používateľa");
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    let date: Date;
    if (typeof dateString === "number" || !isNaN(Number(dateString))) {
      date = new Date(Number(dateString));
    } else {
      date = new Date(dateString);
    }
    if (isNaN(date.getTime())) return "—";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  if (loading) {
    return (
      <div
        className="profile-page-wrapper"
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <p style={{ color: "var(--text-gray)" }}>Načítavam používateľov...</p>
      </div>
    );
  }

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
        <h2>Admin panel</h2>
        <div className="profile-header-spacer"></div>
      </div>

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
            <div className="profile-avatar-letter">
              {user?.email?.charAt(0).toUpperCase() || "A"}
            </div>
            <p className="profile-email">
              {user?.email || "admin@example.com"}
            </p>
            <div className="profile-badge">Administrátor</div>
          </div>

          <nav className="profile-nav">
            <div className="profile-nav-top">
              <button
                className={`nav-item ${activeTab === "offers" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("offers");
                  setMobileMenuOpen(false);
                }}
              >
                <span className="nav-icon">📩</span>
                <span>Ponuky</span>
              </button>

              {isAdmin && (
                <button
                  className={`nav-item ${activeTab === "users" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("users");
                    setMobileMenuOpen(false);
                  }}
                >
                  <span className="nav-icon">👥</span>
                  <span>Správa používateľov</span>
                </button>
              )}

              <button
                className={`nav-item ${activeTab === "myRealities" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("myRealities");
                  setMobileMenuOpen(false);
                }}
              >
                <span className="nav-icon">📋</span>
                <span>Moje inzeráty</span>
              </button>

              <button
                className={`nav-item ${activeTab === "favorites" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("favorites");
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
                className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("settings");
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
            <OffersTab isAdmin={true} />
          </div>
        )}

        {activeTab === "users" && isAdmin && (
          <div className="tab-content">
            <div className="tab-header">
              <h1>Správa používateľov</h1>
              <p className="tab-description">
                Správa a administrácia všetkých používateľov systému
              </p>
            </div>
            <div className="content-area">
              {users.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">👥</div>
                  <h3>Žiadni používatelia</h3>
                  <p>Zatiaľ nie sú registrovaní žiadni používatelia.</p>
                </div>
              ) : (
                <div className="users-grid">
                  {users.map((u) => (
                    <div key={u._id || u.id} className="user-card">
                      <div className="user-card-header">
                        <div className="user-avatar-letter small">
                          {u.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="user-info">
                          <h3>{u.name || "Neznáme meno"}</h3>
                          <p className="user-email">
                            {u.email || "Neznámy email"}
                          </p>
                        </div>
                        <div className={`user-role-badge ${u.role}`}>
                          {u.role === "admin" ? "Admin" : "Používateľ"}
                        </div>
                      </div>
                      <div className="user-card-footer">
                        <div className="user-date">
                          <span className="date-label">Registrovaný:</span>
                          <span className="date-value">
                            {formatDate(u.createdAt)}
                          </span>
                        </div>
                        {isAdmin && (
                          <div className="user-actions">
                            <button
                              onClick={() => handleEditClick(u)}
                              className="action-btn edit-btn"
                            >
                              Upraviť
                            </button>
                            <button
                              onClick={() => handleDeleteClick(u)}
                              className="action-btn delete-btn"
                            >
                              Zmazať
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "myRealities" && (
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
                  {userRealities.map((reality) => (
                    <RealityCard
                      key={reality._id}
                      reality={reality}
                      favorites={favorites}
                      onFavChange={handleFavChange}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="tab-content">
            <div className="tab-header">
              <h1>Moje obľúbené</h1>
              <p className="tab-description">
                Zoznam vašich obľúbených nehnuteľností
              </p>
            </div>
            <div className="content-area">
              {userFavorites.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">❤️</div>
                  <h3>Žiadne obľúbené</h3>
                  <p>
                    Zatiaľ ste si neoznačili žiadnu nehnuteľnosť ako obľúbenú.
                  </p>
                  <button
                    className="empty-action-btn"
                    onClick={() => navigate("/")}
                  >
                    Prezerať nehnuteľnosti
                  </button>
                </div>
              ) : (
                <div className="realities-grid">
                  {userFavorites.map((reality) => (
                    <RealityCard
                      key={reality._id}
                      reality={reality}
                      favorites={favorites}
                      onFavChange={handleFavChange}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Upraviť používateľa</h3>
              <button
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-form-group">
                <label htmlFor="name">Meno</label>
                <input
                  ref={nameInputRef}
                  type="text"
                  id="name"
                  className="modal-input"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="modal-form-group">
                <label htmlFor="role">Rola</label>
                <select
                  id="role"
                  className="modal-input"
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({ ...editForm, role: e.target.value })
                  }
                  required
                >
                  <option value={UserRole.USER}>Používateľ</option>
                  <option value={UserRole.ADMIN}>Administrátor</option>
                </select>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="modal-btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Zrušiť
                </button>
                <button type="submit" className="modal-btn-primary">
                  Uložiť zmeny
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Zmazať používateľa</h3>
              <button
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-warning">
                <span className="warning-icon">⚠️</span>
                <p>
                  Naozaj chcete zmazať používateľa{" "}
                  <strong>{deletingUser?.name}</strong>?
                </p>
                <p className="warning-text">Táto akcia je nevratná.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="modal-btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Zrušiť
              </button>
              <button
                type="button"
                className="modal-btn-danger"
                onClick={handleDeleteConfirm}
              >
                Zmazať používateľa
              </button>
            </div>
          </div>
        </div>
      )}

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

        * { margin: 0; padding: 0; box-sizing: border-box; }

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
          top: 0; left: 0; right: 0;
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

        .profile-header-spacer { width: 30px; }

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

        /* Sidebar */
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

        .profile-info {
          text-align: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-light);
          flex-shrink: 0;
        }

        .profile-avatar-letter {
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

        .profile-avatar-letter.small {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          font-size: 1.2rem;
          margin: 0;
          flex-shrink: 0;
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

        .nav-item:hover { background: var(--bg-gray); color: var(--text-dark); }

        .nav-item.active {
          background: var(--primary-light);
          color: var(--primary-color);
          font-weight: 500;
        }

        .nav-icon { font-size: 1.2rem; min-width: 28px; }

        .nav-item.logout:hover { background: var(--danger-light); color: var(--danger); }

        .profile-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
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

        .tab-content { animation: fadeIn 0.3s ease; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .tab-header { margin-bottom: 2rem; }

        .tab-header h1 {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
        }

        .tab-description { color: var(--text-gray); font-size: 0.9rem; }

        .content-area {
          background: var(--bg-white);
          border-radius: 16px;
          padding: 1.5rem;
        }

        /* Users grid */
        .users-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .user-card {
          background: var(--bg-white);
          border-radius: 16px;
          padding: 1.25rem;
          border: 1px solid var(--border-light);
          transition: all 0.2s ease;
        }

        .user-card:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--primary-color);
        }

        .user-card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .user-info { flex: 1; min-width: 0; }

        .user-info h3 {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 0.2rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-email {
          font-size: 0.78rem;
          color: var(--text-gray);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role-badge {
          padding: 0.25rem 0.65rem;
          border-radius: 20px;
          font-size: 0.68rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        .user-role-badge.admin { background: var(--primary-light); color: var(--primary-color); }
        .user-role-badge.user { background: var(--bg-gray); color: var(--text-gray); }

        .user-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.85rem;
          border-top: 1px solid var(--border-light);
        }

        .user-date { display: flex; flex-direction: column; gap: 0.2rem; }
        .date-label { font-size: 0.65rem; color: var(--text-light); text-transform: uppercase; }
        .date-value { font-size: 0.8rem; color: var(--text-gray); font-weight: 500; }

        .user-actions { display: flex; gap: 0.5rem; }

        .action-btn {
          padding: 0.35rem 0.75rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .edit-btn { background: var(--bg-gray); color: var(--text-dark); }
        .edit-btn:hover { background: var(--border-light); }
        .delete-btn { background: var(--danger-light); color: var(--danger); }
        .delete-btn:hover { background: #fee2e2; }

        /* Realities grid */
        .realities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        /* Empty state */
        .empty-state { text-align: center; padding: 3rem; }
        .empty-icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.6; }
        .empty-state h3 { font-size: 1.2rem; font-weight: 600; color: var(--text-dark); margin-bottom: 0.5rem; }
        .empty-state p { color: var(--text-gray); margin-bottom: 1.5rem; }

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

        .empty-action-btn:hover { background: var(--primary-hover); transform: translateY(-1px); }

        /* Modals */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          animation: fadeIn 0.2s ease;
        }

        .modal-container {
          background: var(--bg-white);
          border-radius: 20px;
          width: 90%;
          max-width: 480px;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border-light);
        }

        .modal-header h3 { font-size: 1.1rem; font-weight: 600; color: var(--text-dark); }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.1rem;
          cursor: pointer;
          color: var(--text-light);
          transition: color 0.2s;
        }

        .modal-close:hover { color: var(--text-dark); }

        .modal-body { padding: 1.25rem 1.5rem; }

        .modal-form-group { padding: 1rem 1.5rem 0; }

        .modal-form-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-dark);
          margin-bottom: 0.4rem;
        }

        .modal-input {
          width: 100%;
          padding: 0.6rem 0.8rem;
          border: 1px solid var(--border-light);
          border-radius: 10px;
          font-size: 0.9rem;
          background: var(--bg-white);
          color: var(--text-dark);
          transition: all 0.2s;
        }

        .modal-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(13, 71, 161, 0.1);
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          padding: 1rem 1.5rem 1.5rem;
          border-top: 1px solid var(--border-light);
          margin-top: 1rem;
        }

        .modal-btn-primary {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 0.55rem 1.1rem;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-btn-primary:hover { background: var(--primary-hover); transform: translateY(-1px); }

        .modal-btn-secondary {
          background: var(--bg-gray);
          color: var(--text-dark);
          border: 1px solid var(--border-light);
          padding: 0.55rem 1.1rem;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-btn-secondary:hover { background: var(--border-light); }

        .modal-btn-danger {
          background: var(--danger);
          color: white;
          border: none;
          padding: 0.55rem 1.1rem;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-btn-danger:hover { background: #b91c1c; }

        .delete-warning { text-align: center; padding: 1rem; }
        .warning-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
        .warning-text { font-size: 0.8rem; color: var(--text-gray); margin-top: 0.5rem; }

        /* Responsive */
        @media (max-width: 768px) {
          .profile-mobile-header { display: flex; }

          .profile-sidebar {
            position: fixed;
            transform: translateX(-100%);
            top: 0; left: 0;
            z-index: 100;
            height: 100vh;
            overflow-y: auto;
          }

          .profile-sidebar.open {
            transform: translateX(0);
            box-shadow: var(--shadow-lg);
          }

          .profile-overlay { display: block; }

          .profile-main-content { padding: 5rem 1rem 2rem; }

          .users-grid,
          .realities-grid { grid-template-columns: 1fr; }

          .content-area { padding: 1rem; }

          .tab-header h1 { font-size: 1.5rem; }
        }

        @media (max-width: 480px) {
          .empty-state { padding: 2rem 1rem; }
          .empty-icon { font-size: 3rem; }
          .empty-state h3 { font-size: 1rem; }
          .user-card-footer { flex-direction: column; gap: 0.75rem; align-items: flex-start; }
          .user-actions { width: 100%; justify-content: flex-end; }
        }
      `}</style>
    </div>
  );
}
