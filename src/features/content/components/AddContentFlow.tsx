import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useUniverseStore } from '../../../stores/universe';
import { TitleInput } from './TitleInput';
import { CandidateSelection } from './CandidateSelection';
import { ImpactAssessment } from './ImpactAssessment';

type FlowStep = 'title' | 'candidates' | 'impact';

export const AddContentFlow: React.FC = () => {
  const { setAddingContent } = useUniverseStore();
  const [currentStep, setCurrentStep] = useState<FlowStep>('title');
  const [title, setTitle] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  const handleClose = () => {
    setAddingContent(false);
    setCurrentStep('title');
    setTitle('');
    setSelectedCandidate(null);
  };

  const handleTitleSubmit = (submittedTitle: string) => {
    setTitle(submittedTitle);
    setCurrentStep('candidates');
  };

  const handleCandidateSelect = (candidate: any) => {
    setSelectedCandidate(candidate);
    setCurrentStep('impact');
  };

  const handleImpactComplete = () => {
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-void-950 bg-opacity-90 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-2xl bg-cosmic-900 border border-cosmic-700 rounded-xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cosmic-700">
          <h2 className="text-xl font-semibold text-white">
            Add to Your Universe
          </h2>
          <button
            onClick={handleClose}
            className="text-cosmic-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {currentStep === 'title' && (
              <TitleInput key="title" onSubmit={handleTitleSubmit} />
            )}
            {currentStep === 'candidates' && (
              <CandidateSelection
                key="candidates"
                title={title}
                onSelect={handleCandidateSelect}
                onBack={() => setCurrentStep('title')}
              />
            )}
            {currentStep === 'impact' && (
              <ImpactAssessment
                key="impact"
                candidate={selectedCandidate}
                onComplete={handleImpactComplete}
                onBack={() => setCurrentStep('candidates')}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};