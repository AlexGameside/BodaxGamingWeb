import React, { useState, useEffect, useRef } from 'react';
import './TitleTypingAnimation.css';

const TitleTypingAnimation = ({ text, speed = 50, delay = 500, className = '', useViewport = false }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isInViewport, setIsInViewport] = useState(!useViewport);
  const elementRef = useRef(null);

  // Viewport detection
  useEffect(() => {
    if (!useViewport) return;

    const checkViewport = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          setIsInViewport(true);
          return true;
        }
      }
      return false;
    };

    // Check immediately
    if (checkViewport()) return;

    // Set up observer for future visibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInViewport(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [useViewport]);

  useEffect(() => {
    if (!isInViewport) return;

    // Initial delay before starting animation
    const initialTimeout = setTimeout(() => {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, speed);

        return () => clearTimeout(timeout);
      } else {
        // Animation complete
        setIsComplete(true);
      }
    }, delay);

    return () => clearTimeout(initialTimeout);
  }, [currentIndex, text, speed, delay, isInViewport]);

  return (
    <span 
      ref={elementRef}
      className={`title-typing-text ${className} ${isComplete ? 'complete' : ''}`}
    >
      {displayedText}
    </span>
  );
};

export default TitleTypingAnimation;
