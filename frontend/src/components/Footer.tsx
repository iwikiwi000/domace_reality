export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo + text */}
        <div className="footer-section">
          <img
            className="footer-logo"
            src="/domace-reality-logo.png"
            alt="Domáce Reality Logo"
          />
          <p>
            Sme realitná kancelária, ktorá vám pomôže nájsť domov, kde sa budete
            cítiť naozaj doma.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-icon" aria-label="Facebook">
              <img
                src="/fb-white.png"
                alt="Facebook"
                className="social-icon-img"
              />
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <img
                src="/insta.png"
                alt="Instagram"
                className="social-icon-img"
              />
            </a>
            {/* <a href="#" className="social-icon" aria-label="LinkedIn">
              <img
                src="/in-white.png"
                alt="LinkedIn"
                className="social-icon-img"
              />
            </a>
            <a href="#" className="social-icon" aria-label="Twitter">
              <img
                src="/x-white.png"
                alt="Twitter"
                className="social-icon-img"
              />
            </a> */}
          </div>
        </div>

        {/* Rýchle odkazy */}
        <div className="footer-section">
          <h4>Rýchle odkazy</h4>
          <ul>
            <li>
              <a href="/">Domov</a>
            </li>
            <li>
              <a href="/reality">Ponuka</a>
            </li>
            <li>
              <a href="/about">O nás</a>
            </li>
            <li>
              <a href="/reality/add">Pridať inzerát</a>
            </li>
          </ul>
        </div>

        {/* Pre klientov
        <div className="footer-section">
          <h4>Pre klientov</h4>
          <ul>
            <li>
              <a href="#">Ako kúpiť nehnuteľnosť</a>
            </li>
            <li>
              <a href="#">Ako predať nehnuteľnosť</a>
            </li>
            <li>
              <a href="#">Často kladené otázky</a>
            </li>
            <li>
              <a href="#">Hypotekárne poradenstvo</a>
            </li>
          </ul>
        </div> */}

        {/* Kontakt */}
        <div className="footer-section">
          <h4>Kontakt</h4>
          <div className="contact-info">
            <div className="contact-icon"></div>
            <p>Hlavné námestie 9, 940 02 Nové Zámky</p>
          </div>
          <div className="contact-info">
            <div className="contact-icon"></div>
            <p>+421 903 123 456</p>
          </div>
          <div className="contact-info">
            <div className="contact-icon"></div>
            <p>info@domacereality.sk</p>
          </div>
          <div className="contact-info">
            <div className="contact-icon"></div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {currentYear} Domáce Reality. Všetky práva vyhradené.</p>
        <div className="footer-bottom-links">
          <a href="#">Ochrana osobných údajov</a>
          <a href="#">Podmienky používania</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
