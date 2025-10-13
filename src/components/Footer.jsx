import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Social Links Section */}
        <div className="footer-section">
          <h3 className="footer-title">FOLLOW US</h3>
          <div className="social-links">
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <img src="/icons/social/x.svg" alt="X" className="social-icon" />
              <span className="social-text">X</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <img src="/icons/social/instagram.svg" alt="Instagram" className="social-icon" />
              <span className="social-text">INSTAGRAM</span>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <img src="/icons/social/youtube.svg" alt="YouTube" className="social-icon" />
              <span className="social-text">YOUTUBE</span>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <img src="/icons/social/tiktok.svg" alt="TikTok" className="social-icon" />
              <span className="social-text">TIKTOK</span>
            </a>
          </div>
        </div>

        {/* Sponsor Section */}
        <div className="footer-section">
          <h3 className="footer-title">SPONSORED BY</h3>
          <div className="sponsor-section">
            <div className="sponsor-logo">
              <div className="logo-placeholder">BODAX</div>
            </div>
            <p className="sponsor-text">Official Gaming Partner</p>
          </div>
        </div>

        {/* Other Links Section */}
        <div className="footer-section">
          <h3 className="footer-title">OTHER</h3>
          <div className="other-links">
            <a href="https://bodaxskirmishes.com" target="_blank" rel="noopener noreferrer" className="other-link">
              BODAX SKIRMISHES
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">© 2025 BODAX GAMING. ALL RIGHTS RESERVED.</p>
          <a href="/impressum" className="impressum-link">IMPRESSUM</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;