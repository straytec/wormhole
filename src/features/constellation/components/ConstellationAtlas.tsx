import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Telescope, MapPin, Calendar } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useConstellations } from '../hooks/useConstellations';
import { useUniverseStore } from '../../../stores/universe';
import { Constellation } from '../types';

interface ConstellationAtlasProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToConstellation: (constellation: Constellation) => void;
}

export const ConstellationAtlas: React.FC<ConstellationAtlasProps> = ({
  isOpen,
  onClose,
  onNavigateToConstellation,
}) => {
  const { constellations } = useConstellations();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-void-950 bg-opacity-90 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-2xl bg-cosmic-900 border border-cosmic-700 rounded-xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-cosmic-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-stellar-500 to-cosmic-500 rounded-full flex items-center justify-center">
                <Telescope className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Constellation Atlas</h2>
                <p className="text-cosmic-300 text-sm">Your discovered patterns in the cosmos</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-cosmic-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {constellations.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌌</div>
                <h3 className="text-lg font-medium text-white mb-2">
                  No Constellations Yet
                </h3>
                <p className="text-cosmic-300 mb-6">
                  Add at least 3 works by the same creator to form your first constellation
                </p>
                <Button variant="cosmic" onClick={onClose}>
                  Continue Exploring
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">
                    Discovered Constellations
                  </h3>
                  <span className="text-cosmic-300 text-sm">
                    {constellations.length} pattern{constellations.length !== 1 ? 's' : ''} found
                  </span>
                </div>

                <div className="grid gap-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-cosmic-600 scrollbar-track-cosmic-800">
                  {constellations.map((constellation) => (
                    <motion.div
                      key={constellation.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-cosmic-800 border border-cosmic-600 rounded-lg p-4 cursor-pointer hover:border-stellar-400 transition-colors"
                      onClick={() => {
                        onNavigateToConstellation(constellation);
                        onClose();
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-stellar-500 to-cosmic-500 rounded-full flex items-center justify-center text-sm">
                              ✨
                            </div>
                            <h4 className="font-semibold text-white">
                              {constellation.name}
                            </h4>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-cosmic-300">
                            <span>
                              {constellation.celestialBodies.length} celestial bodies
                            </span>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(constellation.discoveredAt || '').toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="stellar"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToConstellation(constellation);
                              onClose();
                            }}
                          >
                            <MapPin className="w-4 h-4 mr-1" />
                            Visit
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};