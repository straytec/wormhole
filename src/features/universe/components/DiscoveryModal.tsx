import React from 'react';
import { motion } from 'framer-motion';
import { X, Shuffle, Zap, Clock, Calendar, Film, Book, Music, Gamepad2, GraduationCap, Briefcase } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useDiscovery } from '../../../hooks/useDiscovery';
import { useCelestialBodies } from '../../../hooks/useCelestialBodies';

interface DiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiscoveryModal: React.FC<DiscoveryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { data: celestialBodies = [] } = useCelestialBodies();
  const {
    discoverRandom,
    discoverByType,
    discoverHighImpact,
    discoverOldest,
    discoverNewest,
  } = useDiscovery();

  const handleDiscover = (discoveryFn: () => any) => {
    const discoveredBody = discoveryFn();
    if (discoveredBody) {
      // Show a brief notification about what was discovered
      console.log('Discovered:', discoveredBody.title);
    }
    onClose();
  };

  const contentTypeCounts = celestialBodies.reduce((acc, body) => {
    acc[body.content_type] = (acc[body.content_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
          className="w-full max-w-lg bg-cosmic-900 border border-cosmic-700 rounded-xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-cosmic-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-stellar-500 to-cosmic-500 rounded-full flex items-center justify-center">
                <Shuffle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Discover Your Universe</h2>
                <p className="text-cosmic-300 text-sm">Explore your knowledge in unexpected ways</p>
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
          <div className="p-6 space-y-4">
            {celestialBodies.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-cosmic-300">Add some content to your universe first!</p>
              </div>
            ) : (
              <>
                {/* Random Discovery */}
                <Button
                  variant="cosmic"
                  onClick={() => handleDiscover(discoverRandom)}
                  className="w-full justify-start"
                >
                  <Shuffle className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Random Discovery</div>
                    <div className="text-sm opacity-80">Surprise me with anything</div>
                  </div>
                </Button>

                {/* High Impact Discovery */}
                {(celestialBodies.some(b => b.has_impact || b.is_singularity)) && (
                  <Button
                    variant="stellar"
                    onClick={() => handleDiscover(discoverHighImpact)}
                    className="w-full justify-start"
                  >
                    <Zap className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">High Impact Content</div>
                      <div className="text-sm opacity-80">Show me something significant</div>
                    </div>
                  </Button>
                )}

                {/* Content Type Discovery */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-cosmic-300 mb-2">Discover by Type</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(contentTypeCounts).map(([type, count]) => (
                      <Button
                        key={type}
                        variant="stellar"
                        size="sm"
                        onClick={() => handleDiscover(() => discoverByType(type))}
                        className="justify-start"
                      >
                        <span className="mr-2">
                          {type === 'movie' ? <Film className="w-4 h-4" /> :
                           type === 'book' ? <Book className="w-4 h-4" /> :
                           type === 'album' ? <Music className="w-4 h-4" /> :
                           type === 'game' ? <Gamepad2 className="w-4 h-4" /> :
                           type === 'studying' ? <GraduationCap className="w-4 h-4" /> :
                           type === 'work' ? <Briefcase className="w-4 h-4" /> : '⭐'}
                        </span>
                        <div className="text-left">
                          <div className="text-sm capitalize">{type}s</div>
                          <div className="text-xs opacity-70">{count} items</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Time-based Discovery */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-cosmic-300 mb-2">Time Travel</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="stellar"
                      size="sm"
                      onClick={() => handleDiscover(discoverOldest)}
                      className="justify-start"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      <div className="text-left">
                        <div className="text-sm">Oldest</div>
                        <div className="text-xs opacity-70">First added</div>
                      </div>
                    </Button>
                    <Button
                      variant="stellar"
                      size="sm"
                      onClick={() => handleDiscover(discoverNewest)}
                      className="justify-start"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      <div className="text-left">
                        <div className="text-sm">Newest</div>
                        <div className="text-xs opacity-70">Recently added</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};