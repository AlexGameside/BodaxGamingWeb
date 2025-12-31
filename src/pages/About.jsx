import './Page.css';
import './About.css';

const About = () => {
  return (
    <div className="page">
      <div className="container">
        <div className="about-hero-split">
          <div className="about-hero-left">
            <span className="kicker">Who we are</span>
            <h1 className="h2 page-hero-title">When Performance Meets Design.</h1>
          </div>
          <div className="about-hero-right">
            <p className="page-hero-subtitle">
              BODAX GAMING is a VALORANT-first org focused on disciplined practice, modern systems, and
              clean performance under pressure. We believe that true excellence comes from the intersection
              of rigorous preparation and creative execution. We don't just play the game; we study it, deconstruct it, and master it.
            </p>
            <p className="page-hero-subtitle">
              Our mission is to build a competitive roster and a content ecosystem that stays sharp all season—prep,
              review, repeat. By fostering a culture of continuous improvement and strategic innovation, we aim to set a new standard in the DACH esports scene, where every round matters and every pixel is perfect.
            </p>
          </div>
        </div>

        <section className="about-socials">
          <a href="https://x.com/BodaxGaming" target="_blank" rel="noopener noreferrer" className="about-social-card">
            <div className="about-social-card-top">
              <div className="about-social-icon x" />
              <span className="about-social-platform">X (Twitter)</span>
              <span className="about-social-arrow">→</span>
            </div>
            <div className="about-social-count">1.2k Followers</div>
          </a>
          <a href="https://youtube.com/@BodaxGaming" target="_blank" rel="noopener noreferrer" className="about-social-card">
            <div className="about-social-card-top">
              <div className="about-social-icon youtube" />
              <span className="about-social-platform">YouTube</span>
              <span className="about-social-arrow">→</span>
            </div>
            <div className="about-social-count">850 Subscribers</div>
          </a>
          <a href="https://instagram.com/bodaxgaming" target="_blank" rel="noopener noreferrer" className="about-social-card">
            <div className="about-social-card-top">
              <div className="about-social-icon instagram" />
              <span className="about-social-platform">Instagram</span>
              <span className="about-social-arrow">→</span>
            </div>
            <div className="about-social-count">2.1k Followers</div>
          </a>
          <a href="https://tiktok.com/@bodaxgaming" target="_blank" rel="noopener noreferrer" className="about-social-card">
            <div className="about-social-card-top">
              <div className="about-social-icon tiktok" />
              <span className="about-social-platform">TikTok</span>
              <span className="about-social-arrow">→</span>
            </div>
            <div className="about-social-count">15k Followers</div>
          </a>
        </section>

        <section className="achievements-section">
          <div className="achievements-head">
            <span className="kicker">Our History</span>
            <h2 className="about-section-title">Achievements</h2>
          </div>
          <div className="achievements-list">
            <div className="achievement-item">
              <div className="achievement-date">20th November 2025</div>
              <img 
                src="/icons/leagues/cl-dach_logo.png" 
                alt="Challengers DACH" 
                className="achievement-logo"
              />
              <div className="achievement-details">
                <span className="achievement-event">Challengers 2025: DACH Evolution Split 3 Relegation</span>
                <span className="achievement-rank rank-1">Top 1</span>
              </div>
            </div>
            <div className="achievement-item">
              <div className="achievement-date">19th October 2025</div>
              <img 
                src="/icons/leagues/project-v_logo.png" 
                alt="Project V" 
                className="achievement-logo"
              />
              <div className="achievement-details">
                <span className="achievement-event">Project V: 2025 Split 3 Pro Series</span>
                <span className="achievement-rank rank-3">Top 3</span>
              </div>
            </div>
          </div>
        </section>

        <section className="media-kit-cta-section">
          <div className="media-kit-cta-inner">
            <div className="media-kit-kicker">Downloads</div>
            <h2 className="media-kit-title">Get our Media Kit</h2>
            <a 
              className="cta-btn primary" 
              href="/assets/BodaxGaming_MediaKit.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <span>Download PDF</span>
              <span className="btn-arrow">→</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
