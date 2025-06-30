import { useState, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
  z: number;
}

export const useCameraAnimation = (
  currentPosition: Position,
  targetPosition: Position,
  isAnimating: boolean,
  setIsAnimating: (animating: boolean) => void
) => {
  const [animatedPosition, setAnimatedPosition] = useState(currentPosition);
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    if (!isAnimating) {
      // Only update if positions are different to avoid unnecessary re-renders
      if (animatedPosition.x !== currentPosition.x || 
          animatedPosition.y !== currentPosition.y || 
          animatedPosition.z !== currentPosition.z) {
        setAnimatedPosition(currentPosition);
      }
      return;
    }

    // Detect if this is a zoom operation (z-axis change)
    const isZoomOperation = Math.abs(targetPosition.z - animatedPosition.z) > 5;
    setIsZooming(isZoomOperation);

    // Start animation
    const startTime = Date.now();
    const duration = isZoomOperation ? 1000 : 1500; // Faster zoom, normal pan
    const startPosition = { ...animatedPosition };
    
    // Reduce frame rate during zoom operations for better performance
    const frameRate = isZoomOperation ? 30 : 60; // 30fps for zoom, 60fps for pan
    const frameInterval = 1000 / frameRate;
    let lastFrameTime = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smoother easing function (ease-in-out-cubic)
      const easeInOutCubic = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // Throttle frame updates during zoom operations
      const now = Date.now();
      if (isZoomOperation && now - lastFrameTime < frameInterval) {
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
        return;
      }
      lastFrameTime = now;

      const newPosition = {
        x: startPosition.x + (targetPosition.x - startPosition.x) * easeInOutCubic,
        y: startPosition.y + (targetPosition.y - startPosition.y) * easeInOutCubic,
        z: startPosition.z + (targetPosition.z - startPosition.z) * easeInOutCubic,
      };

      setAnimatedPosition(newPosition);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animation complete
        setAnimatedPosition(targetPosition);
        setIsAnimating(false);
        setIsZooming(false);
      }
    };

    requestAnimationFrame(animate);
  }, [targetPosition, isAnimating]); // Remove animatedPosition from dependencies to prevent loops

  return { position: animatedPosition, isZooming };
};