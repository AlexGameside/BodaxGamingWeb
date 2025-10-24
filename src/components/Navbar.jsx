import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTeamsDropdownOpen, setIsTeamsDropdownOpen] = useState(false);

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

  const toggleTeamsDropdown = () => {
    setIsTeamsDropdownOpen(!isTeamsDropdownOpen);
  };

  const handleTeamClick = (teamType) => {
    setIsTeamsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    // Navigate to specific team page
    const teamRoutes = {
      'main': '/teams/main',
      'vantage': '/teams/vantage',
      'game-changers': '/teams/game-changers'
    };
    
    if (teamRoutes[teamType]) {
      window.location.href = teamRoutes[teamType];
    }
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
            <img src="/icons/logos/bodax-gaming_logo_2.svg" alt="BODAX Gaming" className="nav-logo-img" />
          </Link>
        </div>

        {/* Center Column - Navigation Links (Desktop) */}
        <div className="nav-center desktop-menu">
          <ul className="nav-menu">
            <li className="nav-item teams-dropdown">
              <button 
                className="nav-link teams-dropdown-btn" 
                onClick={toggleTeamsDropdown}
                onMouseEnter={() => setIsTeamsDropdownOpen(true)}
              >
                TEAMS
                <span className="dropdown-arrow">▼</span>
              </button>
              {isTeamsDropdownOpen && (
                <div 
                  className="teams-dropdown-menu"
                  onMouseLeave={() => setIsTeamsDropdownOpen(false)}
                >
                  <button 
                    className="dropdown-item" 
                    onClick={() => handleTeamClick('main')}
                  >
                    Main Team
                  </button>
                  <button 
                    className="dropdown-item" 
                    onClick={() => handleTeamClick('vantage')}
                  >
                    Team Vantage
                  </button>
                  <button 
                    className="dropdown-item" 
                    onClick={() => handleTeamClick('game-changers')}
                  >
                    Game Changers
                  </button>
                </div>
              )}
            </li>
            <li className="nav-item">
              <Link to="/game-schedule" className="nav-link">GAME SCHEDULE</Link>
            </li>
            <li className="nav-item">
              <Link to="/streamers" className="nav-link">STREAMERS</Link>
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
            <a href="https://www.tiktok.com/@bodaxgaming" target="_blank" rel="noopener noreferrer" className="social-link">
              <img src="/icons/social/tiktok.svg" alt="TikTok" className="social-icon" />
            </a>
            <a href="https://discord.gg/SCRE27SpvQ" target="_blank" rel="noopener noreferrer" className="social-link">
              <img src="/icons/social/discord.svg" alt="Discord" className="social-icon" />
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
              <button 
                className="mobile-nav-link mobile-teams-btn" 
                onClick={toggleTeamsDropdown}
              >
                TEAMS
                <span className="mobile-dropdown-arrow">▼</span>
              </button>
              {isTeamsDropdownOpen && (
                <div className="mobile-teams-dropdown">
                  <button 
                    className="mobile-dropdown-item" 
                    onClick={() => handleTeamClick('main')}
                  >
                    Main Team
                  </button>
                  <button 
                    className="mobile-dropdown-item" 
                    onClick={() => handleTeamClick('vantage')}
                  >
                    Team Vantage
                  </button>
                  <button 
                    className="mobile-dropdown-item" 
                    onClick={() => handleTeamClick('game-changers')}
                  >
                    Game Changers
                  </button>
                </div>
              )}
            </li>
            <li className="mobile-nav-item">
              <Link to="/game-schedule" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>GAME SCHEDULE</Link>
            </li>
            <li className="mobile-nav-item">
              <Link to="/streamers" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>STREAMERS</Link>
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
            <a href="https://www.tiktok.com/@bodaxgaming" target="_blank" rel="noopener noreferrer" className="mobile-social-link">
              <img src="/icons/social/tiktok.svg" alt="TikTok" className="social-icon" />
              <span>TIKTOK</span>
            </a>
            <a href="https://discord.gg/SCRE27SpvQ" target="_blank" rel="noopener noreferrer" className="mobile-social-link">
              <img src="/icons/social/discord.svg" alt="Discord" className="social-icon" />
              <span>DISCORD</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

