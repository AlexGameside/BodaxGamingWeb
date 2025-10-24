import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import GameSlider from '../components/GameSlider';
import TypingAnimation from '../components/TypingAnimation';
import TitleTypingAnimation from '../components/TitleTypingAnimation';
import './Home.css';

const Home = () => {
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [mainTeamPlayers, setMainTeamPlayers] = useState([]);
  const [vantageTeamPlayers, setVantageTeamPlayers] = useState([]);
  const [gameChangersPlayers, setGameChangersPlayers] = useState([]);
  const [streamers, setStreamers] = useState([]);
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
      const upcoming = matches
        .filter(m => m.date?.toDate() > now)
        .sort((a, b) => a.date?.toDate() - b.date?.toDate());

      setUpcomingMatches(upcoming);

      // Fetch players and separate by team
      const playersRef = collection(db, 'players');
      const playersSnapshot = await getDocs(playersRef);
      const playersData = playersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Separate by team (only non-coaches)
      const mainPlayers = playersData.filter(p => 
        p.team === 'main' && !p.role.toLowerCase().includes('coach')
      );
      const vantagePlayers = playersData.filter(p => 
        p.team === 'vantage' && !p.role.toLowerCase().includes('coach')
      );
      const gameChangersPlayers = playersData.filter(p => 
        p.team === 'game-changers' && !p.role.toLowerCase().includes('coach')
      );
      
      setMainTeamPlayers(mainPlayers);
      setVantageTeamPlayers(vantagePlayers);
      setGameChangersPlayers(gameChangersPlayers);

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

  const renderPlayerCard = (player) => (
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
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      {/* Slogan Section */}
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

      {/* Upcoming Games Section */}
      <section id="upcoming-games" className="upcoming-games-section-home">
        <h2 className="section-title">
          <TitleTypingAnimation text="UPCOMING GAMES" speed={5} delay={100} useViewport={true} />
        </h2>
        {upcomingMatches.length > 0 ? (
          <GameSlider games={upcomingMatches} />
        ) : (
          <div className="no-data">No upcoming matches scheduled</div>
        )}
      </section>

      {/* Main Team Section */}
      <section id="main-team" className="team-section main-team-section">
        <div className="team-section-header">
          <h2 className="section-title">
            <TitleTypingAnimation text="MAIN TEAM" speed={5} delay={100} useViewport={true} />
          </h2>
          <Link to="/teams/main" className="view-more-btn">VIEW FULL ROSTER →</Link>
        </div>
        
        <div className="team-grid">
          {mainTeamPlayers.length > 0 ? (
            mainTeamPlayers.slice(0, 5).map(renderPlayerCard)
          ) : (
            <div className="no-data">No main team players added yet</div>
          )}
        </div>
      </section>

      {/* Team Vantage Section */}
      <section id="team-vantage" className="team-section vantage-team-section">
        <div className="team-section-header">
          <h2 className="section-title vantage-title">
            <TitleTypingAnimation text="TEAM VANTAGE" speed={5} delay={100} useViewport={true} />
          </h2>
          <Link to="/teams/vantage" className="view-more-btn vantage-btn">VIEW FULL ROSTER →</Link>
        </div>
        
        <div className="team-grid">
          {vantageTeamPlayers.length > 0 ? (
            vantageTeamPlayers.slice(0, 5).map(renderPlayerCard)
          ) : (
            <div className="no-data">No team vantage players added yet</div>
          )}
        </div>
      </section>

      {/* Game Changers Section */}
      <section id="game-changers" className="team-section game-changers-section">
        <div className="team-section-header">
          <h2 className="section-title game-changers-title">
            <TitleTypingAnimation text="GAME CHANGERS" speed={5} delay={100} useViewport={true} />
          </h2>
          <Link to="/teams/game-changers" className="view-more-btn game-changers-btn">VIEW FULL ROSTER →</Link>
        </div>
        
        <div className="team-grid">
          {gameChangersPlayers.length > 0 ? (
            gameChangersPlayers.slice(0, 5).map(renderPlayerCard)
          ) : (
            <div className="no-data">No game changers players added yet</div>
          )}
        </div>
      </section>

      {/* Streamers Section */}
      <section id="streamers" className="streamers-section-home">
        <div className="streamers-section-header">
          <h2 className="section-title streamers-title">
            <TitleTypingAnimation text="OUR STREAMERS" speed={5} delay={100} useViewport={true} />
          </h2>
          <Link to="/streamers" className="view-more-btn streamers-btn">VIEW ALL STREAMERS →</Link>
        </div>
        
        <div className="streamers-grid-home">
          {streamers.length > 0 ? (
            streamers.map(streamer => (
              <div key={streamer.id} className="streamer-card-home">
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
                <div className="streamer-info-home">
                  <h3 className="streamer-name-home">{streamer.name}</h3>
                  <p className="streamer-title-home">{streamer.title || 'Content Creator'}</p>
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

export default Home;