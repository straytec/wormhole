export interface Constellation {
  id: string;
  creator: string;
  name: string;
  celestialBodies: string[];
  isDiscovered: boolean;
  discoveredAt?: string;
  centerPosition: {
    x: number;
    y: number;
    z: number;
  };
}

export interface ConstellationLine {
  id: string;
  from: string;
  to: string;
  opacity: number;
  isActive: boolean;
}