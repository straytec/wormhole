import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Dices } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useUniverseStore } from '../../../stores/universe';
import { useCelestialBodies } from '../../../hooks/useCelestialBodies';
import { CelestialBodyDetails } from './CelestialBodyDetails';
import { UniverseControls } from './UniverseControls';
import { CosmicPhenomena } from './CosmicPhenomena';
import { useCameraAnimation } from '../../../hooks/useCameraAnimation';
import { useDragging } from '../../../hooks/useDragging';
import { ConstellationLines } from '../../constellation/components/ConstellationLines';
import { ConstellationBirthEffect } from '../../constellation/components/ConstellationBirthEffect';
import { ConstellationInfoPanel } from '../../constellation/components/ConstellationInfoPanel';
import { ConstellationAtlas } from '../../constellation/components/ConstellationAtlas';
import { useConstellationInteraction } from '../../constellation/hooks/useConstellationInteraction';

export const UniverseCanvas: React.FC = () => {
  const { 
    setAddingContent, 
    discover, 
    selectedBody, 
    setSelectedBody,
    cameraPosition,
    setCameraPosition,
    targetPosition,
    setTargetPosition,
    isAnimating,
    setIsAnimating,
    viewMode,
    setViewMode,
    focusOnBody,
    resetView
  } = useUniverseStore();
  const { data: celestialBodies = [], isLoading } = useCelestialBodies();
  
  // Constellation interaction
  const {
    activeConstellationId,
    selectedConstellation,
    showAtlas,
    handleBodyClick: handleConstellationBodyClick,
    handleCenterConstellation,
    handleNavigateToBody,
    handleClosePanel,
    handleOpenAtlas,
    handleCloseAtlas,
    handleNavigateToConstellation,
  } = useConstellationInteraction();
  
  // Use camera animation hook
  const animatedPosition = useCameraAnimation(cameraPosition, targetPosition, isAnimating, setIsAnimating);
  
  // Use dragging hook
  const {
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useDragging(
    animatedPosition,
    (position) => {
      setCameraPosition(position);
      setTargetPosition(position);
    },
    isAnimating
  );

  // Add global mouse/touch event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      // Change cursor to grabbing
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const handleBodyClick = (bodyId: string) => {
    // Handle both regular focus and constellation interaction
    handleConstellationBodyClick(bodyId, celestialBodies);
  };

  const handleZoomToContent = (contentType: string) => {
    const zones = {
      movie: { x: 0, y: 0, z: 50 },
      book: { x: 110, y: 0, z: 50 },
      album: { x: -110, y: 0, z: 50 },
      game: { x: 0, y: 70, z: 50 },
      studying: { x: 110, y: 70, z: 50 },
      work: { x: -110, y: 70, z: 50 },
      other: { x: 0, y: -70, z: 50 },
    };
    
    const zone = zones[contentType as keyof typeof zones];
    if (zone) {
      setTargetPosition(zone);
      setIsAnimating(true);
      setViewMode('zone');
    }
  };

  return (
    <div 
      className={`relative w-full h-screen overflow-hidden ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Universe Background */}
      <div className="absolute inset-0">
        {/* Deep space gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-cosmic-900/30 via-void-950 to-void-950" />
        
        {/* Animated cosmic dust */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-stellar-300 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Universe Content Area */}
      <div 
        className="relative z-10 w-full h-full flex items-center justify-center"
        style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
      >
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-cosmic-300 text-lg">Loading your universe...</div>
          </motion.div>
        ) : celestialBodies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <h2 className="text-4xl font-light text-white mb-4">
              Your Universe Awaits
            </h2>
            <p className="text-cosmic-300 mb-8 text-lg">
              Add your first piece of knowledge to begin your cosmic journey
            </p>
            
            <Button
              variant="cosmic"
              size="lg"
              onClick={() => setAddingContent(true)}
              className="shadow-2xl"
            >
              <Plus className="w-6 h-6 mr-2" />
              Add to Universe
            </Button>
          </motion.div>
        ) : (
          // Render celestial bodies
          <div 
            className="absolute inset-0"
            style={{
              transform: `translate(${-animatedPosition.x * 2}px, ${-animatedPosition.y * 2}px) scale(${100 / animatedPosition.z})`,
              transition: isAnimating ? 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            }}
          >
            {/* Cosmic Phenomena (background groupings) */}
            <CosmicPhenomena celestialBodies={celestialBodies} />
            
            {/* Constellation Lines */}
            <ConstellationLines activeConstellationId={activeConstellationId} />
            
            {/* Individual Celestial Bodies */}
            {celestialBodies.map((body) => (
              <motion.div
                key={body.id}
                className="absolute cursor-pointer"
                style={{
                  left: `${50 + (body.position_x * 0.5)}%`,
                  top: `${50 + (body.position_y * 0.5)}%`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: isDragging ? 'none' : 'auto',
                }}
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  rotateZ: 0,
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotateZ: 360,
                }}
                transition={{ 
                  duration: 1.5,
                  delay: Math.random() * 0.5,
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  rotateZ: {
                    duration: 2,
                    ease: "easeOut"
                  }
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <div
                  className={`
                    rounded-full transition-all duration-300 relative group
                    ${selectedBody === body.id ? 'ring-4 ring-stellar-400 ring-opacity-60' : ''}
                    ${body.is_singularity
                      ? 'bg-gradient-to-r from-purple-900 to-black border-2 border-purple-400' 
                      : body.visual_attributes.type === 'star'
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                      : body.visual_attributes.type === 'planet'
                      ? 'bg-gradient-to-r from-blue-500 to-green-500'
                      : body.visual_attributes.type === 'nebula'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500'
                      : 'bg-gradient-to-r from-gray-400 to-gray-600'
                    }
                  `}
                  style={{
                    width: `${Math.max(body.visual_attributes.size * 30, 20)}px`,
                    height: `${Math.max(body.visual_attributes.size * 30, 20)}px`,
                    opacity: body.visual_attributes.brightness,
                    boxShadow: `0 0 ${body.visual_attributes.size * 15}px rgba(255, 255, 255, ${body.visual_attributes.brightness * 0.5})`,
                  }}
                  onClick={() => handleBodyClick(body.id)}
                  title={`${body.title} (${body.content_type})`}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  {/* Birth Animation Ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 3, opacity: 0 }}
                    transition={{ 
                      duration: 2,
                      delay: 0.5,
                      ease: "easeOut"
                    }}
                  />
                  
                  {/* Sparkle Effects */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        left: '50%',
                        top: '50%',
                      }}
                      initial={{ 
                        scale: 0,
                        x: 0,
                        y: 0,
                        opacity: 1
                      }}
                      animate={{ 
                        scale: [0, 1, 0],
                        x: Math.cos(i * 45 * Math.PI / 180) * 40,
                        y: Math.sin(i * 45 * Math.PI / 180) * 40,
                        opacity: [1, 1, 0]
                      }}
                      transition={{ 
                        duration: 1.5,
                        delay: 0.8 + (i * 0.1),
                        ease: "easeOut"
                      }}
                    />
                  ))}
                  
                  {body.has_impact && (
                    <div className="absolute inset-0 rounded-full animate-pulse bg-white opacity-20" />
                  )}
                  
                  {/* Selection indicator */}
                  {selectedBody === body.id && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-stellar-400"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.8, 0.3, 0.8],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  )}
                  
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-cosmic-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {body.title}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Universe Controls */}
      <UniverseControls 
        celestialBodies={celestialBodies}
        onZoomToContent={handleZoomToContent}
        onOpenAtlas={handleOpenAtlas}
      />

      {/* Premium Portal (subtle) */}
      <motion.div
        className="absolute top-8 left-8"
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      >
        <div className="w-4 h-4 bg-gradient-to-r from-stellar-400 to-cosmic-400 rounded-full shadow-lg cursor-pointer" />
      </motion.div>

      {/* Celestial Body Details Modal */}
      {selectedBody && (
        <CelestialBodyDetails
          bodyId={selectedBody}
          onClose={() => setSelectedBody(null)}
        />
      )}

      {/* Constellation Info Panel */}
      <ConstellationInfoPanel
        constellation={selectedConstellation}
        onClose={handleClosePanel}
        onCenterConstellation={handleCenterConstellation}
        onNavigateToBody={(bodyId) => handleNavigateToBody(bodyId, celestialBodies)}
      />

      {/* Constellation Atlas */}
      <ConstellationAtlas
        isOpen={showAtlas}
        onClose={handleCloseAtlas}
        onNavigateToConstellation={handleNavigateToConstellation}
      />

      {/* Constellation Birth Effect */}
      <ConstellationBirthEffect />
    </div>
  );
};