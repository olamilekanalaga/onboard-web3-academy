import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Certificate {
  id: string;
  course_id: string;
  user_id: string;
  certificate_url: string | null;
  issued_at: string | null;
  courses?: {
    id: string;
    title: string;
    description: string | null;
    thumbnail_url: string | null;
    difficulty_level: string | null;
    category: string | null;
  };
}

export const useCertificates = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['certificates', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          courses (
            id,
            title,
            description,
            thumbnail_url,
            difficulty_level,
            category
          )
        `)
        .eq('user_id', user.id)
        .order('issued_at', { ascending: false });
      
      if (error) throw error;
      return data as Certificate[];
    },
    enabled: !!user,
  });
};

export const useCreateCertificate = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ courseId }: { courseId: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('certificates')
        .insert({
          user_id: user.id,
          course_id: courseId,
          issued_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });
};
