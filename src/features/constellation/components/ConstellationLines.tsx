import React from 'react';
import { motion } from 'framer-motion';
import { useCelestialBodies } from '../../../hooks/useCelestialBodies';
import { useConstellations } from '../hooks/useConstellations';
import { useUniverseStore } from '../../../stores/universe';

interface ConstellationLinesProps {
  activeConstellationId?: string;
}

export const ConstellationLines: React.FC<ConstellationLinesProps> = ({
  activeConstellationId,
}) => {
  const { data: celestialBodies = [] } = useCelestialBodies();
  const { constellations, getConstellationLines } = useConstellations();
  const { cameraPosition } = useUniverseStore();

  // Calculate visibility based on camera distance
  const getLineVisibility = (constellationId: string) => {
    if (activeConstellationId === constellationId) return 1;
    
    // Lines become visible when camera is closer
    const distance = Math.sqrt(
      Math.pow(cameraPosition.x, 2) + 
      Math.pow(cameraPosition.y, 2) + 
      Math.pow(cameraPosition.z - 50, 2)
    );
    
    // Fade in when camera is closer than 150 units
    return Math.max(0, Math.min(0.4, (150 - distance) / 100));
  };

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      {constellations.map((constellation) => {
        const lines = getConstellationLines(constellation.id);
        const visibility = getLineVisibility(constellation.id);
        
        if (visibility <= 0) return null;

        return lines.map((line) => {
          const fromBody = celestialBodies.find(b => b.id === line.from);
          const toBody = celestialBodies.find(b => b.id === line.to);
          
          if (!fromBody || !toBody) return null;

          const isActive = activeConstellationId === constellation.id;

          return (
            <motion.line
              key={line.id}
              x1={`${50 + (fromBody.position_x * 0.5)}%`}
              y1={`${50 + (fromBody.position_y * 0.5)}%`}
              x2={`${50 + (toBody.position_x * 0.5)}%`}
              y2={`${50 + (toBody.position_y * 0.5)}%`}
              stroke="url(#constellation-gradient)"
              strokeWidth={isActive ? "2" : "1"}
              strokeDasharray={isActive ? "none" : "5,5"}
              initial={{ 
                opacity: 0,
                pathLength: 0 
              }}
              animate={{ 
                opacity: isActive ? 0.8 : visibility,
                pathLength: 1,
                strokeDashoffset: isActive ? 0 : [0, -10]
              }}
              transition={{
                opacity: { duration: 0.5 },
                pathLength: { duration: 2, delay: Math.random() * 0.5 },
                strokeDashoffset: { 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "linear" 
                }
              }}
            />
          );
        });
      })}
      
      {/* Gradient definition for constellation lines */}
      <defs>
        <linearGradient id="constellation-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.8)" />
          <stop offset="50%" stopColor="rgba(114, 114, 204, 0.6)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.8)" />
        </linearGradient>
      </defs>
    </svg>
  );
};