import React from 'react';
import { motion } from 'framer-motion';
import { HybridZone } from '../types';

interface HybridZoneVisualizationProps {
  zones: HybridZone[];
}

export const HybridZoneVisualization: React.FC<HybridZoneVisualizationProps> = ({
  zones,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {zones.map((zone) => (
        <motion.div
          key={zone.id}
          className="absolute"
          style={{
            left: `${50 + (zone.centerPosition.x * 0.5)}%`,
            top: `${50 + (zone.centerPosition.y * 0.5)}%`,
            width: `${zone.radius * 2}px`,
            height: `${zone.radius * 2}px`,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 3, delay: 0.5 }}
        >
          {/* Turbulent collision zone background */}
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: `conic-gradient(from 0deg, ${zone.colors.primary}20, ${zone.colors.secondary}20, ${zone.colors.primary}20)`,
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* Turbulence layers */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(ellipse 60% 40% at 30% 70%, ${zone.colors.turbulence}15 0%, transparent 50%), radial-gradient(ellipse 40% 60% at 70% 30%, ${zone.colors.secondary}20 0%, transparent 50%)`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [-5, 5, -5],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Star-forming region effects */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${zone.colors.turbulence}10 0%, transparent 70%)`,
            }}
            animate={{
              scale: [0.8, 1.3, 0.8],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Collision zone boundary */}
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{
              borderColor: `${zone.colors.turbulence}40`,
              borderStyle: 'dashed',
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 15, repeat: Infinity, ease: "linear" },
              scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            }}
          />

          {/* Young star formation */}
          {Array.from({ length: Math.floor(zone.intensity * 12) }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: zone.colors.turbulence,
                left: `${30 + Math.random() * 40}%`,
                top: `${30 + Math.random() * 40}%`,
                boxShadow: `0 0 8px ${zone.colors.turbulence}`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}

          {/* Dust clouds */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={`dust-${i}`}
              className="absolute rounded-full opacity-30"
              style={{
                width: `${20 + Math.random() * 30}%`,
                height: `${20 + Math.random() * 30}%`,
                left: `${Math.random() * 80}%`,
                top: `${Math.random() * 80}%`,
                background: `radial-gradient(circle, ${i % 2 === 0 ? zone.colors.primary : zone.colors.secondary}30 0%, transparent 70%)`,
              }}
              animate={{
                x: [0, Math.random() * 40 - 20],
                y: [0, Math.random() * 40 - 20],
                scale: [0.8, 1.2, 0.8],
                rotate: [0, 360],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}

          {/* Zone name label */}
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm border"
            style={{
              color: zone.colors.turbulence,
              backgroundColor: `${zone.colors.primary}25`,
              borderColor: `${zone.colors.turbulence}50`,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
          >
            {zone.name}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};