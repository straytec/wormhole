import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useContentSearch } from '../../../hooks/useContentSearch';

interface CandidateSelectionProps {
  title: string;
  onSelect: (candidate: any) => void;
  onBack: () => void;
}

export const CandidateSelection: React.FC<CandidateSelectionProps> = ({
  title,
  onSelect,
  onBack,
}) => {
  const { data: candidates, isLoading, error } = useContentSearch(title, true);

  const handleNoneOfThese = () => {
    // Create a generic entry
    onSelect({
      id: `generic-${Date.now()}`,
      title,
      type: 'other',
      imageUrl: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: new Date().getFullYear().toString(),
      creator: 'Unknown',
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
            Choose Your Content
          </h3>
          <p className="text-cosmic-300">
            Searching for "{title}"
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-cosmic-400 animate-spin" />
          <span className="ml-3 text-cosmic-300">Scanning the cosmos...</span>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">Failed to search content</p>
          <Button variant="cosmic" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      )}

      {candidates && candidates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-cosmic-600 scrollbar-track-cosmic-800">
          {candidates.map((candidate) => (
            <motion.div
              key={candidate.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-cosmic-800 border border-cosmic-600 rounded-lg overflow-hidden cursor-pointer hover:border-stellar-400 transition-colors"
              onClick={() => onSelect(candidate)}
            >
              <div className="aspect-[3/4] relative overflow-hidden">
                <img
                  src={candidate.imageUrl}
                  alt={candidate.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-cosmic-900 text-cosmic-200 text-xs rounded-full capitalize">
                    {candidate.type}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-white mb-1 line-clamp-2">
                  {candidate.title}
                </h4>
                <p className="text-cosmic-300 text-sm">
                  {candidate.year && `${candidate.year} • `}
                  {candidate.creator}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {candidates && (
        <div className="pt-4 border-t border-cosmic-700">
          <Button
            variant="stellar"
            onClick={handleNoneOfThese}
            className="w-full"
          >
            None of these match - Create custom entry
          </Button>
        </div>
      )}
    </motion.div>
  );
};