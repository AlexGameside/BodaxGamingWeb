import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Social Links Section */}
        <div className="footer-section">
          <h3 className="footer-title">FOLLOW US</h3>
          <div className="social-links">
            <a href="https://x.com/GamingBodax" target="_blank" rel="noopener noreferrer" className="social-link">
              <img src="/icons/social/x.svg" alt="X" className="social-icon" />
              <span className="social-text">X</span>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <img src="/icons/social/tiktok.svg" alt="TikTok" className="social-icon" />
              <span className="social-text">TIKTOK</span>
            </a>
            <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="social-link">
              <img src="/icons/social/discord.svg" alt="Discord" className="social-icon" />
              <span className="social-text">DISCORD</span>
            </a>
          </div>
        </div>

        {/* Sponsor Section */}
        <div className="footer-section">
          <h3 className="footer-title">SPONSORED BY</h3>
          <div className="sponsor-section">
            <a href="https://bodax.dev" target="_blank" rel="noopener noreferrer" className="sponsor-logo">
              <img src="/icons/logos/bodax_logomark-light.png" alt="Bodax" className="sponsor-logo-img" />
            </a>
            <p className="sponsor-text">Official Gaming Partner</p>
          </div>
        </div>

        {/* Other Links Section */}
        <div className="footer-section">
          <h3 className="footer-title">OTHER</h3>
          <div className="other-links">
            <a href="https://bodax-skirmish.web.app/" target="_blank" rel="noopener noreferrer" className="other-link">
              BODAX SKIRMISHES
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">© 2025 BODAX GAMING. ALL RIGHTS RESERVED.</p>
          <div className="legal-links">
            <a href="/impressum" className="impressum-link">IMPRESSUM</a>
            <a href="/privacy" className="impressum-link">DATENSCHUTZ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;