import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  country_id: number | null;
  timezone: string | null;
  phone: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      // Ensure avatar_url is properly set and accessible
      if (data && data.avatar_url) {
        // Check if the avatar URL is accessible by making a HEAD request
        try {
          const response = await fetch(data.avatar_url, { method: 'HEAD' });
          if (!response.ok) {
            console.warn('Avatar URL not accessible, clearing from profile');
            // If avatar is not accessible, clear it from the profile
            await supabase
              .from('profiles')
              .update({ avatar_url: null })
              .eq('id', user.id);
            data.avatar_url = null;
          }
        } catch (error) {
          console.warn('Error checking avatar accessibility:', error);
          // If there's an error checking, keep the URL but log it
        }
      }
      
      return data as Profile;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useUpdateProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Update the cached profile data immediately
      queryClient.setQueryData(['profile', user?.id], data);
      // Also invalidate to refetch from server
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
