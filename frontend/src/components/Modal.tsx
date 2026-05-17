// src/components/Modal.tsx
import { useEffect } from "react";

export default function Modal({ onClose }: { onClose: () => void }) {
  // Zatvorenie ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Zamknutie scrollu pozadia
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleLogin = () => {
    onClose();
    window.location.href = "/auth/login"; // ← priama navigácia
  };

  const handleSignup = () => {
    onClose();
    window.location.href = "/auth/signup"; // ← priama navigácia
  };

  return (
    <div className="modal-overlay-centered" onClick={handleOverlayClick}>
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <div className="modal-icon">🔒</div>
        <h3>Prihlásenie potrebné</h3>
        <p>Pre pridávanie obľúbených nehnuteľností sa musíte prihlásiť.</p>
        <div className="modal-buttons-centered">
          <button className="modal-btn-primary" onClick={handleLogin}>
            Prihlásiť sa
          </button>
          <button className="modal-btn-secondary" onClick={handleSignup}>
            Registrovať sa
          </button>
          <button className="modal-btn-outline" onClick={onClose}>
            Zrušiť
          </button>
        </div>
      </div>
    </div>
  );
}
