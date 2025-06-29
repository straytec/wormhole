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
    const duration = 1500; // 1.5 seconds
    const startPosition = { ...animatedPosition };

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (cubic-bezier equivalent to ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const newPosition = {
        x: startPosition.x + (targetPosition.x - startPosition.x) * easeOut,
        y: startPosition.y + (targetPosition.y - startPosition.y) * easeOut,
        z: startPosition.z + (targetPosition.z - startPosition.z) * easeOut,
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