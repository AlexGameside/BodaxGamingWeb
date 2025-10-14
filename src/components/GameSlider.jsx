import React, { useState, useEffect, useRef } from 'react';
import TitleTypingAnimation from './TitleTypingAnimation';
import './GameSlider.css';

const GameSlider = ({ games }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [slideDistance, setSlideDistance] = useState(265);
  const [containerWidth, setContainerWidth] = useState(1600);
  const sliderRef = useRef(null);

  // Calculate slide distance based on screen size
  useEffect(() => {
    const updateSlideDistance = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setSlideDistance(325); // 300px card + 25px gap
      } else if (width < 768) {
        setSlideDistance(380); // 350px card + 30px gap
      } else if (width < 1200) {
        setSlideDistance(430); // 400px card + 30px gap
      } else {
        setSlideDistance(680); // 650px card + 30px gap
      }
    };

    updateSlideDistance();
    window.addEventListener('resize', updateSlideDistance);
    return () => window.removeEventListener('resize', updateSlideDistance);
  }, []);

  // Measure container width
  useEffect(() => {
    const updateContainerWidth = () => {
      if (sliderRef.current) {
        setContainerWidth(sliderRef.current.offsetWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    return () => window.removeEventListener('resize', updateContainerWidth);
  }, []);

  // Reset currentIndex when cardsPerView changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [cardsPerView]);

  // Calculate max index based on total games and visible area
  // We want the last card to align to the right edge
  const maxIndex = Math.max(0, games.length - 1);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const goToSlide = (index) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  // Calculate the translateX value to align last card to right edge
  const calculateTranslateX = () => {
    if (games.length <= 1) return 0;
    
    // For the first slide (index 0), return 0 to keep it at the left edge with margin
    if (currentIndex === 0) return 0;
    
    // Calculate the total width of all slides
    const totalSlidesWidth = games.length * slideDistance;
    
    // Calculate the visible container width (accounting for margin and right padding)
    const trackMargin = 20; // Left margin of slider-track
    const containerPadding = 50; // Only right padding for fade effect
    const visibleWidth = containerWidth - containerPadding - trackMargin;
    
    // If total slides width is less than visible width, no translation needed
    if (totalSlidesWidth <= visibleWidth) return 0;
    
    // Calculate the maximum translation needed to align last card to right
    const maxTranslation = totalSlidesWidth - visibleWidth;
    
    // Apply the current index translation, but don't exceed the maximum
    const currentTranslation = currentIndex * slideDistance;
    return Math.min(currentTranslation, maxTranslation);
  };

  // Debug: Log games data
  console.log('GameSlider - Total games:', games?.length, games);
  console.log('GameSlider - Max index:', maxIndex);
  console.log('GameSlider - Current index:', currentIndex);

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

  // Ensure we have games data
  if (games.length < 1) {
    console.warn('GameSlider: No games to display');
    return null;
  }

  return (
    <div className="game-slider-container" ref={sliderRef}>
      <div className="slider-header">
        <h2 className="slider-title">
          <TitleTypingAnimation text="UPCOMING MATCHES" speed={5} delay={50} useViewport={true} />
        </h2>
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
            {currentIndex + 1} / {games.length}
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
        <div className={`unified-slider ${currentIndex > 0 ? 'show-left-fade' : ''}`}>
          <div 
            className="slider-track"
            style={{
              transform: `translateX(-${calculateTranslateX()}px)`,
              transition: 'transform 0.5s ease-in-out'
            }}
          >
            {games.map((game, index) => (
              <div 
                key={game.id || index} 
                className={`game-slide ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              >
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
                        <img src="/icons/logos/bodax-gaming_logo_2.svg" alt="BODAX Gaming" className="team-logo-img" />
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
      </div>
    </div>
  );
};

export default GameSlider;
