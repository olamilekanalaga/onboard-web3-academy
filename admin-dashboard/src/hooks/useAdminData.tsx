import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Booking statistics
export const useBookingStats = () => {
  return useQuery({
    queryKey: ['booking-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_booking_stats');
      if (error) throw error;
      return data[0];
    },
  });
};

// User country statistics
export const useUserCountryStats = () => {
  return useQuery({
    queryKey: ['user-country-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_country_stats');
      if (error) throw error;
      return data;
    },
  });
};

// All bookings for admin
export const useAllBookings = () => {
  return useQuery({
    queryKey: ['all-bookings'],
    queryFn: async () => {
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
          ),
          profiles (
            id,
            full_name,
            avatar_url,
            countries (
              name,
              flag_emoji
            )
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// Recent bookings
export const useRecentBookings = () => {
  return useQuery({
    queryKey: ['recent-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          sessions (
            *,
            session_types (
              name,
              price_usd
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });
};

// All sessions for admin
export const useAllSessions = () => {
  return useQuery({
    queryKey: ['all-sessions'],
    queryFn: async () => {
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
        .order('start_time', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// Update booking status
export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      bookingId,
      status,
      meetingLink,
    }: {
      bookingId: string;
      status: string;
      meetingLink?: string;
    }) => {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };
      
      // If confirming, also update the session with meeting link
      if (status === 'confirmed' && meetingLink) {
        const { data: booking } = await supabase
          .from('bookings')
          .select('session_id')
          .eq('id', bookingId)
          .single();
        
        if (booking) {
          await supabase
            .from('sessions')
            .update({ meeting_link: meetingLink })
            .eq('id', booking.session_id);
        }
      }
      
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
      queryClient.invalidateQueries({ queryKey: ['all-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['recent-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking-stats'] });
    },
  });
};

// Create new session
export const useCreateSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      sessionTypeId,
      title,
      description,
      startTime,
      endTime,
      timezone,
      maxParticipants = 1,
    }: {
      sessionTypeId: number;
      title?: string;
      description?: string;
      startTime: string;
      endTime: string;
      timezone: string;
      maxParticipants?: number;
    }) => {
      const { data, error } = await supabase
        .from('sessions')
        .insert({
          session_type_id: sessionTypeId,
          title,
          description,
          start_time: startTime,
          end_time: endTime,
          timezone,
          max_participants: maxParticipants,
          is_available: true,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-sessions'] });
    },
  });
};

// User analytics data
export const useUserAnalytics = () => {
  return useQuery({
    queryKey: ['user-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);
      
      if (error) throw error;
      return data;
    },
  });
};

// Session types
export const useSessionTypes = () => {
  return useQuery({
    queryKey: ['session-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('session_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
};

// Revenue analytics
export const useRevenueAnalytics = () => {
  return useQuery({
    queryKey: ['revenue-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          payment_amount,
          payment_status,
          created_at,
          sessions (
            session_types (
              name
            )
          )
        `)
        .eq('payment_status', 'completed')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Group by month
      const monthlyRevenue = data.reduce((acc: any, booking) => {
        const month = new Date(booking.created_at).toISOString().slice(0, 7);
        if (!acc[month]) {
          acc[month] = {
            month,
            revenue: 0,
            bookings: 0,
          };
        }
        acc[month].revenue += booking.payment_amount || 0;
        acc[month].bookings += 1;
        return acc;
      }, {});
      
      return Object.values(monthlyRevenue);
    },
  });
};

// User growth analytics
export const useUserGrowthAnalytics = () => {
  return useQuery({
    queryKey: ['user-growth-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('created_at')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Group by month
      const monthlyGrowth = data.reduce((acc: any, profile) => {
        const month = new Date(profile.created_at).toISOString().slice(0, 7);
        if (!acc[month]) {
          acc[month] = {
            month,
            users: 0,
          };
        }
        acc[month].users += 1;
        return acc;
      }, {});
      
      return Object.values(monthlyGrowth);
    },
  });
};

// Delete session
export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', sessionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-sessions'] });
    },
  });
};

// Update session
export const useUpdateSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      sessionId,
      updates,
    }: {
      sessionId: string;
      updates: any;
    }) => {
      const { data, error } = await supabase
        .from('sessions')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sessionId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-sessions'] });
    },
  });
};
