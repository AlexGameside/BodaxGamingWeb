import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { format } from 'date-fns';
import TitleTypingAnimation from '../components/TitleTypingAnimation';
import './TeamVantage.css';

const TeamVantage = () => {
  const [players, setPlayers] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [upcomingMatch, setUpcomingMatch] = useState(null);
  const [activeTab, setActiveTab] = useState('players');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      // Fetch players for team vantage
      const playersRef = collection(db, 'players');
      const playersSnapshot = await getDocs(playersRef);
      const playersData = playersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter players and coaches for team vantage
      const vantagePlayers = playersData.filter(p => 
        p.team === 'vantage' && !p.role.toLowerCase().includes('coach')
      );
      const vantageCoaches = playersData.filter(p => 
        p.team === 'vantage' && p.role.toLowerCase().includes('coach')
      );

      setPlayers(vantagePlayers);
      setCoaches(vantageCoaches);

      // Fetch next upcoming match
      const matchesRef = collection(db, 'matches');
      const matchesQuery = query(matchesRef, orderBy('date', 'asc'));
      const matchesSnapshot = await getDocs(matchesQuery);
      
      const now = new Date();
      const upcoming = matchesSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(m => m.date?.toDate() > now && m.team === 'vantage')
        .sort((a, b) => a.date?.toDate() - b.date?.toDate())[0];

      setUpcomingMatch(upcoming);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching team vantage data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading Team Vantage...</div>;
  }

  return (
    <div className="team-page team-vantage">
      {/* Section 1: Team Header with Name, Socials, and Upcoming Game */}
      <section className="team-hero-section">
        <div className="team-hero-content">
          <h1 className="team-title">
            <TitleTypingAnimation text="TEAM VANTAGE" speed={50} delay={100} />
          </h1>
          <p className="team-tagline">Strategic Excellence & Tactical Innovation</p>
          
          <div className="team-socials">
            <a href="https://x.com/GamingBodax" target="_blank" rel="noopener noreferrer" className="social-button">
              <img src="/icons/social/x.svg" alt="X" className="social-icon" />
              <span>X</span>
            </a>
            <a href="https://www.tiktok.com/@bodaxgaming" target="_blank" rel="noopener noreferrer" className="social-button">
              <img src="/icons/social/tiktok.svg" alt="TikTok" className="social-icon" />
              <span>TIKTOK</span>
            </a>
            <a href="https://discord.gg/SCRE27SpvQ" target="_blank" rel="noopener noreferrer" className="social-button">
              <img src="/icons/social/discord.svg" alt="Discord" className="social-icon" />
              <span>DISCORD</span>
            </a>
          </div>

          {upcomingMatch && (
            <div className="upcoming-match-card">
              <h3 className="upcoming-match-title">NEXT MATCH</h3>
              <div className="match-info">
                <div className="match-date">
                  {format(upcomingMatch.date.toDate(), 'EEEE, MMMM d, yyyy')}
                  <br />
                  {format(upcomingMatch.date.toDate(), 'h:mm a')}
                </div>
                <div className="match-tournament">{upcomingMatch.tournament}</div>
                <div className="match-opponent">
                  <span className="vs-text">VS</span>
                  <span className="opponent-name">{upcomingMatch.opponent}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 2: Players and Coaches */}
      <section className="team-section">
        <div className="team-section-header">
          <h2 className="section-title">
            <TitleTypingAnimation text="OUR ROSTER" speed={5} delay={100} useViewport={true} />
          </h2>
          <div className="team-tabs">
            <button 
              className={`tab-button ${activeTab === 'players' ? 'active' : ''}`}
              onClick={() => setActiveTab('players')}
            >
              PLAYERS
            </button>
            <button 
              className={`tab-button ${activeTab === 'coaches' ? 'active' : ''}`}
              onClick={() => setActiveTab('coaches')}
            >
              COACHES
            </button>
          </div>
        </div>
        
        <div className="team-grid">
          {activeTab === 'players' ? (
            players.length > 0 ? (
              players.map(player => (
                <div key={player.id} className="team-member-card">
                  <div className="member-portrait">
                    {player.photoUrl && player.photoUrl.trim() !== '' ? (
                      <img src={player.photoUrl} alt={player.fullName} />
                    ) : (
                      <div className="placeholder-portrait">
                        <svg className="placeholder-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="member-info">
                    <h3 className="member-name">{player.fullName}</h3>
                    <p className="member-ign">{player.role}</p>
                    <div className="member-socials">
                      {player.socials?.twitter && (
                        <a href={player.socials.twitter} target="_blank" rel="noopener noreferrer">TWITTER</a>
                      )}
                      {player.socials?.twitch && (
                        <a href={player.socials.twitch} target="_blank" rel="noopener noreferrer">TWITCH</a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">No players added yet</div>
            )
          ) : (
            coaches.length > 0 ? (
              coaches.map(coach => (
                <div key={coach.id} className="team-member-card">
                  <div className="member-portrait">
                    {coach.photoUrl ? (
                      <img src={coach.photoUrl} alt={coach.fullName} />
                    ) : (
                      <div className="placeholder-portrait">
                        <svg className="placeholder-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="member-info">
                    <h3 className="member-name">{coach.fullName}</h3>
                    <p className="member-ign">{coach.role}</p>
                    <div className="member-socials">
                      {coach.socials?.twitter && (
                        <a href={coach.socials.twitter} target="_blank" rel="noopener noreferrer">TWITTER</a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">No coaches added yet</div>
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default TeamVantage;
