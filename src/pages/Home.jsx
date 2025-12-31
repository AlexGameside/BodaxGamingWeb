import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { format } from 'date-fns';
import { site } from '../config/site';
import PersonModal from '../components/PersonModal';
import './Home.css';

const BRANDS = [
  { name: 'Bodax', href: 'https://bodax.dev', image: '/icons/logos/bodax-gaming_logo_2.svg' },
  { name: 'Bodax Skirmishes', href: 'https://bodax-skirmish.web.app/', image: '/icons/logos/bodax-skirmish_logo_white.svg' },
  { name: 'Bodax Masters', href: 'https://bodax-masters.web.app/', image: '/icons/logos/bodax-gaming_logo_2.svg' },
];

const SOCIAL_ITEMS = [
  { keys: ['x', 'twitter'], label: 'X', icon: '/icons/social/x.svg' },
  { keys: ['twitch'], label: 'Twitch', icon: '/icons/social/twitch.svg' },
  { keys: ['instagram'], label: 'Instagram', icon: '/icons/social/instagram.svg' },
  { keys: ['youtube'], label: 'YouTube', icon: '/icons/social/youtube.svg' },
  { keys: ['tiktok'], label: 'TikTok', icon: '/icons/social/tiktok.svg' },
  { keys: ['discord'], label: 'Discord', icon: '/icons/social/discord.svg' },
];

const SOCIAL_PLATFORMS = ['x', 'twitter', 'tiktok', 'discord', 'youtube', 'twitch', 'instagram'];

const normUrl = (v) => (typeof v === 'string' ? v.trim() : '');

// Helper to extract display name from URL or return username
const getSocialHandle = (url, platform) => {
  if (!url) return '';
  // If it doesn't start with http, assume it's a handle
  if (!url.startsWith('http')) return url.startsWith('@') ? url : (platform === 'X' ? `@${url}` : url);
  
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/^\/|\/$/g, ''); // Remove leading/trailing slashes
    // Handle special cases
    if (u.hostname.includes('youtube.com')) {
      if (path.startsWith('c/') || path.startsWith('channel/') || path.startsWith('user/')) {
        const parts = path.split('/');
        return parts.length > 1 ? parts[1] : path;
      }
      return path.replace('@', ''); // Handle youtube handles like @username
    }
    return path;
  } catch (e) {
    return url;
  }
};

const getSocialLinks = (person) => {
  const socials = person?.socials || {};
  return SOCIAL_ITEMS.map((item) => {
    const rawValue = item.keys.map((k) => normUrl(socials[k])).find(Boolean);
    if (!rawValue) return null;

    let url = rawValue;
    // Fix up URLs if user entered just username for specific platforms
    if (!url.startsWith('http')) {
      if (item.label === 'Twitch') url = `https://twitch.tv/${url}`;
      else if (item.label === 'X') url = `https://x.com/${url.replace('@', '')}`;
      else if (item.label === 'Instagram') url = `https://instagram.com/${url}`;
      else if (item.label === 'TikTok') url = `https://tiktok.com/@${url.replace('@', '')}`;
      else if (item.label === 'YouTube') url = `https://youtube.com/@${url}`;
    }

    const handle = getSocialHandle(rawValue, item.label);

    return { url, label: item.label, icon: item.icon, handle };
  }).filter(Boolean);
};

const Home = () => {
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [creators, setCreators] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const scheduleStripRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Matches (upcoming)
      const matchesRef = collection(db, 'matches');
      const matchesQuery = query(matchesRef, orderBy('date', 'asc'), limit(30));
      const matchesSnapshot = await getDocs(matchesQuery);
      const matches = matchesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const now = new Date();
      const upcoming = matches
        .filter((m) => m.date && m.date.toDate && m.date.toDate() > now)
        .sort((a, b) => a.date.toDate() - b.date.toDate())
        .slice(0, 8);

      setUpcomingMatches(upcoming);

      // Players
      const playersRef = collection(db, 'players');
      const playersSnapshot = await getDocs(playersRef);
      const playersData = playersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const playersList = playersData
        .filter((p) => !p.role?.toLowerCase?.().includes('coach'))
        .slice(0, 6);
      setPlayers(playersList);

      // Creators - try to get from contentCreators collection first
      try {
        const creatorsRef = collection(db, 'contentCreators');
        const cq = query(creatorsRef, limit(6));
        const creatorsSnap = await getDocs(cq);
        const creatorsData = creatorsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        if (creatorsData.length > 0) {
          setCreators(creatorsData.slice(0, 6));
        } else {
          // Fallback to players with creator role
          const fallback = playersData
            .filter(
              (p) =>
                p.role?.toLowerCase?.().includes('creator') || p.role?.toLowerCase?.().includes('content')
            )
            .slice(0, 6);
          setCreators(fallback);
        }
      } catch (e) {
        console.error("Error fetching creators:", e);
        const fallback = playersData
          .filter(
            (p) => p.role?.toLowerCase?.().includes('creator') || p.role?.toLowerCase?.().includes('content')
          )
          .slice(0, 6);
        setCreators(fallback);
      }

      // News (latest)
      try {
        const newsRef = collection(db, 'news');
        // Fetch more items to fill the grid (1 featured + 4 grid = 5)
        const nq = query(newsRef, orderBy('date', 'desc'), limit(5));
        const newsSnap = await getDocs(nq);
        const rows = newsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        if (rows.length > 0) {
          setNewsItems(rows);
        } else {
          setNewsItems([
            { id: 'social-x', title: 'Follow us on X', link: site.socials.x, platform: 'x', date: new Date(), image: '/icons/social/x.svg' },
            { id: 'social-tiktok', title: 'Watch on TikTok', link: site.socials.tiktok, platform: 'tiktok', date: new Date(), image: '/icons/social/tiktok.svg' },
            { id: 'social-discord', title: 'Join our Discord', link: site.socials.discord, platform: 'discord', date: new Date(), image: '/icons/social/discord.svg' },
            { id: 'social-twitch', title: 'Watch Live', link: site.socials.twitch, platform: 'twitch', date: new Date(), image: '/icons/social/twitch.svg' },
            { id: 'social-insta', title: 'Follow on Instagram', link: site.socials.instagram, platform: 'instagram', date: new Date(), image: '/icons/social/instagram.svg' },
          ].filter((i) => Boolean(i.link)));
        }
      } catch (e) {
        setNewsItems([
          { id: 'social-x', title: 'Follow us on X', link: site.socials.x, platform: 'x', date: new Date(), image: '/icons/social/x.svg' },
          { id: 'social-tiktok', title: 'Watch on TikTok', link: site.socials.tiktok, platform: 'tiktok', date: new Date(), image: '/icons/social/tiktok.svg' },
          { id: 'social-discord', title: 'Join our Discord', link: site.socials.discord, platform: 'discord', date: new Date(), image: '/icons/social/discord.svg' },
        ].filter((i) => Boolean(i.link)));
      }

      setLoading(false);
    } catch (error) {
      setUpcomingMatches([]);
      setPlayers([]);
      setCreators([]);
      setNewsItems([]);
      setLoading(false);
    }
  };

  const scheduleItems = useMemo(() => upcomingMatches.slice(0, 8), [upcomingMatches]);

  const scrollSchedule = (dir) => {
    const el = scheduleStripRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.85);
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      {/* Hero */}
      <section className="home-hero">
        <div className="container">
          <div className="home-hero-inner">
            <div className="home-hero-kicker">{site.game}</div>
            <h1 className="home-hero-title">{site.name}</h1>
            <p className="home-hero-sub">where performance meets design.</p>

            <div className="home-hero-actions">
              <Link className="hero-btn primary" to="/teams">
                <span>Meet the team</span>
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="home-section" id="home-schedule">
        <div className="container">
          <div className="home-head">
            <div>
              <div className="home-kicker">Stay up to date with our games</div>
              <div className="home-title-row">
                <h2 className="home-title">Schedule</h2>
                <span className="home-pill">Live</span>
              </div>
            </div>

            <div className="home-actions">
              <button type="button" className="icon-btn" aria-label="Scroll schedule left" onClick={() => scrollSchedule('left')}>
                ‹
              </button>
              <button type="button" className="icon-btn" aria-label="Scroll schedule right" onClick={() => scrollSchedule('right')}>
                ›
              </button>
              <Link className="text-link" to="/schedule">
                View all
              </Link>
            </div>
          </div>

          {scheduleItems.length === 0 ? (
            <div className="home-empty">No upcoming matches yet.</div>
          ) : (
            <div className="schedule-strip" ref={scheduleStripRef}>
              {scheduleItems.map((m) => {
                const dt = m.date?.toDate?.();
                return (
                  <article key={m.id} className="schedule-card">
                    <div className="schedule-top">
                      <div className="schedule-meta">
                        <div className="schedule-league">{m.tournament || 'Tournament TBA'}</div>
                        <div className="schedule-date">{dt ? format(dt, 'MMM d • HH:mm') : 'TBD'}</div>
                      </div>
                      <div className="schedule-badges">
                        {m.streamLink ? <span className="mini-pill">Stream</span> : null}
                        {m.vlrLink ? <span className="mini-pill">VLR</span> : null}
                      </div>
                    </div>

                    <div className="schedule-teams">
                      <div className="schedule-team">
                        <img className="schedule-logo" src="/icons/logos/bodax-gaming_logo_2.svg" alt="BODAX" />
                        <span className="schedule-team-name">BODAX GAMING</span>
                      </div>
                      <span className="schedule-vs">vs</span>
                      <div className="schedule-team">
                        {m.opponentLogoUrl ? (
                          <img className="schedule-logo" src={m.opponentLogoUrl} alt={m.opponent || 'Opponent'} />
                        ) : (
                          <span className="schedule-fallback">{(m.opponent || 'TBA').slice(0, 3).toUpperCase()}</span>
                        )}
                        <span className="schedule-team-name">{m.opponent || 'TBA'}</span>
                      </div>
                    </div>

                    <div className="schedule-actions">
                      {m.streamLink ? (
                        <a className="mini-btn primary" href={m.streamLink} target="_blank" rel="noopener noreferrer">
                          Watch
                        </a>
                      ) : (
                        <span className="mini-btn disabled">Watch</span>
                      )}
                      {m.vlrLink ? (
                        <a className="mini-btn" href={m.vlrLink} target="_blank" rel="noopener noreferrer">
                          VLR
                        </a>
                      ) : (
                        <span className="mini-btn disabled">VLR</span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Team */}
      <section className="home-section">
        <div className="container">
          <div className="home-head">
            <div>
              <div className="home-kicker">Meet the squad</div>
              <h2 className="home-title">Team</h2>
            </div>
            <Link className="text-link" to="/teams">
              View team
            </Link>
          </div>

          <div className="card-grid">
            {players.length ? (
              players.slice(0, 6).map((p) => (
                <article key={p.id} className="person-card">
                  <div className="person-media">
                    {p.photoUrl || p.photoURL ? (
                      <img src={p.photoUrl || p.photoURL} alt={p.fullName || p.name} />
                    ) : (
                      <div className="person-placeholder">
                        <img src="/icons/user-solid.svg" alt="" />
                      </div>
                    )}
                  </div>
                  <div className="person-body">
                    {(() => {
                      const socialLinks = getSocialLinks(p);
                      const country = p.country || 'Germany';
                      const countryCode = (p.countryCode || 'de').toLowerCase();
                      
                      return (
                        <>
                    <div className="person-name">
                      {p.fullName || p.name}
                      <div className="person-country-tag">
                        <img 
                          src={`https://flagcdn.com/${countryCode}.svg`} 
                          alt={country} 
                          title={country}
                          className="country-flag" 
                        />
                        <span className="country-name">{country}</span>
                      </div>
                    </div>
                    {socialLinks.length ? (
                      <div className="person-socials" aria-label="Player socials">
                        {socialLinks.map((s) => (
                          <a
                            key={`${p.id}-${s.label}`}
                            className="person-social"
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={s.label}
                            title={s.label}
                          >
                            <img src={s.icon} alt="" />
                          </a>
                        ))}
                      </div>
                    ) : null}
                        </>
                      );
                    })()}
                  </div>
                </article>
              ))
            ) : (
              <div className="home-empty">No players added yet.</div>
            )}
          </div>
        </div>
      </section>

      {/* Content creators */}
      <section className="home-section">
        <div className="container">
          <div className="home-head">
            <div>
              <div className="home-kicker">Creators & streamers</div>
              <h2 className="home-title">Content</h2>
            </div>
            <Link className="text-link" to="/creators">
              View all
            </Link>
          </div>

          <div className="creator-grid">
            {creators.length ? (
              creators.slice(0, 6).map((c) => (
                <article key={c.id} className="creator-card">
                  <div className="creator-media">
                    {c.photoUrl || c.photoURL ? (
                      <img src={c.photoUrl || c.photoURL} alt={c.fullName || c.name} />
                    ) : (
                      <div className="person-placeholder">
                        <img src="/icons/user-solid.svg" alt="" />
                      </div>
                    )}
                  </div>
                  <div className="creator-body">
                    <div className="creator-name">{c.fullName || c.name}</div>
                    {(() => {
                      const socialLinks = getSocialLinks(c);
                      return socialLinks.length ? (
                        <div className="creator-socials">
                          {socialLinks.map((s) => (
                            <a
                              key={`${c.id}-${s.label}`}
                              className="creator-social-row"
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <div className="creator-social-icon">
                                <img src={s.icon} alt="" />
                              </div>
                              <span className="creator-social-handle">{s.handle || s.label}</span>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="creator-role">{c.role || 'Creator'}</div>
                      );
                    })()}
                  </div>
                </article>
              ))
            ) : (
              <div className="home-empty">No creators added yet.</div>
            )}
          </div>
        </div>
      </section>

      {/* Discord CTA */}
      <section className="home-section discord-cta-section">
        <div className="container">
          <div className="discord-cta-inner">
            <div className="home-kicker" style={{ color: '#e5294f' }}>Join the community</div>
            <h2 className="home-title" style={{ fontSize: 'clamp(32px, 5vw, 48px)', margin: '10px 0 30px' }}>Connect on Discord</h2>
            <a className="hero-btn primary" href={site.socials.discord} target="_blank" rel="noopener noreferrer">
              <span>Join Server</span>
              <span className="btn-arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Our brands */}
      <section className="home-section">
        <div className="container">
          <div className="home-head">
            <div>
              <div className="home-kicker">Powered by</div>
              <h2 className="home-title">Our Brands</h2>
            </div>
            <Link className="text-link" to="/partners">
              View all
            </Link>
          </div>

          <div className="brand-grid">
            {BRANDS.map((b) => (
              <a key={b.href} className="brand-card" href={b.href} target="_blank" rel="noopener noreferrer">
                <div className="brand-main">
                  {b.image && <img src={b.image} alt="" className="brand-logo" />}
                  <span className="brand-name">{b.name}</span>
                </div>
                <span className="brand-cta">Visit →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="home-section">
        <div className="container">
          <div className="home-head">
            <div>
              <div className="home-kicker">Latest updates</div>
              <h2 className="home-title">News</h2>
            </div>
            <Link className="text-link" to="/news">
              View all
            </Link>
          </div>

          <div className="featured-grid">
            {newsItems.length ? (
              <>
                {/* Main Featured (Left) */}
                <div className="main-featured-col">
                  {(() => {
                    const n = newsItems[0];
                    const isInternal = !SOCIAL_PLATFORMS.includes(n.platform) || n.platform === 'news';
                    const CardWrapper = isInternal ? Link : 'a';
                    const cardProps = isInternal 
                      ? { to: `/news/${n.id}` }
                      : { href: n.link || '#', target: n.link ? "_blank" : undefined, rel: n.link ? "noopener noreferrer" : undefined };
                    
                    return (
                      <CardWrapper
                        key={n.id}
                        className="main-featured-card"
                        {...cardProps}
                      >
                         <div className="main-featured-image">
                          {n.image ? (
                            <img src={n.image} alt="" />
                          ) : (
                            <div className="placeholder-image" />
                          )}
                        </div>
                        <div className="main-featured-content">
                          <div className="news-meta">
                            {n.platform && <span className="news-platform">{String(n.platform).toUpperCase()}</span>}
                            <span className="news-dot">•</span>
                            <span className="news-date">
                              {n.date
                                ? format(n.date?.toDate ? n.date.toDate() : new Date(n.date), 'MMM d, yyyy')
                                : '—'}
                            </span>
                          </div>
                          <h3 className="main-featured-title">{n.title || 'Update'}</h3>
                          <span className="read-more-link">{isInternal ? 'Read Article' : 'Read More'} <span>→</span></span>
                        </div>
                      </CardWrapper>
                    );
                  })()}
                </div>

                {/* Sub Featured (Right) */}
                <div className="sub-featured-col">
                  {newsItems.slice(1, 5).map((n) => {
                    const isInternal = !SOCIAL_PLATFORMS.includes(n.platform) || n.platform === 'news';
                    const CardWrapper = isInternal ? Link : 'a';
                    const cardProps = isInternal 
                      ? { to: `/news/${n.id}` }
                      : { href: n.link || '#', target: n.link ? "_blank" : undefined, rel: n.link ? "noopener noreferrer" : undefined };

                    return (
                      <CardWrapper
                        key={n.id}
                        className="sub-featured-card"
                        {...cardProps}
                      >
                        <div className="sub-featured-image">
                          {n.image ? (
                            <img src={n.image} alt="" />
                          ) : (
                            <div className="placeholder-image" />
                          )}
                        </div>
                        <div className="sub-featured-content">
                          <h4 className="sub-featured-title">{n.title || 'Update'}</h4>
                          <div className="news-meta small">
                             <span className="news-date">
                                {n.date
                                  ? format(n.date?.toDate ? n.date.toDate() : new Date(n.date), 'MMM d, yyyy')
                                  : '—'}
                             </span>
                          </div>
                        </div>
                      </CardWrapper>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="home-empty">No news yet.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
