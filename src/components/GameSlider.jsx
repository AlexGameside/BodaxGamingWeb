import React, { useState, useEffect } from 'react';
import './GameSlider.css';

const GameSlider = ({ games }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  // Calculate cards per view based on screen size
  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setCardsPerView(1); // Show 1 card on mobile
      } else if (width < 1200) {
        setCardsPerView(2); // Show 2 cards on tablet
      } else {
        setCardsPerView(2.5); // Show 2.5 cards on desktop to see partial next card
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  // Reset currentIndex when cardsPerView changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [cardsPerView]);

  // Calculate total number of slides needed
  const totalSlides = Math.ceil(games.length / cardsPerView);
  const maxIndex = Math.max(0, totalSlides - 1);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const goToSlide = (index) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  // Debug: Log games data
  console.log('GameSlider - Total games:', games?.length, games);

  if (!games || games.length === 0) {
    return (
      <div className="game-slider-container">
        <div className="no-games-message">
          <h3>No upcoming games scheduled</h3>
          <p>Check back soon for new matches!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-slider-container">
      <div className="slider-header">
        <h2 className="slider-title">UPCOMING MATCHES</h2>
        <div className="slider-controls">
          <button 
            className="slider-btn prev-btn" 
            onClick={prevSlide}
            disabled={currentIndex === 0}
            aria-label="Previous games"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="slider-counter">
            {currentIndex + 1} / {totalSlides}
          </span>
          <button 
            className="slider-btn next-btn" 
            onClick={nextSlide}
            disabled={currentIndex === maxIndex}
            aria-label="Next games"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="slider-wrapper">
        <div 
          className="slider-track"
          style={{
            transform: `translateX(-${currentIndex * (100 / totalSlides)}%)`,
            width: `${totalSlides * 100}%`
          }}
        >
          {games.map((game, index) => (
            <div key={game.id || index} className="slider-card">
              <div className="game-card">
                <div className="game-header">
                  <div className="game-date">
                    {game.date?.toDate ? 
                      `${game.date.toDate().toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })} at ${game.date.toDate().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}` : 
                      'TBD'
                    }
                  </div>
                  <div className="game-tournament">{game.tournament}</div>
                </div>

                <div className="game-teams">
                  <div className="team-info">
                    <div className="team-logo">
                      <img src="/icons/logos/bodax-gaming_logo.png" alt="BODAX Gaming" className="team-logo-img" />
                    </div>
                    <div className="team-name">BODAX GAMING</div>
                  </div>
                  <div className="vs">VS</div>
                  <div className="team-info">
                    <div className="team-logo team-logo-placeholder">
                      <span className="placeholder-text">
                        {game.opponent?.substring(0, 3).toUpperCase()}
                      </span>
                    </div>
                    <div className="team-name">{game.opponent}</div>
                  </div>
                </div>

                {game.caster && (
                  <div className="game-details">
                    <div className="game-caster">
                      Caster: {game.caster}
                    </div>
                  </div>
                )}

                <div className="game-actions">
                  {game.streamLink && (
                    <a 
                      href={game.streamLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="stream-link"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M2 3H6L9 7H13L16 3H22V21H2V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 7V13L13 10L9 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Watch Stream
                    </a>
                  )}
                  {game.vlrLink && (
                    <a 
                      href={game.vlrLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="vlr-link"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M10 13L15 8L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 8H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      VLR.gg
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      {totalSlides > 1 && (
        <div className="slider-dots">
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={index}
              className={`slider-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GameSlider;
