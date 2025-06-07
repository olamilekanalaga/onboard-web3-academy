import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Country {
  id: number;
  name: string;
  code: string;
  flag_emoji: string;
  timezone: string;
}

export interface SessionType {
  id: number;
  name: string;
  description: string;
  duration_minutes: number;
  price_usd: number;
  is_active: boolean;
}

export interface Session {
  id: string;
  session_type_id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  timezone: string;
  max_participants: number;
  is_available: boolean;
  meeting_link?: string;
  session_types?: SessionType;
}

export interface Booking {
  id: string;
  session_id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  booking_notes?: string;
  user_timezone: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_amount: number;
  payment_currency: string;
  feedback_rating?: number;
  feedback_comment?: string;
  attended?: boolean;
  created_at: string;
  updated_at: string;
  sessions?: Session;
}

// Get all countries
export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async (): Promise<Country[]> => {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
};

// Get session types
export const useSessionTypes = () => {
  return useQuery({
    queryKey: ['session-types'],
    queryFn: async (): Promise<SessionType[]> => {
      const { data, error } = await supabase
        .from('session_types')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
};

// Get available sessions
export const useAvailableSessions = () => {
  return useQuery({
    queryKey: ['available-sessions'],
    queryFn: async (): Promise<Session[]> => {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          session_types (
            id,
            name,
            description,
            duration_minutes,
            price_usd
          )
        `)
        .eq('is_available', true)
        .gte('start_time', new Date().toISOString())
        .order('start_time');
      
      if (error) throw error;
      return data;
    },
  });
};

// Get user's bookings
export const useUserBookings = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-bookings', user?.id],
    queryFn: async (): Promise<Booking[]> => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          sessions (
            *,
            session_types (
              id,
              name,
              description,
              duration_minutes,
              price_usd
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

// Create a booking
export const useCreateBooking = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      sessionId,
      bookingNotes,
      userTimezone,
    }: {
      sessionId: string;
      bookingNotes?: string;
      userTimezone: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      // First, get the session details to calculate payment amount
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .select(`
          *,
          session_types (price_usd)
        `)
        .eq('id', sessionId)
        .single();
      
      if (sessionError) throw sessionError;
      
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          session_id: sessionId,
          user_id: user.id,
          booking_notes: bookingNotes,
          user_timezone: userTimezone,
          payment_amount: session.session_types?.price_usd || 0,
          status: 'pending',
          payment_status: 'pending',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['available-sessions'] });
    },
  });
};

// Update booking status
export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      bookingId,
      status,
      feedbackRating,
      feedbackComment,
    }: {
      bookingId: string;
      status?: string;
      feedbackRating?: number;
      feedbackComment?: string;
    }) => {
      const updateData: any = { updated_at: new Date().toISOString() };
      
      if (status) updateData.status = status;
      if (feedbackRating) updateData.feedback_rating = feedbackRating;
      if (feedbackComment) updateData.feedback_comment = feedbackComment;
      
      const { data, error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
    },
  });
};

// Cancel booking
export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['available-sessions'] });
    },
  });
};

// Track user analytics
export const useTrackAnalytics = () => {
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({
      eventType,
      eventData,
      countryCode,
      city,
    }: {
      eventType: string;
      eventData?: any;
      countryCode?: string;
      city?: string;
    }) => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('user_analytics')
        .insert({
          user_id: user.id,
          event_type: eventType,
          event_data: eventData || {},
          country_code: countryCode,
          city: city,
        });
      
      if (error) throw error;
      return data;
    },
  });
};
