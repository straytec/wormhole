import React from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-void-950 via-cosmic-900 to-void-950 overflow-hidden">
      {/* Cosmic Background */}
      <div className="fixed inset-0 z-0">
        {/* Nebula Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-cosmic-900/20 via-stellar-900/10 to-nebula-900/20" />
        
        {/* Stars */}
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
        
        {/* Cosmic Birth Flash Effect */}
        <motion.div
          className="fixed inset-0 bg-gradient-radial from-white/20 via-transparent to-transparent pointer-events-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0, scale: 0 }}
          id="cosmic-birth-flash"
        />
      </div>
    </div>
  );
};