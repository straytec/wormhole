import React from 'react';
import { motion } from 'framer-motion';
import { GenreZone } from '../types';

interface GenreZoneVisualizationProps {
  zones: GenreZone[];
}

export const GenreZoneVisualization: React.FC<GenreZoneVisualizationProps> = ({
  zones,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {zones.map((zone) => (
        <motion.div
          key={zone.id}
          className="absolute rounded-full"
          style={{
            left: `${50 + (zone.centerPosition.x * 0.5)}%`,
            top: `${50 + (zone.centerPosition.y * 0.5)}%`,
            width: `${zone.radius * 2}px`,
            height: `${zone.radius * 2}px`,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, ${zone.color.primary}15 0%, ${zone.color.secondary}08 50%, transparent 100%)`,
            border: `1px solid ${zone.color.accent}20`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: Math.random() * 0.5 }}
        >
          {/* Zone boundary ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{
              borderColor: `${zone.color.accent}30`,
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Zone label */}
          <div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm"
            style={{
              color: zone.color.accent,
              backgroundColor: `${zone.color.primary}20`,
              border: `1px solid ${zone.color.accent}40`,
            }}
          >
            {zone.contentType.charAt(0).toUpperCase() + zone.contentType.slice(1)} Zone
          </div>

          {/* Ambient particles */}
          {Array.from({ length: Math.floor(zone.celestialBodies.length / 3) }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: zone.color.accent,
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
    </div>
  );
};