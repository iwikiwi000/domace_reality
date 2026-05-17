// components/profile/Settings.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuth } from "../../context/useAuth";
import { usersService } from "../../services/usersServices";
import FormInput from "../../components/forms/FormInput";

type ProfileFormData = {
  name: string;
  email: string;
};

type PasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function Settings() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await usersService.getMe();
        resetProfile({
          name: userData.name || "",
          email: userData.email || "",
        });
      } catch (error) {
        console.error("Chyba pri načítaní používateľa:", error);
        toast.error("Nepodarilo sa načítať údaje používateľa");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [resetProfile]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      const updatedUser = await usersService.updateMe({
        name: data.name,
        email: data.email,
      });

      // Aktualizácia používateľa v kontexte
      if (user && login) {
        const token = localStorage.getItem("auth_token");
        if (token) {
          login(token, {
            userId: user.userId,
            email: data.email,
            role: user.role,
            isAdmin: user.isAdmin,
          });
        }
      }

      toast.success("Profil bol úspešne aktualizovaný");
    } catch (error: any) {
      console.error("Chyba pri aktualizácii profilu:", error);
      toast.error(
        error.response?.data?.message || "Nepodarilo sa aktualizovať profil",
      );
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Nové heslo sa nezhoduje s potvrdením");
      return;
    }

    if (data.newPassword.length < 6) {
      toast.error("Nové heslo musí mať aspoň 6 znakov");
      return;
    }

    try {
      await usersService.updateMyPassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast.success("Heslo bolo úspešne zmenené");
      resetPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
    } catch (error: any) {
      console.error("Chyba pri zmene hesla:", error);
      toast.error(
        error.response?.data?.message || "Nepodarilo sa zmeniť heslo",
      );
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Naozaj chcete zmazať svoj účet? Táto akcia je nevratná a všetky vaše inzeráty budú odstránené.",
    );

    if (!confirmed) return;

    try {
      await usersService.deleteMe();
      localStorage.removeItem("auth_token");
      localStorage.removeItem("token");
      toast.success("Účet bol úspešne zmazaný");
      navigate("/auth/login");
    } catch (error: any) {
      console.error("Chyba pri mazaní účtu:", error);
      toast.error(error.response?.data?.message || "Nepodarilo sa zmazať účet");
    }
  };

  if (loading) {
    return (
      <div className="settings-container">
        <div className="settings-card">
          <p>Načítavam nastavenia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="settings-card">
        <form
          onSubmit={handleProfileSubmit(onProfileSubmit)}
          className="settings-form"
        >
          <h2>Osobné údaje</h2>

          <FormInput
            label="Meno"
            name="name"
            type="text"
            register={registerProfile}
            error={profileErrors.name}
            required
          />

          <FormInput
            label="Email"
            name="email"
            type="email"
            register={registerProfile}
            error={profileErrors.email}
            required
          />

          <button type="submit" className="settings-button primary">
            Uložiť zmeny
          </button>
        </form>

        {/* Formulár pre zmenu hesla */}
        <div className="settings-section">
          <h2>Zmena hesla</h2>
          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="settings-button secondary"
            >
              Zmeniť heslo
            </button>
          ) : (
            <form
              onSubmit={handlePasswordSubmit(onPasswordSubmit)}
              className="settings-form"
            >
              <FormInput
                label="Aktuálne heslo"
                name="currentPassword"
                type="password"
                register={registerPassword}
                error={passwordErrors.currentPassword}
                required
              />

              <FormInput
                label="Nové heslo"
                name="newPassword"
                type="password"
                register={registerPassword}
                error={passwordErrors.newPassword}
                required
              />

              <FormInput
                label="Potvrdenie nového hesla"
                name="confirmPassword"
                type="password"
                register={registerPassword}
                error={passwordErrors.confirmPassword}
                required
              />

              <div className="settings-buttons-group">
                <button type="submit" className="settings-button primary">
                  Zmeniť heslo
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="settings-button danger"
                >
                  Zrušiť
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Nebezpečná zóna - zmazanie účtu */}
        <div className="settings-section danger-zone">
          <p>Zmazanie účtu je nevratné. Všetky vaše údaje budú odstránené.</p>
          <button
            onClick={handleDeleteAccount}
            className="settings-button delete"
          >
            Zmazať účet
          </button>
        </div>
      </div>
    </div>
  );
}
