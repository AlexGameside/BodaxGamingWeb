import './Page.css';
import './Partners.css';
import { site } from '../config/site';

const Partners = () => {
  return (
    <div className="page">
      <div className="container">
        <div className="page-hero">
          <span className="kicker">Support</span>
          <h1 className="h2 page-hero-title">Partners</h1>
          <p className="page-hero-subtitle">
            We are looking for partners to join us on our journey.
          </p>
        </div>

        <div className="partners-cta-container">
          <div className="cta-box">
            <h2>Become a Partner</h2>
            <p>
              We are currently looking for partners to help us reach new heights. 
              Check out our pitch deck to learn more about our vision and opportunities.
            </p>
            <div className="cta-actions">
              {/* Replace '#' with actual pitch deck URL */}
              <a href="#" className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                Check out our Pitch Deck
              </a>
              <a href={`mailto:${site.email}`} className="btn">
                Contact Us
              </a>
            </div>
            
            <div className="contact-info">
                <p className="contact-label">Or reach us directly at:</p>
                <a href={`mailto:${site.email}`} className="contact-link">{site.email}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;
