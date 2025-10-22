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
                {player.photoURL ? (
                  <img src={player.photoURL} alt={player.name} />
                ) : (
                  <div className="avatar-placeholder">
                    <img src="/icons/user-solid.svg" alt="User" className="placeholder-icon" />
                  </div>
                )}
              </div>
              <div className="player-info">
                <h3 className="player-name">{player.name}</h3>
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

