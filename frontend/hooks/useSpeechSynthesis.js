/**
 * Speech Synthesis Hook
 * Location: frontend/hooks/useSpeechSynthesis.js
 * 
 * Handles text-to-speech conversion with multilingual support
 */

import { useState, useCallback, useRef } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const utteranceRef = useRef(null);

  const speak = useCallback((text, language = 'en-IN') => {
    // Cancel previous speech
    if (utteranceRef.current) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure utterance
    utterance.lang = language; // en-IN (English - India), hi-IN (Hindi), ml-IN (Malayalam)
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, []);

  const pause = useCallback(() => {
    speechSynthesis.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    speechSynthesis.resume();
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
  };
};
