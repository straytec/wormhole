import { useCelestialBodies } from './useCelestialBodies';
import { useUniverseStore } from '../stores/universe';

export const useDiscovery = () => {
  const { data: celestialBodies = [] } = useCelestialBodies();
  const { setTargetPosition, setSelectedBody, setIsAnimating, setViewMode } = useUniverseStore();

  const discoverRandom = () => {
    if (celestialBodies.length === 0) return;

    // Pick a random celestial body
    const randomIndex = Math.floor(Math.random() * celestialBodies.length);
    const randomBody = celestialBodies[randomIndex];

    // Navigate to it
    setTargetPosition({
      x: randomBody.position_x,
      y: randomBody.position_y,
      z: 30, // Zoom in close
    });

    setIsAnimating(true);
    setViewMode('focused');
    
    // Select it after animation completes
    setTimeout(() => {
      setSelectedBody(randomBody.id);
    }, 1500);

    return randomBody;
  };

  const discoverByType = (contentType: string) => {
    const bodiesOfType = celestialBodies.filter(body => body.content_type === contentType);
    if (bodiesOfType.length === 0) return;

    const randomBody = bodiesOfType[Math.floor(Math.random() * bodiesOfType.length)];
    
    setTargetPosition({
      x: randomBody.position_x,
      y: randomBody.position_y,
      z: 30,
    });

    setIsAnimating(true);
    setViewMode('focused');
    
    setTimeout(() => {
      setSelectedBody(randomBody.id);
    }, 1500);

    return randomBody;
  };

  const discoverHighImpact = () => {
    const highImpactBodies = celestialBodies.filter(body => body.has_impact || body.is_singularity);
    if (highImpactBodies.length === 0) return discoverRandom();

    const randomBody = highImpactBodies[Math.floor(Math.random() * highImpactBodies.length)];
    
    setTargetPosition({
      x: randomBody.position_x,
      y: randomBody.position_y,
      z: 25,
    });

    setIsAnimating(true);
    setViewMode('focused');
    
    setTimeout(() => {
      setSelectedBody(randomBody.id);
    }, 1500);

    return randomBody;
  };

  const discoverOldest = () => {
    if (celestialBodies.length === 0) return;

    const oldestBody = [...celestialBodies].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )[0];

    setTargetPosition({
      x: oldestBody.position_x,
      y: oldestBody.position_y,
      z: 30,
    });

    setIsAnimating(true);
    setViewMode('focused');
    
    setTimeout(() => {
      setSelectedBody(oldestBody.id);
    }, 1500);

    return oldestBody;
  };

  const discoverNewest = () => {
    if (celestialBodies.length === 0) return;

    const newestBody = [...celestialBodies].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

    setTargetPosition({
      x: newestBody.position_x,
      y: newestBody.position_y,
      z: 30,
    });

    setIsAnimating(true);
    setViewMode('focused');
    
    setTimeout(() => {
      setSelectedBody(newestBody.id);
    }, 1500);

    return newestBody;
  };

  return {
    discoverRandom,
    discoverByType,
    discoverHighImpact,
    discoverOldest,
    discoverNewest,
  };
};