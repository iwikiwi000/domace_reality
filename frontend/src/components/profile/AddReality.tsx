// components/profile/AddReality.tsx
import { useNavigate } from "react-router-dom";

export default function AddReality() {
  const navigate = useNavigate();

  return (
    <div>
      <button className="styled-button" onClick={() => navigate("/reality/add")}>
        Pridať nový inzerát
      </button>
    </div>
  );
}