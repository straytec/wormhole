import { useState, useCallback } from 'react';
import { useConstellations } from './useConstellations';
import { useUniverseStore } from '../../../stores/universe';
import { Constellation } from '../types';

export const useConstellationInteraction = () => {
  const [activeConstellationId, setActiveConstellationId] = useState<string | null>(null);
  const [selectedConstellation, setSelectedConstellation] = useState<Constellation | null>(null);
  const [showAtlas, setShowAtlas] = useState(false);
  
  const { getConstellationForBody } = useConstellations();
  const { setTargetPosition, setIsAnimating, setViewMode, focusOnBody } = useUniverseStore();

  const handleBodyClick = useCallback((bodyId: string, celestialBodies: any[]) => {
    const constellation = getConstellationForBody(bodyId);
    
    if (constellation) {
      setActiveConstellationId(constellation.id);
      setSelectedConstellation(constellation);
      
      // Focus on the clicked body
      focusOnBody(bodyId, celestialBodies);
    } else {
      setActiveConstellationId(null);
      setSelectedConstellation(null);
    }
  }, [getConstellationForBody, focusOnBody]);

  const handleCenterConstellation = useCallback((constellation: Constellation) => {
    setTargetPosition({
      x: constellation.centerPosition.x,
      y: constellation.centerPosition.y,
      z: 60, // Zoom out to see the whole constellation
    });
    setIsAnimating(true);
    setViewMode('focused');
  }, [setTargetPosition, setIsAnimating, setViewMode]);

  const handleNavigateToBody = useCallback((bodyId: string, celestialBodies: any[]) => {
    focusOnBody(bodyId, celestialBodies);
  }, [focusOnBody]);

  const handleClosePanel = useCallback(() => {
    setActiveConstellationId(null);
    setSelectedConstellation(null);
  }, []);

  const handleOpenAtlas = useCallback(() => {
    setShowAtlas(true);
  }, []);

  const handleCloseAtlas = useCallback(() => {
    setShowAtlas(false);
  }, []);

  const handleNavigateToConstellation = useCallback((constellation: Constellation) => {
    handleCenterConstellation(constellation);
    setActiveConstellationId(constellation.id);
    setSelectedConstellation(constellation);
  }, [handleCenterConstellation]);

  return {
    activeConstellationId,
    selectedConstellation,
    showAtlas,
    handleBodyClick,
    handleCenterConstellation,
    handleNavigateToBody,
    handleClosePanel,
    handleOpenAtlas,
    handleCloseAtlas,
    handleNavigateToConstellation,
  };
};