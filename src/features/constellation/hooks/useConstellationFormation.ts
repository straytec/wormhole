import { useEffect, useState } from 'react';
import { useCelestialBodies } from '../../../hooks/useCelestialBodies';
import { useConstellations } from './useConstellations';

const CONSTELLATION_THRESHOLD = 5;

interface ConstellationFormationEvent {
  constellationId: string;
  creator: string;
  triggeringBodyId: string;
  timestamp: string;
}

export const useConstellationFormation = () => {
  const { data: celestialBodies = [] } = useCelestialBodies();
  const { constellations } = useConstellations();
  const [formationEvent, setFormationEvent] = useState<ConstellationFormationEvent | null>(null);
  const [previousBodyCount, setPreviousBodyCount] = useState(0);

  useEffect(() => {
    // Only check for new formations when bodies are added
    if (celestialBodies.length <= previousBodyCount) {
      setPreviousBodyCount(celestialBodies.length);
      return;
    }

    // Get the most recently added body
    const sortedBodies = [...celestialBodies].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const newestBody = sortedBodies[0];

    if (!newestBody || !newestBody.creator_id || newestBody.creator_id === 'Unknown Creator') {
      setPreviousBodyCount(celestialBodies.length);
      return;
    }

    // Count works by this creator
    const creatorWorks = celestialBodies.filter(body => 
      body.creator_id === newestBody.creator_id && 
      body.creator_id !== 'Unknown Creator'
    );

    // Check if we just hit the threshold for the first time
    if (creatorWorks.length === CONSTELLATION_THRESHOLD) {
      // Verify this is a new constellation (not already formed)
      const existingConstellation = constellations.find(c => c.creator === newestBody.creator_id);
      
      if (!existingConstellation) {
        // Trigger constellation formation!
        const event: ConstellationFormationEvent = {
          constellationId: `constellation-${newestBody.creator_id.toLowerCase().replace(/\s+/g, '-')}`,
          creator: newestBody.creator_id,
          triggeringBodyId: newestBody.id,
          timestamp: new Date().toISOString(),
        };

        setFormationEvent(event);

        // Clear the event after the animation completes
        setTimeout(() => {
          setFormationEvent(null);
        }, 6000);
      }
    }

    setPreviousBodyCount(celestialBodies.length);
  }, [celestialBodies, constellations, previousBodyCount]);

  const clearFormationEvent = () => {
    setFormationEvent(null);
  };

  return {
    formationEvent,
    clearFormationEvent,
    threshold: CONSTELLATION_THRESHOLD,
  };
};