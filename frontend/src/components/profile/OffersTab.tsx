// src/components/profile/OffersTab.tsx
import { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";

type Offer = {
  _id: string;
  amount: number;
  comment: string;
  status: string;
  createdAt: string;
  buyer: { name: string; email: string };
  nehnutelnost: { _id: string; title: string; price: number };
};

export default function OffersTab({ isAdmin = false }: { isAdmin?: boolean }) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  useEffect(() => {
    const endpoint = isAdmin ? "/offers/all" : "/offers/received";
    axiosInstance
      .get(endpoint)
      .then((r) => setOffers(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("sk-SK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="offer-status pending">Čaká na schválenie</span>;
      case "accepted":
        return <span className="offer-status accepted">Prijatá</span>;
      case "rejected":
        return <span className="offer-status rejected">Zamietnutá</span>;
      default:
        return <span className="offer-status pending">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="offers-loading">
        <div className="loading-spinner"></div>
        <p>Načítavam ponuky...</p>
      </div>
    );
  }

  return (
    <div className="offers-container">
      <div className="offers-header">
        <h2>Prijaté ponuky</h2>
        <p className="offers-count">Celkom: {offers.length} ponúk</p>
      </div>

      {offers.length === 0 ? (
        <div className="offers-empty">
          <div className="empty-icon">📭</div>
          <h3>Zatiaľ ste nedostali žiadnu ponuku</h3>
          <p>
            Keď niekto pošle ponuku na vašu nehnuteľnosť, zobrazí sa vám tu.
          </p>
          <button
            className="empty-action-btn"
            onClick={() => (window.location.href = "/reality/add")}
          >
            + Pridať nový inzerát
          </button>
        </div>
      ) : (
        <div className="offers-grid">
          {offers.map((offer) => (
            <div key={offer._id} className="offer-card">
              <div className="offer-card-header">
                <div className="offer-property">
                  <h3>{offer.nehnutelnost?.title ?? "Nehnuteľnosť"}</h3>
                  <p className="offer-property-price">
                    {offer.nehnutelnost?.price?.toLocaleString()} €
                  </p>
                </div>
                {/* {getStatusBadge(offer.status)} */}
              </div>

              <div className="offer-card-body">
                <div className="offer-amount">
                  <span className="amount-label">Ponuka</span>
                  <span className="amount-value">
                    {offer.amount.toLocaleString()} €
                  </span>
                </div>

                <div className="offer-buyer">
                  <span className="buyer-label">Kupujúci</span>
                  <span className="buyer-name">{offer.buyer?.name}</span>
                </div>

                {offer.comment ? (
                  <div className="offer-comment">
                    <span className="comment-label">Komentár</span>
                    <p className="comment-text">"{offer.comment}"</p>
                  </div>
                ) : (
                  <div className="offer-comment">
                    <span className="comment-label">Komentár</span>
                    <p className="comment-text no-comment">— Bez komentára —</p>
                  </div>
                )}
              </div>

              <div className="offer-card-footer">
                <span className="offer-date">
                  {formatDate(offer.createdAt)}
                </span>
                <button
                  className="offer-details-btn"
                  onClick={() => setSelectedOffer(offer)}
                >
                  Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail modál */}
      {selectedOffer && (
        <div
          className="modal-overlay-centered"
          onClick={() => setSelectedOffer(null)}
        >
          <div
            className="offer-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedOffer(null)}
            >
              ✕
            </button>
            <h3>Detail ponuky</h3>

            <div className="detail-section">
              <label>Nehnuteľnosť</label>
              <p>{selectedOffer.nehnutelnost?.title}</p>
              <p className="detail-price">
                Pôvodná cena:{" "}
                {selectedOffer.nehnutelnost?.price?.toLocaleString()} €
              </p>
            </div>

            <div className="detail-section">
              <label>Ponúkaná suma</label>
              <p className="offer-amount-highlight">
                {selectedOffer.amount.toLocaleString()} €
              </p>
            </div>

            <div className="detail-section">
              <label>Kupujúci</label>
              <p>
                <strong>{selectedOffer.buyer?.name}</strong>
              </p>
              <p>{selectedOffer.buyer?.email}</p>
            </div>

            {selectedOffer.comment && (
              <div className="detail-section">
                <label>Komentár</label>
                <p className="comment-text">"{selectedOffer.comment}"</p>
              </div>
            )}

            <div className="detail-section">
              <label>Dátum</label>
              <p>{formatDate(selectedOffer.createdAt)}</p>
            </div>

            {/* <div className="detail-section">
              <label>Stav</label>
              {getStatusBadge(selectedOffer.status)}
            </div> */}
          </div>
        </div>
      )}

      <style>{`
        .offers-container {
          padding: 1rem;
        }

        .offers-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .offers-header h2 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #333;
          margin: 0;
        }

        .offers-count {
          color: #666;
          font-size: 0.85rem;
        }

        /* Grid layout - 3 stĺpce na desktope */
        .offers-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .offer-card {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
        }

        .offer-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }

        .offer-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #eee;
        }

        .offer-property h3 {
          font-size: 0.95rem;
          font-weight: 600;
          color: #333;
          margin: 0 0 0.25rem 0;
          line-height: 1.3;
        }

        .offer-property-price {
          font-size: 0.7rem;
          color: #999;
          margin: 0;
        }

        .offer-status {
          padding: 0.2rem 0.5rem;
          border-radius: 20px;
          font-size: 0.65rem;
          font-weight: 500;
          white-space: nowrap;
        }

        .offer-status.pending {
          background: #fff3e0;
          color: #ed6c02;
        }

        .offer-status.accepted {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .offer-status.rejected {
          background: #ffebee;
          color: #d32f2f;
        }

        .offer-card-body {
          flex: 1;
          margin-bottom: 0.75rem;
        }

        .offer-amount {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 0.5rem 0;
        }

        .amount-label {
          font-size: 0.7rem;
          color: #666;
        }

        .amount-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0d47a1;
        }

        .offer-buyer {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          padding: 0.5rem 0;
          border-top: 1px solid #f0f0f0;
        }

        .buyer-label {
          font-size: 0.65rem;
          color: #999;
        }

        .buyer-name {
          font-weight: 600;
          color: #333;
          font-size: 0.85rem;
        }

        .offer-comment {
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .comment-label {
          font-size: 0.6rem;
          color: #999;
          display: block;
          margin-bottom: 0.2rem;
        }

        .comment-text {
          font-size: 0.75rem;
          color: #555;
          margin: 0;
          font-style: italic;
          line-height: 1.4;
        }

        .offer-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.75rem;
          border-top: 1px solid #eee;
        }

        .offer-date {
          font-size: 0.65rem;
          color: #999;
        }

        .offer-details-btn {
          background: none;
          border: none;
          color: #0d47a1;
          font-size: 0.7rem;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .offer-details-btn:hover {
          background: #e3f2fd;
        }

        .offers-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f0f0f0;
          border-top-color: #0d47a1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Prázdny stav */
        .offers-empty {
          text-align: center;
          padding: 3rem 2rem;
          background: #f8f9fa;
          border-radius: 24px;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.6;
        }

        .offers-empty h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .offers-empty p {
          color: #666;
          margin-bottom: 1.5rem;
        }

        .empty-action-btn {
          background-color: #0d47a1;
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .empty-action-btn:hover {
          background-color: #1565c0;
          transform: translateY(-2px);
        }

        /* Detail modal */
        .offer-detail-modal {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          max-width: 450px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.1rem;
          cursor: pointer;
          color: #999;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .modal-close:hover {
          color: #333;
          background-color: #f0f0f0;
        }

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
        }

        .offer-detail-modal h3 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          padding-right: 1.5rem;
        }

        .detail-section {
          margin-bottom: 0.8rem;
          padding-bottom: 0.8rem;
          border-bottom: 1px solid #eee;
        }

        .detail-section:last-child {
          border-bottom: none;
        }

        .detail-section label {
          display: block;
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 0.3rem;
        }

        .detail-section p {
          margin: 0;
          color: #333;
          font-size: 0.9rem;
        }

        .offer-amount-highlight {
          font-size: 1.3rem;
          font-weight: 700;
          color: #0d47a1;
        }

        .detail-price {
          font-size: 0.75rem;
          color: #666;
          margin-top: 0.25rem;
        }

        /* Responzívne úpravy */
        @media (max-width: 1024px) {
          .offers-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
        }

        @media (max-width: 768px) {
          .offers-container {
            padding: 0.5rem;
          }
          
          .offers-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          
          .offer-card-header {
            flex-direction: row;
            align-items: center;
          }
          
          .offers-empty {
            padding: 2rem 1rem;
          }
          
          .empty-icon {
            font-size: 3rem;
          }
          
          .offers-empty h3 {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .offer-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
