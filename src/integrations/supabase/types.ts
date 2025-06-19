export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          permissions: Json | null
          role: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          attended: boolean | null
          booking_notes: string | null
          created_at: string | null
          feedback_comment: string | null
          feedback_rating: number | null
          id: string
          payment_amount: number | null
          payment_currency: string | null
          payment_id: string | null
          payment_status: string | null
          reminder_sent: boolean | null
          session_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          user_timezone: string | null
        }
        Insert: {
          attended?: boolean | null
          booking_notes?: string | null
          created_at?: string | null
          feedback_comment?: string | null
          feedback_rating?: number | null
          id?: string
          payment_amount?: number | null
          payment_currency?: string | null
          payment_id?: string | null
          payment_status?: string | null
          reminder_sent?: boolean | null
          session_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          user_timezone?: string | null
        }
        Update: {
          attended?: boolean | null
          booking_notes?: string | null
          created_at?: string | null
          feedback_comment?: string | null
          feedback_rating?: number | null
          id?: string
          payment_amount?: number | null
          payment_currency?: string | null
          payment_id?: string | null
          payment_status?: string | null
          reminder_sent?: boolean | null
          session_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          user_timezone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          certificate_url: string | null
          course_id: string
          id: string
          issued_at: string | null
          user_id: string
        }
        Insert: {
          certificate_url?: string | null
          course_id: string
          id?: string
          issued_at?: string | null
          user_id: string
        }
        Update: {
          certificate_url?: string | null
          course_id?: string
          id?: string
          issued_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          code: string
          created_at: string | null
          flag_emoji: string | null
          id: number
          name: string
          timezone: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          flag_emoji?: string | null
          id?: number
          name: string
          timezone?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          flag_emoji?: string | null
          id?: number
          name?: string
          timezone?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          estimated_duration: number | null
          id: string
          is_featured: boolean | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_duration?: number | null
          id?: string
          is_featured?: boolean | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_duration?: number | null
          id?: string
          is_featured?: boolean | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content: string | null
          course_id: string
          created_at: string | null
          duration: number | null
          id: string
          order_index: number
          title: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          course_id: string
          created_at?: string | null
          duration?: number | null
          id?: string
          order_index: number
          title: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          course_id?: string
          created_at?: string | null
          duration?: number | null
          id?: string
          order_index?: number
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country_id: number | null
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          timezone: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          country_id?: number | null
          created_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          timezone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          country_id?: number | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          timezone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      session_types: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number
          id: number
          is_active: boolean | null
          name: string
          price_usd: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes: number
          id?: number
          is_active?: boolean | null
          name: string
          price_usd?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: number
          is_active?: boolean | null
          name?: string
          price_usd?: number | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          end_time: string
          id: string
          is_available: boolean | null
          max_participants: number | null
          meeting_link: string | null
          meeting_password: string | null
          notes: string | null
          session_type_id: number | null
          start_time: string
          timezone: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time: string
          id?: string
          is_available?: boolean | null
          max_participants?: number | null
          meeting_link?: string | null
          meeting_password?: string | null
          notes?: string | null
          session_type_id?: number | null
          start_time: string
          timezone: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time?: string
          id?: string
          is_available?: boolean | null
          max_participants?: number | null
          meeting_link?: string | null
          meeting_password?: string | null
          notes?: string | null
          session_type_id?: number | null
          start_time?: string
          timezone?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_session_type_id_fkey"
            columns: ["session_type_id"]
            isOneToOne: false
            referencedRelation: "session_types"
            referencedColumns: ["id"]
          },
        ]
      }
      user_analytics: {
        Row: {
          city: string | null
          country_code: string | null
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          city?: string | null
          country_code?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          city?: string | null
          country_code?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_at: string | null
          course_id: string
          created_at: string | null
          id: string
          lesson_id: string | null
          progress_percentage: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          progress_percentage?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          progress_percentage?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          course_reminders: boolean | null
          created_at: string | null
          data_analytics: boolean | null
          email_notifications: boolean | null
          id: string
          language: string | null
          marketing_emails: boolean | null
          show_achievements: boolean | null
          show_progress: boolean | null
          theme: string | null
          timezone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          course_reminders?: boolean | null
          created_at?: string | null
          data_analytics?: boolean | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          marketing_emails?: boolean | null
          show_achievements?: boolean | null
          show_progress?: boolean | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          course_reminders?: boolean | null
          created_at?: string | null
          data_analytics?: boolean | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          marketing_emails?: boolean | null
          show_achievements?: boolean | null
          show_progress?: boolean | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_booking_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_bookings: number
          pending_bookings: number
          confirmed_bookings: number
          completed_bookings: number
          cancelled_bookings: number
          total_revenue: number
          avg_rating: number
        }[]
      }
      get_user_country_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          country_name: string
          country_code: string
          flag_emoji: string
          user_count: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
