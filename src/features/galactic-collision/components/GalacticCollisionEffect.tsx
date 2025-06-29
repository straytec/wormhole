import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGalacticCollisions } from '../hooks/useGalacticCollisions';
import { GenreZoneVisualization } from './GenreZoneVisualization';
import { HybridZoneVisualization } from './HybridZoneVisualization';
import { CollisionShockwave } from './CollisionShockwave';

export const GalacticCollisionEffect: React.FC = () => {
  const {
    genreZones,
    hybridZones,
    collisionEvents,
    activeShockwaves,
  } = useGalacticCollisions();

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Genre Zone Boundaries */}
      <GenreZoneVisualization zones={genreZones} />

      {/* Hybrid Collision Zones */}
      <HybridZoneVisualization zones={hybridZones} />

      {/* Active Shockwaves */}
      <CollisionShockwave shockwaves={activeShockwaves} />

      {/* Collision Event Notifications */}
      <AnimatePresence>
        {collisionEvents.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="fixed top-12 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-cosmic-900/95 backdrop-blur-xl border-2 border-white/30 rounded-xl px-8 py-6 shadow-2xl max-w-md">
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
                  🌌
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-white text-xl font-bold mb-2"
                >
                  Galactic Collision Detected!
                </motion.p>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="text-stellar-200 text-sm mb-3"
                >
                  Genres are merging, creating new star-forming regions
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="flex justify-center gap-2"
                >
                  {event.parentGenres.map((genre, index) => (
                    <span
                      key={genre}
                      className="px-2 py-1 bg-stellar-600/50 text-stellar-200 text-xs rounded-full border border-stellar-400/30"
                    >
                      {genre}
                      {index < event.parentGenres.length - 1 && (
                        <span className="ml-1 text-white">×</span>
                      )}
                    </span>
                  ))}
                </motion.div>

                {/* Collision intensity indicator */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${event.collisionIntensity * 100}%` }}
                  transition={{ delay: 2.5, duration: 1 }}
                  className="mt-3 h-1 bg-gradient-to-r from-stellar-400 to-cosmic-400 rounded-full mx-auto"
                  style={{ maxWidth: '120px' }}
                />
                <p className="text-cosmic-300 text-xs mt-1">
                  Collision Intensity: {Math.round(event.collisionIntensity * 100)}%
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};