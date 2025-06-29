import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Star, Users, TrendingUp, Clock } from 'lucide-react';
import { CelestialBody } from '../../../hooks/useCelestialBodies';
import { useConstellations } from '../../constellation/hooks/useConstellations';

interface KnowledgeMetricsProps {
  celestialBodies: CelestialBody[];
}

export const KnowledgeMetrics: React.FC<KnowledgeMetricsProps> = ({
  celestialBodies,
}) => {
  const { constellations } = useConstellations();

  const metrics = React.useMemo(() => {
    const totalBodies = celestialBodies.length;
    const singularities = celestialBodies.filter(b => b.is_singularity).length;
    const highImpact = celestialBodies.filter(b => b.has_impact).length;
    const totalConstellations = constellations.length;
    
    // Calculate knowledge diversity (unique content types)
    const contentTypes = new Set(celestialBodies.map(b => b.content_type));
    const diversity = contentTypes.size;
    
    // Calculate recent activity (bodies added in last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentActivity = celestialBodies.filter(b => 
      new Date(b.created_at) > weekAgo
    ).length;
    
    // Calculate knowledge density (average bodies per constellation)
    const density = totalConstellations > 0 ? totalBodies / totalConstellations : 0;
    
    return {
      totalBodies,
      singularities,
      highImpact,
      totalConstellations,
      diversity,
      recentActivity,
      density: Math.round(density * 10) / 10,
    };
  }, [celestialBodies, constellations]);

  const getKnowledgeLevel = () => {
    if (metrics.totalBodies < 5) return { level: 'Cosmic Dust', color: 'text-gray-400' };
    if (metrics.totalBodies < 15) return { level: 'Stellar Nursery', color: 'text-blue-400' };
    if (metrics.totalBodies < 30) return { level: 'Solar System', color: 'text-yellow-400' };
    if (metrics.totalBodies < 50) return { level: 'Galaxy Cluster', color: 'text-purple-400' };
    return { level: 'Universe Master', color: 'text-cosmic-300' };
  };

  const knowledgeLevel = getKnowledgeLevel();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-8 left-8 z-30"
    >
      <div className="bg-cosmic-900/95 backdrop-blur-xl border border-cosmic-700 rounded-xl p-6 shadow-2xl min-w-80">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-stellar-500 to-cosmic-500 rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Knowledge Universe</h3>
            <p className={`text-sm font-medium ${knowledgeLevel.color}`}>
              {knowledgeLevel.level}
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Total Bodies */}
          <div className="bg-cosmic-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-stellar-400" />
              <span className="text-cosmic-300 text-xs font-medium">Total Bodies</span>
            </div>
            <div className="text-white text-xl font-bold">{metrics.totalBodies}</div>
          </div>

          {/* Constellations */}
          <div className="bg-cosmic-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-cosmic-300 text-xs font-medium">Constellations</span>
            </div>
            <div className="text-white text-xl font-bold">{metrics.totalConstellations}</div>
          </div>

          {/* High Impact */}
          <div className="bg-cosmic-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-cosmic-300 text-xs font-medium">High Impact</span>
            </div>
            <div className="text-white text-xl font-bold">{metrics.highImpact}</div>
          </div>

          {/* Singularities */}
          <div className="bg-cosmic-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 bg-purple-400 rounded-full" />
              <span className="text-cosmic-300 text-xs font-medium">Singularities</span>
            </div>
            <div className="text-white text-xl font-bold">{metrics.singularities}</div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="mt-4 pt-4 border-t border-cosmic-700">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-cosmic-300">Diversity</span>
              </div>
              <span className="text-white font-medium">{metrics.diversity}/7 types</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-blue-400" />
                <span className="text-cosmic-300">Recent Activity</span>
              </div>
              <span className="text-white font-medium">{metrics.recentActivity} this week</span>
            </div>
            
            {metrics.totalConstellations > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-stellar-400 rounded-full" />
                  <span className="text-cosmic-300">Density</span>
                </div>
                <span className="text-white font-medium">{metrics.density} bodies/constellation</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-cosmic-300 mb-1">
            <span>Progress to next level</span>
            <span>{metrics.totalBodies}/50</span>
          </div>
          <div className="w-full bg-cosmic-800 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-stellar-500 to-cosmic-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((metrics.totalBodies / 50) * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};