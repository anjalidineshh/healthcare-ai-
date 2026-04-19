/**
 * Floating Avatar Assistant Component
 * Location: frontend/components/FloatingAvatar/FloatingAvatar.jsx
 * 
 * Features:
 * - Fixed bottom-right positioning
 * - Draggable and collapsible
 * - 3D avatar face (using Three.js or CSS-based)
 * - Voice input/output
 * - Expression changes (happy, thinking, concerned, speaking)
 * - Smooth animations
 * - Auto-greeting on first load
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Send, Phone, MessageSquare } from 'lucide-react';
import AvatarFace from './AvatarFace';
import ChatPanel from './ChatPanel';
import useAvatarStore from '../../store/avatarStore';
import useVoiceRecognition from '../../hooks/useVoiceRecognition';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';

const FloatingAvatar = () => {
  const {
    isExpanded,
    toggleExpanded,
    messages,
    addMessage,
    isLoading,
    setLoading,
    conversationId,
    setConversationId,
    currentExpression,
    setExpression,
  } = useAvatarStore();

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const containerRef = useRef(null);
  const dragRef = useRef(null);

  const { isListening, startListening, stopListening, transcript } =
    useVoiceRecognition();
  const { speak, isSpeaking } = useSpeechSynthesis();

  // Auto-greet on first load
  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => {
        const greeting =
          "Hi, I'm your health assistant. How can I help you today?";
        addMessage({
          role: 'assistant',
          content: greeting,
          emotion: 'happy',
        });
        speak(greeting);
        setExpression('happy');
      }, 500);
    }
  }, []);

  // Handle drag
  const handleMouseDown = (e) => {
    if (!isExpanded) {
      setIsDragging(true);
      const rect = dragRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && !isExpanded) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Handle voice input
  const handleMicClick = async () => {
    if (isListening) {
      stopListening();
      setIsRecording(false);
      // Auto-send transcript as message
      if (transcript) {
        handleSendMessage(transcript);
      }
    } else {
      startListening();
      setIsRecording(true);
      setExpression('thinking');
    }
  };

  // Handle text message
  const handleSendMessage = async (text = inputValue) => {
    if (!text.trim()) return;

    setExpression('thinking');
    setLoading(true);
    addMessage({
      role: 'user',
      content: text,
      emotion: 'neutral',
    });

    setInputValue('');

    try {
      // Call backend AI endpoint directly
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: text,
          conversationId,
          context: {
            messages: messages.slice(-5), // Last 5 messages for context
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat request failed with status ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.message || "I'm here to help. What can I do?";

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      addMessage({
        role: 'assistant',
        content: aiResponse,
        emotion: data.emotion || 'happy',
      });

      setExpression(data.emotion || 'happy');
      speak(aiResponse);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg =
        'Sorry, I encountered an error. Please try again.';
      addMessage({
        role: 'assistant',
        content: errorMsg,
        emotion: 'concerned',
      });
      setExpression('concerned');
      speak(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Collapsed avatar bubble
  if (!isExpanded) {
    return (
      <motion.div
        ref={dragRef}
        className="fixed bottom-6 right-6 z-40 cursor-grab active:cursor-grabbing"
        style={{
          x: position.x,
          y: position.y,
        }}
        onMouseDown={handleMouseDown}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.button
          onClick={() => toggleExpanded()}
          className="relative w-16 h-16 rounded-full bg-gradient-to-br from-healthcare-400 to-healthcare-600 shadow-avatar hover:shadow-lg transition-all flex items-center justify-center group"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(15, 165, 233, 0.7)',
              '0 0 0 10px rgba(15, 165, 233, 0)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Avatar Icon */}
          <div className="relative w-12 h-12">
            <AvatarFace
              expression={currentExpression}
              size="small"
              isSpeaking={isSpeaking}
            />
          </div>

          {/* Pulse Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-healthcare-300 opacity-0"
            animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Unread indicator */}
          {messages.length > 0 && (
            <motion.div className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
              animate={{ scale: [0.8, 1] }}
              transition={{ duration: 0.3 }}
            >
              {Math.min(messages.length, 9)}
            </motion.div>
          )}
        </motion.button>

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-20 right-0 bg-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap text-sm font-medium text-gray-800 pointer-events-none"
        >
          Health Assistant
        </motion.div>
      </motion.div>
    );
  }

  // Expanded chat panel
  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 right-6 z-40 w-96 h-[600px] bg-white rounded-2xl shadow-avatar flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-healthcare-500 to-healthcare-600 px-6 py-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10">
            <AvatarFace expression={currentExpression} size="tiny" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Health Assistant</h3>
            <p className="text-xs opacity-90">
              {isSpeaking ? 'Speaking...' : 'Online'}
            </p>
          </div>
        </div>
        <button
          onClick={() => toggleExpanded()}
          className="hover:bg-white/20 p-2 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Avatar Section */}
      <div className="flex-1 bg-gradient-to-b from-healthcare-50 to-white p-6 flex items-center justify-center border-b border-gray-100">
        <motion.div
          animate={{
            scale: isSpeaking ? 1.05 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <AvatarFace
            expression={currentExpression}
            size="large"
            isSpeaking={isSpeaking}
          />
        </motion.div>
      </div>

      {/* Chat Messages */}
      <ChatPanel messages={messages} isLoading={isLoading} />

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100 bg-white space-y-3">
        {isRecording && transcript && (
          <div className="bg-healthcare-50 p-3 rounded-lg text-sm text-gray-700 border-l-4 border-healthcare-400">
            "{transcript}"
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) =>
              e.key === 'Enter' && handleSendMessage()
            }
            placeholder="Type or say something..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-400"
            disabled={isLoading || isRecording}
          />

          <motion.button
            onClick={handleMicClick}
            whileTap={{ scale: 0.9 }}
            className={`p-2.5 rounded-full transition-colors ${
              isRecording
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-healthcare-100'
            }`}
            disabled={isLoading}
          >
            <Mic size={20} />
          </motion.button>

          <motion.button
            onClick={() => handleSendMessage()}
            whileTap={{ scale: 0.9 }}
            disabled={isLoading || !inputValue.trim()}
            className="p-2.5 rounded-full bg-healthcare-500 text-white hover:bg-healthcare-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </motion.button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          ⚕️ Disclaimer: This system does not replace professional medical advice.
        </p>
      </div>
    </motion.div>
  );
};

export default FloatingAvatar;
