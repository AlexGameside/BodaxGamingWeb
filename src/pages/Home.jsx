import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import TypingAnimation from '../components/TypingAnimation';
import TitleTypingAnimation from '../components/TitleTypingAnimation';
import './Home.css';

const Home = () => {
  const [streamers, setStreamers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch streamers
      const streamersRef = collection(db, 'streamers');
      const streamersQuery = query(streamersRef, orderBy('name'), limit(6));
      const streamersSnapshot = await getDocs(streamersQuery);
      const streamersData = streamersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setStreamers(streamersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const teams = [
    {
      id: 'main',
      name: 'MAIN TEAM',
      path: '/teams/main',
      color: '#e5294f'
    },
    {
      id: 'vantage',
      name: 'TEAM VANTAGE',
      path: '/teams/vantage',
      color: '#0096ff'
    },
    {
      id: 'game-changers',
      name: 'GAME CHANGERS',
      path: '/teams/game-changers',
      color: '#ffa500'
    }
  ];

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="slogan-section">
        <h1 className="main-title">
          <TitleTypingAnimation text="BODAX GAMING" speed={50} delay={100} />
        </h1>
        <p className="slogan">
          <TypingAnimation 
            text="WHERE PERFORMANCE MEETS DESIGN." 
            speed={80}
            delay={800}
          />
        </p>
      </section>

      {/* Our Teams Section */}
      <section className="teams-overview-section">
        <h2 className="section-title">
          <TitleTypingAnimation text="OUR TEAMS" speed={5} delay={100} useViewport={true} />
        </h2>
        
        <div className="teams-overview-grid">
          {teams.map((team, index) => (
            <Link 
              to={team.path} 
              key={team.id} 
              className="team-overview-card"
              style={{ '--team-color': team.color, animationDelay: `${index * 0.15}s` }}
            >
              <div className="team-overview-image">
                <div className="team-placeholder">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                </div>
              </div>
              <div className="team-overview-name">
                <h3>{team.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Our Streamers Section */}
      <section id="streamers" className="streamers-section-home">
        <h2 className="section-title streamers-title">
          <TitleTypingAnimation text="OUR STREAMERS" speed={5} delay={100} useViewport={true} />
        </h2>
        
        <div className="streamers-row-home">
          {streamers.length > 0 ? (
            streamers.map((streamer, index) => (
              <div key={streamer.id} className="streamer-card-home" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="streamer-portrait-home">
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
                <h3 className="streamer-name-home">{streamer.name}</h3>
                <div className="streamer-socials">
                  {streamer.socials?.twitter && (
                    <a href={streamer.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  )}
                  {streamer.socials?.twitch && (
                    <a href={streamer.socials.twitch} target="_blank" rel="noopener noreferrer" aria-label="Twitch">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
                      </svg>
                    </a>
                  )}
                  {streamer.socials?.youtube && (
                    <a href={streamer.socials.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                  )}
                </div>
                <p className="streamer-bio">{streamer.bio || 'Lorem ipsum dies das anannas'}</p>
              </div>
            ))
          ) : (
            <div className="no-data">No streamers added yet</div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">JOIN OUR COMMUNITY</h2>
          <p className="cta-description">
            Connect with us on Discord and follow our journey
          </p>
          <div className="cta-buttons">
            <a 
              href="https://discord.gg/bodaxgaming" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cta-button discord-button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              JOIN DISCORD
            </a>
            <a 
              href="https://twitter.com/bodaxgaming" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cta-button twitter-button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              FOLLOW US
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;