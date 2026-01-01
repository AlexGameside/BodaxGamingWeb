import './Footer.css';
import { Link } from 'react-router-dom';
import { site } from '../config/site';

const Footer = () => {
  const socials = [
    { key: 'x', label: 'X', icon: '/icons/social/x.svg', href: site.socials.x },
    { key: 'tiktok', label: 'TikTok', icon: '/icons/social/tiktok.svg', href: site.socials.tiktok },
    { key: 'discord', label: 'Discord', icon: '/icons/social/discord.svg', href: site.socials.discord },
  ].filter((s) => Boolean(s.href));

  const columns = [
    {
      title: 'Company',
      links: [
        { label: 'About', to: '/about' },
        { label: 'Schedule', to: '/schedule' },
        { label: 'News', to: '/news' },
        { label: 'Media Kit', href: 'https://drive.google.com/drive/folders/1fsYItzmfhU0IaA-mkGvaQ4Xp73BYBuQJ?usp=sharing' },
      ],
    },
    {
      title: 'Our Brands',
      links: [
        { label: 'bodax.dev', href: 'https://bodax.dev' },
        { label: 'Bodax Skirmish', href: 'https://bodax-skirmish.web.app/' },
        { label: 'Bodax Masters', href: 'https://bodax-masters.web.app/' },
      ],
    },
    {
      title: 'Partners',
      links: [
        { label: 'Coming Soon' },
      ],
    },
    {
      title: 'Impressum & Privacy',
      links: [
        { label: 'Impressum', to: '/impressum' },
        { label: 'Privacy', to: '/privacy' },
      ],
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-shell">
        <div className="footer-main">
          <div className="footer-left">
            <img
              src="/icons/logos/bdx-g_logo-horizontal.svg"
              alt={`${site.name} logo`}
              className="footer-logo"
            />

            <div className="footer-socials" aria-label="Social links">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social"
                  aria-label={s.label}
                  title={s.label}
                >
                  <img src={s.icon} alt="" className="footer-social-icon" />
                </a>
              ))}
            </div>
          </div>

          <nav className="footer-right" aria-label="Footer navigation">
            {columns.map((col) => (
              <div key={col.title} className="footer-col">
                <div className="footer-title">{col.title}</div>
                <div className="footer-links">
                  {col.links.map((l) => {
                    if (l.to) {
                      return (
                        <Link key={l.label} to={l.to} className="footer-link">
                          {l.label}
                        </Link>
                      );
                    }
                    if (l.href) {
                      return (
                        <a
                          key={l.label}
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="footer-link"
                        >
                          {l.label}
                        </a>
                      );
                    }
                    return (
                      <span key={l.label} className="footer-link" style={{ cursor: 'default', opacity: 0.7 }}>
                        {l.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="footer-bottom" aria-label="Footer meta">
          <p className="footer-copy">© 2026 BODAX UG. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
