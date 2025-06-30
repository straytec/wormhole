import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  MapPin, 
  Globe, 
  Calendar,
  Shield,
  Palette,
  Mail,
  Star,
  Zap
} from 'lucide-react';
import { Layout } from '../../../components/Layout';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useUserProfile, useUpdateProfile, useUploadAvatar } from '../../../hooks/useUserProfile';
import { useCelestialBodies } from '../../../hooks/useCelestialBodies';
import { useConstellations } from '../../constellation/hooks/useConstellations';

export const ProfilePage: React.FC = () => {
  const { data: profile, isLoading } = useUserProfile();
  const { data: celestialBodies = [] } = useCelestialBodies();
  const { constellations } = useConstellations();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    display_name: '',
    bio: '',
    location: '',
    website: '',
    universe_theme: 'cosmic' as const,
    privacy_level: 'private' as const,
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        universe_theme: profile.universe_theme,
        privacy_level: profile.privacy_level,
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadAvatar.mutateAsync(file);
    } catch (error) {
      console.error('Failed to upload avatar:', error);
    }
  };

  const getUniverseStats = () => {
    const totalBodies = celestialBodies.length;
    const singularities = celestialBodies.filter(b => b.is_singularity).length;
    const highImpact = celestialBodies.filter(b => b.has_impact).length;
    const totalConstellations = constellations.length;
    
    return { totalBodies, singularities, highImpact, totalConstellations };
  };

  const stats = getUniverseStats();

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-stellar-400 border-t-transparent rounded-full"
          />
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">Profile Not Found</h2>
            <p className="text-cosmic-300">Unable to load your profile information.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Your Cosmic Profile
            </h1>
            <p className="text-cosmic-300 text-lg">
              Manage your identity across the knowledge universe
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-cosmic-900/80 backdrop-blur-lg border border-cosmic-700 rounded-xl p-8 shadow-2xl">
                {/* Avatar Section */}
                <div className="flex items-start gap-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-stellar-500 to-cosmic-500 flex items-center justify-center overflow-hidden">
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-white" />
                      )}
                    </div>
                    
                    {isEditing && (
                      <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-stellar-600 hover:bg-stellar-500 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                        <Camera className="w-4 h-4 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {profile.display_name || profile.full_name || 'Cosmic Explorer'}
                        </h2>
                        {profile.display_name && profile.full_name && (
                          <p className="text-cosmic-300">{profile.full_name}</p>
                        )}
                      </div>
                      
                      <Button
                        variant={isEditing ? "stellar" : "cosmic"}
                        size="sm"
                        onClick={isEditing ? () => setIsEditing(false) : () => setIsEditing(true)}
                        disabled={updateProfile.isPending}
                      >
                        {isEditing ? (
                          <>
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </>
                        ) : (
                          <>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Profile
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-cosmic-300 mb-4">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {profile.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Joined {new Date(profile.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Editable Fields */}
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      key="editing"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Full Name"
                          value={formData.full_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                          placeholder="Your full name"
                        />
                        <Input
                          label="Display Name"
                          value={formData.display_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                          placeholder="How others see you"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stellar-200 mb-2">
                          Bio
                        </label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell the universe about yourself..."
                          rows={3}
                          className="w-full px-4 py-3 bg-cosmic-800 border border-cosmic-600 rounded-lg text-white placeholder-cosmic-400 focus:outline-none focus:ring-2 focus:ring-stellar-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Location"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Your location"
                        />
                        <Input
                          label="Website"
                          value={formData.website}
                          onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="https://your-website.com"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-stellar-200 mb-2">
                            Universe Theme
                          </label>
                          <select
                            value={formData.universe_theme}
                            onChange={(e) => setFormData(prev => ({ ...prev, universe_theme: e.target.value as any }))}
                            className="w-full px-4 py-3 bg-cosmic-800 border border-cosmic-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-stellar-500 focus:border-transparent transition-all duration-200"
                          >
                            <option value="cosmic">Cosmic</option>
                            <option value="stellar">Stellar</option>
                            <option value="nebula">Nebula</option>
                            <option value="void">Void</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-stellar-200 mb-2">
                            Privacy Level
                          </label>
                          <select
                            value={formData.privacy_level}
                            onChange={(e) => setFormData(prev => ({ ...prev, privacy_level: e.target.value as any }))}
                            className="w-full px-4 py-3 bg-cosmic-800 border border-cosmic-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-stellar-500 focus:border-transparent transition-all duration-200"
                          >
                            <option value="private">Private</option>
                            <option value="friends">Friends Only</option>
                            <option value="public">Public</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          variant="cosmic"
                          onClick={handleSave}
                          disabled={updateProfile.isPending}
                          className="flex-1"
                        >
                          {updateProfile.isPending ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                            />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Save Changes
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="viewing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {profile.bio && (
                        <div>
                          <h3 className="text-sm font-medium text-stellar-200 mb-2">Bio</h3>
                          <p className="text-white">{profile.bio}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {profile.location && (
                          <div className="flex items-center gap-2 text-cosmic-300">
                            <MapPin className="w-4 h-4" />
                            {profile.location}
                          </div>
                        )}
                        {profile.website && (
                          <div className="flex items-center gap-2 text-cosmic-300">
                            <Globe className="w-4 h-4" />
                            <a
                              href={profile.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-stellar-300 transition-colors"
                            >
                              {profile.website}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-6 pt-4 border-t border-cosmic-700">
                        <div className="flex items-center gap-2 text-cosmic-300">
                          <Palette className="w-4 h-4" />
                          <span className="capitalize">{profile.universe_theme} Theme</span>
                        </div>
                        <div className="flex items-center gap-2 text-cosmic-300">
                          <Shield className="w-4 h-4" />
                          <span className="capitalize">{profile.privacy_level} Profile</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="fixed bottom-4 right-32 z-20"
              >
              <a
                href="https://bolt.new"
               target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-3 py-2 bg-cosmic-900/90 backdrop-blur-sm border border-cosmic-600 rounded-lg hover:border-stellar-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                 >
               <div className="flex items-center gap-2">
                  <img
                 src="/bolt_black_circle.png"
                alt="Bolt Icon"
                className="w-20 h-20"
                  />
                   </div>
              </a>
          </motion.div>

          
            {/* Universe Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Stats Card */}
              <div className="bg-cosmic-900/80 backdrop-blur-lg border border-cosmic-700 rounded-xl p-6 shadow-2xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-stellar-400" />
                  Universe Stats
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-cosmic-300">Celestial Bodies</span>
                    <span className="text-white font-semibold">{stats.totalBodies}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-cosmic-300">Constellations</span>
                    <span className="text-white font-semibold">{stats.totalConstellations}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-cosmic-300">High Impact</span>
                    <span className="text-yellow-400 font-semibold">{stats.highImpact}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-cosmic-300">Singularities</span>
                    <span className="text-purple-400 font-semibold">{stats.singularities}</span>
                  </div>
                </div>
              </div>

              {/* Achievement Card */}
              <div className="bg-cosmic-900/80 backdrop-blur-lg border border-cosmic-700 rounded-xl p-6 shadow-2xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-stellar-400" />
                  Achievements
                </h3>
                
                <div className="space-y-3">
                  {stats.totalBodies >= 10 && (
                    <div className="flex items-center gap-3 p-3 bg-stellar-900/30 rounded-lg">
                      <div className="w-8 h-8 bg-stellar-500 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">Cosmic Explorer</div>
                        <div className="text-cosmic-300 text-xs">Added 10+ celestial bodies</div>
                      </div>
                    </div>
                  )}
                  
                  {stats.totalConstellations >= 3 && (
                    <div className="flex items-center gap-3 p-3 bg-purple-900/30 rounded-lg">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">Constellation Master</div>
                        <div className="text-cosmic-300 text-xs">Formed 3+ constellations</div>
                      </div>
                    </div>
                  )}
                  
                  {stats.singularities >= 1 && (
                    <div className="flex items-center gap-3 p-3 bg-cosmic-900/30 rounded-lg">
                      <div className="w-8 h-8 bg-cosmic-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                      <div>
                        <div className="text-white font-medium">Singularity Creator</div>
                        <div className="text-cosmic-300 text-xs">Created a singularity</div>
                      </div>
                    </div>
                  )}
                  
                  {stats.totalBodies === 0 && (
                    <div className="text-center py-4">
                      <p className="text-cosmic-400 text-sm">
                        Start adding content to unlock achievements!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};