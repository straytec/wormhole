import { useState, useEffect, useMemo } from 'react';
import { useCelestialBodies } from '../../../hooks/useCelestialBodies';
import { useGenreDetection } from './useGenreDetection';
import { GenreZone, HybridZone, GalacticCollisionEvent, ShockwaveEffect } from '../types';

const GENRE_ZONE_POSITIONS = {
  movie: { x: 0, y: 0, z: 0 },
  book: { x: 110, y: 0, z: 0 },
  album: { x: -110, y: 0, z: 0 },
  game: { x: 0, y: 70, z: 0 },
  studying: { x: 110, y: 70, z: 0 },
  work: { x: -110, y: 70, z: 0 },
  other: { x: 0, y: -70, z: 0 },
};

const GENRE_COLORS = {
  movie: { primary: '#3B82F6', secondary: '#1E40AF', accent: '#60A5FA' },
  book: { primary: '#F59E0B', secondary: '#D97706', accent: '#FCD34D' },
  album: { primary: '#EC4899', secondary: '#BE185D', accent: '#F9A8D4' },
  game: { primary: '#10B981', secondary: '#047857', accent: '#6EE7B7' },
  studying: { primary: '#06B6D4', secondary: '#0891B2', accent: '#67E8F9' },
  work: { primary: '#F97316', secondary: '#EA580C', accent: '#FB923C' },
  other: { primary: '#6B7280', secondary: '#4B5563', accent: '#9CA3AF' },
};

export const useGalacticCollisions = () => {
  const { data: celestialBodies = [] } = useCelestialBodies();
  const { detectHybridGenres, getParentGenres, isSignificantHybrid } = useGenreDetection();
  
  const [collisionEvents, setCollisionEvents] = useState<GalacticCollisionEvent[]>([]);
  const [activeShockwaves, setActiveShockwaves] = useState<ShockwaveEffect[]>([]);
  const [previousBodyCount, setPreviousBodyCount] = useState(0);

  // Generate genre zones based on celestial bodies
  const genreZones = useMemo((): GenreZone[] => {
    const zones: GenreZone[] = [];
    
    Object.entries(GENRE_ZONE_POSITIONS).forEach(([contentType, position]) => {
      const bodiesInZone = celestialBodies.filter(body => body.content_type === contentType);
      
      if (bodiesInZone.length > 0) {
        zones.push({
          id: `zone-${contentType}`,
          contentType,
          centerPosition: position,
          radius: Math.max(80, bodiesInZone.length * 15),
          color: GENRE_COLORS[contentType as keyof typeof GENRE_COLORS],
          celestialBodies: bodiesInZone.map(b => b.id),
        });
      }
    });
    
    return zones;
  }, [celestialBodies]);

  // Generate hybrid zones based on detected hybrid content
  const hybridZones = useMemo((): HybridZone[] => {
    const zones: HybridZone[] = [];
    const hybridBodies = celestialBodies.filter(body => {
      if (!body.api_data) return false;
      const hybridTypes = detectHybridGenres(body.api_data);
      return isSignificantHybrid(hybridTypes);
    });

    // Group hybrid bodies by their hybrid types
    const hybridGroups = hybridBodies.reduce((acc, body) => {
      const hybridTypes = detectHybridGenres(body.api_data);
      hybridTypes.forEach(hybridType => {
        if (!acc[hybridType]) {
          acc[hybridType] = [];
        }
        acc[hybridType].push(body);
      });
      return acc;
    }, {} as Record<string, typeof hybridBodies>);

    Object.entries(hybridGroups).forEach(([hybridType, bodies]) => {
      if (bodies.length === 0) return;

      const parentGenres = getParentGenres(hybridType);
      const parentZones = genreZones.filter(zone => 
        parentGenres.includes(zone.contentType)
      );

      if (parentZones.length >= 2) {
        // Calculate collision zone position (midpoint between parent zones)
        const avgX = parentZones.reduce((sum, zone) => sum + zone.centerPosition.x, 0) / parentZones.length;
        const avgY = parentZones.reduce((sum, zone) => sum + zone.centerPosition.y, 0) / parentZones.length;
        const avgZ = parentZones.reduce((sum, zone) => sum + zone.centerPosition.z, 0) / parentZones.length;

        // Create hybrid zone
        zones.push({
          id: `hybrid-${hybridType}`,
          name: `${hybridType.split('-').map(g => g.charAt(0).toUpperCase() + g.slice(1)).join('-')} Collision Zone`,
          parentGenres,
          centerPosition: { x: avgX, y: avgY, z: avgZ },
          radius: Math.max(60, bodies.length * 20),
          intensity: Math.min(bodies.length / 5, 1),
          colors: {
            primary: parentZones[0].color.primary,
            secondary: parentZones[1]?.color.primary || parentZones[0].color.secondary,
            turbulence: '#FFFFFF',
          },
          celestialBodies: bodies.map(b => b.id),
          createdAt: bodies[0].created_at,
          isActive: false,
        });
      }
    });

    return zones;
  }, [celestialBodies, genreZones, detectHybridGenres, getParentGenres, isSignificantHybrid]);

  // Detect new galactic collisions
  useEffect(() => {
    if (celestialBodies.length <= previousBodyCount) {
      setPreviousBodyCount(celestialBodies.length);
      return;
    }

    // Get the most recently added body
    const sortedBodies = [...celestialBodies].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const newestBody = sortedBodies[0];

    if (!newestBody?.api_data) {
      setPreviousBodyCount(celestialBodies.length);
      return;
    }

    // Check if the new body is a significant hybrid
    const hybridTypes = detectHybridGenres(newestBody.api_data);
    if (!isSignificantHybrid(hybridTypes)) {
      setPreviousBodyCount(celestialBodies.length);
      return;
    }

    // Find the hybrid zone this body belongs to
    const relevantHybridZone = hybridZones.find(zone => 
      zone.celestialBodies.includes(newestBody.id)
    );

    if (relevantHybridZone) {
      // Create collision event
      const collisionEvent: GalacticCollisionEvent = {
        id: `collision-${Date.now()}`,
        triggeringBodyId: newestBody.id,
        hybridZoneId: relevantHybridZone.id,
        parentGenres: relevantHybridZone.parentGenres,
        collisionIntensity: relevantHybridZone.intensity,
        timestamp: new Date().toISOString(),
        phases: {
          galacticMerge: false,
          collisionZoneForm: false,
          hybridBodyBirth: false,
          shockwave: false,
          complete: false,
        },
      };

      setCollisionEvents(prev => [...prev, collisionEvent]);

      // Create shockwave effect
      const shockwave: ShockwaveEffect = {
        id: `shockwave-${Date.now()}`,
        originPosition: { ...newestBody.position_x, y: newestBody.position_y, z: newestBody.position_z },
        currentRadius: 0,
        maxRadius: 300,
        intensity: relevantHybridZone.intensity,
        affectedBodies: [],
        startTime: Date.now(),
        duration: 8000, // 8 seconds
      };

      setActiveShockwaves(prev => [...prev, shockwave]);

      // Clear events after animation completes
      setTimeout(() => {
        setCollisionEvents(prev => prev.filter(e => e.id !== collisionEvent.id));
        setActiveShockwaves(prev => prev.filter(s => s.id !== shockwave.id));
      }, 12000);
    }

    setPreviousBodyCount(celestialBodies.length);
  }, [celestialBodies, hybridZones, detectHybridGenres, isSignificantHybrid, previousBodyCount]);

  // Update shockwave animations
  useEffect(() => {
    if (activeShockwaves.length === 0) return;

    const interval = setInterval(() => {
      setActiveShockwaves(prev => 
        prev.map(shockwave => {
          const elapsed = Date.now() - shockwave.startTime;
          const progress = Math.min(elapsed / shockwave.duration, 1);
          
          return {
            ...shockwave,
            currentRadius: shockwave.maxRadius * progress,
          };
        }).filter(shockwave => {
          const elapsed = Date.now() - shockwave.startTime;
          return elapsed < shockwave.duration;
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [activeShockwaves.length]);

  return {
    genreZones,
    hybridZones,
    collisionEvents,
    activeShockwaves,
    detectHybridGenres,
    isSignificantHybrid,
  };
};