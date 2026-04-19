/**
 * Avatar Face Component (3D SVG-based)
 * Location: frontend/components/FloatingAvatar/AvatarFace.jsx
 * 
 * Expressions: happy, concerned, thinking, neutral, speaking
 * Uses SVG for lightweight 3D-like face with smooth animations
 */

import React from 'react';
import { motion } from 'framer-motion';

const AvatarFace = ({ expression = 'neutral', size = 'medium', isSpeaking = false }) => {
  const sizes = {
    tiny: { width: 40, height: 40, face: 24 },
    small: { width: 64, height: 64, face: 48 },
    medium: { width: 120, height: 120, face: 100 },
    large: { width: 200, height: 200, face: 180 },
  };

  const { width, height, face } = sizes[size];
  const scale = face / 100;

  // Expression configurations
  const expressions = {
    happy: {
      eyeOffset: -2,
      eyeScale: 1,
      mouth: 'happy',
      eyebrow: 'normal',
      glow: 'rgba(16, 185, 129, 0.3)',
    },
    concerned: {
      eyeOffset: 0,
      eyeScale: 0.9,
      mouth: 'concerned',
      eyebrow: 'worried',
      glow: 'rgba(239, 68, 68, 0.3)',
    },
    thinking: {
      eyeOffset: 1,
      eyeScale: 0.95,
      mouth: 'neutral',
      eyebrow: 'thinking',
      glow: 'rgba(59, 130, 246, 0.3)',
    },
    neutral: {
      eyeOffset: 0,
      eyeScale: 1,
      mouth: 'neutral',
      eyebrow: 'normal',
      glow: 'rgba(15, 165, 233, 0.2)',
    },
    speaking: {
      eyeOffset: -1,
      eyeScale: 1.05,
      mouth: 'speaking',
      eyebrow: 'normal',
      glow: 'rgba(59, 130, 246, 0.4)',
    },
  };

  const config = expressions[expression] || expressions.neutral;

  // Animation for speaking
  const speakingAnimation = isSpeaking ? {
    scale: [1, 1.02, 1],
    transition: { duration: 0.5, repeat: Infinity },
  } : {};

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox={`0 0 ${face} ${face}`}
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
      animate={speakingAnimation}
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FED7AA', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#FDBA74', stopOpacity: 1 }} />
        </linearGradient>

        <radialGradient id="cheekGradient">
          <stop offset="0%" style={{ stopColor: '#FB7185', stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: '#FB7185', stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      {/* Background glow */}
      <circle
        cx={face / 2}
        cy={face / 2}
        r={face / 2}
        fill={config.glow}
        opacity="0.8"
        className="transition-all duration-300"
      />

      {/* Face outline */}
      <circle
        cx={face / 2}
        cy={face / 2}
        r={face / 2.2}
        fill="url(#skinGradient)"
        stroke="#E5B8A6"
        strokeWidth="2"
      />

      {/* Left cheek */}
      <circle
        cx={face / 3.5}
        cy={face / 1.8}
        r={face / 8}
        fill="url(#cheekGradient)"
      />

      {/* Right cheek */}
      <circle
        cx={(face * 2.5) / 3.5}
        cy={face / 1.8}
        r={face / 8}
        fill="url(#cheekGradient)"
      />

      {/* Left eyebrow */}
      <motion.path
        d={
          config.eyebrow === 'worried'
            ? `M ${face / 3.5 - 8} ${face / 3} Q ${face / 3.5} ${face / 3.5} ${face / 3.5 + 8} ${face / 3}`
            : config.eyebrow === 'thinking'
            ? `M ${face / 3.5 - 10} ${face / 3} Q ${face / 3.5} ${face / 3.3} ${face / 3.5 + 10} ${face / 3}`
            : `M ${face / 3.5 - 10} ${face / 3.2} Q ${face / 3.5} ${face / 3.5} ${face / 3.5 + 10} ${face / 3.2}`
        }
        stroke="#8B4513"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        animate={
          config.eyebrow === 'thinking'
            ? {
                d: [
                  `M ${face / 3.5 - 10} ${face / 3} Q ${face / 3.5} ${face / 3.3} ${face / 3.5 + 10} ${face / 3}`,
                  `M ${face / 3.5 - 10} ${face / 3.2} Q ${face / 3.5} ${face / 3.5} ${face / 3.5 + 10} ${face / 3.2}`,
                ],
                transition: { duration: 1.5, repeat: Infinity },
              }
            : {}
        }
      />

      {/* Right eyebrow */}
      <motion.path
        d={
          config.eyebrow === 'worried'
            ? `M ${(face * 2.5) / 3.5 - 8} ${face / 3} Q ${(face * 2.5) / 3.5} ${face / 3.5} ${(face * 2.5) / 3.5 + 8} ${face / 3}`
            : config.eyebrow === 'thinking'
            ? `M ${(face * 2.5) / 3.5 - 10} ${face / 3} Q ${(face * 2.5) / 3.5} ${face / 3.3} ${(face * 2.5) / 3.5 + 10} ${face / 3}`
            : `M ${(face * 2.5) / 3.5 - 10} ${face / 3.2} Q ${(face * 2.5) / 3.5} ${face / 3.5} ${(face * 2.5) / 3.5 + 10} ${face / 3.2}`
        }
        stroke="#8B4513"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        animate={
          config.eyebrow === 'thinking'
            ? {
                d: [
                  `M ${(face * 2.5) / 3.5 - 10} ${face / 3} Q ${(face * 2.5) / 3.5} ${face / 3.3} ${(face * 2.5) / 3.5 + 10} ${face / 3}`,
                  `M ${(face * 2.5) / 3.5 - 10} ${face / 3.2} Q ${(face * 2.5) / 3.5} ${face / 3.5} ${(face * 2.5) / 3.5 + 10} ${face / 3.2}`,
                ],
                transition: { duration: 1.5, repeat: Infinity },
              }
            : {}
        }
      />

      {/* Left eye white */}
      <circle
        cx={face / 3.5}
        cy={face / 2.2 + config.eyeOffset}
        r={face / 12}
        fill="white"
        stroke="#DDD"
        strokeWidth="1.5"
      />

      {/* Right eye white */}
      <circle
        cx={(face * 2.5) / 3.5}
        cy={face / 2.2 + config.eyeOffset}
        r={face / 12}
        fill="white"
        stroke="#DDD"
        strokeWidth="1.5"
      />

      {/* Left pupil */}
      <motion.circle
        cx={face / 3.5}
        cy={face / 2.2 + config.eyeOffset}
        r={(face / 12) * 0.5 * config.eyeScale}
        fill="#1F2937"
        animate={
          config.eyebrow === 'thinking'
            ? {
                cx: [face / 3.5 - 2, face / 3.5, face / 3.5 + 2, face / 3.5],
                transition: { duration: 1.5, repeat: Infinity },
              }
            : {}
        }
      />

      {/* Right pupil */}
      <motion.circle
        cx={(face * 2.5) / 3.5}
        cy={face / 2.2 + config.eyeOffset}
        r={(face / 12) * 0.5 * config.eyeScale}
        fill="#1F2937"
        animate={
          config.eyebrow === 'thinking'
            ? {
                cx: [(face * 2.5) / 3.5 - 2, (face * 2.5) / 3.5, (face * 2.5) / 3.5 + 2, (face * 2.5) / 3.5],
                transition: { duration: 1.5, repeat: Infinity },
              }
            : {}
        }
      />

      {/* Left eye shine */}
      <circle
        cx={face / 3.5 + 2}
        cy={face / 2.2 + config.eyeOffset - 2}
        r={face / 24}
        fill="white"
        opacity="0.7"
      />

      {/* Right eye shine */}
      <circle
        cx={(face * 2.5) / 3.5 + 2}
        cy={face / 2.2 + config.eyeOffset - 2}
        r={face / 24}
        fill="white"
        opacity="0.7"
      />

      {/* Mouth */}
      {config.mouth === 'happy' && (
        <motion.path
          d={`M ${face / 3.5} ${face / 1.5} Q ${face / 2} ${face / 1.35} ${(face * 2.5) / 3.5} ${face / 1.5}`}
          stroke="#C1272D"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          animate={isSpeaking ? {
            d: [
              `M ${face / 3.5} ${face / 1.5} Q ${face / 2} ${face / 1.35} ${(face * 2.5) / 3.5} ${face / 1.5}`,
              `M ${face / 3.5} ${face / 1.5} Q ${face / 2} ${face / 1.3} ${(face * 2.5) / 3.5} ${face / 1.5}`,
            ],
            transition: { duration: 0.4, repeat: Infinity },
          } : {}}
        />
      )}

      {config.mouth === 'concerned' && (
        <path
          d={`M ${face / 3.5} ${face / 1.4} Q ${face / 2} ${face / 1.5} ${(face * 2.5) / 3.5} ${face / 1.4}`}
          stroke="#F59E0B"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      )}

      {config.mouth === 'neutral' && (
        <line
          x1={face / 3.5}
          y1={face / 1.5}
          x2={(face * 2.5) / 3.5}
          y2={face / 1.5}
          stroke="#8B4513"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}

      {config.mouth === 'speaking' && (
        <motion.ellipse
          cx={face / 2}
          cy={face / 1.45}
          rx={face / 8}
          ry={face / 12}
          fill="rgba(193, 39, 45, 0.3)"
          animate={{
            ry: [face / 12, face / 8, face / 12],
          }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />
      )}

      {/* Nose */}
      <path
        d={`M ${face / 2} ${face / 2.8} L ${face / 2} ${face / 1.7}`}
        stroke="#D4A574"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </motion.svg>
  );
};

export default AvatarFace;
