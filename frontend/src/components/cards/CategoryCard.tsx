import { useNavigate } from "react-router-dom";

export default function CategoryCard({
  typ,
  icon,
}: {
  typ: string;
  icon: string;
}) {
  const navigate = useNavigate();

  const getType = () => {
    if (typ === "Byty") return "byt";
    if (typ === "Domy") return "dom";
    if (typ === "Pozemky") return "pozemok";
    return "";
  };

  return (
    <div
      className="category-card"
      onClick={() => navigate(`/reality?type=${getType()}`)}
    >
      <div className="category-icon-wrapper">
        <img src={icon} alt={typ} />
      </div>
      <h3>{typ}</h3>
    </div>
  );
}
