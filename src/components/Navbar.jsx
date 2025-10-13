import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Left Column - Logo */}
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            <span className="logo-text">LOGO</span>
          </Link>
        </div>

        {/* Center Column - Navigation Links */}
        <div className="nav-center">
          <ul className="nav-menu">
            <li className="nav-item">
              <a href="#team" className="nav-link">TEAM</a>
            </li>
            <li className="nav-item">
              <a href="#upcoming-games" className="nav-link">UPCOMING GAMES</a>
            </li>
            <li className="nav-item">
              <a href="#recent-games" className="nav-link">PAST GAMES</a>
            </li>
            {currentUser && (
              <li className="nav-item">
                <Link to="/admin" className="nav-link">ADMIN</Link>
              </li>
            )}
          </ul>
        </div>

        {/* Right Column - Social Icons */}
        <div className="nav-right">
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-link">
            <img src="/icons/social/x.svg" alt="X" className="social-icon" />
          </a>
          <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="social-link">
            <span className="social-icon">💬</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

