import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Zap } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useCreateCelestialBody } from '../../../hooks/useCelestialBodies';

interface ImpactAssessmentProps {
  candidate: any;
  onComplete: () => void;
  onBack: () => void;
}

export const ImpactAssessment: React.FC<ImpactAssessmentProps> = ({
  candidate,
  onComplete,
  onBack,
}) => {
  const [hasImpact, setHasImpact] = useState(false);
  const [isSingularity, setIsSingularity] = useState(false);
  const createCelestialBody = useCreateCelestialBody();

  const handleComplete = () => {
    createCelestialBody.mutate({
      title: candidate.title,
      content_type: candidate.type,
      genre: candidate.genre,
      creator: candidate.creator,
      external_id: candidate.id,
      api_data: candidate,
      is_singularity: isSingularity,
      has_impact: hasImpact,
    }, {
      onSuccess: () => {
        // Reset form state
        setHasImpact(false);
        setIsSingularity(false);
        onComplete();
      },
      onError: (error) => {
        console.error('Failed to create celestial body:', error);
        // You could show an error message here
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <Button
          variant="stellar"
          size="sm"
          onClick={onBack}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h3 className="text-xl font-semibold text-white">
            Cosmic Impact
          </h3>
          <p className="text-cosmic-300">
            How will this knowledge shape your universe?
          </p>
        </div>
      </div>

      {/* Content Preview */}
      <div className="flex items-center gap-4 p-4 bg-cosmic-800 rounded-lg border border-cosmic-600">
        <img
          src={candidate.imageUrl}
          alt={candidate.title}
          className="w-16 h-20 object-cover rounded"
        />
        <div>
          <h4 className="font-semibold text-white">{candidate.title}</h4>
          <p className="text-cosmic-300 text-sm">
            <span className="capitalize">{candidate.type}</span>
            {candidate.year && ` • ${candidate.year}`}
          </p>
          <p className="text-cosmic-400 text-sm">{candidate.creator}</p>
        </div>
      </div>

      {/* Impact Choices */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-medium text-white mb-3">
            Choose its cosmic form:
          </h4>
          
          {/* Standard Impact */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              p-4 rounded-lg border-2 cursor-pointer transition-all
              ${hasImpact && !isSingularity
                ? 'border-stellar-400 bg-stellar-900/30' 
                : 'border-cosmic-600 hover:border-cosmic-500'
              }
            `}
            onClick={() => {
              setHasImpact(!hasImpact);
              setIsSingularity(false);
            }}
          >
            <div className="flex items-center gap-3">
              <Heart className={`w-6 h-6 ${hasImpact && !isSingularity ? 'text-stellar-400' : 'text-cosmic-400'}`} />
              <div>
                <h5 className="font-medium text-white">High Impact</h5>
                <p className="text-cosmic-300 text-sm">
                  Creates a brighter, larger celestial body with greater presence
                </p>
              </div>
            </div>
          </motion.div>

          {/* Singularity */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              p-4 rounded-lg border-2 cursor-pointer transition-all mt-3
              ${isSingularity
                ? 'border-purple-400 bg-purple-900/30' 
                : 'border-cosmic-600 hover:border-cosmic-500'
              }
            `}
            onClick={() => {
              setIsSingularity(!isSingularity);
              setHasImpact(false);
            }}
          >
            <div className="flex items-center gap-3">
              <Zap className={`w-6 h-6 ${isSingularity ? 'text-purple-400' : 'text-cosmic-400'}`} />
              <div>
                <h5 className="font-medium text-white">Singularity</h5>
                <p className="text-cosmic-300 text-sm">
                  Creates a special cosmic phenomenon with unique properties
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Button
        variant="cosmic"
        size="lg"
        onClick={handleComplete}
        disabled={createCelestialBody.isPending}
        className="w-full"
      >
        {createCelestialBody.isPending ? (
          <motion.div
            className="flex items-center gap-2"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <motion.div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            Birthing into existence...
          </motion.div>
        ) : (
          'Birth New Celestial Body'
        )}
      </Button>
    </motion.div>
  );
};