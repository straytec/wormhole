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
        {/* Glow effect on constellation bodies */}
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
              initial={{ scale: 1 }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 1,
                delay: index * 0.3,
                ease: "easeInOut",
              }}
            >
              <div className="w-16 h-16 bg-gradient-radial from-white/40 via-stellar-300/30 to-transparent rounded-full" />
            </motion.div>
          );
        })}

        {/* Animated constellation lines */}
        <svg className="absolute inset-0 w-full h-full">
          {lines.map((line, index) => {
            const fromBody = celestialBodies.find(b => b.id === line.from);
            const toBody = celestialBodies.find(b => b.id === line.to);
            
            if (!fromBody || !toBody) return null;

            return (
              <motion.line
                key={line.id}
                x1={`${50 + (fromBody.position_x * 0.5)}%`}
                y1={`${50 + (fromBody.position_y * 0.5)}%`}
                x2={`${50 + (toBody.position_x * 0.5)}%`}
                y2={`${50 + (toBody.position_y * 0.5)}%`}
                stroke="rgba(255, 255, 255, 0.8)"
                strokeWidth="3"
                initial={{ 
                  pathLength: 0,
                  opacity: 0 
                }}
                animate={{ 
                  pathLength: 1,
                  opacity: [0, 1, 0.6]
                }}
                transition={{
                  pathLength: { 
                    duration: 1.5, 
                    delay: 1 + (index * 0.2),
                    ease: "easeInOut" 
                  },
                  opacity: { 
                    duration: 2, 
                    delay: 1 + (index * 0.2) 
                  }
                }}
              />
            );
          })}
        </svg>
      </div>

      {/* Poetic Notification */}
      <AnimatePresence>
        {formationEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1 }}
            className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-cosmic-900/90 backdrop-blur-lg border border-stellar-400/30 rounded-xl px-6 py-4 shadow-2xl">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="text-2xl mb-2"
                >
                  ✨
                </motion.div>
                <p className="text-stellar-200 text-sm font-medium">
                  A new pattern has emerged in your cosmos...
                </p>
                <p className="text-cosmic-300 text-xs mt-1">
                  {constellation.name}
                </p>
                <p className="text-cosmic-400 text-xs mt-2">
                  {constellation.celestialBodies.length} works by {formationEvent.creator}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};