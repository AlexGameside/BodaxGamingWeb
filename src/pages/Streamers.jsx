import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import TitleTypingAnimation from '../components/TitleTypingAnimation';
import './Streamers.css';

const Streamers = () => {
  const [streamers, setStreamers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreamers();
  }, []);

  const fetchStreamers = async () => {
    try {
      const streamersRef = collection(db, 'streamers');
      const q = query(streamersRef, orderBy('name'));
      const snapshot = await getDocs(q);
      
      const streamersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setStreamers(streamersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching streamers:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading streamers...</div>;
  }

  return (
    <div className="streamers-page">
      {/* Hero Section */}
      <section className="streamers-hero-section">
        <div className="streamers-hero-content">
          <h1 className="streamers-title">
            <TitleTypingAnimation text="OUR STREAMERS" speed={50} delay={100} />
          </h1>
          <p className="streamers-tagline">Content Creators & Community Leaders</p>
        </div>
      </section>

      {/* Streamers Grid Section */}
      <section className="streamers-section">
        <div className="streamers-grid">
          {streamers.length > 0 ? (
            streamers.map(streamer => (
              <div key={streamer.id} className="streamer-card">
                <div className="streamer-portrait">
                  {streamer.photoUrl && streamer.photoUrl.trim() !== '' ? (
                    <img src={streamer.photoUrl} alt={streamer.name} />
                  ) : (
                    <div className="streamer-placeholder-portrait">
                      <svg className="streamer-placeholder-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="streamer-info">
                  <h3 className="streamer-name">{streamer.name}</h3>
                  <p className="streamer-title">{streamer.title || 'Content Creator'}</p>
                  {streamer.bio && <p className="streamer-bio">{streamer.bio}</p>}
                  <div className="streamer-socials">
                    {streamer.twitchUrl && (
                      <a 
                        href={streamer.twitchUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="streamer-social-link twitch"
                      >
                        <img src="/icons/social/twitch.svg" alt="Twitch" className="streamer-social-icon" />
                        <span>TWITCH</span>
                      </a>
                    )}
                    {streamer.youtubeUrl && (
                      <a 
                        href={streamer.youtubeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="streamer-social-link youtube"
                      >
                        <img src="/icons/social/youtube.svg" alt="YouTube" className="streamer-social-icon" />
                        <span>YOUTUBE</span>
                      </a>
                    )}
                    {streamer.twitterUrl && (
                      <a 
                        href={streamer.twitterUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="streamer-social-link twitter"
                      >
                        <img src="/icons/social/x.svg" alt="X" className="streamer-social-icon" />
                        <span>X</span>
                      </a>
                    )}
                    {streamer.tiktokUrl && (
                      <a 
                        href={streamer.tiktokUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="streamer-social-link tiktok"
                      >
                        <img src="/icons/social/tiktok.svg" alt="TikTok" className="streamer-social-icon" />
                        <span>TIKTOK</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">No streamers added yet</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Streamers;
