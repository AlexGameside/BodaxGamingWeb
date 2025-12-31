import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CookieProvider } from './contexts/CookieContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import Home from './pages/Home.jsx';
import Teams from './pages/Teams.jsx';
import Creators from './pages/Creators.jsx';
import Schedule from './pages/Schedule.jsx';
import About from './pages/About.jsx';
import Partners from './pages/Partners.jsx';
import News from './pages/News.jsx';
import NewsDetail from './pages/NewsDetail.jsx';
import Admin from './pages/Admin.jsx';
import Login from './pages/Login.jsx';
import Impressum from './pages/Impressum.jsx';
import Privacy from './pages/Privacy.jsx';
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
                <Route path="/teams" element={<Teams />} />
                <Route path="/creators" element={<Creators />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/about" element={<About />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsDetail />} />
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
