import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useForm, type Control } from "react-hook-form";
import RealityCard from "../../components/cards/RealityCard";
import Search from "../../components/Search";
import FormSelect from "../../components/forms/FormSelect";
import { useSearchParams } from "react-router-dom";
import {
  type Nehnutelnost,
  nehnutelnostiService,
} from "../../services/nehnutelnostiService";
import { usersService } from "../../services/usersServices";
import { useAuth } from "../../context/useAuth";

type SortFormData = {
  sortBy: string;
};

export default function Reality() {
  const [realities, setRealities] = useState<Nehnutelnost[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const hasFetched = useRef(false);
  const { user } = useAuth();
  const [filteredRealitiesState, setFilteredRealitiesState] = useState<
    Nehnutelnost[]
  >([]);

  const initialSearchTerm = useMemo(
    () => ({
      location: searchParams.get("location") ?? "",
      state: searchParams.get("state") ?? "",
      type: searchParams.get("type") ?? "",
      priceMin: searchParams.get("priceMin") ?? "",
      priceMax: searchParams.get("priceMax") ?? "",
    }),
    [searchParams],
  );

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  const { register, watch, setValue, control } = useForm<SortFormData>({
    defaultValues: {
      sortBy: searchParams.get("sort") ?? "newest",
    },
  });

  const sortBy = watch("sortBy");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const realityData = await nehnutelnostiService.getAll();
        setRealities(realityData);

        if (user?.userId) {
          const userData = await usersService.getMe();
          setFavorites(userData.favorites ?? []);
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error("Nastala chyba pri načítaní realít: ", error);
        setError("Nepodarilo sa načítať nehnuteľnosti");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.userId]);

  useEffect(() => {
    setSearchTerm({
      location: searchParams.get("location") ?? "",
      state: searchParams.get("state") ?? "",
      type: searchParams.get("type") ?? "",
      priceMin: searchParams.get("priceMin") ?? "",
      priceMax: searchParams.get("priceMax") ?? "",
    });
  }, [searchParams]);

  // Filtrovanie nehnuteľností
  useEffect(() => {
    if (realities.length === 0) return;

    const filtered = realities.filter((reality) => {
      const matchesLocation =
        !searchTerm.location ||
        reality.location?.city
          ?.toLowerCase()
          .includes(searchTerm.location.toLowerCase()) ||
        reality.location?.street
          ?.toLowerCase()
          .includes(searchTerm.location.toLowerCase());

      const matchesState =
        !searchTerm.state ||
        reality.state?.toLowerCase() === searchTerm.state.toLowerCase();

      const matchesType =
        !searchTerm.type ||
        reality.type?.toLowerCase() === searchTerm.type.toLowerCase();

      const matchesPriceMin =
        !searchTerm.priceMin || reality.price >= Number(searchTerm.priceMin);

      const matchesPriceMax =
        !searchTerm.priceMax || reality.price <= Number(searchTerm.priceMax);

      return (
        matchesLocation &&
        matchesState &&
        matchesType &&
        matchesPriceMin &&
        matchesPriceMax
      );
    });

    setFilteredRealitiesState(filtered);
  }, [realities, searchTerm]);

  // Zoradenie nehnuteľností
  const sortedRealities = [...filteredRealitiesState].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === "price-asc") {
      return a.price - b.price;
    } else if (sortBy === "price-desc") {
      return b.price - a.price;
    }
    return 0;
  });

  const handleFavChange = useCallback((realityId: string, isLiked: boolean) => {
    setFavorites((prev) => {
      const newFavorites = isLiked
        ? [...prev, realityId]
        : prev.filter((id) => id !== realityId);
      return newFavorites;
    });
  }, []);

  const sortOptions = [
    { value: "newest", label: "Najnovšie" },
    { value: "oldest", label: "Najstaršie" },
    { value: "price-asc", label: "Najlacnejšie" },
    { value: "price-desc", label: "Najdrahšie" },
  ];

  if (loading) {
    return <div className="reality-page">Načítavam nehnuteľnosti...</div>;
  }

  if (error) {
    return <div className="reality-page error">{error}</div>;
  }

  return (
    <div className="reality-page">
      <div
        className="reality-hero"
        style={{ textAlign: "left", marginBottom: "20px" }}
      >
        <h1>Ponuka nehnuteľností</h1>
      </div>

      {/* Search komponent s initialValues */}
      <Search
        setSearchTerm={setSearchTerm}
        initialValues={initialSearchTerm} // ← nie searchTerm
      />

      <div className="reality-header">
        <p className="reality-count">
          Nájdených {sortedRealities.length} nehnuteľností
        </p>
        <div className="reality-sort">
          <FormSelect
            label="Zoradiť podľa"
            name="sortBy"
            control={control}
            options={sortOptions}
          />
        </div>
      </div>

      <div className="realities-list">
        {sortedRealities.length === 0 ? (
          <div className="no-results">
            <p>Žiadne nehnuteľnosti nespĺňajú vaše kritériá.</p>
            <button
              className="styled-button"
              onClick={() => {
                setSearchTerm({
                  location: "",
                  state: "",
                  type: "",
                  priceMin: "",
                  priceMax: "",
                });
                setValue("sortBy", "newest");
              }}
            >
              Zrušiť filter
            </button>
          </div>
        ) : (
          sortedRealities.map((reality) => (
            <RealityCard
              key={reality._id}
              reality={reality}
              favorites={favorites}
              onFavChange={handleFavChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
