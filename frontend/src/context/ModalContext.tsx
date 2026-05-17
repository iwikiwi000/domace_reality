// src/context/ModalContext.tsx
import { createContext, useContext, useState } from "react";
import Modal from "../components/Modal";

type ModalContextType = {
  setShowLoginModal: (show: boolean) => void;
};

const ModalContext = createContext<ModalContextType>({
  setShowLoginModal: () => {},
});

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <ModalContext.Provider value={{ setShowLoginModal }}>
      {children}
      {showLoginModal && <Modal onClose={() => setShowLoginModal(false)} />}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
