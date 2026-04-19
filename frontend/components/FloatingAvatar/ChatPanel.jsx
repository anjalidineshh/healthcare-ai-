/**
 * Chat Panel Component
 * Location: frontend/components/FloatingAvatar/ChatPanel.jsx
 * 
 * Displays conversation messages with smooth scrolling and animations
 */

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ChatPanel = ({ messages, isLoading }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const emotionColors = {
    happy: 'text-green-600',
    sad: 'text-blue-600',
    concerned: 'text-red-600',
    neutral: 'text-gray-600',
    thinking: 'text-yellow-600',
  };

  const emotionIcons = {
    happy: '😊',
    sad: '😔',
    concerned: '😟',
    neutral: '😐',
    thinking: '🤔',
  };

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-3 bg-white"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-center">
          <div className="text-gray-400">
            <p className="text-2xl mb-2">👋</p>
            <p className="text-sm">Start a conversation</p>
          </div>
        </div>
      ) : (
        messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-healthcare-500 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}
            >
              <div className="flex items-end gap-2">
                {msg.role === 'assistant' && msg.emotion && (
                  <span className="text-lg leading-none">
                    {emotionIcons[msg.emotion]}
                  </span>
                )}
                <ReactMarkdown
                  className="prose prose-sm max-w-none"
                  components={{
                    p: ({ node, ...props }) => (
                      <p className="m-0" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="m-0 ml-4 list-disc" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="m-0 ml-4 list-decimal" {...props} />
                    ),
                    a: ({ node, ...props }) => (
                      <a className="underline hover:opacity-80" {...props} />
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </motion.div>
        ))
      )}

      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-start"
        >
          <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-2">
            <Loader size={16} className="animate-spin text-healthcare-500" />
            <span className="text-sm text-gray-600">Thinking...</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChatPanel;
