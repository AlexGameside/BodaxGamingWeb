import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import PersonModal from '../components/PersonModal';
import './Page.css';
import './Creators.css';

const sortByName = (a, b) => {
  const an = (a.fullName || a.name || '').toLowerCase();
  const bn = (b.fullName || b.name || '').toLowerCase();
  return an.localeCompare(bn);
};

const Creators = () => {
  const [loading, setLoading] = useState(true);
  const [creators, setCreators] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, 'contentCreators'));
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setCreators(rows);
      } catch (e) {
        console.error('Creators fetch error:', e);
        setCreators([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const display = [...creators].sort(sortByName);

  return (
    <div className="page">
      <div className="container">
        <div className="page-hero">
          <span className="kicker">Talent</span>
          <h1 className="h2 page-hero-title">Content Creators</h1>
          <p className="page-hero-subtitle">
            Meet the personalities bringing you the best VALORANT content and community vibes.
          </p>
        </div>

        {loading ? (
          <div className="empty">Loading creators…</div>
        ) : display.length === 0 ? (
          <div className="empty">No content creators added yet.</div>
        ) : (
          <div className="creator-grid">
            {display.map((p) => {
              const name = p.name || 'Unknown';
              const photo = p.photoUrl || '';
              const x = p.socials?.twitter || '';
              
              // Twitch: check plain string or full URL. If simple string, assume username.
              let twitch = p.socials?.twitch || '';
              if (twitch && !twitch.startsWith('http')) {
                twitch = `https://twitch.tv/${twitch}`;
              }

              const youtube = p.socials?.youtube || '';
              const instagram = p.socials?.instagram || '';
              const tiktok = p.socials?.tiktok || '';

              return (
                <article 
                  key={p.id} 
                  className="creator-card" 
                  onClick={() => setSelectedPerson(p)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="creator-photo">
                    {photo ? (
                      <img src={photo} alt={name} />
                    ) : (
                      <div className="creator-photo-placeholder">
                        <img src="/icons/user-solid.svg" alt="" />
                      </div>
                    )}
                  </div>
                  <div className="creator-meta">
                    <div className="creator-name-row">
                      <h3 className="creator-name">{name}</h3>
                    </div>
                    
                    {(x || twitch || youtube || instagram || tiktok) ? (
                      <div className="creator-socials" onClick={(e) => e.stopPropagation()}>
                        {twitch ? (
                          <a href={twitch} target="_blank" rel="noopener noreferrer" className="creator-social" aria-label="Twitch">
                            <img src="/icons/social/twitch.svg" alt="" />
                          </a>
                        ) : null}
                        {x ? (
                          <a href={x} target="_blank" rel="noopener noreferrer" className="creator-social" aria-label="X">
                            <img src="/icons/social/x.svg" alt="" />
                          </a>
                        ) : null}
                        {youtube ? (
                          <a href={youtube} target="_blank" rel="noopener noreferrer" className="creator-social" aria-label="YouTube">
                            <img src="/icons/social/youtube.svg" alt="" />
                          </a>
                        ) : null}
                        {instagram ? (
                          <a href={instagram} target="_blank" rel="noopener noreferrer" className="creator-social" aria-label="Instagram">
                            <img src="/icons/social/instagram.svg" alt="" />
                          </a>
                        ) : null}
                        {tiktok ? (
                          <a href={tiktok} target="_blank" rel="noopener noreferrer" className="creator-social" aria-label="TikTok">
                            <img src="/icons/social/tiktok.svg" alt="" />
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

export default Creators;
