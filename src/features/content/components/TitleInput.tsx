import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

interface TitleInputProps {
  onSubmit: (title: string) => void;
}

export const TitleInput: React.FC<TitleInputProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-white mb-2">
          What knowledge shall we add?
        </h3>
        <p className="text-cosmic-300">
          Enter the title of a movie, book, album, game, course, or work project
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cosmic-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="e.g., Interstellar, Dune, React Course, Project Alpha..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="pl-12 text-lg"
            autoFocus
          />
        </div>

        <Button
          type="submit"
          variant="cosmic"
          size="lg"
          disabled={!title.trim()}
          className="w-full"
        >
          Search Universe
        </Button>
      </form>
    </motion.div>
  );
};