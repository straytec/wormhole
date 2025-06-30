import { useState, useEffect, useRef } from 'react';

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
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    if (!isAnimating) {
      setAnimatedPosition(currentPosition);
      return;
    }

    // Cancel any existing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Start new animation
    startTimeRef.current = Date.now();
    const startPosition = { ...animatedPosition };
    
    // Calculate distance to determine animation duration
    const distance = Math.sqrt(
      Math.pow(targetPosition.x - startPosition.x, 2) +
      Math.pow(targetPosition.y - startPosition.y, 2) +
      Math.pow(targetPosition.z - startPosition.z, 2)
    );
    
    // Dynamic duration based on distance (min 800ms, max 2000ms)
    const baseDuration = Math.min(Math.max(distance * 8, 800), 2000);
    
    // Zoom operations get faster duration
    const isZoomOperation = Math.abs(targetPosition.x - startPosition.x) < 10 && 
                           Math.abs(targetPosition.y - startPosition.y) < 10;
    const duration = isZoomOperation ? Math.min(baseDuration * 0.6, 1000) : baseDuration;

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current!;
      const progress = Math.min(elapsed / duration, 1);
      
      // Enhanced easing function for smoother motion
      // Uses a combination of ease-in-out-cubic with slight overshoot for zoom
      let easeProgress;
      if (isZoomOperation) {
        // Smoother easing for zoom operations
        easeProgress = progress < 0.5 
          ? 4 * progress * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      } else {
        // Slightly bouncy easing for navigation
        const c1 = 1.70158;
        const c2 = c1 * 1.525;
        easeProgress = progress < 0.5
          ? (Math.pow(2 * progress, 2) * ((c2 + 1) * 2 * progress - c2)) / 2
          : (Math.pow(2 * progress - 2, 2) * ((c2 + 1) * (progress * 2 - 2) + c2) + 2) / 2;
      }

      const newPosition = {
        x: startPosition.x + (targetPosition.x - startPosition.x) * easeProgress,
        y: startPosition.y + (targetPosition.y - startPosition.y) * easeProgress,
        z: startPosition.z + (targetPosition.z - startPosition.z) * easeProgress,
      };

      setAnimatedPosition(newPosition);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        setAnimatedPosition(targetPosition);
        setIsAnimating(false);
        animationFrameRef.current = undefined;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    };
  }, [targetPosition, isAnimating]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return animatedPosition;
};