import { useCelestialBodies } from './useCelestialBodies';
import { useUniverseStore } from '../stores/universe';

export const useDiscovery = () => {
  const { data: celestialBodies = [] } = useCelestialBodies();
  const { 
    setCameraPosition, 
    setTargetPosition, 
    setSelectedBody, 
    setIsAnimating, 
    setViewMode,
    cameraPosition 
  } = useUniverseStore();

  const animateToBody = (body: any, zoomLevel: number = 25) => {
    // Clear any existing selection first
    setSelectedBody(null);
    
    // Sync camera position with current target position
    setCameraPosition(cameraPosition);
    
    // Set the target directly to the body
    setTargetPosition({
      x: body.position_x,
      y: body.position_y,
      z: zoomLevel,
    });
    
    // Start animation and set view mode
    setIsAnimating(true);
    setViewMode('focused');
    
    // Select the body after a short delay to ensure animation starts
    setTimeout(() => {
      setSelectedBody(body.id);
    }, 100);

    return body;
  };

  const discoverRandom = () => {
    if (celestialBodies.length === 0) return;

    // Pick a random celestial body
    const randomIndex = Math.floor(Math.random() * celestialBodies.length);
    const randomBody = celestialBodies[randomIndex];

    return animateToBody(randomBody, 20);
  };

  const discoverByType = (contentType: string) => {
    const bodiesOfType = celestialBodies.filter(body => body.content_type === contentType);
    if (bodiesOfType.length === 0) return;

    const randomBody = bodiesOfType[Math.floor(Math.random() * bodiesOfType.length)];
    return animateToBody(randomBody, 25);
  };

  const discoverHighImpact = () => {
    const highImpactBodies = celestialBodies.filter(body => body.has_impact || body.is_singularity);
    if (highImpactBodies.length === 0) return discoverRandom();

    const randomBody = highImpactBodies[Math.floor(Math.random() * highImpactBodies.length)];
    return animateToBody(randomBody, 18);
  };

  const discoverOldest = () => {
    if (celestialBodies.length === 0) return;

    const oldestBody = [...celestialBodies].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )[0];

    return animateToBody(oldestBody, 22);
  };

  const discoverNewest = () => {
    if (celestialBodies.length === 0) return;

    const newestBody = [...celestialBodies].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

    return animateToBody(newestBody, 22);
  };

  return {
    discoverRandom,
    discoverByType,
    discoverHighImpact,
    discoverOldest,
    discoverNewest,
  };
};