import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { format } from 'date-fns';
import './Matches.css';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const matchesRef = collection(db, 'matches');
      const q = query(matchesRef, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      
      const matchesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setMatches(matchesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setLoading(false);
    }
  };

  const getFilteredMatches = () => {
    const now = new Date();
    
    if (filter === 'upcoming') {
      return matches.filter(m => m.date?.toDate() > now);
    } else if (filter === 'past') {
      return matches.filter(m => m.date?.toDate() <= now);
    }
    return matches;
  };

  const filteredMatches = getFilteredMatches();

  if (loading) {
    return <div className="loading">Loading matches...</div>;
  }

  return (
    <div className="matches-page">
      <div className="page-header">
        <h1>Matches</h1>
        <p>Track our performance and upcoming games</p>
      </div>

      <div className="matches-filter">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Matches
        </button>
        <button 
          className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
          onClick={() => setFilter('past')}
        >
          Past Results
        </button>
      </div>

      <div className="matches-list">
        {filteredMatches.length > 0 ? (
          filteredMatches.map(match => {
            const matchDate = match.date?.toDate();
            const isPast = matchDate <= new Date();
            const isWin = match.ourScore > match.opponentScore;

            return (
              <div key={match.id} className={`match-card ${isPast ? 'past' : 'upcoming'}`}>
                <div className="match-header">
                  <div className="match-date">
                    {format(matchDate, 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div className="match-time">
                    {format(matchDate, 'HH:mm')}
                  </div>
                </div>

                <div className="match-body">
                  <div className="match-teams-row">
                    <div className="team-info">
                      <div className="team-name-large">BodaxGaming</div>
                      {isPast && (
                        <div className={`team-score-large ${isWin ? 'win' : 'loss'}`}>
                          {match.ourScore}
                        </div>
                      )}
                    </div>
                    
                    <div className="vs-divider">VS</div>
                    
                    <div className="team-info">
                      <div className="team-name-large">{match.opponent}</div>
                      {isPast && (
                        <div className={`team-score-large ${!isWin ? 'win' : 'loss'}`}>
                          {match.opponentScore}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="match-footer">
                    <div className="match-tournament">{match.tournament}</div>
                    {isPast && (
                      <div className={`match-result-badge ${isWin ? 'victory' : 'defeat'}`}>
                        {isWin ? 'Victory' : 'Defeat'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-matches-found">
            <p>No matches found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;

