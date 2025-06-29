import { useMemo } from 'react';
import { useCelestialBodies } from '../../../hooks/useCelestialBodies';
import { Constellation } from '../types';

const MINIMUM_WORKS_FOR_CONSTELLATION = 3;

export const useConstellations = () => {
  const { data: celestialBodies = [] } = useCelestialBodies();

  const constellations = useMemo(() => {
    // Group celestial bodies by creator
    const creatorGroups = celestialBodies.reduce((acc, body) => {
      const creator = body.creator_id || 'Unknown Creator';
      if (!acc[creator]) {
        acc[creator] = [];
      }
      acc[creator].push(body);
      return acc;
    }, {} as Record<string, typeof celestialBodies>);

    // Create constellations for creators with enough works
    const constellations: Constellation[] = [];
    
    Object.entries(creatorGroups).forEach(([creator, bodies]) => {
      if (bodies.length >= MINIMUM_WORKS_FOR_CONSTELLATION && creator !== 'Unknown Creator') {
        // Calculate center position
        const centerX = bodies.reduce((sum, body) => sum + body.position_x, 0) / bodies.length;
        const centerY = bodies.reduce((sum, body) => sum + body.position_y, 0) / bodies.length;
        const centerZ = bodies.reduce((sum, body) => sum + body.position_z, 0) / bodies.length;

        // Generate constellation name
        const constellationName = `The ${creator} Constellation`;

        constellations.push({
          id: `constellation-${creator.toLowerCase().replace(/\s+/g, '-')}`,
          creator,
          name: constellationName,
          celestialBodies: bodies.map(b => b.id),
          isDiscovered: true, // All constellations are discovered when they meet the criteria
          discoveredAt: bodies[bodies.length - 1].created_at, // Use the latest addition
          centerPosition: {
            x: centerX,
            y: centerY,
            z: centerZ,
          },
        });
      }
    });

    return constellations;
  }, [celestialBodies]);

  const getConstellationForBody = (bodyId: string) => {
    return constellations.find(constellation => 
      constellation.celestialBodies.includes(bodyId)
    );
  };

  const getConstellationLines = (constellationId: string) => {
    const constellation = constellations.find(c => c.id === constellationId);
    if (!constellation || constellation.celestialBodies.length < 2) return [];

    const bodies = constellation.celestialBodies
      .map(id => celestialBodies.find(b => b.id === id))
      .filter(Boolean);

    const lines = [];
    
    // Create a connected path through all bodies (not fully connected graph)
    for (let i = 0; i < bodies.length - 1; i++) {
      const currentBody = bodies[i];
      const nextBody = bodies[i + 1];
      
      if (currentBody && nextBody) {
        lines.push({
          id: `line-${currentBody.id}-${nextBody.id}`,
          from: currentBody.id,
          to: nextBody.id,
          opacity: 0.3,
          isActive: false,
        });
      }
    }

    // Connect the last body back to the first to complete the constellation
    if (bodies.length > 2) {
      const firstBody = bodies[0];
      const lastBody = bodies[bodies.length - 1];
      
      if (firstBody && lastBody) {
        lines.push({
          id: `line-${lastBody.id}-${firstBody.id}`,
          from: lastBody.id,
          to: firstBody.id,
          opacity: 0.3,
          isActive: false,
        });
      }
    }

    return lines;
  };

  return {
    constellations,
    getConstellationForBody,
    getConstellationLines,
  };
};