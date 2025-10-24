import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { format } from 'date-fns';
import GameSlider from '../components/GameSlider';
import TitleTypingAnimation from '../components/TitleTypingAnimation';
import './GameSchedule.css';

const GameSchedule = () => {
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [allRecentMatches, setAllRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedDays, setSelectedDays] = useState('all');
  const [displayLimit, setDisplayLimit] = useState(6);
  const [totalFilteredMatches, setTotalFilteredMatches] = useState(0);

  useEffect(() => {
    fetchMatches();
  }, []);

  // Filter matches based on selected criteria
  useEffect(() => {
    filterMatches();
  }, [allRecentMatches, selectedYear, selectedMonth, selectedDays, displayLimit]);

  const filterMatches = () => {
    let filtered = [...allRecentMatches];

    // Filter by year
    if (selectedYear !== 'all') {
      filtered = filtered.filter(match => {
        const matchYear = match.date?.toDate().getFullYear().toString();
        return matchYear === selectedYear;
      });
    }

    // Filter by month
    if (selectedMonth !== 'all') {
      filtered = filtered.filter(match => {
        const matchMonth = (match.date?.toDate().getMonth() + 1).toString();
        return matchMonth === selectedMonth;
      });
    }

    // Filter by days (last X days)
    if (selectedDays !== 'all') {
      const daysAgo = parseInt(selectedDays);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
      
      filtered = filtered.filter(match => {
        return match.date?.toDate() >= cutoffDate;
      });
    }

    // Apply display limit and update total count
    setTotalFilteredMatches(filtered.length);
    setRecentMatches(filtered.slice(0, displayLimit));
  };

  // Get unique years from matches
  const getAvailableYears = () => {
    const years = [...new Set(allRecentMatches.map(match => 
      match.date?.toDate().getFullYear().toString()
    ))].sort((a, b) => b - a);
    return years;
  };

  // Get unique months from matches
  const getAvailableMonths = () => {
    const months = [...new Set(allRecentMatches.map(match => 
      (match.date?.toDate().getMonth() + 1).toString()
    ))].sort((a, b) => a - b);
    return months;
  };

  const monthNames = {
    '1': 'January', '2': 'February', '3': 'March', '4': 'April',
    '5': 'May', '6': 'June', '7': 'July', '8': 'August',
    '9': 'September', '10': 'October', '11': 'November', '12': 'December'
  };

  const fetchMatches = async () => {
    try {
      const matchesRef = collection(db, 'matches');
      const matchesQuery = query(matchesRef, orderBy('date', 'desc'), limit(50));
      const matchesSnapshot = await getDocs(matchesQuery);
      
      const matches = matchesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const now = new Date();
      const upcoming = matches
        .filter(m => m.date?.toDate() > now)
        .sort((a, b) => a.date?.toDate() - b.date?.toDate());
      const allRecent = matches
        .filter(m => m.date?.toDate() <= now)
        .sort((a, b) => b.date?.toDate() - a.date?.toDate());

      setUpcomingMatches(upcoming);
      setAllRecentMatches(allRecent);
      setRecentMatches(allRecent.slice(0, displayLimit));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading game schedule...</div>;
  }

  return (
    <div className="game-schedule-page">
      {/* Hero Section */}
      <section className="schedule-hero-section">
        <div className="schedule-hero-content">
          <h1 className="schedule-title">
            <TitleTypingAnimation text="GAME SCHEDULE" speed={50} delay={100} />
          </h1>
          <p className="schedule-tagline">Upcoming Matches & Recent Results</p>
        </div>
      </section>

      {/* Upcoming Games Section */}
      <section id="upcoming-games" className="upcoming-games-section">
        <h2 className="section-title">
          <TitleTypingAnimation text="UPCOMING GAMES" speed={5} delay={50} useViewport={true} />
        </h2>
        {upcomingMatches.length > 0 ? (
          <GameSlider games={upcomingMatches} />
        ) : (
          <div className="no-games">No upcoming matches scheduled</div>
        )}
      </section>

      {/* Recent Games Section */}
      <section id="recent-games" className="recent-games-section">
        <div className="recent-games-section-header">
          <h2 className="section-title">
            <TitleTypingAnimation text="RECENT GAMES" speed={5} delay={50} useViewport={true} />
          </h2>
          <div className="games-filter-controls">
            <div className="filter-group">
              <label htmlFor="year-filter">Year:</label>
              <select 
                id="year-filter"
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Years</option>
                {getAvailableYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="month-filter">Month:</label>
              <select 
                id="month-filter"
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Months</option>
                {getAvailableMonths().map(month => (
                  <option key={month} value={month}>{monthNames[month]}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="days-filter">Last:</label>
              <select 
                id="days-filter"
                value={selectedDays} 
                onChange={(e) => setSelectedDays(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Time</option>
                <option value="7">7 Days</option>
                <option value="30">30 Days</option>
                <option value="90">90 Days</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="limit-filter">Show:</label>
              <select 
                id="limit-filter"
                value={displayLimit} 
                onChange={(e) => setDisplayLimit(parseInt(e.target.value))}
                className="filter-select"
              >
                <option value="3">3 Games</option>
                <option value="6">6 Games</option>
                <option value="9">9 Games</option>
                <option value="12">12 Games</option>
              </select>
            </div>
          </div>
        </div>
        
        {totalFilteredMatches > 0 && (
          <div className="matches-count">
            Showing {recentMatches.length} of {totalFilteredMatches} matches
          </div>
        )}
        
        <div className="games-container">
          {recentMatches.length > 0 ? (
            recentMatches.map(match => (
              <div key={match.id} className={`game-card ${match.ourScore > match.opponentScore ? 'victory-card' : 'defeat-card'}`}>
                <div className="game-header">
                  <div className="game-header-left">
                    <div className="game-date">
                      {format(match.date.toDate(), 'MMM d, yyyy')} at {format(match.date.toDate(), 'h:mm a')}
                    </div>
                    <div className="game-tournament">{match.tournament}</div>
                  </div>
                  <div className={`game-result-badge ${match.ourScore > match.opponentScore ? 'victory' : 'defeat'}`}>
                    {match.ourScore > match.opponentScore ? 'VICTORY' : 'DEFEAT'}
                  </div>
                </div>
                <div className="game-teams">
                  <div className="team-info">
                    <div className="team-logo">
                      <img src="/icons/logos/bodax-gaming_logo_2.svg" alt="BODAX Gaming" className="team-logo-img" />
                    </div>
                    <div className="team-name">BODAX GAMING</div>
                  </div>
                  <div className="game-score">
                    <div className="score-display">
                      <span className={`score ${match.ourScore > match.opponentScore ? 'win' : 'loss'}`}>
                        {match.ourScore}
                      </span>
                      <span className="score-separator">-</span>
                      <span className={`score ${match.opponentScore > match.ourScore ? 'win' : 'loss'}`}>
                        {match.opponentScore}
                      </span>
                    </div>
                  </div>
                  <div className="team-info">
                    <div className="team-logo">
                      {match.opponentLogo ? (
                        <img src={match.opponentLogo} alt={match.opponent} className="team-logo-img" />
                      ) : (
                        <div className="team-logo-placeholder">
                          <span className="placeholder-text">{match.opponent?.substring(0, 3).toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    <div className="team-name">{match.opponent}</div>
                  </div>
                </div>
                {match.vlrLink && (
                  <div className="game-actions">
                    <a 
                      href={match.vlrLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="vlr-link"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M10 13L15 8L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 8H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Game Details
                    </a>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-games">No recent matches found</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default GameSchedule;
