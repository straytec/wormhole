import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCelestialBodies } from '../../../hooks/useCelestialBodies';
import { useConstellationFormation } from '../hooks/useConstellationFormation';
import { useConstellations } from '../hooks/useConstellations';

export const ConstellationBirthEffect: React.FC = () => {
  const { data: celestialBodies = [] } = useCelestialBodies();
  const { getConstellationLines, constellations } = useConstellations();
  const { formationEvent } = useConstellationFormation();

  if (!formationEvent) return null;

  const constellation = constellations.find(c => c.id === formationEvent.constellationId);
  if (!constellation) return null;

  const lines = getConstellationLines(constellation.id);

  return (
    <>
      {/* Constellation Birth Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Enhanced glow effect on constellation bodies */}
        {constellation.celestialBodies.map((bodyId, index) => {
          const body = celestialBodies.find(b => b.id === bodyId);
          if (!body) return null;

          return (
            <motion.div
              key={bodyId}
              className="absolute"
              style={{
                left: `${50 + (body.position_x * 0.5)}%`,
                top: `${50 + (body.position_y * 0.5)}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 1, opacity: 1 }}
              animate={{
                scale: [1, 2.5, 1.5, 1],
                opacity: [1, 0.3, 0.8, 1],
              }}
              transition={{
                duration: 2,
                delay: index * 0.4,
                ease: "easeInOut",
              }}
            >
              {/* Multiple layered glow effects */}
              <div className="absolute inset-0">
                {/* Outer bright glow */}
                <div className="w-32 h-32 bg-gradient-radial from-white/60 via-stellar-300/40 to-transparent rounded-full blur-lg" />
                {/* Middle glow */}
                <div className="absolute inset-4 bg-gradient-radial from-stellar-400/80 via-cosmic-400/50 to-transparent rounded-full blur-md" />
                {/* Inner bright core */}
                <div className="absolute inset-8 bg-gradient-radial from-white/90 via-stellar-200/70 to-transparent rounded-full" />
              </div>
              
              {/* Sparkle burst effect */}
              {Array.from({ length: 12 }).map((_, sparkleIndex) => (
                <motion.div
                  key={sparkleIndex}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ 
                    scale: 0,
                    x: 0,
                    y: 0,
                    opacity: 1
                  }}
                  animate={{ 
                    scale: [0, 1.5, 0],
                    x: Math.cos(sparkleIndex * 30 * Math.PI / 180) * 60,
                    y: Math.sin(sparkleIndex * 30 * Math.PI / 180) * 60,
                    opacity: [1, 1, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: index * 0.4 + 0.5,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>
          );
        })}

        {/* Enhanced animated constellation lines with multiple effects */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            {/* Bright line gradient */}
            <linearGradient id="birth-line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 1)" />
              <stop offset="25%" stopColor="rgba(176, 126, 200, 0.9)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 1)" />
              <stop offset="75%" stopColor="rgba(114, 114, 204, 0.9)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 1)" />
            </linearGradient>
            
            {/* Enhanced glow filter */}
            <filter id="birth-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            {/* Shimmer effect */}
            <filter id="shimmer" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"/>
            </filter>
          </defs>
          
          {lines.map((line, index) => {
            const fromBody = celestialBodies.find(b => b.id === line.from);
            const toBody = celestialBodies.find(b => b.id === line.to);
            
            if (!fromBody || !toBody) return null;

            return (
              <g key={line.id}>
                {/* Background glow line */}
                <motion.line
                  x1={`${50 + (fromBody.position_x * 0.5)}%`}
                  y1={`${50 + (fromBody.position_y * 0.5)}%`}
                  x2={`${50 + (toBody.position_x * 0.5)}%`}
                  y2={`${50 + (toBody.position_y * 0.5)}%`}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="8"
                  filter="url(#birth-glow)"
                  initial={{ 
                    pathLength: 0,
                    opacity: 0 
                  }}
                  animate={{ 
                    pathLength: 1,
                    opacity: [0, 0.8, 0.5]
                  }}
                  transition={{
                    pathLength: { 
                      duration: 2, 
                      delay: 1.5 + (index * 0.3),
                      ease: "easeInOut" 
                    },
                    opacity: { 
                      duration: 3, 
                      delay: 1.5 + (index * 0.3) 
                    }
                  }}
                />
                
                {/* Main bright line */}
                <motion.line
                  x1={`${50 + (fromBody.position_x * 0.5)}%`}
                  y1={`${50 + (fromBody.position_y * 0.5)}%`}
                  x2={`${50 + (toBody.position_x * 0.5)}%`}
                  y2={`${50 + (toBody.position_y * 0.5)}%`}
                  stroke="url(#birth-line-gradient)"
                  strokeWidth="4"
                  filter="url(#shimmer)"
                  initial={{ 
                    pathLength: 0,
                    opacity: 0 
                  }}
                  animate={{ 
                    pathLength: 1,
                    opacity: [0, 1, 0.8]
                  }}
                  transition={{
                    pathLength: { 
                      duration: 1.8, 
                      delay: 1.5 + (index * 0.3),
                      ease: "easeInOut" 
                    },
                    opacity: { 
                      duration: 2.5, 
                      delay: 1.5 + (index * 0.3) 
                    }
                  }}
                />
                
                {/* Traveling light pulse */}
                <motion.circle
                  r="4"
                  fill="rgba(255, 255, 255, 0.9)"
                  filter="url(#birth-glow)"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: 2 + (index * 0.3),
                    ease: "easeInOut"
                  }}
                >
                  <animateMotion
                    dur="2s"
                    begin={`${2 + (index * 0.3)}s`}
                    fill="freeze"
                  >
                    <mpath href={`#birth-path-${line.id}`} />
                  </animateMotion>
                </motion.circle>
                
                {/* Hidden path for animation */}
                <path
                  id={`birth-path-${line.id}`}
                  d={`M ${50 + (fromBody.position_x * 0.5)}% ${50 + (fromBody.position_y * 0.5)}% L ${50 + (toBody.position_x * 0.5)}% ${50 + (toBody.position_y * 0.5)}%`}
                  fill="none"
                  stroke="none"
                />
              </g>
            );
          })}
        </svg>
        
        {/* Constellation completion burst */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0, 1, 0],
            scale: [0, 0, 3, 5]
          }}
          transition={{
            duration: 3,
            delay: 4,
            ease: "easeOut"
          }}
        >
          <div className="w-32 h-32 bg-gradient-radial from-white/40 via-stellar-300/20 to-transparent rounded-full" />
        </motion.div>
      </div>

      {/* Enhanced Poetic Notification */}
      <AnimatePresence>
        {formationEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-cosmic-900/95 backdrop-blur-xl border-2 border-stellar-400/50 rounded-xl px-8 py-6 shadow-2xl">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 0.5, 
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  className="text-4xl mb-3"
                >
                  ✨
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-stellar-200 text-lg font-medium mb-2"
                >
                  A new constellation has been born...
                </motion.p>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="text-white text-xl font-semibold mb-1"
                >
                  {constellation.name}
                </motion.p>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="text-cosmic-300 text-sm"
                >
                  {constellation.celestialBodies.length} celestial bodies united by {formationEvent.creator}
                </motion.p>
                
                {/* Subtle sparkle effects around the notification */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: 2.5 + (i * 0.2),
                      repeat: 2,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};