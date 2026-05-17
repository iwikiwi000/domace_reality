import CategoryCard from "../cards/CategoryCard";

import apartmentIcon from "/apartment-icon.png";
import houseImg from "/house-icon.png";
import landImg from "/land-icon.png";

export default function Categories() {
  return (
    <div className="categories-container">
      <h1>Čo hľadáte?</h1>
      <div className="categories-content">
        <CategoryCard typ={"Pozemky"} icon={landImg} />
        <CategoryCard typ={"Domy"} icon={houseImg} />
        <CategoryCard typ={"Byty"} icon={apartmentIcon} />
      </div>
    </div>
  );
}
