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
import { format } from 'date-fns';
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
    vlrLink: '',
    opponentLogoUrl: ''
  });
  
  // Player form state
  const [playerForm, setPlayerForm] = useState({
    fullName: '',
    ign: '',
    role: '',
    bio: '',
    photoUrl: '',
    twitter: '',
    twitch: '',
    vlr: ''
  });

  // News form state
  const [newsForm, setNewsForm] = useState({
    title: '',
    content: '',
    platform: 'news',
    link: '',
    image: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Creator form state
  const [creatorForm, setCreatorForm] = useState({
    name: '',
    bio: '',
    photoUrl: '',
    twitter: '',
    twitch: '',
    youtube: '',
    instagram: '',
    tiktok: ''
  });

  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [news, setNews] = useState([]);
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingMatch, setEditingMatch] = useState(null);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editingNews, setEditingNews] = useState(null);
  const [editingCreator, setEditingCreator] = useState(null);
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
    await Promise.all([fetchMatches(), fetchPlayers(), fetchNews(), fetchCreators()]);
    const exists = await checkDataExists();
    setDataExists(exists);
  };

  const fetchMatches = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'matches'));
      const matchesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort matches by date
      matchesData.sort((a, b) => {
        const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
        const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
        return dateB - dateA;
      });
      setMatches(matchesData);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const fetchPlayers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'players'));
      const playersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlayers(playersData);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const fetchNews = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'news'));
      const newsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort news by date
      newsData.sort((a, b) => {
        const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
        const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
        return dateB - dateA;
      });
      setNews(newsData);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const fetchCreators = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'contentCreators'));
      const creatorsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCreators(creatorsData);
    } catch (error) {
      console.error("Error fetching creators:", error);
    }
  };

  const handleMatchChange = (e) => {
    const { name, value } = e.target;
    setMatchForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePlayerChange = (e) => {
    const { name, value } = e.target;
    setPlayerForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNewsChange = (e) => {
    const { name, value } = e.target;
    setNewsForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCreatorChange = (e) => {
    const { name, value } = e.target;
    setCreatorForm(prev => ({ ...prev, [name]: value }));
  };

  const handleMatchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Combine date and time
      const dateTimeString = `${matchForm.date}T${matchForm.time}`;
      const matchDate = new Date(dateTimeString);
      const firestoreDate = Timestamp.fromDate(matchDate);

      const matchData = {
        opponent: matchForm.opponent,
        tournament: matchForm.tournament,
        date: firestoreDate,
        ourScore: matchForm.ourScore ? parseInt(matchForm.ourScore) : null,
        opponentScore: matchForm.opponentScore ? parseInt(matchForm.opponentScore) : null,
        streamLink: matchForm.streamLink,
        vlrLink: matchForm.vlrLink,
        opponentLogoUrl: matchForm.opponentLogoUrl || null
      };

      if (editingMatch) {
        await updateDoc(doc(db, 'matches', editingMatch.id), matchData);
        setMessage('Match updated successfully!');
      } else {
        await addDoc(collection(db, 'matches'), matchData);
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
      setEditingMatch(null);
      fetchMatches();
    } catch (error) {
      console.error("Error adding/updating match:", error);
      setMessage('Error saving match. Please try again.');
    }
    setLoading(false);
  };

  const handlePlayerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const playerData = {
        name: playerForm.fullName, // Keep legacy field for now
        fullName: playerForm.fullName,
        ign: playerForm.ign,
        role: playerForm.role,
        bio: playerForm.bio,
        photoUrl: playerForm.photoUrl,
        socials: {
          twitter: playerForm.twitter,
          twitch: playerForm.twitch,
          vlr: playerForm.vlr
        }
      };

      if (editingPlayer) {
        await updateDoc(doc(db, 'players', editingPlayer.id), playerData);
        setMessage('Player updated successfully!');
      } else {
        await addDoc(collection(db, 'players'), playerData);
        setMessage('Player added successfully!');
      }

      setPlayerForm({
        fullName: '',
        ign: '',
        role: '',
        bio: '',
        photoUrl: '',
        twitter: '',
        twitch: '',
        vlr: ''
      });
      setEditingPlayer(null);
      fetchPlayers();
    } catch (error) {
      console.error("Error adding/updating player:", error);
      setMessage('Error saving player. Please try again.');
    }
    setLoading(false);
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const dateObj = new Date(newsForm.date);
      const firestoreDate = Timestamp.fromDate(dateObj);

      const newsData = {
        title: newsForm.title,
        content: newsForm.content,
        platform: newsForm.platform,
        link: newsForm.link,
        image: newsForm.image,
        date: firestoreDate
      };

      if (editingNews) {
        await updateDoc(doc(db, 'news', editingNews.id), newsData);
        setMessage('News updated successfully!');
      } else {
        await addDoc(collection(db, 'news'), newsData);
        setMessage('News added successfully!');
      }

      setNewsForm({
        title: '',
        content: '',
        platform: 'news',
        link: '',
        image: '',
        date: new Date().toISOString().split('T')[0]
      });
      setEditingNews(null);
      fetchNews();
    } catch (error) {
      console.error("Error adding/updating news:", error);
      setMessage('Error saving news. Please try again.');
    }
    setLoading(false);
  };

  const handleCreatorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const creatorData = {
        name: creatorForm.name,
        bio: creatorForm.bio,
        photoUrl: creatorForm.photoUrl,
        socials: {
          twitter: creatorForm.twitter,
          twitch: creatorForm.twitch,
          youtube: creatorForm.youtube,
          instagram: creatorForm.instagram,
          tiktok: creatorForm.tiktok
        }
      };

      if (editingCreator) {
        await updateDoc(doc(db, 'contentCreators', editingCreator.id), creatorData);
        setMessage('Creator updated successfully!');
      } else {
        await addDoc(collection(db, 'contentCreators'), creatorData);
        setMessage('Creator added successfully!');
      }

      setCreatorForm({
        name: '',
        bio: '',
        photoUrl: '',
        twitter: '',
        twitch: '',
        youtube: '',
        instagram: '',
        tiktok: ''
      });
      setEditingCreator(null);
      fetchCreators();
    } catch (error) {
      console.error("Error adding/updating creator:", error);
      setMessage('Error saving creator. Please try again.');
    }
    setLoading(false);
  };

  const handleEditMatch = (match) => {
    const dateObj = match.date?.toDate ? match.date.toDate() : new Date(match.date);
    
    // Format date as YYYY-MM-DD
    const dateStr = dateObj.toISOString().split('T')[0];
    
    // Format time as HH:MM
    const timeStr = dateObj.toTimeString().slice(0, 5);

    setMatchForm({
      opponent: match.opponent || '',
      tournament: match.tournament || '',
      date: dateStr,
      time: timeStr,
      ourScore: match.ourScore !== null ? match.ourScore : '',
      opponentScore: match.opponentScore !== null ? match.opponentScore : '',
      streamLink: match.streamLink || '',
      vlrLink: match.vlrLink || '',
      opponentLogoUrl: match.opponentLogoUrl || ''
    });
    setEditingMatch(match);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditPlayer = (player) => {
    setPlayerForm({
      fullName: player.fullName || player.name || '',
      ign: player.ign || '',
      role: player.role || '',
      bio: player.bio || '',
      photoUrl: player.photoUrl || '',
      twitter: player.socials?.twitter || '',
      twitch: player.socials?.twitch || '',
      vlr: player.socials?.vlr || ''
    });
    setEditingPlayer(player);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditNews = (item) => {
    const dateObj = item.date?.toDate ? item.date.toDate() : new Date(item.date);
    const dateStr = dateObj.toISOString().split('T')[0];

    setNewsForm({
      title: item.title || '',
      content: item.content || '',
      platform: item.platform || 'news',
      link: item.link || '',
      image: item.image || '',
      date: dateStr
    });
    setEditingNews(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteMatch = async (id) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      try {
        await deleteDoc(doc(db, 'matches', id));
        setMessage('Match deleted successfully!');
        fetchMatches();
      } catch (error) {
        console.error("Error deleting match:", error);
        setMessage('Error deleting match.');
      }
    }
  };

  const handleDeletePlayer = async (id) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await deleteDoc(doc(db, 'players', id));
        setMessage('Player deleted successfully!');
        fetchPlayers();
      } catch (error) {
        console.error("Error deleting player:", error);
        setMessage('Error deleting player.');
      }
    }
  };

  const handleDeleteNews = async (id) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        await deleteDoc(doc(db, 'news', id));
        setMessage('News item deleted successfully!');
        fetchNews();
      } catch (error) {
        console.error("Error deleting news:", error);
        setMessage('Error deleting news.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSeedData = async () => {
    setSeeding(true);
    setMessage('Adding example data...');
    try {
      await seedDatabase();
      setMessage('Example data added successfully!');
      fetchData();
    } catch (error) {
      setMessage('Error adding data: ' + error.message);
    }
    setSeeding(false);
  };

  const handleReseedTeam = async () => {
    setSeeding(true);
    setMessage('Updating team roster...');
    try {
      await clearAndReseedTeam();
      setMessage('Team roster updated successfully!');
      fetchData();
    } catch (error) {
      setMessage('Error updating team: ' + error.message);
    }
    setSeeding(false);
  };

  const handleEditCreator = (creator) => {
    setEditingCreator(creator);
    setCreatorForm({
      name: creator.name || '',
      bio: creator.bio || '',
      photoUrl: creator.photoUrl || '',
      twitter: creator.socials?.twitter || '',
      twitch: creator.socials?.twitch || '',
      youtube: creator.socials?.youtube || '',
      instagram: creator.socials?.instagram || '',
      tiktok: creator.socials?.tiktok || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCreator = async (id) => {
    if (!window.confirm('Are you sure you want to delete this content creator?')) return;
    
    try {
      await deleteDoc(doc(db, 'contentCreators', id));
      setMessage('Creator deleted successfully!');
      fetchCreators();
    } catch (error) {
      console.error("Error deleting creator:", error);
      setMessage('Error deleting creator.');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'TBD';
    const d = date.toDate ? date.toDate() : new Date(date);
    return format(d, 'MMM d, yyyy • HH:mm');
  };

  return (
    <div className="admin-page">
      <div className="container">
        <header className="admin-header">
          <div className="container">
            <div className="admin-header-inner">
              <h1 className="admin-title">Admin Dashboard</h1>
              <div className="admin-actions">
                <button onClick={handleLogout} className="admin-btn danger">
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {message && (
          <div className={`status-msg ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {/* Tabs */}
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
          <button 
            className={`tab-btn ${activeTab === 'news' ? 'active' : ''}`}
            onClick={() => setActiveTab('news')}
          >
            News & Articles
          </button>
          <button 
            className={`tab-btn ${activeTab === 'creators' ? 'active' : ''}`}
            onClick={() => setActiveTab('creators')}
          >
            Content Creators
          </button>
        </div>

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <div className="admin-grid">
            {/* Match Form */}
            <div className="admin-panel">
              <h2 className="panel-title">{editingMatch ? 'Edit Match' : 'Add New Match'}</h2>
              <form onSubmit={handleMatchSubmit}>
                <div className="form-group">
                  <label>Tournament</label>
                  <input
                    type="text"
                    name="tournament"
                    className="form-input"
                    value={matchForm.tournament}
                    onChange={handleMatchChange}
                    required
                    placeholder="e.g. VCT Challengers"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Opponent Name</label>
                    <input
                      type="text"
                      name="opponent"
                      className="form-input"
                      value={matchForm.opponent}
                      onChange={handleMatchChange}
                      required
                      placeholder="e.g. Sentinels"
                    />
                  </div>
                  <div className="form-group">
                     <label>Opponent Logo URL</label>
                     <input
                        type="text"
                        name="opponentLogoUrl"
                        className="form-input"
                        value={matchForm.opponentLogoUrl}
                        onChange={handleMatchChange}
                        placeholder="https://..."
                      />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      name="date"
                      className="form-input"
                      value={matchForm.date}
                      onChange={handleMatchChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Time</label>
                    <input
                      type="time"
                      name="time"
                      className="form-input"
                      value={matchForm.time}
                      onChange={handleMatchChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Our Score</label>
                    <input
                      type="number"
                      name="ourScore"
                      className="form-input"
                      value={matchForm.ourScore}
                      onChange={handleMatchChange}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="form-group">
                    <label>Opp Score</label>
                    <input
                      type="number"
                      name="opponentScore"
                      className="form-input"
                      value={matchForm.opponentScore}
                      onChange={handleMatchChange}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Stream Link</label>
                    <input
                      type="url"
                      name="streamLink"
                      className="form-input"
                      value={matchForm.streamLink}
                      onChange={handleMatchChange}
                      placeholder="https://twitch.tv/..."
                    />
                  </div>
                  <div className="form-group">
                    <label>VLR Link</label>
                    <input
                      type="url"
                      name="vlrLink"
                      className="form-input"
                      value={matchForm.vlrLink}
                      onChange={handleMatchChange}
                      placeholder="https://vlr.gg/..."
                    />
                  </div>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Saving...' : (editingMatch ? 'Update Match' : 'Add Match')}
                </button>
                {editingMatch && (
                  <button 
                    type="button" 
                    className="submit-btn" 
                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}
                    onClick={() => {
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
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>

            {/* Matches List */}
            <div className="admin-panel">
              <h2 className="panel-title">Existing Matches</h2>
              <div className="list-container">
                {matches.map((match) => (
                  <div key={match.id} className="list-item">
                    <div className="item-info">
                      <div className="item-title">
                        vs {match.opponent}
                        {match.ourScore !== null && match.opponentScore !== null && (
                          <span style={{ marginLeft: '8px', opacity: 0.6 }}>
                            ({match.ourScore} - {match.opponentScore})
                          </span>
                        )}
                      </div>
                      <div className="item-sub">
                        {formatDate(match.date)} • {match.tournament}
                      </div>
                    </div>
                    <div className="item-actions">
                      <button 
                        onClick={() => handleEditMatch(match)}
                        className="icon-btn"
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button 
                        onClick={() => handleDeleteMatch(match.id)}
                        className="icon-btn delete"
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                {matches.length === 0 && (
                  <div className="item-sub" style={{ textAlign: 'center', padding: '20px' }}>
                    No matches found.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Players Tab */}
        {activeTab === 'players' && (
          <div className="admin-grid">
            {/* Player Form */}
            <div className="admin-panel">
              <h2 className="panel-title">{editingPlayer ? 'Edit Player' : 'Add New Player'}</h2>
              <form onSubmit={handlePlayerSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-input"
                      value={playerForm.fullName}
                      onChange={handlePlayerChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>IGN</label>
                    <input
                      type="text"
                      name="ign"
                      className="form-input"
                      value={playerForm.ign}
                      onChange={handlePlayerChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <input
                    type="text"
                    name="role"
                    className="form-input"
                    value={playerForm.role}
                    onChange={handlePlayerChange}
                    required
                    placeholder="e.g. Duelist"
                  />
                </div>

                <div className="form-group">
                  <label>Photo URL</label>
                  <input
                    type="text"
                    name="photoUrl"
                    className="form-input"
                    value={playerForm.photoUrl}
                    onChange={handlePlayerChange}
                    placeholder="https://..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Twitter/X</label>
                    <input
                      type="text"
                      name="twitter"
                      className="form-input"
                      value={playerForm.twitter}
                      onChange={handlePlayerChange}
                      placeholder="@username"
                    />
                  </div>
                  <div className="form-group">
                    <label>Twitch</label>
                    <input
                      type="text"
                      name="twitch"
                      className="form-input"
                      value={playerForm.twitch}
                      onChange={handlePlayerChange}
                      placeholder="username"
                    />
                  </div>
                  <div className="form-group">
                    <label>VLR.GG Link</label>
                    <input
                      type="text"
                      name="vlr"
                      className="form-input"
                      value={playerForm.vlr}
                      onChange={handlePlayerChange}
                      placeholder="https://vlr.gg/player/..."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Bio (Optional)</label>
                  <textarea
                    name="bio"
                    className="form-textarea"
                    value={playerForm.bio}
                    onChange={handlePlayerChange}
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Saving...' : (editingPlayer ? 'Update Player' : 'Add Player')}
                </button>
                {editingPlayer && (
                  <button 
                    type="button" 
                    className="submit-btn" 
                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}
                    onClick={() => {
                      setEditingPlayer(null);
                        setPlayerForm({
                        fullName: '',
                        ign: '',
                        role: '',
                        bio: '',
                        photoUrl: '',
                        twitter: '',
                        twitch: '',
                        vlr: ''
                      });
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>

            {/* Players List */}
            <div className="admin-panel">
              <h2 className="panel-title">Roster</h2>
              <div className="list-container">
                {players.map((player) => (
                  <div key={player.id} className="list-item">
                    <div className="item-info">
                      <div className="item-title">{player.ign}</div>
                      <div className="item-sub">
                        {player.fullName} • {player.role}
                      </div>
                    </div>
                    <div className="item-actions">
                      <button 
                        onClick={() => handleEditPlayer(player)}
                        className="icon-btn"
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button 
                        onClick={() => handleDeletePlayer(player.id)}
                        className="icon-btn delete"
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                {players.length === 0 && (
                  <div className="item-sub" style={{ textAlign: 'center', padding: '20px' }}>
                    No players found.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* News Tab */}
        {activeTab === 'news' && (
          <div className="admin-grid">
            {/* News Form */}
            <div className="admin-panel">
              <h2 className="panel-title">{editingNews ? 'Edit News' : 'Add News / Article'}</h2>
              <form onSubmit={handleNewsSubmit}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-input"
                    value={newsForm.title}
                    onChange={handleNewsChange}
                    required
                    placeholder="Headline"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Platform</label>
                    <select
                      name="platform"
                      className="form-select"
                      value={newsForm.platform}
                      onChange={handleNewsChange}
                    >
                      <option value="news">Article (News)</option>
                      <option value="x">X / Twitter</option>
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="youtube">YouTube</option>
                      <option value="twitch">Twitch</option>
                      <option value="discord">Discord</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      name="date"
                      className="form-input"
                      value={newsForm.date}
                      onChange={handleNewsChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Content / Body</label>
                  <textarea
                    name="content"
                    className="form-textarea"
                    value={newsForm.content}
                    onChange={handleNewsChange}
                    placeholder="Article content or social post description..."
                  />
                </div>

                <div className="form-group">
                  <label>External Link (Optional)</label>
                  <input
                    type="url"
                    name="link"
                    className="form-input"
                    value={newsForm.link}
                    onChange={handleNewsChange}
                    placeholder="https://..."
                  />
                </div>

                <div className="form-group">
                  <label>Image URL (Optional)</label>
                  <input
                    type="text"
                    name="image"
                    className="form-input"
                    value={newsForm.image}
                    onChange={handleNewsChange}
                    placeholder="https://..."
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Saving...' : (editingNews ? 'Update News' : 'Add News')}
                </button>
                {editingNews && (
                  <button 
                    type="button" 
                    className="submit-btn" 
                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}
                    onClick={() => {
                      setEditingNews(null);
                      setNewsForm({
                        title: '',
                        content: '',
                        platform: 'news',
                        link: '',
                        image: '',
                        date: new Date().toISOString().split('T')[0]
                      });
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>

            {/* News List */}
            <div className="admin-panel">
              <h2 className="panel-title">Published News</h2>
              <div className="list-container">
                {news.map((item) => (
                  <div key={item.id} className="list-item">
                    <div className="item-info">
                      <div className="item-title">{item.title}</div>
                      <div className="item-sub">
                        {formatDate(item.date)} • {item.platform.toUpperCase()}
                      </div>
                    </div>
                    <div className="item-actions">
                      <button 
                        onClick={() => handleEditNews(item)}
                        className="icon-btn"
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button 
                        onClick={() => handleDeleteNews(item.id)}
                        className="icon-btn delete"
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                {news.length === 0 && (
                  <div className="item-sub" style={{ textAlign: 'center', padding: '20px' }}>
                    No news items found.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Creators Tab */}
        {activeTab === 'creators' && (
          <div className="admin-grid">
            {/* Creator Form */}
            <div className="admin-panel">
              <h2 className="panel-title">{editingCreator ? 'Edit Creator' : 'Add Creator'}</h2>
              <form onSubmit={handleCreatorSubmit}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={creatorForm.name}
                    onChange={handleCreatorChange}
                    required
                    placeholder="e.g. CreatorName"
                  />
                </div>
                
                <div className="form-group">
                  <label>Photo URL</label>
                  <input
                    type="text"
                    name="photoUrl"
                    className="form-input"
                    value={creatorForm.photoUrl}
                    onChange={handleCreatorChange}
                    placeholder="https://..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Twitch</label>
                    <input
                      type="text"
                      name="twitch"
                      className="form-input"
                      value={creatorForm.twitch}
                      onChange={handleCreatorChange}
                      placeholder="username (for live check)"
                    />
                  </div>
                  <div className="form-group">
                    <label>Twitter/X</label>
                    <input
                      type="text"
                      name="twitter"
                      className="form-input"
                      value={creatorForm.twitter}
                      onChange={handleCreatorChange}
                      placeholder="@username"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>YouTube</label>
                    <input
                      type="text"
                      name="youtube"
                      className="form-input"
                      value={creatorForm.youtube}
                      onChange={handleCreatorChange}
                      placeholder="URL"
                    />
                  </div>
                  <div className="form-group">
                    <label>Instagram</label>
                    <input
                      type="text"
                      name="instagram"
                      className="form-input"
                      value={creatorForm.instagram}
                      onChange={handleCreatorChange}
                      placeholder="URL"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>TikTok</label>
                  <input
                    type="text"
                    name="tiktok"
                    className="form-input"
                    value={creatorForm.tiktok}
                    onChange={handleCreatorChange}
                    placeholder="URL"
                  />
                </div>

                <div className="form-group">
                  <label>Bio (Optional)</label>
                  <textarea
                    name="bio"
                    className="form-textarea"
                    value={creatorForm.bio}
                    onChange={handleCreatorChange}
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Saving...' : (editingCreator ? 'Update Creator' : 'Add Creator')}
                </button>
                {editingCreator && (
                  <button 
                    type="button" 
                    className="submit-btn" 
                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}
                    onClick={() => {
                      setEditingCreator(null);
                      setCreatorForm({
                        name: '',
                        bio: '',
                        photoUrl: '',
                        twitter: '',
                        twitch: '',
                        youtube: '',
                        instagram: '',
                        tiktok: ''
                      });
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>

            {/* Creators List */}
            <div className="admin-panel">
              <h2 className="panel-title">Content Creators</h2>
              <div className="list-container">
                {creators.map((creator) => (
                  <div key={creator.id} className="list-item">
                    <div className="item-info">
                      <div className="item-title">{creator.name}</div>
                      <div className="item-sub">
                         Twitch: {creator.socials?.twitch || 'N/A'}
                      </div>
                    </div>
                    <div className="item-actions">
                      <button 
                        onClick={() => handleEditCreator(creator)}
                        className="icon-btn"
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button 
                        onClick={() => handleDeleteCreator(creator.id)}
                        className="icon-btn delete"
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                {creators.length === 0 && (
                  <div className="item-sub" style={{ textAlign: 'center', padding: '20px' }}>
                    No content creators found.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
