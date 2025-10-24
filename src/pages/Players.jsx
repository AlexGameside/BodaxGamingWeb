import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import './Players.css';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const playersRef = collection(db, 'players');
      const q = query(playersRef, orderBy('name'));
      const snapshot = await getDocs(q);
      
      const playersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPlayers(playersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching players:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading players...</div>;
  }

  return (
    <div className="players-page">
      <div className="page-header">
        <h1>Our Players</h1>
        <p>Meet the talented roster of BodaxGaming</p>
      </div>

      <div className="players-grid">
        {players.length > 0 ? (
          players.map(player => (
            <div key={player.id} className="player-card">
              <div className="player-avatar">
                {player.photoUrl && player.photoUrl.trim() !== '' ? (
                  <img src={player.photoUrl} alt={player.fullName} />
                ) : (
                  <div className="avatar-placeholder">
                    <svg className="placeholder-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="player-info">
                <h3 className="player-name">{player.fullName}</h3>
                <p className="player-ign">{player.role}</p>
                {player.bio && <p className="player-bio">{player.bio}</p>}
              </div>
            </div>
          ))
        ) : (
          <div className="no-players">
            <p>No players added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Players;

