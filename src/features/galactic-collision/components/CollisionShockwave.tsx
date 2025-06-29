import React from 'react';
import { motion } from 'framer-motion';
import { ShockwaveEffect } from '../types';
import { useCelestialBodies } from '../../../hooks/useCelestialBodies';

interface CollisionShockwaveProps {
  shockwaves: ShockwaveEffect[];
}

export const CollisionShockwave: React.FC<CollisionShockwaveProps> = ({
  shockwaves,
}) => {
  const { data: celestialBodies = [] } = useCelestialBodies();

  return (
    <div className="absolute inset-0 pointer-events-none">
      {shockwaves.map((shockwave) => (
        <div key={shockwave.id}>
          {/* Main shockwave ring */}
          <motion.div
            className="absolute rounded-full border-2"
            style={{
              left: `${50 + (shockwave.originPosition.x * 0.5)}%`,
              top: `${50 + (shockwave.originPosition.y * 0.5)}%`,
              width: `${shockwave.currentRadius * 2}px`,
              height: `${shockwave.currentRadius * 2}px`,
              transform: 'translate(-50%, -50%)',
              borderColor: `rgba(255, 255, 255, ${shockwave.intensity * 0.8})`,
              boxShadow: `0 0 20px rgba(255, 255, 255, ${shockwave.intensity * 0.6})`,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ 
              scale: 1,
              opacity: [1, 0.6, 0],
            }}
            transition={{ 
              duration: shockwave.duration / 1000,
              ease: "easeOut"
            }}
          />

          {/* Secondary shockwave rings */}
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={`ring-${i}`}
              className="absolute rounded-full border"
              style={{
                left: `${50 + (shockwave.originPosition.x * 0.5)}%`,
                top: `${50 + (shockwave.originPosition.y * 0.5)}%`,
                width: `${shockwave.currentRadius * 2 * (0.7 + i * 0.15)}px`,
                height: `${shockwave.currentRadius * 2 * (0.7 + i * 0.15)}px`,
                transform: 'translate(-50%, -50%)',
                borderColor: `rgba(255, 255, 255, ${shockwave.intensity * 0.3})`,
              }}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ 
                scale: 1,
                opacity: [0.8, 0.3, 0],
              }}
              transition={{ 
                duration: shockwave.duration / 1000,
                delay: i * 0.2,
                ease: "easeOut"
              }}
            />
          ))}

          {/* Shimmer effect on affected celestial bodies */}
          {celestialBodies.map((body) => {
            const distance = Math.sqrt(
              Math.pow(body.position_x - shockwave.originPosition.x, 2) +
              Math.pow(body.position_y - shockwave.originPosition.y, 2)
            );

            // Check if body is within shockwave radius
            if (distance <= shockwave.currentRadius && distance > shockwave.currentRadius - 50) {
              return (
                <motion.div
                  key={`shimmer-${body.id}`}
                  className="absolute rounded-full"
                  style={{
                    left: `${50 + (body.position_x * 0.5)}%`,
                    top: `${50 + (body.position_y * 0.5)}%`,
                    width: '40px',
                    height: '40px',
                    transform: 'translate(-50%, -50%)',
                    background: `radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%)`,
                    pointerEvents: 'none',
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0.5, 2, 0.5],
                  }}
                  transition={{ 
                    duration: 1,
                    ease: "easeOut"
                  }}
                />
              );
            }
            return null;
          })}

          {/* Energy particles radiating outward */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i / 16) * 2 * Math.PI;
            const endX = shockwave.originPosition.x + Math.cos(angle) * shockwave.currentRadius;
            const endY = shockwave.originPosition.y + Math.sin(angle) * shockwave.currentRadius;

            return (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${50 + (shockwave.originPosition.x * 0.5)}%`,
                  top: `${50 + (shockwave.originPosition.y * 0.5)}%`,
                  boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
                }}
                animate={{
                  x: (endX - shockwave.originPosition.x) * 0.5,
                  y: (endY - shockwave.originPosition.y) * 0.5,
                  opacity: [1, 0.8, 0],
                  scale: [1, 1.5, 0],
                }}
                transition={{
                  duration: shockwave.duration / 1000,
                  ease: "easeOut",
                  delay: i * 0.05,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};