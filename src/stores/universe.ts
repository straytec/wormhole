import { create } from 'zustand';

interface UniverseState {
  isAddingContent: boolean;
  selectedBody: string | null;
  showKnowledgeMetrics: boolean;
  cameraPosition: { x: number; y: number; z: number };
  targetPosition: { x: number; y: number; z: number };
  isAnimating: boolean;
  viewMode: 'overview' | 'focused' | 'zone';
  searchQuery: string;
  setAddingContent: (adding: boolean) => void;
  setSelectedBody: (bodyId: string | null) => void;
  setShowKnowledgeMetrics: (show: boolean) => void;
  setCameraPosition: (position: { x: number; y: number; z: number }) => void;
  setTargetPosition: (target: { x: number; y: number; z: number }) => void;
  setIsAnimating: (animating: boolean) => void;
  setViewMode: (mode: 'overview' | 'focused' | 'zone') => void;
  setSearchQuery: (query: string) => void;
  focusOnBody: (bodyId: string, celestialBodies: any[]) => void;
  resetView: () => void;
  discover: () => void;
}

export const useUniverseStore = create<UniverseState>((set, get) => ({
  isAddingContent: false,
  selectedBody: null,
  showKnowledgeMetrics: true,
  cameraPosition: { x: 0, y: 0, z: 100 },
  targetPosition: { x: 0, y: 0, z: 100 },
  isAnimating: false,
  viewMode: 'overview',
  searchQuery: '',
  setAddingContent: (adding) => set({ isAddingContent: adding }),
  setSelectedBody: (bodyId) => set({ selectedBody: bodyId }),
  setShowKnowledgeMetrics: (show) => set({ showKnowledgeMetrics: show }),
  setCameraPosition: (position) => set({ cameraPosition: position }),
  setTargetPosition: (target) => set({ targetPosition: target }),
  setIsAnimating: (animating) => set({ isAnimating: animating }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  focusOnBody: (bodyId, celestialBodies) => {
    const body = celestialBodies.find(b => b.id === bodyId);
    if (!body) return;
    
    const state = get();
    set({
      cameraPosition: state.targetPosition, // Sync current position
      targetPosition: { 
        x: body.position_x, 
        y: body.position_y, 
        z: 30 
      },
      selectedBody: bodyId,
      viewMode: 'focused',
      isAnimating: true
    });
  },
  resetView: () => {
    const state = get();
    set({
      cameraPosition: state.targetPosition, // Sync current position
      targetPosition: { x: 0, y: 0, z: 100 },
      selectedBody: null,
      viewMode: 'overview',
      isAnimating: true
    });
  },
  discover: () => {
    // This will be handled by the discovery hook
    console.log('Discovery triggered from store');
  }