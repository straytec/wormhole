import { useCelestialBodies } from './useCelestialBodies';
import { useUniverseStore } from '../stores/universe';

export const useDiscovery = () => {
  const { data: celestialBodies = [] } = useCelestialBodies();
  const { setTargetPosition, setSelectedBody, setIsAnimating, setViewMode } = useUniverseStore();

  const animateToBody = (body: any, zoomLevel: number = 25) => {
    // Smooth multi-stage animation
    setIsAnimating(true);
    setViewMode('focused');
    
    // Stage 1: Zoom out slightly for better transition
    setTargetPosition({
      x: body.position_x * 0.3, // Ease into the area
      y: body.position_y * 0.3,
      z: 80,
    });

    // Stage 2: Move closer to the target
    setTimeout(() => {
      setTargetPosition({
        x: body.position_x * 0.7,
        y: body.position_y * 0.7,
        z: 50,
      });
    }, 500);

    // Stage 3: Final zoom to the body
    setTimeout(() => {
      setTargetPosition({
        x: body.position_x,
        y: body.position_y,
        z: zoomLevel,
      });
    }, 1000);

    // Stage 4: Select and highlight the body
    setTimeout(() => {
      setSelectedBody(body.id);
      setIsAnimating(false);
    }, 2000);

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