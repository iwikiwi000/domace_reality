// src/components/OfferModal.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosInstance from "../services/axios";
import { toast } from "react-toastify";
import FormInput from "./forms/FormInput";

type Props = {
  nehnutelnostId: string;
  originalPrice: number;
  onClose: () => void;
};

const offerSchema = z.object({
  amount: z.coerce
    .number()
    .min(1, "Ponuka musí byť aspoň 1 €")
    .positive("Zadajte platnú sumu"),
  comment: z
    .string()
    .max(500, "Komentár môže mať maximálne 500 znakov")
    .optional(),
});

type OfferFormData = z.infer<typeof offerSchema>;

export default function OfferModal({
  nehnutelnostId,
  originalPrice,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      amount: originalPrice,
      comment: "",
    },
  });

  const watchedAmount = watch("amount");

  const onSubmit = async (data: OfferFormData) => {
    setLoading(true);
    try {
      await axiosInstance.post(`/offers/${nehnutelnostId}`, {
        amount: data.amount,
        comment: data.comment,
      });
      toast.success("Ponuka bola úspešne odoslaná");
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Chyba pri odoslaní ponuky");
    } finally {
      setLoading(false);
    }
  };

  // Zatvorenie modalu pri stlačení ESC
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className="modal-overlay-centered" onClick={onClose}>
      <div
        className="offer-modal-container"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="modal-icon">💰</div>

        <h3>Odoslať ponuku</h3>
        <p className="modal-subtitle">
          Zadajte vašu cenovú ponuku pre túto nehnuteľnosť
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            label="Vaša ponuka (€)"
            name="amount"
            type="number"
            register={register}
            error={errors.amount}
            required
          />

          <div className="price-info">
            <small>
              Pôvodná cena: {originalPrice.toLocaleString()} €
              {watchedAmount && watchedAmount !== originalPrice && (
                <span className="price-diff">
                  {" "}
                  ({watchedAmount > originalPrice ? "▲" : "▼"}{" "}
                  {Math.abs(
                    ((watchedAmount - originalPrice) / originalPrice) * 100,
                  ).toFixed(1)}
                  %)
                </span>
              )}
            </small>
          </div>

          <FormInput
            label="Komentár (voliteľné)"
            name="comment"
            type="text"
            register={register}
            error={errors.comment}
            multiline
            rows={3}
            placeholder="Napíšte správu predávajúcemu..."
          />

          <div className="modal-buttons-centered">
            <button
              type="button"
              className="modal-btn-outline"
              onClick={onClose}
            >
              Zrušiť
            </button>
            <button
              type="submit"
              className="modal-btn-primary"
              disabled={loading}
            >
              {loading ? "Odosielam..." : "Odoslať ponuku"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay-centered {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .offer-modal-container {
          position: relative;
          background: white;
          border-radius: 24px;
          padding: 2rem;
          max-width: 480px;
          width: 90%;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .modal-close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: #999;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }
        
        .modal-close-btn:hover {
          color: #333;
          background-color: #f0f0f0;
        }
        
        .modal-icon {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        
        .offer-modal-container h3 {
          font-size: 1.5rem;
          font-weight: 600;
          text-align: center;
          margin-bottom: 0.5rem;
          color: #333;
        }
        
        .modal-subtitle {
          text-align: center;
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 1.5rem;
        }
        
        .price-info {
          margin-top: -0.5rem;
          margin-bottom: 1rem;
          font-size: 0.75rem;
          color: #666;
        }
        
        .price-diff {
          color: #0d47a1;
          font-weight: 500;
        }
        
        .modal-buttons-centered {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }
        
        .modal-btn-primary {
          flex: 1;
          background-color: #0d47a1;
          color: white;
          border: none;
          padding: 0.75rem;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .modal-btn-primary:hover {
          background-color: #1565c0;
          transform: translateY(-2px);
        }
        
        .modal-btn-primary:disabled {
          background-color: #999;
          cursor: not-allowed;
          transform: none;
        }
        
        .modal-btn-outline {
          flex: 1;
          background-color: transparent;
          color: #666;
          border: 1px solid #ddd;
          padding: 0.75rem;
          border-radius: 12px;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .modal-btn-outline:hover {
          background-color: #f5f5f5;
        }
        
        @media (max-width: 480px) {
          .offer-modal-container {
            padding: 1.5rem;
          }
          
          .offer-modal-container h3 {
            font-size: 1.3rem;
          }
          
          .modal-buttons-centered {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
