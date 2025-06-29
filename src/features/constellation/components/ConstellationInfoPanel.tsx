import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, User } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useCelestialBodies } from '../../../hooks/useCelestialBodies';
import { useConstellations } from '../hooks/useConstellations';
import { useUniverseStore } from '../../../stores/universe';
import { Constellation } from '../types';

interface ConstellationInfoPanelProps {
  constellation: Constellation | null;
  onClose: () => void;
  onCenterConstellation: (constellation: Constellation) => void;
  onNavigateToBody: (bodyId: string) => void;
}

export const ConstellationInfoPanel: React.FC<ConstellationInfoPanelProps> = ({
  constellation,
  onClose,
  onCenterConstellation,
  onNavigateToBody,
}) => {
  const { data: celestialBodies = [] } = useCelestialBodies();

  if (!constellation) return null;

  const constellationBodies = constellation.celestialBodies
    .map(id => celestialBodies.find(b => b.id === id))
    .filter(Boolean);

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'movie': return '🎬';
      case 'book': return '📚';
      case 'album': return '🎵';
      case 'game': return '🎮';
      case 'studying': return '🎓';
      case 'work': return '💼';
      default: return '⭐';
    }
  };

  const getBodyTypeLabel = (body: any) => {
    if (body.is_singularity) return 'Singularity';
    if (body.visual_attributes?.type === 'star') return 'Star';
    if (body.visual_attributes?.type === 'planet') return 'Planet';
    if (body.visual_attributes?.type === 'nebula') return 'Nebula';
    return 'Celestial Body';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-8 top-1/2 transform -translate-y-1/2 w-80 z-40"
      >
        <div className="bg-cosmic-900/95 backdrop-blur-lg border border-cosmic-700 rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-cosmic-700">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-stellar-500 to-cosmic-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {constellation.name}
                  </h2>
                  <p className="text-cosmic-300 text-sm">
                    {constellation.celestialBodies.length} Works Discovered
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-cosmic-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Center Button */}
            <Button
              variant="cosmic"
              size="sm"
              onClick={() => onCenterConstellation(constellation)}
              className="w-full"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Center on this Constellation
            </Button>

            {/* Works List */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-cosmic-300 mb-3">
                Celestial Bodies
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-cosmic-600 scrollbar-track-cosmic-800">
                {constellationBodies.map((body) => (
                  <motion.button
                    key={body.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigateToBody(body.id)}
                    className="w-full p-3 bg-cosmic-800 hover:bg-cosmic-700 rounded-lg transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {getContentTypeIcon(body.content_type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-cosmic-600 text-cosmic-200 rounded-full">
                            {getBodyTypeLabel(body)}
                          </span>
                          {body.has_impact && (
                            <span className="text-xs px-2 py-1 bg-stellar-600 text-stellar-200 rounded-full">
                              High Impact
                            </span>
                          )}
                        </div>
                        <h4 className="font-medium text-white text-sm mt-1 truncate">
                          {body.title}
                        </h4>
                        <p className="text-cosmic-300 text-xs capitalize">
                          {body.content_type}
                          {body.genre && ` • ${body.genre}`}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Discovery Info */}
            <div className="pt-4 border-t border-cosmic-700">
              <div className="text-xs text-cosmic-400">
                <p>Constellation formed on</p>
                <p className="text-cosmic-200 mt-1">
                  {new Date(constellation.discoveredAt || '').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};