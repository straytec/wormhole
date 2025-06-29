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
    
    // Fade in when camera is closer than 200 units (increased visibility range)
    return Math.max(0, Math.min(0.7, (200 - distance) / 120));
  };

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      {constellations.map((constellation) => {
        const lines = getConstellationLines(constellation.id);
        const visibility = getLineVisibility(constellation.id);
        
        if (visibility <= 0) return null;

        return lines.map((line, lineIndex) => {
          const fromBody = celestialBodies.find(b => b.id === line.from);
          const toBody = celestialBodies.find(b => b.id === line.to);
          
          if (!fromBody || !toBody) return null;

          const isActive = activeConstellationId === constellation.id;
          const lineId = `${line.id}-${constellation.id}`;

          return (
            <g key={lineId}>
              {/* Main constellation line with enhanced glow */}
              <motion.line
                x1={`${50 + (fromBody.position_x * 0.5)}%`}
                y1={`${50 + (fromBody.position_y * 0.5)}%`}
                x2={`${50 + (toBody.position_x * 0.5)}%`}
                y2={`${50 + (toBody.position_y * 0.5)}%`}
                stroke={`url(#constellation-gradient-${constellation.id})`}
                strokeWidth={isActive ? "4" : "2"}
                filter={`url(#constellation-glow-${constellation.id})`}
                initial={{ 
                  opacity: 0,
                  pathLength: 0 
                }}
                animate={{ 
                  opacity: isActive ? 1 : visibility * 0.8,
                  pathLength: 1,
                }}
                transition={{
                  opacity: { duration: 0.8, ease: "easeOut" },
                  pathLength: { 
                    duration: 2.5, 
                    delay: lineIndex * 0.3,
                    ease: "easeInOut"
                  }
                }}
              />
              
              {/* Flowing energy particles along the line */}
              {isActive && (
                <motion.circle
                  r="3"
                  fill="rgba(255, 255, 255, 0.9)"
                  filter={`url(#particle-glow-${constellation.id})`}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    delay: lineIndex * 0.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    begin={`${lineIndex * 0.5}s`}
                  >
                    <mpath href={`#constellation-path-${lineId}`} />
                  </animateMotion>
                </motion.circle>
              )}
              
              {/* Hidden path for particle animation */}
              <path
                id={`constellation-path-${lineId}`}
                d={`M ${50 + (fromBody.position_x * 0.5)}% ${50 + (fromBody.position_y * 0.5)}% L ${50 + (toBody.position_x * 0.5)}% ${50 + (toBody.position_y * 0.5)}%`}
                fill="none"
                stroke="none"
              />
            </g>
          );
        });
      })}
      
      {/* Enhanced gradient and glow definitions */}
      <defs>
        {constellations.map((constellation) => (
          <g key={`defs-${constellation.id}`}>
            {/* Bright constellation gradient */}
            <linearGradient 
              id={`constellation-gradient-${constellation.id}`} 
              x1="0%" y1="0%" x2="100%" y2="100%"
            >
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)" />
              <stop offset="25%" stopColor="rgba(176, 126, 200, 0.9)" />
              <stop offset="50%" stopColor="rgba(114, 114, 204, 0.95)" />
              <stop offset="75%" stopColor="rgba(176, 126, 200, 0.9)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.95)" />
            </linearGradient>
            
            {/* Enhanced glow filter */}
            <filter id={`constellation-glow-${constellation.id}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            {/* Particle glow filter */}
            <filter id={`particle-glow-${constellation.id}`} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </g>
        ))}
        
        {/* Shimmering animation gradient */}
        <linearGradient id="shimmer-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.1)" />
          <stop offset="50%" stopColor="rgba(255, 255, 255, 0.8)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.1)" />
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            values="-100 0;100 0;-100 0"
            dur="4s"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
    </svg>
  );
};