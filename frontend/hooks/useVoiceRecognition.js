/**
 * Voice Recognition Hook
 * Location: frontend/hooks/useVoiceRecognition.js
 * 
 * Handles microphone input and speech-to-text conversion
 */

import { useState, useCallback, useEffect, useRef } from 'react';

const useVoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech Recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN'; // Set to Indian English by default

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          setTranscript(transcript);
        } else {
          interimTranscript += transcript;
        }
      }
    };

    recognition.onerror = (event) => {
      setError(`Voice error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = useCallback(() => {
    setTranscript('');
    setError(null);
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    error,
    browserSupportsSpeechRecognition: !!recognitionRef.current,
  };
};

export default useVoiceRecognition;
