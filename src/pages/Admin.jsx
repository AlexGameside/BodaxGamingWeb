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
import { seedDatabase, checkDataExists } from '../seedData';
import './Admin.css';

const Admin = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('matches');
  
  // Match form state
  const [matchForm, setMatchForm] = useState({
    opponent: '',
    tournament: '',
    date: '',
    time: '',
    ourScore: '',
    opponentScore: '',
    streamLink: '',
    caster: '',
    vlrLink: ''
  });

  // Player form state
  const [playerForm, setPlayerForm] = useState({
    fullName: '',
    ign: '',
    role: '',
    bio: '',
    photoUrl: '',
    twitter: '',
    twitch: ''
  });

  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingMatch, setEditingMatch] = useState(null);
  const [dataExists, setDataExists] = useState({ hasPlayers: false, hasMatches: false, playerCount: 0, matchCount: 0 });
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [currentUser, navigate]);

  const fetchData = async () => {
    await Promise.all([fetchMatches(), fetchPlayers()]);
    const dataCheck = await checkDataExists();
    setDataExists(dataCheck);
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
      
      if (editingMatch) {
        // Update existing match
        await updateDoc(doc(db, 'matches', editingMatch.id), {
          opponent: matchForm.opponent,
          tournament: matchForm.tournament,
          date: Timestamp.fromDate(dateTime),
          ourScore: parseInt(matchForm.ourScore) || 0,
          opponentScore: parseInt(matchForm.opponentScore) || 0,
          streamLink: matchForm.streamLink,
          caster: matchForm.caster,
          vlrLink: matchForm.vlrLink,
        });
        setMessage('Match updated successfully!');
        setEditingMatch(null);
      } else {
        // Add new match
        await addDoc(collection(db, 'matches'), {
          opponent: matchForm.opponent,
          tournament: matchForm.tournament,
          date: Timestamp.fromDate(dateTime),
          ourScore: parseInt(matchForm.ourScore) || 0,
          opponentScore: parseInt(matchForm.opponentScore) || 0,
          streamLink: matchForm.streamLink,
          caster: matchForm.caster,
          vlrLink: matchForm.vlrLink,
          createdAt: Timestamp.now()
        });
        setMessage('Match added successfully!');
      }

      setMatchForm({
        opponent: '',
        tournament: '',
        date: '',
        time: '',
        ourScore: '',
        opponentScore: '',
        streamLink: '',
        caster: '',
        vlrLink: ''
      });
      
      await fetchMatches();
    } catch (error) {
      console.error('Error saving match:', error);
      setMessage('Error saving match. Please try again.');
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
        fullName: playerForm.fullName,
        ign: playerForm.ign,
        role: playerForm.role,
        bio: playerForm.bio,
        photoUrl: playerForm.photoUrl,
        socials: {
          twitter: playerForm.twitter,
          twitch: playerForm.twitch
        },
        createdAt: Timestamp.now()
      });

      setMessage('Player added successfully!');
      setPlayerForm({
        fullName: '',
        ign: '',
        role: '',
        bio: '',
        photoUrl: '',
        twitter: '',
        twitch: ''
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

  const startEditMatch = (match) => {
    const matchDate = match.date.toDate();
    setEditingMatch(match);
    setMatchForm({
      opponent: match.opponent,
      tournament: match.tournament,
      date: matchDate.toISOString().split('T')[0],
      time: matchDate.toTimeString().slice(0, 5),
      ourScore: match.ourScore.toString(),
      opponentScore: match.opponentScore.toString(),
      streamLink: match.streamLink || '',
      caster: match.caster || '',
      vlrLink: match.vlrLink || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingMatch(null);
    setMatchForm({
      opponent: '',
      tournament: '',
      date: '',
      time: '',
      ourScore: '',
      opponentScore: '',
      streamLink: '',
      caster: '',
      vlrLink: ''
    });
  };

  const handleSeedData = async () => {
    if (window.confirm('This will add example players, coaches, and matches to your database. Continue?')) {
      setSeeding(true);
      setMessage('');
      
      try {
        await seedDatabase();
        setMessage('Example data added successfully!');
        await fetchData(); // Refresh the data
      } catch (error) {
        console.error('Error seeding data:', error);
        setMessage('Error adding example data. Please try again.');
      } finally {
        setSeeding(false);
      }
    }
  };

  if (!currentUser) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your team's matches and players</p>
        <div className="admin-header-actions">
          <button onClick={() => navigate('/')} className="home-btn">
            VIEW SITE
          </button>
          {(!dataExists.hasPlayers || !dataExists.hasMatches) && (
            <button onClick={handleSeedData} disabled={seeding} className="seed-btn">
              {seeding ? 'ADDING...' : 'ADD EXAMPLE DATA'}
            </button>
          )}
          <button onClick={handleLogout} className="logout-btn">
            LOGOUT
          </button>
        </div>
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
            <h2>{editingMatch ? 'Edit Match' : 'Add New Match'}</h2>
            {editingMatch && (
              <p className="edit-notice">
                Editing match vs {editingMatch.opponent}
                <button onClick={cancelEdit} className="cancel-edit-btn">Cancel Edit</button>
              </p>
            )}
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
                  <label>Our Score (0 for upcoming matches)</label>
                  <input
                    type="number"
                    value={matchForm.ourScore}
                    onChange={(e) => setMatchForm({...matchForm, ourScore: e.target.value})}
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label>Opponent Score (0 for upcoming matches)</label>
                  <input
                    type="number"
                    value={matchForm.opponentScore}
                    onChange={(e) => setMatchForm({...matchForm, opponentScore: e.target.value})}
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Stream Link (optional)</label>
                  <input
                    type="url"
                    value={matchForm.streamLink}
                    onChange={(e) => setMatchForm({...matchForm, streamLink: e.target.value})}
                    placeholder="https://twitch.tv/..."
                  />
                </div>
                <div className="form-group">
                  <label>Caster Name (optional)</label>
                  <input
                    type="text"
                    value={matchForm.caster}
                    onChange={(e) => setMatchForm({...matchForm, caster: e.target.value})}
                    placeholder="Caster Name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>VLR.GG Link (optional)</label>
                <input
                  type="url"
                  value={matchForm.vlrLink}
                  onChange={(e) => setMatchForm({...matchForm, vlrLink: e.target.value})}
                  placeholder="https://vlr.gg/..."
                />
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Saving...' : editingMatch ? 'Update Match' : 'Add Match'}
              </button>
            </form>
          </div>

          <div className="admin-list">
            <h2>All Matches ({matches.length})</h2>
            {matches.length > 0 ? (
              <div className="admin-items">
                {matches.map(match => {
                  const isPast = match.date?.toDate() <= new Date();
                  return (
                    <div key={match.id} className="admin-item">
                      <div className="item-content">
                        <div className="item-title">
                          BodaxGaming vs {match.opponent}
                        </div>
                        <div className="item-details">
                          {match.tournament} | {match.date?.toDate().toLocaleDateString()} | 
                          Score: {match.ourScore} - {match.opponentScore}
                          {isPast ? ' (Completed)' : ' (Upcoming)'}
                        </div>
                      </div>
                      <div className="admin-actions">
                        <button 
                          onClick={() => startEditMatch(match)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteMatch(match.id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
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
                    value={playerForm.fullName}
                    onChange={(e) => setPlayerForm({...playerForm, fullName: e.target.value})}
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
                  value={playerForm.photoUrl}
                  onChange={(e) => setPlayerForm({...playerForm, photoUrl: e.target.value})}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Twitter URL (optional)</label>
                  <input
                    type="url"
                    value={playerForm.twitter}
                    onChange={(e) => setPlayerForm({...playerForm, twitter: e.target.value})}
                    placeholder="https://twitter.com/username"
                  />
                </div>
                <div className="form-group">
                  <label>Twitch URL (optional)</label>
                  <input
                    type="url"
                    value={playerForm.twitch}
                    onChange={(e) => setPlayerForm({...playerForm, twitch: e.target.value})}
                    placeholder="https://twitch.tv/username"
                  />
                </div>
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
                        {player.fullName || player.name} ({player.ign})
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
