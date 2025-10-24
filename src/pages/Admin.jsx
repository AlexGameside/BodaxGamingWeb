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
import { seedDatabase, checkDataExists, clearAndReseedTeam } from '../seedData';
import './Admin.css';

const Admin = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('matches');
  const [matchFilter, setMatchFilter] = useState('all'); // 'all', 'upcoming', 'recent'
  
  // Match form state
  const [matchForm, setMatchForm] = useState({
    opponent: '',
    tournament: '',
    date: '',
    time: '',
    ourScore: '',
    opponentScore: '',
    streamLink: '',
    vlrLink: '',
    opponentLogo: ''
  });

  // File upload state
  const [opponentLogoFile, setOpponentLogoFile] = useState(null);
  const [playerPhotoFile, setPlayerPhotoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // File upload handler for opponent logos
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please select a valid image file.');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setMessage('File size must be less than 2MB.');
        return;
      }
      
      setOpponentLogoFile(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setMatchForm(prev => ({
        ...prev,
        opponentLogo: previewUrl
      }));
    }
  };

  // File upload handler for player photos
  const handlePlayerPhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please select a valid image file.');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setMessage('File size must be less than 2MB.');
        return;
      }
      
      setPlayerPhotoFile(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setPlayerForm(prev => ({
        ...prev,
        photoUrl: previewUrl
      }));
    }
  };

  // Convert file to base64 for storage
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

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
    setUploading(true);
    setMessage('');

    try {
      // Debug: Log the form values
      console.log('Form values:', { date: matchForm.date, time: matchForm.time });
      
      // Validate date and time
      if (!matchForm.date || !matchForm.time) {
        throw new Error('Date and time are required');
      }
      
      const dateTime = new Date(`${matchForm.date}T${matchForm.time}`);
      
      // Debug: Log the created date
      console.log('Created date:', dateTime);
      
      // Validate the date is valid
      if (isNaN(dateTime.getTime())) {
        throw new Error('Invalid date or time format');
      }

      // Handle file upload if a file was selected
      let opponentLogoUrl = matchForm.opponentLogo;
      if (opponentLogoFile) {
        const base64Image = await fileToBase64(opponentLogoFile);
        opponentLogoUrl = base64Image;
      }
      
      if (editingMatch) {
        // Update existing match
        await updateDoc(doc(db, 'matches', editingMatch.id), {
          opponent: matchForm.opponent,
          tournament: matchForm.tournament,
          date: Timestamp.fromDate(dateTime),
          ourScore: parseInt(matchForm.ourScore) || 0,
          opponentScore: parseInt(matchForm.opponentScore) || 0,
          streamLink: matchForm.streamLink,
          vlrLink: matchForm.vlrLink,
          opponentLogo: opponentLogoUrl,
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
          vlrLink: matchForm.vlrLink,
          opponentLogo: opponentLogoUrl,
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
        vlrLink: '',
        opponentLogo: ''
      });
      setOpponentLogoFile(null);
      
      await fetchMatches();
    } catch (error) {
      console.error('Error saving match:', error);
      setMessage('Error saving match. Please try again.');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handlePlayerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploading(true);
    setMessage('');

    try {
      // Handle file upload if a file was selected
      let photoUrl = playerForm.photoUrl;
      if (playerPhotoFile) {
        const base64Image = await fileToBase64(playerPhotoFile);
        photoUrl = base64Image;
      }

      await addDoc(collection(db, 'players'), {
        fullName: playerForm.fullName,
        ign: playerForm.ign,
        role: playerForm.role,
        bio: playerForm.bio,
        photoUrl: photoUrl,
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
      setPlayerPhotoFile(null);
      
      await fetchPlayers();
    } catch (error) {
      console.error('Error adding player:', error);
      setMessage('Error adding player. Please try again.');
    } finally {
      setLoading(false);
      setUploading(false);
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
      vlrLink: match.vlrLink || '',
      opponentLogo: match.opponentLogo || ''
    });
    setOpponentLogoFile(null); // Clear any existing file upload
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter and sort matches based on selected filter
  const getFilteredMatches = () => {
    const now = new Date();
    const filtered = matches.filter(match => {
      const matchDate = match.date?.toDate();
      if (!matchDate) return false;
      
      switch (matchFilter) {
        case 'upcoming':
          return matchDate > now;
        case 'recent':
          return matchDate <= now;
        default:
          return true;
      }
    });

    // Sort by date - upcoming matches ascending (earliest first), recent matches descending (latest first)
    return filtered.sort((a, b) => {
      const dateA = a.date?.toDate();
      const dateB = b.date?.toDate();
      
      if (!dateA || !dateB) return 0;
      
      if (matchFilter === 'upcoming') {
        // For upcoming matches, sort ascending (earliest first)
        return dateA - dateB;
      } else if (matchFilter === 'recent') {
        // For recent matches, sort descending (latest first)
        return dateB - dateA;
      } else {
        // For all matches, sort descending (latest first)
        return dateB - dateA;
      }
    });
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
      vlrLink: '',
      opponentLogo: ''
    });
    setOpponentLogoFile(null);
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

  const handleReseedTeam = async () => {
    if (window.confirm('This will clear existing team data and add the new Bodax Gaming roster. Continue?')) {
      setSeeding(true);
      setMessage('');
      
      try {
        await clearAndReseedTeam();
        setMessage('Team data updated successfully with new roster!');
        await fetchData(); // Refresh the data
      } catch (error) {
        console.error('Error reseeding team data:', error);
        setMessage('Error updating team data. Please try again.');
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
          <button onClick={handleReseedTeam} disabled={seeding} className="reseed-btn">
            {seeding ? 'UPDATING...' : 'UPDATE TEAM ROSTER'}
          </button>
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
                    onChange={(e) => {
                      console.log('Date input changed:', e.target.value);
                      setMatchForm({...matchForm, date: e.target.value});
                    }}
                    max="2030-12-31"
                    required
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    value={matchForm.time}
                    onChange={(e) => {
                      console.log('Time input changed:', e.target.value);
                      setMatchForm({...matchForm, time: e.target.value});
                    }}
                    required
                    style={{ colorScheme: 'dark' }}
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

              <div className="form-group">
                <label>Opponent Logo (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="file-input"
                />
                {opponentLogoFile && (
                  <div className="file-preview">
                    <p className="file-info">
                      Selected: {opponentLogoFile.name} ({(opponentLogoFile.size / 1024).toFixed(1)} KB)
                    </p>
                    <img 
                      src={matchForm.opponentLogo} 
                      alt="Logo preview" 
                      className="logo-preview"
                    />
                  </div>
                )}
                {!opponentLogoFile && matchForm.opponentLogo && !matchForm.opponentLogo.startsWith('data:') && (
                  <div className="url-preview">
                    <p className="url-info">Current logo URL:</p>
                    <img 
                      src={matchForm.opponentLogo} 
                      alt="Current logo" 
                      className="logo-preview"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <p className="url-fallback" style={{display: 'none'}}>Unable to load image from URL</p>
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading || uploading} className="submit-btn">
                {uploading ? 'Uploading...' : loading ? 'Saving...' : editingMatch ? 'Update Match' : 'Add Match'}
              </button>
            </form>
          </div>

          <div className="admin-list">
            <div className="admin-header">
              <h2>Matches ({getFilteredMatches().length})</h2>
              <div className="sort-indicator">
                {matchFilter === 'upcoming' ? '↑ Sorted by date (earliest first)' :
                 matchFilter === 'recent' ? '↓ Sorted by date (latest first)' :
                 '↓ Sorted by date (latest first)'}
              </div>
              <div className="filter-tabs">
                <button 
                  className={`filter-tab ${matchFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setMatchFilter('all')}
                >
                  All ({matches.length})
                </button>
                <button 
                  className={`filter-tab ${matchFilter === 'upcoming' ? 'active' : ''}`}
                  onClick={() => setMatchFilter('upcoming')}
                >
                  Upcoming ({matches.filter(m => m.date?.toDate() > new Date()).length})
                </button>
                <button 
                  className={`filter-tab ${matchFilter === 'recent' ? 'active' : ''}`}
                  onClick={() => setMatchFilter('recent')}
                >
                  Recent ({matches.filter(m => m.date?.toDate() <= new Date()).length})
                </button>
              </div>
            </div>
            {getFilteredMatches().length > 0 ? (
              <div className="admin-items">
                {getFilteredMatches().map(match => {
                  const isPast = match.date?.toDate() <= new Date();
                  return (
                    <div key={match.id} className="admin-item">
                      <div className="item-content">
                        <div className="item-title">
                          BodaxGaming vs {match.opponent}
                        </div>
                        <div className="item-details">
                          <span>{match.tournament}</span>
                          <span>|</span>
                          <span>{match.date?.toDate().toLocaleDateString()}</span>
                          <span className="match-time">
                            {match.date?.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span>|</span>
                          <span>Score: {match.ourScore} - {match.opponentScore}</span>
                          <span className="match-status">
                            {isPast ? '(Completed)' : '(Upcoming)'}
                          </span>
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
              <p className="no-items">
                {matchFilter === 'upcoming' ? 'No upcoming matches found.' :
                 matchFilter === 'recent' ? 'No recent matches found.' :
                 'No matches added yet.'}
              </p>
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
                <label>Player Photo (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePlayerPhotoUpload}
                  className="file-input"
                />
                {playerPhotoFile && (
                  <div className="file-preview">
                    <p className="file-info">
                      Selected: {playerPhotoFile.name} ({(playerPhotoFile.size / 1024).toFixed(1)} KB)
                    </p>
                    <img 
                      src={playerForm.photoUrl} 
                      alt="Photo preview" 
                      className="logo-preview"
                    />
                  </div>
                )}
                {!playerPhotoFile && playerForm.photoUrl && !playerForm.photoUrl.startsWith('data:') && (
                  <div className="url-preview">
                    <p className="url-info">Current photo URL:</p>
                    <img 
                      src={playerForm.photoUrl} 
                      alt="Current photo" 
                      className="logo-preview"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <p className="url-fallback" style={{display: 'none'}}>Unable to load image from URL</p>
                  </div>
                )}
                <div className="placeholder-options">
                  <p className="placeholder-label">Or use placeholder:</p>
                  <button
                    type="button"
                    className="placeholder-btn"
                    onClick={() => {
                      setPlayerForm(prev => ({ ...prev, photoUrl: '' }));
                      setPlayerPhotoFile(null);
                    }}
                  >
                    Use Default Icon
                  </button>
                </div>
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

              <button type="submit" disabled={loading || uploading} className="submit-btn">
                {uploading ? 'Uploading...' : loading ? 'Adding...' : 'Add Player'}
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
