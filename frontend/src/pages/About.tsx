import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <div className="about-container">
        {/* Hero sekcia */}
        <div className="about-hero">
          <h1>O nás</h1>
          <p>Vaša cesta k vysnívanému domovu začína tu</p>
        </div>

        {/* Kto sme */}
        <div className="about-section">
          <div className="about-text">
            <h2>Kto sme?</h2>
            <p>
              Domáce Reality sú moderná realitná kancelária, ktorá sa venuje
              sprostredkovaniu predaja a prenájmu nehnuteľností po celom
              Slovensku. Naším cieľom je spojiť ľudí s ich vysnívaným domovom
              jednoducho, rýchlo a bez stresu.
            </p>
            <p>
              S viac ako 10-ročnými skúsenosťami na trhu sme pomohli stovkám
              klientov nájsť to pravé miesto pre ich bývanie alebo podnikanie.
            </p>
          </div>
        </div>

        {/* Naše hodnoty */}
        <div className="values-section">
          <h2>Naše hodnoty</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <img src="/loyalty.png" alt="Ľudský prístup" />
              </div>
              <h3>Dôvera</h3>
              <p>
                Budujeme dlhodobé vzťahy založené na úprimnosti a
                transparentnosti.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <img src="/lightning.png" alt="Rýchlosť" />
              </div>
              <h3>Rýchlosť</h3>
              <p>
                Reagujeme promptne a každú požiadavku riešime bez zbytočných
                odkladov.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <img src="/target.png" alt="Profesionalita" />
              </div>
              <h3>Profesionalita</h3>
              <p>
                Poskytujeme odborné poradenstvo a komplexný servis od začiatku
                do konca.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <img src="/shield.png" alt="Ľudský prístup" />
              </div>
              <h3>Ľudský prístup</h3>
              <p>
                Každý klient je pre nás jedinečný a venujeme mu individuálnu
                pozornosť.
              </p>
            </div>
          </div>
        </div>

        {/* Štatistiky */}
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Spokojných klientov</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">Rokov skúseností</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Miest po celom SK</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Spokojnosť klientov</span>
            </div>
          </div>
        </div>

        {/* Náš tím */}
        <div className="team-section">
          <h2>Náš tím</h2>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-photo">
                <img src="/makler.png" alt="Ing. Stanislav Lauro" />
              </div>
              <h3>Ing. Stanislav Lauro</h3>
              <p>Konateľ a hlavný maklér</p>
            </div>
            <div className="team-card">
              <div className="team-photo">
                <img src="/makler2.png" alt="Ing. Mária Kováčová" />
              </div>
              <h3>Ing. Mária Kováčová</h3>
              <p>Obchodná riaditeľka</p>
            </div>
            <div className="team-card">
              <div className="team-photo">
                <img src="/makler3.png" alt="Ing. Peter Horváth" />
              </div>
              <h3>Ing. Peter Horváth</h3>
              <p>Právny poradca</p>
            </div>
          </div>
        </div>

        {/* CTA sekcia s obrázkom na pozadí */}
        <div className="about-cta">
          <div className="cta-overlay"></div>
          <div className="cta-content">
            <h2>Chcete predať alebo kúpiť nehnuteľnosť?</h2>
            <p>
              Kontaktujte nás ešte dnes a dohodnite si nezáväznú konzultáciu.
            </p>
            <button
              className="cta-button"
              onClick={() => navigate("/reality/add")}
            >
              Pridať inzerát
            </button>
          </div>
        </div>
      </div>

      <style>{`
        :root {
          --primary-color: #0d47a1;
          --primary-hover: #0a3a7e;
          --primary-light: #eff6ff;
          --text-dark: #111827;
          --text-gray: #6b7280;
          --text-light: #9ca3af;
          --border-light: #e5e7eb;
          --bg-white: #ffffff;
          --bg-gray: #f9fafb;
          --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .about-page {
          background: var(--bg-white);
          min-height: 100vh;
        }

        .about-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        /* Hero sekcia */
        .about-hero {
          text-align: center;
          padding: 3rem 1rem;
          color: white;
          background: var(--primary-color);
          border-radius: 24px;
          margin-bottom: 3rem;
        }

        .about-hero h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1rem;
        }

        .about-hero p {
          font-size: 1.1rem;
          color: white;
        }

        /* About section */
        .about-section {
          display: flex;
          flex-direction: row;
          gap: 3rem;
          margin-bottom: 4rem;
          align-items: center;
        }

        .about-text h2 {
          font-size: 1.8rem;
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 1.5rem;
        }

        .about-text p {
          color: var(--text-gray);
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        /* Values section */
        .values-section {
          margin-bottom: 4rem;
        }

        .values-section h2 {
          font-size: 1.8rem;
          font-weight: 600;
          color: var(--text-dark);
          text-align: center;
          margin-bottom: 2rem;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .value-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          background: var(--bg-white);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .value-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary-light);
        }

        .value-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .value-icon img {
          width: 50px;
          height: 50px;
          object-fit: contain;
        }

        .value-card h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
        }

        .value-card p {
          color: var(--text-gray);
          line-height: 1.5;
          font-size: 0.9rem;
        }

        /* Stats section */
        .stats-section {
          background: var(--primary-color);
          border-radius: 24px;
          padding: 3rem;
          margin-bottom: 4rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          text-align: center;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: white;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.85rem;
        }

        /* Team section */
        .team-section {
          margin-bottom: 4rem;
        }

        .team-section h2 {
          font-size: 1.8rem;
          font-weight: 600;
          color: var(--text-dark);
          text-align: center;
          margin-bottom: 2rem;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .team-card {
          text-align: center;
          padding: 2rem;
          background: var(--bg-white);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .team-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .team-photo {
          width: 120px;
          height: 120px;
          margin: 0 auto 1rem;
          border-radius: 50%;
          overflow: hidden;
          background: var(--primary-color);
        }

        .team-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Placeholder pre prípad, že obrázok neexistuje */
        .team-photo:not(:has(img)) {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, var(--primary-color) 0%, #1e3a8a 100%);
        }

        .team-card h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 0.25rem;
        }

        .team-card p {
          color: var(--text-gray);
          font-size: 0.85rem;
        }

        /* CTA sekcia s obrázkom na pozadí */
        .about-cta {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .about-cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('/cta-background.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          filter: brightness(0.7);
          z-index: 0;
        }

        .cta-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(13, 71, 161, 0.85) 0%, rgba(13, 71, 161, 0.75) 100%);
          z-index: 1;
        }

        .cta-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 4rem 3rem;
          color: white;
        }

        .cta-content h2 {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: white;
        }

        .cta-content p {
          font-size: 1rem;
          margin-bottom: 2rem;
          opacity: 0.95;
          color: white;
        }

        .cta-button {
          background: white;
          color: var(--primary-color);
          border: none;
          padding: 0.85rem 2rem;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          background: var(--bg-gray);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .about-container {
            padding: 1rem;
          }

          .about-section {
            flex-direction: column;
            gap: 2rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }

          .stats-section {
            padding: 2rem;
          }

          .about-hero h1 {
            font-size: 2rem;
          }

          .about-hero p {
            font-size: 1rem;
          }

          .values-grid,
          .team-grid {
            grid-template-columns: 1fr;
          }

          .cta-content {
            padding: 3rem 2rem;
          }

          .cta-content h2 {
            font-size: 1.4rem;
          }

          .cta-content p {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .about-hero {
            padding: 2rem 1rem;
          }

          .cta-content {
            padding: 2rem 1.5rem;
          }

          .cta-content h2 {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
}
