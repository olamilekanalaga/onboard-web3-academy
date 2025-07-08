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
      card_transactions: {
        Row: {
          amount: number
          authorization_code: string | null
          card_id: string
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          is_recurring: boolean | null
          merchant_category: string | null
          merchant_id: string | null
          merchant_info: Json | null
          merchant_name: string
          processed_at: string | null
          recurring_id: string | null
          timestamp: string | null
          user_id: string
        }
        Insert: {
          amount: number
          authorization_code?: string | null
          card_id: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          merchant_category?: string | null
          merchant_id?: string | null
          merchant_info?: Json | null
          merchant_name: string
          processed_at?: string | null
          recurring_id?: string | null
          timestamp?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          authorization_code?: string | null
          card_id?: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          merchant_category?: string | null
          merchant_id?: string | null
          merchant_info?: Json | null
          merchant_name?: string
          processed_at?: string | null
          recurring_id?: string | null
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
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
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_edited: boolean | null
          message_type: string | null
          reactions: Json | null
          reply_to_id: string | null
          room_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_edited?: boolean | null
          message_type?: string | null
          reactions?: Json | null
          reply_to_id?: string | null
          room_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_edited?: boolean | null
          message_type?: string | null
          reactions?: Json | null
          reply_to_id?: string | null
          room_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_room_members: {
        Row: {
          id: string
          joined_at: string | null
          last_read_at: string | null
          role: string | null
          room_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          role?: string | null
          room_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          role?: string | null
          room_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_room_members_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          course_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          last_message_at: string | null
          max_members: number | null
          members_count: number | null
          name: string
          room_type: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          last_message_at?: string | null
          max_members?: number | null
          members_count?: number | null
          name: string
          room_type: string
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          last_message_at?: string | null
          max_members?: number | null
          members_count?: number | null
          name?: string
          room_type?: string
        }
        Relationships: []
      }
      countries: {
        Row: {
          code: string
          created_at: string | null
          flag_emoji: string | null
          id: number
          is_active: boolean | null
          name: string
          timezone: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          flag_emoji?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          timezone?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          flag_emoji?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          timezone?: string | null
        }
        Relationships: []
      }
      course_reminders: {
        Row: {
          action_url: string | null
          course_id: string
          created_at: string | null
          id: string
          is_dismissed: boolean | null
          is_read: boolean | null
          message: string
          reminder_type: string
          scheduled_for: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          course_id: string
          created_at?: string | null
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          message: string
          reminder_type: string
          scheduled_for?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          course_id?: string
          created_at?: string | null
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          message?: string
          reminder_type?: string
          scheduled_for?: string | null
          title?: string
          user_id?: string | null
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
      crypto_deposits: {
        Row: {
          amount_crypto: number
          amount_ngn: number
          amount_usd: number
          block_height: number | null
          confirmations: number | null
          confirmed_at: string | null
          created_at: string | null
          detected_at: string | null
          exchange_rate_crypto_usd: number | null
          exchange_rate_usd_ngn: number
          id: string
          metadata: Json | null
          processed_at: string | null
          required_confirmations: number | null
          status: string | null
          token_mint: string
          token_symbol: string
          transaction_signature: string | null
          updated_at: string | null
          user_id: string
          wallet_address: string
        }
        Insert: {
          amount_crypto: number
          amount_ngn: number
          amount_usd: number
          block_height?: number | null
          confirmations?: number | null
          confirmed_at?: string | null
          created_at?: string | null
          detected_at?: string | null
          exchange_rate_crypto_usd?: number | null
          exchange_rate_usd_ngn: number
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          required_confirmations?: number | null
          status?: string | null
          token_mint: string
          token_symbol: string
          transaction_signature?: string | null
          updated_at?: string | null
          user_id: string
          wallet_address: string
        }
        Update: {
          amount_crypto?: number
          amount_ngn?: number
          amount_usd?: number
          block_height?: number | null
          confirmations?: number | null
          confirmed_at?: string | null
          created_at?: string | null
          detected_at?: string | null
          exchange_rate_crypto_usd?: number | null
          exchange_rate_usd_ngn?: number
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          required_confirmations?: number | null
          status?: string | null
          token_mint?: string
          token_symbol?: string
          transaction_signature?: string | null
          updated_at?: string | null
          user_id?: string
          wallet_address?: string
        }
        Relationships: []
      }
      detected_recurring_payments: {
        Row: {
          amount: number
          auto_detected: boolean | null
          card_id: string
          created_at: string | null
          frequency: string
          id: string
          last_payment_date: string | null
          merchant_info: Json
          next_payment_date: string
          status: string | null
          updated_at: string | null
          user_confirmed: boolean | null
          user_id: string
        }
        Insert: {
          amount: number
          auto_detected?: boolean | null
          card_id: string
          created_at?: string | null
          frequency: string
          id?: string
          last_payment_date?: string | null
          merchant_info: Json
          next_payment_date: string
          status?: string | null
          updated_at?: string | null
          user_confirmed?: boolean | null
          user_id: string
        }
        Update: {
          amount?: number
          auto_detected?: boolean | null
          card_id?: string
          created_at?: string | null
          frequency?: string
          id?: string
          last_payment_date?: string | null
          merchant_info?: Json
          next_payment_date?: string
          status?: string | null
          updated_at?: string | null
          user_confirmed?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      direct_messages: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read_at: string | null
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read_at?: string | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read_at?: string | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "direct_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "direct_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exchange_rates: {
        Row: {
          ask_rate: number | null
          bid_rate: number | null
          created_at: string | null
          from_currency: string
          id: string
          is_active: boolean | null
          rate: number
          source: string
          source_priority: number | null
          to_currency: string
          updated_at: string | null
          valid_from: string | null
          valid_until: string
        }
        Insert: {
          ask_rate?: number | null
          bid_rate?: number | null
          created_at?: string | null
          from_currency: string
          id?: string
          is_active?: boolean | null
          rate: number
          source: string
          source_priority?: number | null
          to_currency: string
          updated_at?: string | null
          valid_from?: string | null
          valid_until: string
        }
        Update: {
          ask_rate?: number | null
          bid_rate?: number | null
          created_at?: string | null
          from_currency?: string
          id?: string
          is_active?: boolean | null
          rate?: number
          source?: string
          source_priority?: number | null
          to_currency?: string
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string
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
      merchant_info: {
        Row: {
          category: string
          confidence_score: number | null
          created_at: string | null
          display_name: string
          id: string
          is_recurring_capable: boolean | null
          logo: string | null
          name: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          category?: string
          confidence_score?: number | null
          created_at?: string | null
          display_name: string
          id?: string
          is_recurring_capable?: boolean | null
          logo?: string | null
          name: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          category?: string
          confidence_score?: number | null
          created_at?: string | null
          display_name?: string
          id?: string
          is_recurring_capable?: boolean | null
          logo?: string | null
          name?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          course_reminders: boolean | null
          created_at: string | null
          email_notifications: boolean | null
          id: string
          push_notifications: boolean | null
          reminder_frequency: string | null
          social_notifications: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          course_reminders?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          push_notifications?: boolean | null
          reminder_frequency?: string | null
          social_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          course_reminders?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          push_notifications?: boolean | null
          reminder_frequency?: string | null
          social_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      off_ramp_transactions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          crypto_amount: number
          crypto_deposit_id: string
          crypto_symbol: string
          exchange_rate: number
          fee_amount: number | null
          id: string
          net_amount: number
          ngn_amount: number
          processing_duration_seconds: number | null
          rate_expires_at: string | null
          rate_locked_at: string | null
          started_at: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          withdrawal_request_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          crypto_amount: number
          crypto_deposit_id: string
          crypto_symbol: string
          exchange_rate: number
          fee_amount?: number | null
          id?: string
          net_amount: number
          ngn_amount: number
          processing_duration_seconds?: number | null
          rate_expires_at?: string | null
          rate_locked_at?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          withdrawal_request_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          crypto_amount?: number
          crypto_deposit_id?: string
          crypto_symbol?: string
          exchange_rate?: number
          fee_amount?: number | null
          id?: string
          net_amount?: number
          ngn_amount?: number
          processing_duration_seconds?: number | null
          rate_expires_at?: string | null
          rate_locked_at?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          withdrawal_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "off_ramp_transactions_crypto_deposit_id_fkey"
            columns: ["crypto_deposit_id"]
            isOneToOne: false
            referencedRelation: "crypto_deposits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "off_ramp_transactions_withdrawal_request_id_fkey"
            columns: ["withdrawal_request_id"]
            isOneToOne: false
            referencedRelation: "withdrawal_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_attempts: {
        Row: {
          actual_provider: string | null
          amount: number
          attempted_at: string
          bank_code: string
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          fallback_used: boolean | null
          id: string
          nibss_available: boolean
          processing_time_ms: number | null
          recommended_provider: string
          reference: string
          success: boolean | null
          user_id: string
        }
        Insert: {
          actual_provider?: string | null
          amount: number
          attempted_at: string
          bank_code: string
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          fallback_used?: boolean | null
          id?: string
          nibss_available: boolean
          processing_time_ms?: number | null
          recommended_provider: string
          reference: string
          success?: boolean | null
          user_id: string
        }
        Update: {
          actual_provider?: string | null
          amount?: number
          attempted_at?: string
          bank_code?: string
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          fallback_used?: boolean | null
          id?: string
          nibss_available?: boolean
          processing_time_ms?: number | null
          recommended_provider?: string
          reference?: string
          success?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country_code: string | null
          country_id: number | null
          country_name: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          follow_flow_completed: boolean | null
          full_name: string | null
          id: string
          language_code: string | null
          last_name: string | null
          phone: string | null
          timezone: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          country_code?: string | null
          country_id?: number | null
          country_name?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          follow_flow_completed?: boolean | null
          full_name?: string | null
          id: string
          language_code?: string | null
          last_name?: string | null
          phone?: string | null
          timezone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          country_code?: string | null
          country_id?: number | null
          country_name?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          follow_flow_completed?: boolean | null
          full_name?: string | null
          id?: string
          language_code?: string | null
          last_name?: string | null
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
      progress_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_comment_id: string | null
          progress_feed_id: string | null
          reactions_count: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          progress_feed_id?: string | null
          reactions_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          progress_feed_id?: string | null
          reactions_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "progress_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_comments_progress_feed_id_fkey"
            columns: ["progress_feed_id"]
            isOneToOne: false
            referencedRelation: "progress_feed"
            referencedColumns: ["id"]
          },
        ]
      }
      progress_feed: {
        Row: {
          activity_type: string
          comments_count: number | null
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          metadata: Json | null
          reactions_count: number | null
          title: string
          user_id: string | null
        }
        Insert: {
          activity_type: string
          comments_count?: number | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          reactions_count?: number | null
          title: string
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          comments_count?: number | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          reactions_count?: number | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      progress_reactions: {
        Row: {
          created_at: string | null
          id: string
          progress_feed_id: string | null
          reaction_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          progress_feed_id?: string | null
          reaction_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          progress_feed_id?: string | null
          reaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_reactions_progress_feed_id_fkey"
            columns: ["progress_feed_id"]
            isOneToOne: false
            referencedRelation: "progress_feed"
            referencedColumns: ["id"]
          },
        ]
      }
      push_notification_tokens: {
        Row: {
          created_at: string | null
          device_type: string | null
          id: string
          is_active: boolean | null
          token: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_type?: string | null
          id?: string
          is_active?: boolean | null
          token: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_type?: string | null
          id?: string
          is_active?: boolean | null
          token?: string
          user_id?: string | null
        }
        Relationships: []
      }
      quiz_results: {
        Row: {
          completed_at: string | null
          course_id: string
          created_at: string | null
          id: string
          passed: boolean
          questions_answered: Json | null
          score: number
          time_taken: number | null
          updated_at: string | null
          user_id: string | null
          xp_earned: number | null
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          created_at?: string | null
          id?: string
          passed: boolean
          questions_answered?: Json | null
          score: number
          time_taken?: number | null
          updated_at?: string | null
          user_id?: string | null
          xp_earned?: number | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          created_at?: string | null
          id?: string
          passed?: boolean
          questions_answered?: Json | null
          score?: number
          time_taken?: number | null
          updated_at?: string | null
          user_id?: string | null
          xp_earned?: number | null
        }
        Relationships: []
      }
      recurring_suggestions: {
        Row: {
          card_id: string
          confidence_score: number
          created_at: string | null
          id: string
          merchant_info: Json
          sample_transactions: Json | null
          status: string | null
          suggested_amount: number
          suggested_frequency: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          card_id: string
          confidence_score: number
          created_at?: string | null
          id?: string
          merchant_info: Json
          sample_transactions?: Json | null
          status?: string | null
          suggested_amount: number
          suggested_frequency: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          card_id?: string
          confidence_score?: number
          created_at?: string | null
          id?: string
          merchant_info?: Json
          sample_transactions?: Json | null
          status?: string | null
          suggested_amount?: number
          suggested_frequency?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      social_follows: {
        Row: {
          created_at: string | null
          follower_id: string | null
          following_id: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Relationships: []
      }
      social_media_requirements: {
        Row: {
          created_at: string | null
          description: string | null
          icon_url: string | null
          id: string
          is_active: boolean | null
          is_required: boolean | null
          order_index: number | null
          platform: string
          url: string
          username: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          order_index?: number | null
          platform: string
          url: string
          username: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          order_index?: number | null
          platform?: string
          url?: string
          username?: string
        }
        Relationships: []
      }
      social_progress: {
        Row: {
          activity_type: string
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          reactions_count: number | null
          title: string
          user_avatar: string | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
          xp_earned: number | null
        }
        Insert: {
          activity_type: string
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          reactions_count?: number | null
          title: string
          user_avatar?: string | null
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
          xp_earned?: number | null
        }
        Update: {
          activity_type?: string
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          reactions_count?: number | null
          title?: string
          user_avatar?: string | null
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
          xp_earned?: number | null
        }
        Relationships: []
      }
      social_reactions: {
        Row: {
          created_at: string | null
          id: string
          progress_id: string | null
          reaction_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          progress_id?: string | null
          reaction_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          progress_id?: string | null
          reaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_reactions_progress_id_fkey"
            columns: ["progress_id"]
            isOneToOne: false
            referencedRelation: "social_progress"
            referencedColumns: ["id"]
          },
        ]
      }
      supported_languages: {
        Row: {
          code: string
          created_at: string | null
          flag_emoji: string | null
          id: string
          is_active: boolean | null
          name: string
          native_name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          flag_emoji?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          native_name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          flag_emoji?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          native_name?: string
        }
        Relationships: []
      }
      system_status_log: {
        Row: {
          checked_at: string
          created_at: string | null
          flutterwave_online: boolean | null
          id: string
          monnify_online: boolean | null
          nibss_consecutive_failures: number | null
          nibss_online: boolean
          nibss_response_time: number | null
          paystack_online: boolean | null
          recommended_provider: string
          services_status: Json | null
        }
        Insert: {
          checked_at: string
          created_at?: string | null
          flutterwave_online?: boolean | null
          id?: string
          monnify_online?: boolean | null
          nibss_consecutive_failures?: number | null
          nibss_online: boolean
          nibss_response_time?: number | null
          paystack_online?: boolean | null
          recommended_provider: string
          services_status?: Json | null
        }
        Update: {
          checked_at?: string
          created_at?: string | null
          flutterwave_online?: boolean | null
          id?: string
          monnify_online?: boolean | null
          nibss_consecutive_failures?: number | null
          nibss_online?: boolean
          nibss_response_time?: number | null
          paystack_online?: boolean | null
          recommended_provider?: string
          services_status?: Json | null
        }
        Relationships: []
      }
      user_activity_log: {
        Row: {
          activity_date: string
          activity_type: string
          created_at: string | null
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          activity_date: string
          activity_type: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          activity_date?: string
          activity_type?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
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
      user_bank_accounts: {
        Row: {
          account_name: string
          account_number: string
          bank_code: string
          bank_name: string
          created_at: string | null
          id: string
          is_default: boolean | null
          is_verified: boolean | null
          last_used_at: string | null
          updated_at: string | null
          usage_count: number | null
          user_id: string
          verification_provider: string | null
          verification_reference: string | null
          verification_response: Json | null
        }
        Insert: {
          account_name: string
          account_number: string
          bank_code: string
          bank_name: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          is_verified?: boolean | null
          last_used_at?: string | null
          updated_at?: string | null
          usage_count?: number | null
          user_id: string
          verification_provider?: string | null
          verification_reference?: string | null
          verification_response?: Json | null
        }
        Update: {
          account_name?: string
          account_number?: string
          bank_code?: string
          bank_name?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          is_verified?: boolean | null
          last_used_at?: string | null
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string
          verification_provider?: string | null
          verification_reference?: string | null
          verification_response?: Json | null
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string | null
          follower_id: string | null
          following_id: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Relationships: []
      }
      user_location_history: {
        Row: {
          city: string | null
          country_code: string | null
          country_name: string | null
          detected_at: string | null
          detection_method: string | null
          id: string
          ip_address: string | null
          region: string | null
          user_id: string | null
        }
        Insert: {
          city?: string | null
          country_code?: string | null
          country_name?: string | null
          detected_at?: string | null
          detection_method?: string | null
          id?: string
          ip_address?: string | null
          region?: string | null
          user_id?: string | null
        }
        Update: {
          city?: string | null
          country_code?: string | null
          country_name?: string | null
          detected_at?: string | null
          detection_method?: string | null
          id?: string
          ip_address?: string | null
          region?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_onboarding_status: {
        Row: {
          country_selected: boolean | null
          course_reminder_count_this_week: number | null
          created_at: string | null
          first_course_started: boolean | null
          id: string
          last_course_reminder_shown: string | null
          last_social_popup_shown: string | null
          onboarding_completed: boolean | null
          profile_completed: boolean | null
          social_follows_completed: boolean | null
          social_popup_dismissed_count: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          country_selected?: boolean | null
          course_reminder_count_this_week?: number | null
          created_at?: string | null
          first_course_started?: boolean | null
          id?: string
          last_course_reminder_shown?: string | null
          last_social_popup_shown?: string | null
          onboarding_completed?: boolean | null
          profile_completed?: boolean | null
          social_follows_completed?: boolean | null
          social_popup_dismissed_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          country_selected?: boolean | null
          course_reminder_count_this_week?: number | null
          created_at?: string | null
          first_course_started?: boolean | null
          id?: string
          last_course_reminder_shown?: string | null
          last_social_popup_shown?: string | null
          onboarding_completed?: boolean | null
          profile_completed?: boolean | null
          social_follows_completed?: boolean | null
          social_popup_dismissed_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          discord_handle: string | null
          display_name: string | null
          followers_count: number | null
          following_count: number | null
          id: string
          is_public: boolean | null
          location: string | null
          show_achievements: boolean | null
          show_progress: boolean | null
          total_reactions_received: number | null
          twitter_handle: string | null
          updated_at: string | null
          user_id: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          discord_handle?: string | null
          display_name?: string | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          is_public?: boolean | null
          location?: string | null
          show_achievements?: boolean | null
          show_progress?: boolean | null
          total_reactions_received?: number | null
          twitter_handle?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          discord_handle?: string | null
          display_name?: string | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          is_public?: boolean | null
          location?: string | null
          show_achievements?: boolean | null
          show_progress?: boolean | null
          total_reactions_received?: number | null
          twitter_handle?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_at: string | null
          completed_chapters: string[] | null
          course_id: string
          created_at: string | null
          id: string
          lesson_id: string | null
          progress_percentage: number | null
          updated_at: string | null
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          completed_at?: string | null
          completed_chapters?: string[] | null
          course_id: string
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          progress_percentage?: number | null
          updated_at?: string | null
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          completed_at?: string | null
          completed_chapters?: string[] | null
          course_id?: string
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          progress_percentage?: number | null
          updated_at?: string | null
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: []
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
      user_social_follows: {
        Row: {
          created_at: string | null
          followed_at: string | null
          id: string
          is_verified: boolean | null
          platform: string
          user_id: string | null
          username: string
          verification_method: string | null
        }
        Insert: {
          created_at?: string | null
          followed_at?: string | null
          id?: string
          is_verified?: boolean | null
          platform: string
          user_id?: string | null
          username: string
          verification_method?: string | null
        }
        Update: {
          created_at?: string | null
          followed_at?: string | null
          id?: string
          is_verified?: boolean | null
          platform?: string
          user_id?: string | null
          username?: string
          verification_method?: string | null
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          achievements: string[] | null
          completed_courses: string[] | null
          created_at: string | null
          current_streak: number | null
          id: string
          last_activity_date: string | null
          level: number | null
          longest_streak: number | null
          total_study_time: number | null
          total_xp: number | null
          unlocked_courses: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achievements?: string[] | null
          completed_courses?: string[] | null
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          level?: number | null
          longest_streak?: number | null
          total_study_time?: number | null
          total_xp?: number | null
          unlocked_courses?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achievements?: string[] | null
          completed_courses?: string[] | null
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          level?: number | null
          longest_streak?: number | null
          total_study_time?: number | null
          total_xp?: number | null
          unlocked_courses?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      withdrawal_requests: {
        Row: {
          account_name: string
          account_number: string
          amount_ngn: number
          bank_code: string | null
          bank_name: string
          completed_at: string | null
          created_at: string | null
          crypto_deposit_id: string | null
          failed_at: string | null
          failure_reason: string | null
          fee_ngn: number | null
          id: string
          max_retries: number | null
          net_amount_ngn: number
          processed_at: string | null
          provider: string
          provider_reference: string | null
          provider_response: Json | null
          requested_at: string | null
          retry_count: number | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_name: string
          account_number: string
          amount_ngn: number
          bank_code?: string | null
          bank_name: string
          completed_at?: string | null
          created_at?: string | null
          crypto_deposit_id?: string | null
          failed_at?: string | null
          failure_reason?: string | null
          fee_ngn?: number | null
          id?: string
          max_retries?: number | null
          net_amount_ngn: number
          processed_at?: string | null
          provider: string
          provider_reference?: string | null
          provider_response?: Json | null
          requested_at?: string | null
          retry_count?: number | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_name?: string
          account_number?: string
          amount_ngn?: number
          bank_code?: string | null
          bank_name?: string
          completed_at?: string | null
          created_at?: string | null
          crypto_deposit_id?: string | null
          failed_at?: string | null
          failure_reason?: string | null
          fee_ngn?: number | null
          id?: string
          max_retries?: number | null
          net_amount_ngn?: number
          processed_at?: string | null
          provider?: string
          provider_reference?: string | null
          provider_response?: Json | null
          requested_at?: string | null
          retry_count?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawal_requests_crypto_deposit_id_fkey"
            columns: ["crypto_deposit_id"]
            isOneToOne: false
            referencedRelation: "crypto_deposits"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_profiles_view: {
        Row: {
          achievements: string[] | null
          completed_courses: string[] | null
          created_at: string | null
          current_streak: number | null
          id: string | null
          last_activity_date: string | null
          level: number | null
          longest_streak: number | null
          total_study_time: number | null
          total_xp: number | null
          unlocked_courses: string[] | null
          updated_at: string | null
          user_avatar: string | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      accept_suggestion: {
        Args: { p_suggestion_id: string; p_user_id: string }
        Returns: Json
      }
      create_demo_suggestion: {
        Args: { p_user_id: string; p_merchant_name: string; p_amount: number }
        Returns: Json
      }
      dismiss_suggestion: {
        Args: { p_suggestion_id: string; p_user_id: string }
        Returns: Json
      }
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
      get_comprehensive_user_analytics: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_users: number
          active_users_today: number
          active_users_week: number
          active_users_month: number
          new_users_today: number
          new_users_week: number
          new_users_month: number
          avg_session_duration: number
          total_course_completions: number
          total_xp_earned: number
        }[]
      }
      get_course_completion_analytics: {
        Args: Record<PropertyKey, never>
        Returns: {
          course_id: string
          course_name: string
          total_enrollments: number
          total_completions: number
          completion_rate: number
          avg_completion_time: number
          total_xp_awarded: number
        }[]
      }
      get_enhanced_user_country_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          country_name: string
          country_code: string
          flag_emoji: string
          user_count: number
          active_users: number
          avg_xp: number
          total_revenue: number
        }[]
      }
      get_user_activity_timeline: {
        Args: { target_user_id: string }
        Returns: {
          activity_date: string
          activity_type: string
          activity_description: string
          xp_earned: number
          course_id: string
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
      get_user_display_info: {
        Args: { user_uuid: string }
        Returns: {
          user_id: string
          email: string
          display_name: string
          avatar_url: string
        }[]
      }
      get_user_growth_analytics: {
        Args: { period_type?: string }
        Returns: {
          period_date: string
          new_users: number
          cumulative_users: number
          active_users: number
          retention_rate: number
        }[]
      }
      get_user_progress_analytics: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          email: string
          full_name: string
          country_name: string
          total_xp: number
          current_level: number
          completed_courses: string[]
          current_streak: number
          longest_streak: number
          total_study_time: number
          last_activity_date: string
          created_at: string
          course_completion_rate: number
        }[]
      }
      get_user_recurring_payments: {
        Args: { p_user_id: string }
        Returns: Json
      }
      get_user_suggestions: {
        Args: { p_user_id: string }
        Returns: Json
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
