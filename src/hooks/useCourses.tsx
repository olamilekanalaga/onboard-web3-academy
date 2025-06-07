
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  difficulty_level: string | null;
  estimated_duration: number | null;
  is_featured: boolean | null;
  category: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Course[];
    },
  });
};

export const useFeaturedCourses = () => {
  return useQuery({
    queryKey: ['featured-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Course[];
    },
  });
};

export const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          lessons (
            id,
            title,
            content,
            video_url,
            order_index,
            duration
          )
        `)
        .eq('id', courseId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });
};
