import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { navLinks, site } from '../config/site';
import './Navbar.css';

const Navbar = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    // Close the mobile menu on navigation
    setIsMobileMenuOpen(false);
  }, [location]);

  const primaryLinks = useMemo(() => {
    // Keep admin route out of the public nav; add it only if logged in.
    const base = navLinks;
    if (!currentUser) return base;
    return [...base, { label: 'Admin', to: '/admin' }];
  }, [currentUser]);

  const socials = useMemo(() => {
    const items = [
      { key: 'x', label: 'X', icon: '/icons/social/x.svg', href: site.socials.x },
      { key: 'tiktok', label: 'TikTok', icon: '/icons/social/tiktok.svg', href: site.socials.tiktok },
      { key: 'instagram', label: 'Instagram', icon: '/icons/social/instagram.svg', href: site.socials.instagram },
      { key: 'youtube', label: 'YouTube', icon: '/icons/social/youtube.svg', href: site.socials.youtube },
      { key: 'discord', label: 'Discord', icon: '/icons/social/discord.svg', href: site.socials.discord },
    ];
    return items.filter((i) => Boolean(i.href));
  }, []);

  return (
    <header className="navbar">
      <div className="nav-shell">
        <div className="nav-left">
          <Link to="/" className="nav-logo" aria-label={`${site.name} home`}>
            <img
              src="/icons/logos/bdx-g_logo-horizontal.svg"
              alt={`${site.name} logo`}
              className="nav-logo-img"
            />
          </Link>
        </div>

        <nav className="nav-center desktop-menu" aria-label="Primary navigation">
          <ul className="nav-menu">
            {primaryLinks.map((l) => (
              <li key={l.to} className="nav-item">
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-right">
          <div className="desktop-social" aria-label="Social links">
            {socials.map((s) => (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label={s.label}
                title={s.label}
              >
                <img src={s.icon} alt="" className="social-icon" />
              </a>
            ))}
          </div>

          <button
            className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </div>

      <div
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
        role="presentation"
      >
        <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-menu-header">
            <span className="pill">{site.game}</span>
            <button className="btn" onClick={() => setIsMobileMenuOpen(false)}>
              Close
            </button>
          </div>

          <ul className="mobile-nav-menu">
            {primaryLinks.map((l) => (
              <li key={l.to} className="mobile-nav-item">
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mobile-social">
            {socials.map((s) => (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-social-link"
              >
                <img src={s.icon} alt="" className="social-icon" />
                <span>{s.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

