import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const { currentUser, login, signup, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (isSignup) {
        await signup(email, password);
        setMessage('Account created! You can now login.');
        setEmail('');
        setPassword('');
        setIsSignup(false);
      } else {
        await login(email, password);
        setMessage('Logged in successfully!');
        setEmail('');
        setPassword('');
        navigate('/admin');
      }
    } catch (error) {
      setError(error.message || 'Authentication failed');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setMessage('Logged out successfully');
    } catch (error) {
      setError('Failed to logout');
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-info">
            <h3>BodaxGaming</h3>
            <p>&copy; 2025 BodaxGaming. All rights reserved.</p>
          </div>

          <div className="footer-auth">
            {currentUser ? (
              <div className="auth-status">
                <p>Logged in as: {currentUser.email}</p>
                <button onClick={handleLogout} className="footer-btn">
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-form">
                <h4>{isSignup ? 'Sign Up' : 'Admin Login'}</h4>
                {error && <div className="footer-error">{error}</div>}
                {message && <div className="footer-message">{message}</div>}
                <form onSubmit={handleSubmit}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="submit" className="footer-btn">
                    {isSignup ? 'Sign Up' : 'Login'}
                  </button>
                </form>
                <p className="toggle-auth">
                  {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                  <button 
                    onClick={() => {
                      setIsSignup(!isSignup);
                      setError('');
                      setMessage('');
                    }}
                    className="toggle-btn"
                  >
                    {isSignup ? 'Login' : 'Sign Up'}
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

