import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import PersonModal from '../components/PersonModal';
import './Page.css';
import './Teams.css';

const isCoachRole = (role) => (role || '').toLowerCase().includes('coach');

const sortByName = (a, b) => {
  const an = (a.fullName || a.name || '').toLowerCase();
  const bn = (b.fullName || b.name || '').toLowerCase();
  return an.localeCompare(bn);
};

const Teams = () => {
  const [loading, setLoading] = useState(true);
  const [roster, setRoster] = useState([]);
  const [tab, setTab] = useState('players');
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const rosterSnap = await getDocs(collection(db, 'players'));
        const rosterRows = rosterSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setRoster(rosterRows);
      } catch (e) {
        console.error('Teams fetch error:', e);
        setRoster([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const display = useMemo(() => {
    const sorted = [...roster].sort(sortByName);
    return tab === 'players' 
      ? sorted.filter((p) => !isCoachRole(p.role))
      : sorted.filter((p) => isCoachRole(p.role));
  }, [tab, roster]);

  return (
    <div className="page">
      <div className="container">
        <div className="page-hero">
          <span className="kicker">Roster</span>
          <h1 className="h2 page-hero-title">Teams</h1>
          <p className="page-hero-subtitle">
            Our VALORANT lineup—players, coaches, and the people behind the prep.
          </p>
        </div>

        <div className="teams-toolbar">
          <div className="tabs" role="tablist" aria-label="Roster tabs">
            <button
              className={`tab ${tab === 'players' ? 'active' : ''}`}
              onClick={() => setTab('players')}
              type="button"
              role="tab"
              aria-selected={tab === 'players'}
            >
              Players
            </button>
            <button
              className={`tab ${tab === 'staff' ? 'active' : ''}`}
              onClick={() => setTab('staff')}
              type="button"
              role="tab"
              aria-selected={tab === 'staff'}
            >
              Coaches
            </button>
          </div>
        </div>

        {loading ? (
          <div className="empty">Loading roster…</div>
        ) : display.length === 0 ? (
          <div className="empty">
            No {tab === 'players' ? 'players' : 'coaches'} found.
          </div>
        ) : (
          <div className="roster-grid">
            {display.map((p) => {
              const name = p.fullName || p.name || 'Unknown';
              const ign = p.ign ? String(p.ign) : null;
              const photo = p.photoUrl || p.photoURL || '';
              const x = p.socials?.twitter || '';
              const twitch = p.socials?.twitch || '';
              const vlr = p.socials?.vlr || '';
              
              // Only players have country logic typically
              const country = p.country || 'Germany';
              const countryCode = (p.countryCode || 'de').toLowerCase();

              return (
                <article 
                  key={p.id} 
                  className="roster-card" 
                  onClick={() => setSelectedPerson(p)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="roster-photo">
                    {photo ? (
                      <img src={photo} alt={name} />
                    ) : (
                      <div className="roster-photo-placeholder">
                        <img src="/icons/user-solid.svg" alt="" />
                      </div>
                    )}
                  </div>
                  <div className="roster-meta">
                    <div className="roster-header-col">
                      <div className="roster-top-row">
                        <h3 className="roster-ign-main">
                          {ign || name}
                        </h3>
                        <div className="roster-country-tag">
                           <img 
                             src={`https://flagcdn.com/${countryCode}.svg`} 
                             alt={country} 
                             title={country}
                             className="country-flag" 
                           />
                           {/* Country name removed as it takes space and flag + tooltip is usually enough, or re-add if desired but user said "keep country on the right" */}
                           {/* Original had span country-name. Let's keep it if space allows or hide it if minimal. User said "small text currently on the right of the country" -> referring to name? No "currently on the right of the country" -> Country Name? */}
                           {/* Wait, user said "real name be the small text thats currently on the right of the country" in PREVIOUS query. */}
                           {/* In THIS query: "keep the country on the right side of the card." */}
                           <span className="country-name">{country}</span>
                        </div>
                      </div>
                      
                      {ign ? (
                        <div className="roster-real-name-sub">
                          {name}
                        </div>
                      ) : null}
                    </div>

                    {(x || twitch || vlr) ? (
                      <div className="roster-socials" onClick={(e) => e.stopPropagation()}>
                        {twitch ? (
                          <a href={twitch} target="_blank" rel="noopener noreferrer" className="roster-social twitch" aria-label="Twitch">
                            <img src="/icons/social/twitch.svg" alt="" />
                          </a>
                        ) : null}
                        {x ? (
                          <a href={x} target="_blank" rel="noopener noreferrer" className="roster-social" aria-label="X">
                            <img src="/icons/social/x.svg" alt="" />
                          </a>
                        ) : null}
                        {vlr ? (
                          <a href={vlr} target="_blank" rel="noopener noreferrer" className="roster-social vlr" aria-label="VLR.gg">
                            <img src="/icons/social/vlr.svg" alt="" />
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <PersonModal person={selectedPerson} onClose={() => setSelectedPerson(null)} />
    </div>
  );
};

export default Teams;
