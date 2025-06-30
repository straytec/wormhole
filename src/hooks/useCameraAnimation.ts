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

  useEffect(() => {
    if (!isAnimating) {
      setAnimatedPosition(currentPosition);
      return;
    }

    // Start animation
    const startTime = Date.now();
    const duration = 1500; // 1.5 seconds for smooth but not too slow animation
    const startPosition = { ...animatedPosition };

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smoother easing function (ease-in-out-cubic)
      const easeInOutCubic = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

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
      }
    };

    requestAnimationFrame(animate);
  }, [targetPosition, isAnimating]);

  return animatedPosition;
};