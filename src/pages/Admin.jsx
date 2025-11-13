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
    opponentLogoUrl: ''
  });
  
  // Image upload state
  const [opponentLogoFile, setOpponentLogoFile] = useState(null);
  const [opponentLogoPreview, setOpponentLogoPreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [logoInputMethod, setLogoInputMethod] = useState('url'); // 'url' or 'file'

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

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;
    
    setUploadingImage(true);
    try {
      // Check file size (max 500KB for base64 storage)
      const maxSize = 500 * 1024; // 500KB
      if (file.size > maxSize) {
        throw new Error(`Image size (${Math.round(file.size / 1024)}KB) exceeds the maximum allowed size of 500KB. Please use a smaller image or provide a URL instead.`);
      }
      
      // Convert to base64
      const base64String = await convertFileToBase64(file);
      console.log('Image converted to base64, size:', Math.round(base64String.length / 1024), 'KB');
      
      return base64String;
    } catch (error) {
      console.error('Error processing image:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please select an image file.');
        return;
      }
      
      // Validate file size (max 500KB for base64 storage)
      const maxSize = 500 * 1024; // 500KB
      if (file.size > maxSize) {
        setMessage(`Image size (${Math.round(file.size / 1024)}KB) exceeds the maximum allowed size of 500KB. Please use a smaller image or provide a URL instead.`);
        return;
      }
      
      setOpponentLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setOpponentLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMatchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      
      // Handle opponent logo - either from URL or file upload
      let opponentLogoUrl = matchForm.opponentLogoUrl;
      if (logoInputMethod === 'file' && opponentLogoFile) {
        try {
          opponentLogoUrl = await handleImageUpload(opponentLogoFile);
        } catch (uploadError) {
          setMessage(`Failed to process image: ${uploadError.message}`);
          setLoading(false);
          return;
        }
      } else if (logoInputMethod === 'url' && matchForm.opponentLogoUrl) {
        // Validate URL format
        try {
          new URL(matchForm.opponentLogoUrl);
        } catch (urlError) {
          setMessage('Please enter a valid image URL.');
          setLoading(false);
          return;
        }
        opponentLogoUrl = matchForm.opponentLogoUrl;
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
          opponentLogoUrl: opponentLogoUrl || null,
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
          opponentLogoUrl: opponentLogoUrl || null,
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
        opponentLogoUrl: ''
      });
      
      // Reset image upload state
      setOpponentLogoFile(null);
      setOpponentLogoPreview(null);
      
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
      vlrLink: match.vlrLink || '',
      opponentLogoUrl: match.opponentLogoUrl || ''
    });
    
    // Set preview if logo exists
    if (match.opponentLogoUrl) {
      setOpponentLogoPreview(match.opponentLogoUrl);
      // Determine input method based on URL format
      if (match.opponentLogoUrl.startsWith('data:')) {
        setLogoInputMethod('file');
      } else {
        setLogoInputMethod('url');
      }
    } else {
      setOpponentLogoPreview(null);
      setLogoInputMethod('url');
    }
    setOpponentLogoFile(null);
    
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
      opponentLogoUrl: ''
    });
    setOpponentLogoFile(null);
    setOpponentLogoPreview(null);
    setLogoInputMethod('url');
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
                <label>Opponent Team Logo (optional)</label>
                
                <div className="logo-input-method-toggle">
                  <button
                    type="button"
                    className={`method-toggle-btn ${logoInputMethod === 'url' ? 'active' : ''}`}
                    onClick={() => {
                      setLogoInputMethod('url');
                      setOpponentLogoFile(null);
                      if (!matchForm.opponentLogoUrl) {
                        setOpponentLogoPreview(null);
                      }
                    }}
                  >
                    Use URL
                  </button>
                  <button
                    type="button"
                    className={`method-toggle-btn ${logoInputMethod === 'file' ? 'active' : ''}`}
                    onClick={() => {
                      setLogoInputMethod('file');
                      if (!opponentLogoFile && !matchForm.opponentLogoUrl) {
                        setOpponentLogoPreview(null);
                      }
                    }}
                  >
                    Upload File
                  </button>
                </div>

                {logoInputMethod === 'url' ? (
                  <>
                    <input
                      type="url"
                      value={matchForm.opponentLogoUrl}
                      onChange={(e) => {
                        const url = e.target.value;
                        setMatchForm({...matchForm, opponentLogoUrl: url});
                        if (url) {
                          setOpponentLogoPreview(url);
                        } else {
                          setOpponentLogoPreview(null);
                        }
                      }}
                      placeholder="https://example.com/logo.png"
                      className="url-input"
                    />
                    {matchForm.opponentLogoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setMatchForm({...matchForm, opponentLogoUrl: ''});
                          setOpponentLogoPreview(null);
                        }}
                        className="remove-image-btn"
                      >
                        Remove Logo
                      </button>
                    )}
                    <p className="form-help-text">Enter a direct image URL (e.g., from Imgur, Cloudinary, or any image hosting service)</p>
                  </>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileChange}
                      className="file-input"
                    />
                    <p className="form-help-text">Upload an image file (max 500KB). PNG, JPG, or SVG recommended. Images will be stored as base64.</p>
                  </>
                )}

                {opponentLogoPreview && (
                  <div className="image-preview">
                    <img src={opponentLogoPreview} alt="Opponent logo preview" />
                    <button
                      type="button"
                      onClick={() => {
                        // If a new file was selected, remove it and restore existing logo if editing
                        if (opponentLogoFile) {
                          setOpponentLogoFile(null);
                          if (editingMatch && matchForm.opponentLogoUrl && !matchForm.opponentLogoUrl.startsWith('data:')) {
                            setOpponentLogoPreview(matchForm.opponentLogoUrl);
                          } else {
                            setOpponentLogoPreview(null);
                          }
                        } else {
                          // Remove existing logo
                          setOpponentLogoPreview(null);
                          setMatchForm({...matchForm, opponentLogoUrl: ''});
                        }
                      }}
                      className="remove-image-btn"
                    >
                      {opponentLogoFile ? 'Cancel New Image' : 'Remove Image'}
                    </button>
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading || uploadingImage} className="submit-btn">
                {uploadingImage ? 'Uploading Image...' : loading ? 'Saving...' : editingMatch ? 'Update Match' : 'Add Match'}
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
