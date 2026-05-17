import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { useAuth } from "../context/useAuth";

import { usersService } from "../services/usersServices";

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: "", role: "" });
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (editingUser && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [editingUser]);

  const fetchUsers = async () => {
    try {
      const data = await usersService.getAll();
      setUsers(data);
    } catch (error) {
      console.error("Chyba pri načítaní používateľov:", error);
      toast.error("Nepodarilo sa načítať používateľov");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditForm({ name: user.name, role: user.role });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await usersService.update(editingUser.id, editForm);
      toast.success("Používateľ bol upravený");
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Chyba pri úprave:", error);
      toast.error("Nepodarilo sa upraviť používateľa");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;

    try {
      await usersService.delete(deletingUser.id);
      toast.success("Používateľ bol zmazaný");
      setDeletingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Chyba pri mazaní:", error);
      toast.error("Nepodarilo sa zmazať používateľa");
    }
  };

  // if (loading) {
  //   return <LoadingSpinner />;
  // }

  return (
    <div className="container mt-2">
      <h1>Používatelia</h1>
      <div className="mt-2">
        {users.length === 0 ? (
          <p>Žiadni používatelia</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "0.5rem",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Meno
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "0.5rem",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "0.5rem",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Rola
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "0.5rem",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Vytvorený
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "0.5rem",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Akcie
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td
                    style={{
                      padding: "0.5rem",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {user.name}
                  </td>
                  <td
                    style={{
                      padding: "0.5rem",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {user.email}
                  </td>
                  <td
                    style={{
                      padding: "0.5rem",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {user.role}
                  </td>
                  <td
                    style={{
                      padding: "0.5rem",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {new Date(user.createdAt).toLocaleDateString("sk-SK")}
                  </td>
                  <td
                    style={{
                      padding: "0.5rem",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => handleEditClick(user)}
                          className="btn btn-sm"
                          style={{ marginRight: "0.5rem" }}
                        >
                          Upraviť
                        </button>
                        <button
                          onClick={() => setDeletingUser(user)}
                          className="btn btn-sm btn-danger"
                        >
                          Zmazať
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* <Modal
        isOpen={editingUser !== null}
        onClose={() => setEditingUser(null)}
        title="Upraviť používateľa"
      >
        <form onSubmit={handleEditSubmit}>
          <div className="form-group">
            <label htmlFor="name">Meno</label>
            <input
              ref={nameInputRef}
              type="text"
              id="name"
              className="form-control"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group mt-1">
            <label htmlFor="role">Rola</label>
            <select
              id="role"
              className="form-control"
              value={editForm.role}
              onChange={(e) =>
                setEditForm({ ...editForm, role: e.target.value })
              }
              required
            >
              <option value={UserRole.USER}>User</option>
              <option value={UserRole.ADMIN}>Admin</option>
            </select>
          </div>
          <div
            className="mt-2"
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="btn"
            >
              Zrušiť
            </button>
            <button type="submit" className="btn btn-primary">
              Uložiť
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={deletingUser !== null}
        onClose={() => setDeletingUser(null)}
        title="Potvrdiť zmazanie"
      > */}
      <p>
        Naozaj chcete zmazať používateľa <strong>{deletingUser?.name}</strong>?
      </p>
      <div
        className="mt-2"
        style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}
      >
        <button onClick={() => setDeletingUser(null)} className="btn">
          Zrušiť
        </button>
        <button onClick={handleDeleteConfirm} className="btn btn-danger">
          Zmazať
        </button>
      </div>
      {/* </Modal> */}
    </div>
  );
}

export default UsersPage;
