export interface GenreZone {
  id: string;
  contentType: string;
  centerPosition: { x: number; y: number; z: number };
  radius: number;
  color: {
    primary: string;
    secondary: string;
    accent: string;
  };
  celestialBodies: string[];
}

export interface HybridZone {
  id: string;
  name: string;
  parentGenres: string[];
  centerPosition: { x: number; y: number; z: number };
  radius: number;
  intensity: number; // 0-1, based on number of hybrid works
  colors: {
    primary: string;
    secondary: string;
    turbulence: string;
  };
  celestialBodies: string[];
  createdAt: string;
  isActive: boolean; // Currently experiencing collision effects
}

export interface GalacticCollisionEvent {
  id: string;
  triggeringBodyId: string;
  hybridZoneId: string;
  parentGenres: string[];
  collisionIntensity: number;
  timestamp: string;
  phases: {
    galacticMerge: boolean;
    collisionZoneForm: boolean;
    hybridBodyBirth: boolean;
    shockwave: boolean;
    complete: boolean;
  };
}

export interface ShockwaveEffect {
  id: string;
  originPosition: { x: number; y: number; z: number };
  currentRadius: number;
  maxRadius: number;
  intensity: number;
  affectedBodies: string[];
  startTime: number;
  duration: number;
}