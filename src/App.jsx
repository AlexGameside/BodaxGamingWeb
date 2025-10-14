import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CookieProvider } from './contexts/CookieContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import Home from './pages/Home';
import Players from './pages/Players';
import Matches from './pages/Matches';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Impressum from './pages/Impressum';
import Privacy from './pages/Privacy';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CookieProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/players" element={<Players />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/login" element={<Login />} />
                <Route path="/impressum" element={<Impressum />} />
                <Route path="/privacy" element={<Privacy />} />
              </Routes>
            </main>
            <Footer />
            <CookieBanner />
          </div>
        </Router>
      </CookieProvider>
    </AuthProvider>
  );
}

export default App;
