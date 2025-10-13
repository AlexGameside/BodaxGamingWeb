import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc,
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import './Admin.css';

const Admin = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('matches');
  
  // Match form state
  const [matchForm, setMatchForm] = useState({
    opponent: '',
    tournament: '',
    date: '',
    time: '',
    ourScore: '',
    opponentScore: ''
  });

  // Player form state
  const [playerForm, setPlayerForm] = useState({
    name: '',
    ign: '',
    role: '',
    bio: '',
    photoURL: ''
  });

  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [currentUser, navigate]);

  const fetchData = async () => {
    await Promise.all([fetchMatches(), fetchPlayers()]);
  };

  const fetchMatches = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'matches'));
      const matchesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMatches(matchesData);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const fetchPlayers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'players'));
      const playersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlayers(playersData);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const handleMatchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const dateTime = new Date(`${matchForm.date}T${matchForm.time}`);
      
      await addDoc(collection(db, 'matches'), {
        opponent: matchForm.opponent,
        tournament: matchForm.tournament,
        date: Timestamp.fromDate(dateTime),
        ourScore: parseInt(matchForm.ourScore) || 0,
        opponentScore: parseInt(matchForm.opponentScore) || 0,
        createdAt: Timestamp.now()
      });

      setMessage('Match added successfully!');
      setMatchForm({
        opponent: '',
        tournament: '',
        date: '',
        time: '',
        ourScore: '',
        opponentScore: ''
      });
      
      await fetchMatches();
    } catch (error) {
      console.error('Error adding match:', error);
      setMessage('Error adding match. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await addDoc(collection(db, 'players'), {
        name: playerForm.name,
        ign: playerForm.ign,
        role: playerForm.role,
        bio: playerForm.bio,
        photoURL: playerForm.photoURL,
        createdAt: Timestamp.now()
      });

      setMessage('Player added successfully!');
      setPlayerForm({
        name: '',
        ign: '',
        role: '',
        bio: '',
        photoURL: ''
      });
      
      await fetchPlayers();
    } catch (error) {
      console.error('Error adding player:', error);
      setMessage('Error adding player. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteMatch = async (id) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      try {
        await deleteDoc(doc(db, 'matches', id));
        setMessage('Match deleted successfully!');
        await fetchMatches();
      } catch (error) {
        console.error('Error deleting match:', error);
        setMessage('Error deleting match.');
      }
    }
  };

  const deletePlayer = async (id) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await deleteDoc(doc(db, 'players', id));
        setMessage('Player deleted successfully!');
        await fetchPlayers();
      } catch (error) {
        console.error('Error deleting player:', error);
        setMessage('Error deleting player.');
      }
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your team's matches and players</p>
      </div>

      {message && (
        <div className={`admin-message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'matches' ? 'active' : ''}`}
          onClick={() => setActiveTab('matches')}
        >
          Matches
        </button>
        <button 
          className={`tab-btn ${activeTab === 'players' ? 'active' : ''}`}
          onClick={() => setActiveTab('players')}
        >
          Players
        </button>
      </div>

      {activeTab === 'matches' && (
        <div className="admin-section">
          <div className="admin-form-container">
            <h2>Add New Match</h2>
            <form onSubmit={handleMatchSubmit} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Opponent Team</label>
                  <input
                    type="text"
                    value={matchForm.opponent}
                    onChange={(e) => setMatchForm({...matchForm, opponent: e.target.value})}
                    required
                    placeholder="Team Rival"
                  />
                </div>
                <div className="form-group">
                  <label>Tournament</label>
                  <input
                    type="text"
                    value={matchForm.tournament}
                    onChange={(e) => setMatchForm({...matchForm, tournament: e.target.value})}
                    required
                    placeholder="Championship League"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={matchForm.date}
                    onChange={(e) => setMatchForm({...matchForm, date: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    value={matchForm.time}
                    onChange={(e) => setMatchForm({...matchForm, time: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Our Score</label>
                  <input
                    type="number"
                    value={matchForm.ourScore}
                    onChange={(e) => setMatchForm({...matchForm, ourScore: e.target.value})}
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label>Opponent Score</label>
                  <input
                    type="number"
                    value={matchForm.opponentScore}
                    onChange={(e) => setMatchForm({...matchForm, opponentScore: e.target.value})}
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Adding...' : 'Add Match'}
              </button>
            </form>
          </div>

          <div className="admin-list">
            <h2>All Matches ({matches.length})</h2>
            {matches.length > 0 ? (
              <div className="admin-items">
                {matches.map(match => (
                  <div key={match.id} className="admin-item">
                    <div className="item-content">
                      <div className="item-title">
                        BodaxGaming vs {match.opponent}
                      </div>
                      <div className="item-details">
                        {match.tournament} | {match.date?.toDate().toLocaleDateString()} | 
                        Score: {match.ourScore} - {match.opponentScore}
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteMatch(match.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-items">No matches added yet.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'players' && (
        <div className="admin-section">
          <div className="admin-form-container">
            <h2>Add New Player</h2>
            <form onSubmit={handlePlayerSubmit} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={playerForm.name}
                    onChange={(e) => setPlayerForm({...playerForm, name: e.target.value})}
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label>In-Game Name (IGN)</label>
                  <input
                    type="text"
                    value={playerForm.ign}
                    onChange={(e) => setPlayerForm({...playerForm, ign: e.target.value})}
                    required
                    placeholder="ProGamer123"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  value={playerForm.role}
                  onChange={(e) => setPlayerForm({...playerForm, role: e.target.value})}
                  required
                  placeholder="Captain / Support / DPS"
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={playerForm.bio}
                  onChange={(e) => setPlayerForm({...playerForm, bio: e.target.value})}
                  placeholder="Player biography..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Photo URL (optional)</label>
                <input
                  type="url"
                  value={playerForm.photoURL}
                  onChange={(e) => setPlayerForm({...playerForm, photoURL: e.target.value})}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Adding...' : 'Add Player'}
              </button>
            </form>
          </div>

          <div className="admin-list">
            <h2>All Players ({players.length})</h2>
            {players.length > 0 ? (
              <div className="admin-items">
                {players.map(player => (
                  <div key={player.id} className="admin-item">
                    <div className="item-content">
                      <div className="item-title">
                        {player.name} ({player.ign})
                      </div>
                      <div className="item-details">
                        {player.role}
                      </div>
                    </div>
                    <button 
                      onClick={() => deletePlayer(player.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-items">No players added yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;

