import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { format } from 'date-fns';
import GameSlider from '../components/GameSlider';
import './Home.css';

const Home = () => {
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [activeTab, setActiveTab] = useState('players');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch matches
      const matchesRef = collection(db, 'matches');
      const matchesQuery = query(matchesRef, orderBy('date', 'desc'), limit(10));
      const matchesSnapshot = await getDocs(matchesQuery);
      
      const matches = matchesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const now = new Date();
      const upcoming = matches.filter(m => m.date?.toDate() > now).slice(0, 3);
      const recent = matches.filter(m => m.date?.toDate() <= now).slice(0, 3);

      setUpcomingMatches(upcoming);
      setRecentMatches(recent);

      // Fetch players
      const playersRef = collection(db, 'players');
      const playersSnapshot = await getDocs(playersRef);
      const playersData = playersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Separate players and coaches
      const playersList = playersData.filter(p => p.role !== 'Coach');
      const coachesList = playersData.filter(p => p.role === 'Coach');
      
      setPlayers(playersList);
      setCoaches(coachesList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      {/* Slogan Section */}
      <section className="slogan-section">
        <h1 className="main-title">BODAX GAMING</h1>
        <p className="slogan">WHERE PERFORMANCE MEETS DESIGN.</p>
      </section>

      {/* Team Section */}
      <section id="team" className="team-section">
        <h2 className="section-title">OUR TEAM</h2>
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
        
        <div className="team-grid">
          {activeTab === 'players' ? (
            players.length > 0 ? (
              players.map(player => (
                <div key={player.id} className="team-member-card">
                  <div className="member-portrait">
                    {player.photoUrl ? (
                      <img src={player.photoUrl} alt={player.fullName} />
                    ) : (
                      <div className="placeholder-portrait">PHOTO</div>
                    )}
                  </div>
                  <div className="member-info">
                    <h3 className="member-name">{player.fullName}</h3>
                    <p className="member-ign">{player.ign}</p>
                    <p className="member-role">{player.role}</p>
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
                      <div className="placeholder-portrait">PHOTO</div>
                    )}
                  </div>
                  <div className="member-info">
                    <h3 className="member-name">{coach.fullName}</h3>
                    <p className="member-ign">{coach.ign}</p>
                    <p className="member-role">{coach.role}</p>
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

      {/* Upcoming Games Section */}
      <section id="upcoming-games">
        <GameSlider games={upcomingMatches} />
      </section>

      {/* Recent Games Section */}
      <section id="recent-games" className="recent-games-section">
        <h2 className="section-title">RECENT GAMES</h2>
        <div className="games-container">
          {recentMatches.length > 0 ? (
            recentMatches.map(match => (
              <div key={match.id} className="game-card">
                <div className="game-header">
                  <div className="game-date">
                    {format(match.date.toDate(), 'MMM d, yyyy')}
                  </div>
                  <div className="game-tournament">{match.tournament}</div>
                </div>
                <div className="game-teams">
                  <div className="team-info">
                    <div className="team-logo">
                      <img src="/icons/logos/bodax-gaming_logo.png" alt="BODAX Gaming" className="team-logo-img" />
                    </div>
                    <div className="team-name">BODAX GAMING</div>
                    <div className={`team-score ${match.ourScore > match.opponentScore ? 'win' : 'loss'}`}>
                      {match.ourScore}
                    </div>
                  </div>
                  <div className="vs">VS</div>
                  <div className="team-info">
                    <div className="team-logo team-logo-placeholder">
                      <span className="placeholder-text">{match.opponent?.substring(0, 3).toUpperCase()}</span>
                    </div>
                    <div className="team-name">{match.opponent}</div>
                    <div className={`team-score ${match.opponentScore > match.ourScore ? 'win' : 'loss'}`}>
                      {match.opponentScore}
                    </div>
                  </div>
                </div>
                <div className="game-result">
                  <div className={`result ${match.ourScore > match.opponentScore ? 'victory' : 'defeat'}`}>
                    {match.ourScore > match.opponentScore ? 'VICTORY' : 'DEFEAT'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">No recent matches</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

