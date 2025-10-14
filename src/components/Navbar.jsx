import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAnchorClick = (e, anchorId) => {
    e.preventDefault();
    
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
    
    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      window.location.href = `/#${anchorId}`;
    } else {
      // If we're already on home page, scroll to the anchor with offset
      const element = document.getElementById(anchorId);
      if (element) {
        const navbarHeight = 80; // Approximate navbar height
        const elementPosition = element.offsetTop - navbarHeight;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle direct navigation to anchors (e.g., /#team)
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const anchorId = location.hash.substring(1); // Remove the # symbol
      setTimeout(() => {
        const element = document.getElementById(anchorId);
        if (element) {
          const navbarHeight = 80; // Approximate navbar height
          const elementPosition = element.offsetTop - navbarHeight;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
        }
      }, 100); // Small delay to ensure page is loaded
    }
  }, [location]);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Left Column - Logo */}
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            <img src="/icons/logos/bodax-gaming_logo.png" alt="BODAX Gaming" className="nav-logo-img" />
          </Link>
        </div>

        {/* Center Column - Navigation Links (Desktop) */}
        <div className="nav-center desktop-menu">
          <ul className="nav-menu">
            <li className="nav-item">
              <a href="#team" className="nav-link" onClick={(e) => handleAnchorClick(e, 'team')}>TEAM</a>
            </li>
            <li className="nav-item">
              <a href="#upcoming-games" className="nav-link" onClick={(e) => handleAnchorClick(e, 'upcoming-games')}>UPCOMING GAMES</a>
            </li>
            <li className="nav-item">
              <a href="#recent-games" className="nav-link" onClick={(e) => handleAnchorClick(e, 'recent-games')}>PAST GAMES</a>
            </li>
            {currentUser && (
              <li className="nav-item">
                <Link to="/admin" className="nav-link">ADMIN</Link>
              </li>
            )}
          </ul>
        </div>

        {/* Right Column - Social Icons & Hamburger */}
        <div className="nav-right">
          <div className="desktop-social">
            <a href="https://x.com/GamingBodax" target="_blank" rel="noopener noreferrer" className="social-link">
              <img src="/icons/social/x.svg" alt="X" className="social-icon" />
            </a>
            <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="social-link">
              <span className="social-icon">💬</span>
            </a>
          </div>
          
          {/* Hamburger Menu Button */}
          <button className="hamburger" onClick={toggleMobileMenu} aria-label="Toggle menu">
            <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
        <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
          <ul className="mobile-nav-menu">
            <li className="mobile-nav-item">
              <Link to="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>HOME</Link>
            </li>
            <li className="mobile-nav-item">
              <a href="#team" className="mobile-nav-link" onClick={(e) => handleAnchorClick(e, 'team')}>TEAM</a>
            </li>
            <li className="mobile-nav-item">
              <a href="#upcoming-games" className="mobile-nav-link" onClick={(e) => handleAnchorClick(e, 'upcoming-games')}>UPCOMING GAMES</a>
            </li>
            <li className="mobile-nav-item">
              <a href="#recent-games" className="mobile-nav-link" onClick={(e) => handleAnchorClick(e, 'recent-games')}>PAST GAMES</a>
            </li>
            {currentUser && (
              <li className="mobile-nav-item">
                <Link to="/admin" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>ADMIN</Link>
              </li>
            )}
          </ul>
          
          <div className="mobile-social">
            <a href="https://x.com/GamingBodax" target="_blank" rel="noopener noreferrer" className="mobile-social-link">
              <img src="/icons/social/x.svg" alt="X" className="social-icon" />
              <span>X</span>
            </a>
            <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="mobile-social-link">
              <span className="social-icon">💬</span>
              <span>DISCORD</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

