import React from 'react';
import { motion } from 'framer-motion';
import { CelestialBody } from '../../../hooks/useCelestialBodies';

interface EnhancedCosmicPhenomenaProps {
  celestialBodies: CelestialBody[];
  isZooming?: boolean;
}

export const EnhancedCosmicPhenomena: React.FC<EnhancedCosmicPhenomenaProps> = ({
  celestialBodies,
  isZooming = false,
}) => {
  // Group celestial bodies by content type and creator for enhanced visualizations
  const groupedBodies = React.useMemo(() => {
    const byType = celestialBodies.reduce((acc, body) => {
      if (!acc[body.content_type]) {
        acc[body.content_type] = [];
      }
      acc[body.content_type].push(body);
      return acc;
    }, {} as Record<string, CelestialBody[]>);

    const byCreator = celestialBodies.reduce((acc, body) => {
      const creator = body.creator_id || 'Unknown';
      if (!acc[creator]) {
        acc[creator] = [];
      }
      acc[creator].push(body);
      return acc;
    }, {} as Record<string, CelestialBody[]>);

    return { byType, byCreator };
  }, [celestialBodies]);

  // Create knowledge streams between related content
  const createKnowledgeStreams = () => {
    const streams = [];
    
    // Create streams between bodies of the same creator
    Object.entries(groupedBodies.byCreator).forEach(([creator, bodies]) => {
      if (bodies.length >= 2 && creator !== 'Unknown Creator') {
        for (let i = 0; i < bodies.length - 1; i++) {
          const body1 = bodies[i];
          const body2 = bodies[i + 1];
          
          streams.push({
            id: `creator-stream-${body1.id}-${body2.id}`,
            from: body1,
            to: body2,
            type: 'creator',
            strength: Math.min(bodies.length / 5, 1),
          });
        }
      }
    });

    // Create streams between bodies of the same type
    Object.entries(groupedBodies.byType).forEach(([type, bodies]) => {
      if (bodies.length >= 3) {
        // Connect nearby bodies of the same type
        for (let i = 0; i < bodies.length; i++) {
          for (let j = i + 1; j < Math.min(i + 3, bodies.length); j++) {
            const body1 = bodies[i];
            const body2 = bodies[j];
            
            const distance = Math.sqrt(
              Math.pow(body1.position_x - body2.position_x, 2) +
              Math.pow(body1.position_y - body2.position_y, 2)
            );
            
            if (distance < 100) {
              streams.push({
                id: `type-stream-${body1.id}-${body2.id}`,
                from: body1,
                to: body2,
                type: 'content',
                strength: Math.max(0.2, 0.8 - (distance / 100)),
              });
            }
          }
        }
      }
    });

    return streams;
  };

  const knowledgeStreams = createKnowledgeStreams();

  // Create content type zones with enhanced visuals
  const createContentZones = () => {
    const zones = {
      movie: { 
        center: { x: 0, y: 0 }, 
        color: 'from-blue-500/15 via-blue-400/10 to-transparent',
        particles: 'bg-blue-400/30'
      },
      book: { 
        center: { x: 110, y: 0 }, 
        color: 'from-yellow-500/15 via-orange-400/10 to-transparent',
        particles: 'bg-yellow-400/30'
      },
      album: { 
        center: { x: -110, y: 0 }, 
        color: 'from-purple-500/15 via-pink-400/10 to-transparent',
        particles: 'bg-purple-400/30'
      },
      game: { 
        center: { x: 0, y: 70 }, 
        color: 'from-green-500/15 via-emerald-400/10 to-transparent',
        particles: 'bg-green-400/30'
      },
      studying: { 
        center: { x: 110, y: 70 }, 
        color: 'from-cyan-500/15 via-blue-400/10 to-transparent',
        particles: 'bg-cyan-400/30'
      },
      work: { 
        center: { x: -110, y: 70 }, 
        color: 'from-orange-500/15 via-red-400/10 to-transparent',
        particles: 'bg-orange-400/30'
      },
      other: { 
        center: { x: 0, y: -70 }, 
        color: 'from-gray-500/15 via-gray-400/10 to-transparent',
        particles: 'bg-gray-400/30'
      },
    };

    return Object.entries(groupedBodies.byType).map(([type, bodies]) => {
      if (bodies.length < 2) return null;
      
      const zone = zones[type as keyof typeof zones];
      if (!zone) return null;

      return {
        type,
        zone,
        bodies,
        intensity: Math.min(bodies.length / 10, 1),
      };
    }).filter(Boolean);
  };

  const contentZones = createContentZones();

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Enhanced Content Type Zones */}
      {!isZooming && contentZones.map((zoneData) => (
        <motion.div
          key={`zone-${zoneData.type}`}
          className={`absolute rounded-full bg-gradient-radial ${zoneData.zone.color}`}
          style={{
            left: `${50 + (zoneData.zone.center.x * 0.5)}%`,
            top: `${50 + (zoneData.zone.center.y * 0.5)}%`,
            width: `${200 + (zoneData.intensity * 100)}px`,
            height: `${200 + (zoneData.intensity * 100)}px`,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: zoneData.intensity * 0.6, 
            scale: 1,
          }}
          transition={{ duration: 2, delay: Math.random() }}
        >
          {/* Zone particles */}
          {Array.from({ length: Math.floor(zoneData.intensity * 8) }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 ${zoneData.zone.particles} rounded-full`}
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1.2, 0.5],
                x: [0, Math.random() * 20 - 10],
                y: [0, Math.random() * 20 - 10],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>
      ))}

      {/* Knowledge Streams */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          {/* Enhanced gradients for different stream types */}
          <linearGradient id="creator-stream" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.6)" />
            <stop offset="50%" stopColor="rgba(139, 92, 246, 0.8)" />
            <stop offset="100%" stopColor="rgba(124, 58, 237, 0.6)" />
          </linearGradient>
          
          <linearGradient id="content-stream" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
            <stop offset="50%" stopColor="rgba(147, 197, 253, 0.6)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.4)" />
          </linearGradient>
          
          {/* Enhanced glow filters */}
          <filter id="stream-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {knowledgeStreams.map((stream) => (
          <g key={stream.id}>
            {/* Main stream line */}
            <motion.line
              x1={`${50 + (stream.from.position_x * 0.5)}%`}
              y1={`${50 + (stream.from.position_y * 0.5)}%`}
              x2={`${50 + (stream.to.position_x * 0.5)}%`}
              y2={`${50 + (stream.to.position_y * 0.5)}%`}
              stroke={stream.type === 'creator' ? 'url(#creator-stream)' : 'url(#content-stream)'}
              strokeWidth={stream.strength * 3}
              filter="url(#stream-glow)"
              initial={{ 
                pathLength: 0,
                opacity: 0 
              }}
              animate={{ 
                pathLength: 1,
                opacity: stream.strength * 0.8,
              }}
              transition={{
                pathLength: { 
                  duration: 2, 
                  delay: Math.random() * 2,
                  ease: "easeInOut" 
                },
                opacity: { 
                  duration: 1.5, 
                  delay: Math.random() * 2 
                }
              }}
            />
            
            {/* Flowing energy particles */}
            <motion.circle
              r={stream.strength * 2 + 1}
              fill={stream.type === 'creator' ? 'rgba(168, 85, 247, 0.8)' : 'rgba(59, 130, 246, 0.8)'}
              filter="url(#stream-glow)"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, stream.strength, stream.strength, 0],
              }}
              transition={{
                duration: 3,
                delay: 1 + Math.random(),
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              <animateMotion
                dur="3s"
                repeatCount="indefinite"
                begin={`${1 + Math.random()}s`}
              >
                <mpath href={`#stream-path-${stream.id}`} />
              </animateMotion>
            </motion.circle>
            
            {/* Hidden path for animation */}
            <path
              id={`stream-path-${stream.id}`}
              d={`M ${50 + (stream.from.position_x * 0.5)}% ${50 + (stream.from.position_y * 0.5)}% L ${50 + (stream.to.position_x * 0.5)}% ${50 + (stream.to.position_y * 0.5)}%`}
              fill="none"
              stroke="none"
            />
          </g>
        ))}
      </svg>

      {/* Enhanced Cosmic Dust and Ambient Effects */}
      {!isZooming && Array.from({ length: isZooming ? 10 : 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-stellar-300/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 200 - 100],
            opacity: [0.1, 0.6, 0.1],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 15 + Math.random() * 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Knowledge Density Visualization */}
      {celestialBodies.length > 10 && (
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-cosmic-500/5 via-transparent to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3 }}
        />
      )}
    </div>
  );
};