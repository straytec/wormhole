import React from 'react';
import { motion } from 'framer-motion';
import { CelestialBody } from '../../../hooks/useCelestialBodies';

interface CosmicPhenomenaProps {
  celestialBodies: CelestialBody[];
}

export const CosmicPhenomena: React.FC<CosmicPhenomenaProps> = ({
  celestialBodies,
}) => {
  // Group celestial bodies by content type for visual phenomena
  const groupedBodies = celestialBodies.reduce((acc, body) => {
    if (!acc[body.content_type]) {
      acc[body.content_type] = [];
    }
    acc[body.content_type].push(body);
    return acc;
  }, {} as Record<string, CelestialBody[]>);

  // Create constellation lines between related content
  const createConstellationLines = (bodies: CelestialBody[]) => {
    if (bodies.length < 2) return [];
    
    const lines = [];
    for (let i = 0; i < bodies.length - 1; i++) {
      for (let j = i + 1; j < Math.min(i + 3, bodies.length); j++) {
        const body1 = bodies[i];
        const body2 = bodies[j];
        
        // Calculate distance
        const distance = Math.sqrt(
          Math.pow(body1.position_x - body2.position_x, 2) +
          Math.pow(body1.position_y - body2.position_y, 2)
        );
        
        // Only connect nearby bodies
        if (distance < 80) {
          lines.push({
            id: `${body1.id}-${body2.id}`,
            x1: 50 + (body1.position_x * 0.5),
            y1: 50 + (body1.position_y * 0.5),
            x2: 50 + (body2.position_x * 0.5),
            y2: 50 + (body2.position_y * 0.5),
            opacity: Math.max(0.1, 0.3 - (distance / 200)),
          });
        }
      }
    }
    return lines;
  };

  // Create zone backgrounds for content types
  const createZoneBackground = (contentType: string, bodies: CelestialBody[]) => {
    if (bodies.length < 3) return null;

    const zones = {
      movie: { x: 50, y: 50, color: 'from-blue-500/10 to-green-500/10' },
      book: { x: 80, y: 50, color: 'from-yellow-500/10 to-orange-500/10' },
      album: { x: 20, y: 50, color: 'from-pink-500/10 to-purple-500/10' },
      game: { x: 50, y: 30, color: 'from-red-500/10 to-blue-500/10' },
      studying: { x: 80, y: 30, color: 'from-green-500/10 to-blue-500/10' },
      work: { x: 20, y: 30, color: 'from-orange-500/10 to-red-500/10' },
      other: { x: 50, y: 70, color: 'from-gray-500/10 to-white/10' },
    };

    const zone = zones[contentType as keyof typeof zones];
    if (!zone) return null;

    return (
      <motion.div
        key={`zone-${contentType}`}
        className={`absolute rounded-full bg-gradient-radial ${zone.color} blur-xl`}
        style={{
          left: `${zone.x}%`,
          top: `${zone.y}%`,
          width: '200px',
          height: '200px',
          transform: 'translate(-50%, -50%)',
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: Math.random() }}
      />
    );
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Zone Backgrounds */}
      {Object.entries(groupedBodies).map(([contentType, bodies]) =>
        createZoneBackground(contentType, bodies)
      )}

      {/* Constellation Lines */}
      <svg className="absolute inset-0 w-full h-full">
        {Object.entries(groupedBodies).map(([contentType, bodies]) => {
          const lines = createConstellationLines(bodies);
          return lines.map((line) => (
            <motion.line
              key={line.id}
              x1={`${line.x1}%`}
              y1={`${line.y1}%`}
              x2={`${line.x2}%`}
              y2={`${line.y2}%`}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="1"
              opacity={line.opacity}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: line.opacity }}
              transition={{ duration: 2, delay: Math.random() * 2 }}
            />
          ));
        })}
      </svg>

      {/* Cosmic Dust Trails */}
      {celestialBodies.filter(body => body.has_impact).map((body) => (
        <motion.div
          key={`trail-${body.id}`}
          className="absolute"
          style={{
            left: `${50 + (body.position_x * 0.5)}%`,
            top: `${50 + (body.position_y * 0.5)}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Cosmic trail effect for high-impact bodies */}
          <motion.div
            className="absolute w-32 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              transform: `rotate(${Math.atan2(body.position_y, body.position_x) * 180 / Math.PI}deg)`,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scaleX: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        </motion.div>
      ))}

      {/* Singularity Effects */}
      {celestialBodies.filter(body => body.is_singularity).map((body) => (
        <motion.div
          key={`singularity-${body.id}`}
          className="absolute"
          style={{
            left: `${50 + (body.position_x * 0.5)}%`,
            top: `${50 + (body.position_y * 0.5)}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Gravitational lensing effect */}
          <motion.div
            className="absolute w-24 h-24 border border-purple-400/30 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute w-16 h-16 border border-purple-400/50 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: 0.5,
            }}
          />
          
          {/* New Singularity Birth Effect */}
          <motion.div
            className="absolute w-32 h-32 border-2 border-purple-300 rounded-full"
            initial={{ scale: 0, opacity: 1, rotate: 0 }}
            animate={{ 
              scale: [0, 2, 0], 
              opacity: [1, 0.3, 0],
              rotate: 360
            }}
            transition={{
              duration: 3,
              delay: 1,
              ease: "easeOut"
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};