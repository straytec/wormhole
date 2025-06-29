import { useMemo } from 'react';

interface ContentCandidate {
  title: string;
  type: string;
  genre?: string;
  description?: string;
  api_data?: any;
}

// Genre detection patterns for hybrid content
const HYBRID_PATTERNS = {
  'sci-fi-horror': {
    keywords: ['alien', 'space horror', 'cosmic horror', 'xenomorph', 'event horizon', 'dead space'],
    titles: ['alien', 'aliens', 'event horizon', 'pandorum', 'life', 'the thing'],
    genres: ['sci-fi', 'horror', 'science fiction', 'thriller']
  },
  'sci-fi-noir': {
    keywords: ['cyberpunk', 'dystopian', 'blade runner', 'neo-noir', 'tech noir'],
    titles: ['blade runner', 'ghost in the shell', 'altered carbon', 'minority report'],
    genres: ['sci-fi', 'noir', 'cyberpunk', 'thriller']
  },
  'fantasy-horror': {
    keywords: ['dark fantasy', 'gothic', 'supernatural horror', 'lovecraftian'],
    titles: ['pan\'s labyrinth', 'the shape of water', 'crimson peak'],
    genres: ['fantasy', 'horror', 'dark fantasy', 'supernatural']
  },
  'comedy-horror': {
    keywords: ['horror comedy', 'zombie comedy', 'dark comedy'],
    titles: ['shaun of the dead', 'what we do in the shadows', 'tucker and dale'],
    genres: ['comedy', 'horror', 'dark comedy']
  },
  'action-sci-fi': {
    keywords: ['space opera', 'sci-fi action', 'futuristic warfare'],
    titles: ['star wars', 'guardians of the galaxy', 'edge of tomorrow'],
    genres: ['action', 'sci-fi', 'adventure']
  },
  'drama-sci-fi': {
    keywords: ['hard sci-fi', 'philosophical sci-fi', 'cerebral'],
    titles: ['arrival', 'interstellar', 'her', 'ex machina'],
    genres: ['drama', 'sci-fi', 'thriller']
  },
  'western-sci-fi': {
    keywords: ['space western', 'frontier', 'cowboy'],
    titles: ['firefly', 'cowboys & aliens', 'westworld'],
    genres: ['western', 'sci-fi', 'adventure']
  }
};

export const useGenreDetection = () => {
  const detectHybridGenres = useMemo(() => {
    return (candidate: ContentCandidate): string[] => {
      const title = candidate.title.toLowerCase();
      const description = candidate.description?.toLowerCase() || '';
      const genre = candidate.genre?.toLowerCase() || '';
      const apiGenres = candidate.api_data?.genres?.map((g: any) => g.name?.toLowerCase() || g.toLowerCase()) || [];
      
      const allText = `${title} ${description} ${genre} ${apiGenres.join(' ')}`;
      const detectedHybrids: string[] = [];

      // Check each hybrid pattern
      Object.entries(HYBRID_PATTERNS).forEach(([hybridType, pattern]) => {
        let score = 0;

        // Check title matches
        if (pattern.titles.some(t => title.includes(t))) {
          score += 3;
        }

        // Check keyword matches
        const keywordMatches = pattern.keywords.filter(keyword => 
          allText.includes(keyword)
        ).length;
        score += keywordMatches;

        // Check genre matches
        const genreMatches = pattern.genres.filter(g => 
          allText.includes(g)
        ).length;
        score += genreMatches;

        // If we have enough evidence, it's a hybrid
        if (score >= 2) {
          detectedHybrids.push(hybridType);
        }
      });

      return detectedHybrids;
    };
  }, []);

  const getParentGenres = useMemo(() => {
    return (hybridType: string): string[] => {
      const parts = hybridType.split('-');
      return parts.map(part => {
        // Map common abbreviations to full content types
        switch (part) {
          case 'sci-fi': return 'movie'; // Assuming sci-fi is primarily movies
          case 'horror': return 'movie';
          case 'comedy': return 'movie';
          case 'action': return 'movie';
          case 'drama': return 'movie';
          case 'western': return 'movie';
          case 'fantasy': return 'book'; // Fantasy often associated with books
          case 'noir': return 'movie';
          default: return 'other';
        }
      });
    };
  }, []);

  const isSignificantHybrid = useMemo(() => {
    return (hybridTypes: string[]): boolean => {
      // A work is a "significant hybrid" if it has at least one detected hybrid pattern
      return hybridTypes.length > 0;
    };
  }, []);

  return {
    detectHybridGenres,
    getParentGenres,
    isSignificantHybrid,
    HYBRID_PATTERNS
  };
};