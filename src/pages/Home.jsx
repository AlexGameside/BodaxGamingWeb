import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { format } from 'date-fns';
import Countdown from '../components/Countdown';
import './Home.css';

const Home = () => {
  const [upcomingMatch, setUpcomingMatch] = useState(null);
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const matchesRef = collection(db, 'matches');
      const q = query(matchesRef, orderBy('date', 'desc'), limit(4));
      const snapshot = await getDocs(q);
      
      const matches = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const now = new Date();
      const upcoming = matches.find(m => m.date?.toDate() > now);
      const recent = matches.filter(m => m.date?.toDate() <= now).slice(0, 3);

      setUpcomingMatch(upcoming);
      setRecentMatches(recent);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to BodaxGaming</h1>
          <p className="hero-subtitle">Elite Esports Team</p>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">🏆</div>
              <div className="stat-label">Champions</div>
            </div>
            <div className="stat">
              <div className="stat-value">💪</div>
              <div className="stat-label">Dedicated</div>
            </div>
            <div className="stat">
              <div className="stat-value">🎮</div>
              <div className="stat-label">Gamers</div>
            </div>
          </div>
        </div>
      </section>

      <section className="next-match-section">
        <h2>Next Match</h2>
        {upcomingMatch ? (
          <div className="next-match-card">
            <div className="match-date">
              {format(upcomingMatch.date.toDate(), 'EEEE, MMMM d, yyyy - HH:mm')}
            </div>
            <Countdown targetDate={upcomingMatch.date.toDate()} />
            <div className="match-teams">
              <div className="team">
                <div className="team-name">BodaxGaming</div>
              </div>
              <div className="vs">VS</div>
              <div className="team">
                <div className="team-name">{upcomingMatch.opponent}</div>
              </div>
            </div>
            <div className="match-tournament">{upcomingMatch.tournament}</div>
          </div>
        ) : (
          <p className="no-matches">No upcoming matches scheduled</p>
        )}
      </section>

      <section className="recent-matches-section">
        <h2>Recent Results</h2>
        {recentMatches.length > 0 ? (
          <div className="recent-matches-grid">
            {recentMatches.map(match => (
              <div key={match.id} className="recent-match-card">
                <div className="match-date-small">
                  {format(match.date.toDate(), 'MMM d, yyyy')}
                </div>
                <div className="match-result">
                  <div className="team-score">
                    <span className="team-name-small">BodaxGaming</span>
                    <span className={`score ${match.ourScore > match.opponentScore ? 'win' : 'loss'}`}>
                      {match.ourScore}
                    </span>
                  </div>
                  <div className="score-separator">-</div>
                  <div className="team-score">
                    <span className={`score ${match.opponentScore > match.ourScore ? 'win' : 'loss'}`}>
                      {match.opponentScore}
                    </span>
                    <span className="team-name-small">{match.opponent}</span>
                  </div>
                </div>
                <div className="match-tournament-small">{match.tournament}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-matches">No recent matches</p>
        )}
      </section>
    </div>
  );
};

export default Home;

