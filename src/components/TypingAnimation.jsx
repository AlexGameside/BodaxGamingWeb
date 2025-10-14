import React, { useState, useEffect } from 'react';
import './TypingAnimation.css';

const TypingAnimation = ({ text, speed = 100, delay = 1000 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      // Animation complete
      setIsTyping(false);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className="typing-text">
      {displayedText}
      <span className={`typing-cursor ${isTyping ? 'typing' : 'blinking'}`}></span>
    </span>
  );
};

export default TypingAnimation;
