import { useState, useEffect } from "react";

type ImageSlider = {
  images: string[];
  onClose: () => void;
  startIndex?: number;
};

export default function ImageSlider({
  images,
  onClose,
  startIndex = 0,
}: ImageSlider) {
  const [current, setCurrent] = useState(startIndex);

  useEffect(() => {
    setCurrent(startIndex);
  }, [startIndex]);

  const prev = () => setCurrent((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrent((i) => (i === images.length - 1 ? 0 : i + 1));

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prev();
      } else if (e.key === "ArrowRight") {
        next();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prev, next, onClose]);

  return (
    <div className="slider-overlay" onClick={onClose}>
      <div className="slider-modal" onClick={(e) => e.stopPropagation()}>
        <button className="slider-close  styled-button" onClick={onClose}>
          ✕
        </button>
        <button className="slider-prev  styled-button" onClick={prev}>
          ‹
        </button>
        <img
          src={images[current]}
          alt={`foto ${current + 1}`}
          className="slider-image"
        />
        <button className="slider-next styled-button" onClick={next}>
          ›
        </button>
        <p className="slider-counter">
          {current + 1} / {images.length}
        </p>
      </div>
    </div>
  );
}
