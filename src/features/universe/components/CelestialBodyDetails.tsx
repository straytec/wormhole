import React from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, User, Tag, Zap, Heart, Focus } from 'lucide-react';
import { useCelestialBodies } from '../../../hooks/useCelestialBodies';
import { useUniverseStore } from '../../../stores/universe';
import { Button } from '../../../components/ui/Button';

interface CelestialBodyDetailsProps {
  bodyId: string;
  onClose: () => void;
}

export const CelestialBodyDetails: React.FC<CelestialBodyDetailsProps> = ({
  bodyId,
  onClose,
}) => {
  const { data: celestialBodies = [] } = useCelestialBodies();
  const { focusOnBody, setSelectedBody } = useUniverseStore();
  const body = celestialBodies.find(b => b.id === bodyId);

  if (!body) return null;

  const handleClose = () => {
    setSelectedBody(null); // Clear selection when closing
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-void-950 bg-opacity-90 backdrop-blur-sm z-40"
        onClick={handleClose}
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
              <span className="text-2xl">{getContentTypeIcon(body.content_type)}</span>
              <div>
                <h2 className="text-xl font-semibold text-white">{body.title}</h2>
                <p className="text-cosmic-300 capitalize">{body.content_type}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-cosmic-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Focus Button */}
            <Button
              variant="cosmic"
              size="sm"
              onClick={() => focusOnBody(bodyId, celestialBodies)}
              className="w-full"
            >
              <Focus className="w-4 h-4 mr-2" />
              Focus on this body
            </Button>

            {/* Special Properties */}
            {(body.is_singularity || body.has_impact) && (
              <div className="flex gap-2">
                {body.is_singularity && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-purple-900/50 border border-purple-400 rounded-full text-purple-200 text-sm">
                    <Zap className="w-4 h-4" />
                    Singularity
                  </div>
                )}
                {body.has_impact && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-stellar-900/50 border border-stellar-400 rounded-full text-stellar-200 text-sm">
                    <Heart className="w-4 h-4" />
                    High Impact
                  </div>
                )}
              </div>
            )}

            {/* Details */}
            <div className="space-y-3">
              {body.creator_id && (
                <div className="flex items-center gap-3 text-cosmic-200">
                  <User className="w-5 h-5 text-cosmic-400" />
                  <span>{body.creator_id}</span>
                </div>
              )}

              {body.genre && (
                <div className="flex items-center gap-3 text-cosmic-200">
                  <Tag className="w-5 h-5 text-cosmic-400" />
                  <span>{body.genre}</span>
                </div>
              )}

              <div className="flex items-center gap-3 text-cosmic-200">
                <Calendar className="w-5 h-5 text-cosmic-400" />
                <span>Added {formatDate(body.created_at)}</span>
              </div>
            </div>

            {/* Visual Properties */}
            <div className="pt-4 border-t border-cosmic-700">
              <h3 className="text-sm font-medium text-cosmic-300 mb-3">Cosmic Properties</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-cosmic-400">Type:</span>
                  <span className="ml-2 text-white capitalize">{body.visual_attributes.type}</span>
                </div>
                <div>
                  <span className="text-cosmic-400">Size:</span>
                  <span className="ml-2 text-white">{(body.visual_attributes.size * 100).toFixed(0)}%</span>
                </div>
                <div>
                  <span className="text-cosmic-400">Brightness:</span>
                  <span className="ml-2 text-white">{(body.visual_attributes.brightness * 100).toFixed(0)}%</span>
                </div>
                <div>
                  <span className="text-cosmic-400">Position:</span>
                  <span className="ml-2 text-white">
                    ({body.position_x.toFixed(1)}, {body.position_y.toFixed(1)})
                  </span>
                </div>
              </div>
            </div>

            {/* API Data Preview */}
            {body.api_data && body.api_data.description && (
              <div className="pt-4 border-t border-cosmic-700">
                <h3 className="text-sm font-medium text-cosmic-300 mb-2">Description</h3>
                <p className="text-cosmic-200 text-sm leading-relaxed">
                  {body.api_data.description.length > 200 
                    ? `${body.api_data.description.substring(0, 200)}...`
                    : body.api_data.description
                  }
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};