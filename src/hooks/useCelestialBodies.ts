import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/auth';
import { useUniverseStore } from '../stores/universe';

export interface CelestialBody {
  id: string;
  user_id: string;
  title: string;
  content_type: 'movie' | 'book' | 'album' | 'game' | 'studying' | 'work' | 'other';
  genre: string | null;
  creator_id: string | null;
  series_id: string | null;
  external_id: string | null;
  api_data: any | null;
  position_x: number;
  position_y: number;
  position_z: number;
  visual_attributes: any;
  is_singularity: boolean;
  has_impact: boolean;
  created_at: string;
}

interface CreateCelestialBodyData {
  title: string;
  content_type: 'movie' | 'book' | 'album' | 'game' | 'studying' | 'work' | 'other';
  genre?: string;
  creator?: string;
  external_id?: string;
  api_data?: any;
  is_singularity: boolean;
  has_impact: boolean;
}

// Generate random position within genre zones
const generatePosition = (contentType: string) => {
  // Define genre zones in 3D space
  const zones = {
    movie: { x: [-50, 50], y: [-30, 30], z: [-20, 20] },
    book: { x: [60, 160], y: [-30, 30], z: [-20, 20] },
    album: { x: [-160, -60], y: [-30, 30], z: [-20, 20] },
    game: { x: [-50, 50], y: [40, 100], z: [-20, 20] },
    studying: { x: [60, 160], y: [40, 100], z: [-20, 20] },
    work: { x: [-160, -60], y: [40, 100], z: [-20, 20] },
    other: { x: [-50, 50], y: [-100, -40], z: [-20, 20] },
  };

  const zone = zones[contentType as keyof typeof zones] || zones.other;
  
  return {
    x: Math.random() * (zone.x[1] - zone.x[0]) + zone.x[0],
    y: Math.random() * (zone.y[1] - zone.y[0]) + zone.y[0],
    z: Math.random() * (zone.z[1] - zone.z[0]) + zone.z[0],
  };
};

// Generate visual attributes based on content type
const generateVisualAttributes = (contentType: string, isSingularity: boolean, hasImpact: boolean) => {
  const baseAttributes = {
    size: hasImpact ? Math.random() * 0.5 + 1.0 : Math.random() * 0.3 + 0.7,
    brightness: hasImpact ? Math.random() * 0.3 + 0.7 : Math.random() * 0.2 + 0.5,
    color: {
      r: Math.random(),
      g: Math.random(),
      b: Math.random(),
    },
  };

  if (isSingularity) {
    return {
      ...baseAttributes,
      type: 'singularity',
      size: Math.random() * 0.2 + 0.8,
      brightness: 1.0,
      color: { r: 0.1, g: 0.0, b: 0.3 },
      specialEffect: 'gravitational_lensing',
    };
  }

  // Content-type specific attributes
  switch (contentType) {
    case 'movie':
      return {
        ...baseAttributes,
        type: 'planet',
        surfaceTexture: Math.floor(Math.random() * 5),
        hasRings: Math.random() > 0.7,
        moonCount: Math.floor(Math.random() * 4),
      };
    case 'book':
      return {
        ...baseAttributes,
        type: 'star',
        colorTemperature: Math.random() * 3000 + 3000,
        coronaSize: Math.random() * 0.5 + 0.5,
      };
    case 'album':
      return {
        ...baseAttributes,
        type: 'nebula',
        shapeId: Math.floor(Math.random() * 3),
        tendrilCount: Math.floor(Math.random() * 8) + 4,
      };
    case 'game':
      return {
        ...baseAttributes,
        type: 'asteroid',
        rotationSpeed: Math.random() * 2 + 0.5,
        crystalline: Math.random() > 0.5,
      };
    case 'studying':
      return {
        ...baseAttributes,
        type: 'pulsar',
        pulseRate: Math.random() * 2 + 1,
        beamIntensity: Math.random() * 0.8 + 0.2,
        knowledge_density: Math.random() * 0.9 + 0.1,
      };
    case 'work':
      return {
        ...baseAttributes,
        type: 'binary_star',
        companion_size: Math.random() * 0.3 + 0.2,
        orbital_period: Math.random() * 5 + 2,
        productivity_index: Math.random() * 0.8 + 0.2,
      };
    default:
      return {
        ...baseAttributes,
        type: 'comet',
        tailLength: Math.random() * 10 + 5,
      };
  }
};

export const useCelestialBodies = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['celestial-bodies', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('celestial_bodies')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CelestialBody[];
    },
    enabled: !!user,
  });
};

export const useCreateCelestialBody = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { setTargetPosition, setIsAnimating, setViewMode, setSelectedBody } = useUniverseStore();

  return useMutation({
    mutationFn: async (data: CreateCelestialBodyData) => {
      if (!user) throw new Error('User not authenticated');

      const position = generatePosition(data.content_type);
      const visualAttributes = generateVisualAttributes(
        data.content_type,
        data.is_singularity,
        data.has_impact
      );

      const celestialBody = {
        user_id: user.id,
        title: data.title,
        content_type: data.content_type,
        genre: data.genre || null,
        creator_id: data.creator || null,
        external_id: data.external_id || null,
        api_data: data.api_data || null,
        position_x: position.x,
        position_y: position.y,
        position_z: position.z,
        visual_attributes: visualAttributes,
        is_singularity: data.is_singularity,
        has_impact: data.has_impact,
      };

      const { data: result, error } = await supabase
        .from('celestial_bodies')
        .insert(celestialBody)
        .select()
        .single();

      if (error) throw error;
      return result as CelestialBody;
    },
    onSuccess: () => {
      // Invalidate and refetch celestial bodies
      queryClient.invalidateQueries({ queryKey: ['celestial-bodies', user?.id] });
      
      // Dramatic camera movement to the new celestial body
      setTimeout(() => {
        setTargetPosition({
          x: newBody.position_x,
          y: newBody.position_y,
          z: 25, // Zoom in close
        });
        setIsAnimating(true);
        setViewMode('focused');
        
        // Select the new body after animation
        setTimeout(() => {
          setSelectedBody(newBody.id);
        }, 1500);
      }, 500); // Small delay to let the query update
    },
  });
};