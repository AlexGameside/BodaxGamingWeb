import React, { useEffect } from 'react';
import './PersonModal.css';

const PersonModal = ({ person, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!person) return null;

  const { fullName, name, ign, photoUrl, photoURL, country, countryCode, role, bio, socials } = person;
  const displayPhoto = photoUrl || photoURL;
  const displayName = fullName || name || 'Unknown';
  const displayIgn = ign || '';
  
  const isPlaceholder = !displayPhoto;

  const renderSocials = () => {
    if (!socials) return null;
    const items = [];
    if (socials.twitter || socials.x) items.push({ type: 'x', url: socials.twitter || socials.x });
    if (socials.twitch) items.push({ type: 'twitch', url: socials.twitch.startsWith('http') ? socials.twitch : `https://twitch.tv/${socials.twitch}` });
    if (socials.instagram) items.push({ type: 'instagram', url: socials.instagram });
    if (socials.youtube) items.push({ type: 'youtube', url: socials.youtube });
    if (socials.tiktok) items.push({ type: 'tiktok', url: socials.tiktok });
    if (socials.discord) items.push({ type: 'discord', url: socials.discord });

    if (items.length === 0) return null;

    return (
      <div className="pm-socials">
        {items.map((s, i) => (
          <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="pm-social-link" aria-label={s.type}>
            <img src={`/icons/social/${s.type}.svg`} alt={s.type} />
          </a>
        ))}
      </div>
    );
  };

  return (
    <div className="pm-overlay" onClick={onClose}>
      <div className="pm-content" onClick={(e) => e.stopPropagation()}>
        <button className="pm-close" onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        
        <div className="pm-layout">
          <div className="pm-image-col">
            <div className="pm-photo-wrapper">
              {isPlaceholder ? (
                 <div className="pm-photo-placeholder"><img src="/icons/user-solid.svg" alt="" /></div>
              ) : (
                 <img src={displayPhoto} alt={displayName} className="pm-photo" />
              )}
            </div>
          </div>
          
          <div className="pm-info-col">
            <div className="pm-header">
              <h2 className="pm-name">{displayName}</h2>
              {displayIgn && <div className="pm-ign">"{displayIgn}"</div>}
              
              <div className="pm-badges">
                {role && <span className="pm-role-badge">{role}</span>}
                {country && (
                  <div className="pm-country-badge">
                    {countryCode && <img src={`https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`} alt={country} />}
                    <span>{country}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pm-body">
              {bio ? (
                <p className="pm-bio">{bio}</p>
              ) : (
                <p className="pm-bio-empty">No biography available.</p>
              )}
            </div>

            <div className="pm-footer">
              {renderSocials()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonModal;

