import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import Slider from "@mui/material/Slider";
import FormSelect from "./forms/FormSelect";
import FormInput from "./forms/FormInput";
import {
  STATE_OPTIONS,
  PROPERTY_OPTIONS,
  SLOVAK_CITIES,
} from "../types/search-types";

type SearchFormData = {
  location: string;
  state: string;
  type: string;
  priceMin: string;
  priceMax: string;
};

type SearchData = {
  location: string;
  state: string;
  type: string;
  priceMin: string;
  priceMax: string;
};

type Props = {
  setSearchTerm: React.Dispatch<React.SetStateAction<SearchData>>;
  onSearch?: (data: SearchData) => void;
  initialValues?: Partial<SearchData>;
};

export default function Search({
  setSearchTerm,
  onSearch,
  initialValues,
}: Props) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [priceRange, setPriceRange] = useState<number[]>([
    initialValues?.priceMin ? Number(initialValues.priceMin) : 0,
    initialValues?.priceMax ? Number(initialValues.priceMax) : 10000000,
  ]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const hasUserInteracted = useRef(false);
  const isFirstRender = useRef(true);

  const { handleSubmit, setValue, watch, reset, control, register } =
    useForm<SearchFormData>({
      defaultValues: {
        location: initialValues?.location ?? "",
        state: initialValues?.state ?? "",
        type: initialValues?.type ?? "",
        priceMin: initialValues?.priceMin ?? "",
        priceMax: initialValues?.priceMax ?? "",
      },
    });

  const watchedLocation = watch("location");
  const watchedState = watch("state");
  const watchedType = watch("type");
  const watchedPriceMin = watch("priceMin");
  const watchedPriceMax = watch("priceMax");

  // Aktualizácia slidera keď sa zmenia hodnoty z URL (initialValues)
  useEffect(() => {
    if (
      initialValues?.priceMin !== undefined ||
      initialValues?.priceMax !== undefined
    ) {
      setPriceRange([
        initialValues.priceMin ? Number(initialValues.priceMin) : 0,
        initialValues.priceMax ? Number(initialValues.priceMax) : 10000000,
      ]);
    }
  }, [initialValues?.priceMin, initialValues?.priceMax]);

  useEffect(() => {
    if (!initialValues) return;

    const current = {
      location: watchedLocation,
      state: watchedState,
      type: watchedType,
      priceMin: watchedPriceMin,
      priceMax: watchedPriceMax,
    };

    const hasChanged =
      (initialValues.location ?? "") !== current.location ||
      (initialValues.state ?? "") !== current.state ||
      (initialValues.type ?? "") !== current.type ||
      (initialValues.priceMin ?? "") !== current.priceMin ||
      (initialValues.priceMax ?? "") !== current.priceMax;

    if (!hasChanged) return;

    reset({
      location: initialValues.location ?? "",
      state: initialValues.state ?? "",
      type: initialValues.type ?? "",
      priceMin: initialValues.priceMin ?? "",
      priceMax: initialValues.priceMax ?? "",
    });
    setPriceRange([
      initialValues.priceMin ? Number(initialValues.priceMin) : 0,
      initialValues.priceMax ? Number(initialValues.priceMax) : 10000000,
    ]);
  }, [
    initialValues?.location,
    initialValues?.state,
    initialValues?.type,
    initialValues?.priceMin,
    initialValues?.priceMax,
  ]);

  useEffect(() => {
    if (isHomePage && isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!hasUserInteracted.current) return;
    if (isHomePage) return;

    const searchData: SearchData = {
      location: watchedLocation,
      state: watchedState,
      type: watchedType,
      priceMin: watchedPriceMin,
      priceMax: watchedPriceMax,
    };
    setSearchTerm(searchData);
    onSearch?.(searchData);
  }, [watchedState, watchedType, watchedPriceMin, watchedPriceMax]);

  useEffect(() => {
    if ((watchedState || watchedType) && !hasUserInteracted.current) {
      hasUserInteracted.current = true;
    }
  }, [watchedState, watchedType]);

  useEffect(() => {
    if (watchedLocation && watchedLocation.trim().length > 0) {
      const filtered = SLOVAK_CITIES.filter((city) =>
        city.toLowerCase().includes(watchedLocation.toLowerCase()),
      );
      setFilteredCities(filtered.slice(0, 10));
      setShowSuggestions(true);
    } else {
      setFilteredCities([]);
      setShowSuggestions(false);
    }
  }, [watchedLocation]);

  const handlePriceRangeChange = (
    _event: Event,
    newValue: number | number[],
  ) => {
    const range = newValue as number[];
    setPriceRange(range);
    setValue("priceMin", range[0].toString());
    setValue("priceMax", range[1].toString());
    if (!hasUserInteracted.current) hasUserInteracted.current = true;
  };

  const handleCitySelect = (city: string) => {
    setValue("location", city);
    setShowSuggestions(false);
    hasUserInteracted.current = true;

    const searchData: SearchData = {
      location: city,
      state: watchedState,
      type: watchedType,
      priceMin: watchedPriceMin,
      priceMax: watchedPriceMax,
    };
    setSearchTerm(searchData);
    onSearch?.(searchData);
  };

  const onSubmit = (data: SearchFormData) => {
    const searchData: SearchData = {
      location: data.location,
      state: data.state,
      type: data.type,
      priceMin: data.priceMin,
      priceMax: data.priceMax,
    };
    setSearchTerm(searchData);
    onSearch?.(searchData);
  };

  const handleReset = () => {
    // Reset formulára
    reset({
      location: "",
      state: "",
      type: "",
      priceMin: "",
      priceMax: "",
    });

    // Reset slidera
    setPriceRange([0, 10000000]);

    // Reset interakcie
    hasUserInteracted.current = false;

    // Vyhľadaj s prázdnymi hodnotami
    const searchData: SearchData = {
      location: "",
      state: "",
      type: "",
      priceMin: "",
      priceMax: "",
    };
    setSearchTerm(searchData);
    onSearch?.(searchData);
  };

  const stateOptions = [
    { value: STATE_OPTIONS.ALL, label: "Všetky ponuky" },
    { value: STATE_OPTIONS.SALE, label: "Na predaj" },
    { value: STATE_OPTIONS.RENT, label: "Na prenájom" },
  ];

  const typeOptions = [
    { value: PROPERTY_OPTIONS.ALL, label: "Všetky typy" },
    { value: PROPERTY_OPTIONS.APARTMENT, label: "Byt" },
    { value: PROPERTY_OPTIONS.HOUSE, label: "Dom" },
    { value: PROPERTY_OPTIONS.LAND, label: "Pozemok" },
  ];

  const formatPrice = (price: number) => {
    if (price === 0) return "0 €";
    if (price >= 10000000) return "10 000 000+ €";
    return `${price.toLocaleString()} €`;
  };

  return (
    <div
      className={`search-wrapper ${isHomePage ? "homepage" : "reality-page"}`}
    >
      <div className="search-container">
        <form className="search-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="search-field">
            <div style={{ position: "relative" }}>
              <FormInput
                label="Kde"
                name="location"
                type="text"
                register={register}
                placeholder="Zadajte mesto"
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={() => {
                  if (watchedLocation?.trim().length > 0)
                    setShowSuggestions(true);
                }}
              />
              {showSuggestions && filteredCities.length > 0 && (
                <div className="city-suggestions">
                  {filteredCities.map((city) => (
                    <div
                      key={city}
                      className="city-suggestion"
                      onClick={() => handleCitySelect(city)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="search-field">
            <FormSelect
              label="Ponuka"
              name="state"
              control={control}
              options={stateOptions}
            />
          </div>

          <div className="search-field">
            <FormSelect
              label="Typ"
              name="type"
              control={control}
              options={typeOptions}
            />
          </div>

          <div className="search-field price-field">
            <label className="search-label">Cena</label>
            <div className="price-range-container">
              <div className="price-values">
                <span>{formatPrice(priceRange[0])}</span>
                <span className="price-separator">—</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
              <Slider
                value={priceRange}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                min={0}
                max={10000000}
                step={50000}
                getAriaValueText={(value) => `${value.toLocaleString()} €`}
                valueLabelFormat={(value) => `${value.toLocaleString()} €`}
                sx={{
                  color: "#0d47a1",
                  "& .MuiSlider-thumb": {
                    backgroundColor: "#0d47a1",
                    "&:hover": {
                      boxShadow: "0 0 0 8px rgba(13, 71, 161, 0.16)",
                    },
                  },
                  "& .MuiSlider-track": { backgroundColor: "#0d47a1" },
                  "& .MuiSlider-rail": { backgroundColor: "#e0e0e0" },
                }}
              />
            </div>
          </div>
          <div className="search-buttons">
            <button type="submit" className="styled-button">
              Hľadať
            </button>

            <button
              type="button"
              className="styled-button-white"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .city-suggestions {
          position: absolute; top: 100%; left: 0; right: 0;
          background: white; border: 1px solid #e0e0e0;
          border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999; max-height: 250px; overflow-y: auto; margin-top: 4px;
        }
        .city-suggestion {
          padding: 0.75rem 1rem; cursor: pointer; transition: background 0.2s;
          display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem;
        }
        .city-suggestion:hover { background-color: #f5f5f5; }

        .search-buttons{
          display: flex; gap: 1rem; margin-bottom: 1.5rem;}
      `}</style>
    </div>
  );
}
