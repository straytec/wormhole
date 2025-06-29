import { useCelestialBodies } from './useCelestialBodies';
import { useUniverseStore } from '../stores/universe';

export const useDiscovery = () => {
  const { data: celestialBodies = [] } = useCelestialBodies();
  const { focusOnBody, setSelectedBody } = useUniverseStore();

  const discoverRandom = () => {
    if (celestialBodies.length === 0) return;

    // Close any existing details modal first
    setSelectedBody(null);
    
    // Pick a random celestial body
    const randomIndex = Math.floor(Math.random() * celestialBodies.length);
    const randomBody = celestialBodies[randomIndex];

    // Use the focusOnBody function which handles everything
    setTimeout(() => {
      focusOnBody(randomBody.id, celestialBodies);
    }, 100);

    return randomBody;
  };

  const discoverByType = (contentType: string) => {
    const bodiesOfType = celestialBodies.filter(body => body.content_type === contentType);
    if (bodiesOfType.length === 0) return;

    // Close any existing details modal first
    setSelectedBody(null);

    const randomBody = bodiesOfType[Math.floor(Math.random() * bodiesOfType.length)];
    
    setTimeout(() => {
      focusOnBody(randomBody.id, celestialBodies);
    }, 100);

    return randomBody;
  };

  const discoverHighImpact = () => {
    const highImpactBodies = celestialBodies.filter(body => body.has_impact || body.is_singularity);
    if (highImpactBodies.length === 0) return discoverRandom();

    // Close any existing details modal first
    setSelectedBody(null);

    const randomBody = highImpactBodies[Math.floor(Math.random() * highImpactBodies.length)];
    
    setTimeout(() => {
      focusOnBody(randomBody.id, celestialBodies);
    }, 100);

    return randomBody;
  };

  const discoverOldest = () => {
    if (celestialBodies.length === 0) return;

    // Close any existing details modal first
    setSelectedBody(null);

    const oldestBody = [...celestialBodies].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )[0];

    setTimeout(() => {
      focusOnBody(oldestBody.id, celestialBodies);
    }, 100);

    return oldestBody;
  };

  const discoverNewest = () => {
    if (celestialBodies.length === 0) return;

    // Close any existing details modal first
    setSelectedBody(null);

    const newestBody = [...celestialBodies].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

    setTimeout(() => {
      focusOnBody(newestBody.id, celestialBodies);
    }, 100);

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