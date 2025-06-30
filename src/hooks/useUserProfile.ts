import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/auth';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  universe_theme: 'cosmic' | 'stellar' | 'nebula' | 'void';
  privacy_level: 'public' | 'friends' | 'private';
  created_at: string;
  updated_at: string;
}

interface UpdateProfileData {
  full_name?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  universe_theme?: 'cosmic' | 'stellar' | 'nebula' | 'void';
  privacy_level?: 'public' | 'friends' | 'private';
}

export const useUserProfile = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
            })
            .select()
            .single();

          if (createError) throw createError;
          return newProfile as UserProfile;
        }
        throw error;
      }

      return data as UserProfile;
    },
    enabled: !!user,
  });
};

export const useUpdateProfile = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      if (!user) throw new Error('User not authenticated');

      const { data: result, error } = await supabase
        .from('users')
        .update(data)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return result as UserProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', user?.id] });
    },
  });
};

export const useUploadAvatar = () => {
  const { user } = useAuthStore();
  const updateProfile = useUpdateProfile();

  return useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('User not authenticated');

      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      return updateProfile.mutateAsync({ avatar_url: data.publicUrl });
    },
  });
};