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
      activity_points: {
        Row: {
          activity_type: string
          description: string | null
          id: string
          is_active: boolean
          points: number
        }
        Insert: {
          activity_type: string
          description?: string | null
          id?: string
          is_active?: boolean
          points?: number
        }
        Update: {
          activity_type?: string
          description?: string | null
          id?: string
          is_active?: boolean
          points?: number
        }
        Relationships: []
      }
      airdrops: {
        Row: {
          amount: string
          creator_address: string
          creator_name: string | null
          id: string
          received_at: string | null
          recipient_address: string
          token_id: string | null
          token_name: string
          token_symbol: string
          transaction_signature: string | null
        }
        Insert: {
          amount: string
          creator_address: string
          creator_name?: string | null
          id?: string
          received_at?: string | null
          recipient_address: string
          token_id?: string | null
          token_name: string
          token_symbol: string
          transaction_signature?: string | null
        }
        Update: {
          amount?: string
          creator_address?: string
          creator_name?: string | null
          id?: string
          received_at?: string | null
          recipient_address?: string
          token_id?: string | null
          token_name?: string
          token_symbol?: string
          transaction_signature?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "airdrops_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      bridge_transactions: {
        Row: {
          amount: number
          created_at: string | null
          destination_address: string
          destination_network: string
          destination_token: string
          destination_tx_hash: string | null
          fee: number
          id: string
          source_network: string
          source_token: string
          source_tx_hash: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          destination_address: string
          destination_network: string
          destination_token: string
          destination_tx_hash?: string | null
          fee: number
          id?: string
          source_network: string
          source_token: string
          source_tx_hash?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          destination_address?: string
          destination_network?: string
          destination_token?: string
          destination_tx_hash?: string | null
          fee?: number
          id?: string
          source_network?: string
          source_token?: string
          source_tx_hash?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          conversation_id: string
          created_at: string | null
          id: string
          is_bot: boolean | null
          message: string
          user_id: string | null
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          id?: string
          is_bot?: boolean | null
          message: string
          user_id?: string | null
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_bot?: boolean | null
          message?: string
          user_id?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          company_name: string
          company_type: string
          created_at: string | null
          creator_address: string
          credentials: string | null
          description: string | null
          employee_count: string | null
          id: string
          industry: string
          year_founded: string | null
        }
        Insert: {
          company_name: string
          company_type: string
          created_at?: string | null
          creator_address: string
          credentials?: string | null
          description?: string | null
          employee_count?: string | null
          id?: string
          industry: string
          year_founded?: string | null
        }
        Update: {
          company_name?: string
          company_type?: string
          created_at?: string | null
          creator_address?: string
          credentials?: string | null
          description?: string | null
          employee_count?: string | null
          id?: string
          industry?: string
          year_founded?: string | null
        }
        Relationships: []
      }
      distribution_recipients: {
        Row: {
          amount: string
          created_at: string | null
          distribution_id: string | null
          id: string
          metrics: Json | null
          status: string
          transaction_signature: string | null
          wallet_address: string
        }
        Insert: {
          amount: string
          created_at?: string | null
          distribution_id?: string | null
          id?: string
          metrics?: Json | null
          status?: string
          transaction_signature?: string | null
          wallet_address: string
        }
        Update: {
          amount?: string
          created_at?: string | null
          distribution_id?: string | null
          id?: string
          metrics?: Json | null
          status?: string
          transaction_signature?: string | null
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "distribution_recipients_distribution_id_fkey"
            columns: ["distribution_id"]
            isOneToOne: false
            referencedRelation: "token_distributions"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          amount: string | null
          company_id: string | null
          created_at: string | null
          id: string
          name: string
          payment_frequency: string
          role: string | null
          wallet_address: string
        }
        Insert: {
          amount?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          payment_frequency: string
          role?: string | null
          wallet_address: string
        }
        Update: {
          amount?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          payment_frequency?: string
          role?: string | null
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      game_escrow_accounts: {
        Row: {
          closed_at: string | null
          created_at: string | null
          game_room_id: string | null
          id: string
          status: string
          total_amount: number
          vault_address: string
        }
        Insert: {
          closed_at?: string | null
          created_at?: string | null
          game_room_id?: string | null
          id?: string
          status?: string
          total_amount?: number
          vault_address: string
        }
        Update: {
          closed_at?: string | null
          created_at?: string | null
          game_room_id?: string | null
          id?: string
          status?: string
          total_amount?: number
          vault_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_escrow_accounts_game_room_id_fkey"
            columns: ["game_room_id"]
            isOneToOne: true
            referencedRelation: "game_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      game_history: {
        Row: {
          difficulty: Database["public"]["Enums"]["game_difficulty"]
          ended_at: string
          game_room_id: string | null
          game_type: Database["public"]["Enums"]["game_type"]
          id: string
          player_count: number
          started_at: string
          token: string
          total_pot: number
          winner_address: string | null
        }
        Insert: {
          difficulty: Database["public"]["Enums"]["game_difficulty"]
          ended_at: string
          game_room_id?: string | null
          game_type: Database["public"]["Enums"]["game_type"]
          id?: string
          player_count: number
          started_at: string
          token: string
          total_pot: number
          winner_address?: string | null
        }
        Update: {
          difficulty?: Database["public"]["Enums"]["game_difficulty"]
          ended_at?: string
          game_room_id?: string | null
          game_type?: Database["public"]["Enums"]["game_type"]
          id?: string
          player_count?: number
          started_at?: string
          token?: string
          total_pot?: number
          winner_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_history_game_room_id_fkey"
            columns: ["game_room_id"]
            isOneToOne: false
            referencedRelation: "game_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      game_participants: {
        Row: {
          bet_amount: number
          eliminated_at: string | null
          game_room_id: string | null
          game_score: number | null
          id: string
          is_demo: boolean | null
          joined_at: string
          player_address: string
          status: string
        }
        Insert: {
          bet_amount: number
          eliminated_at?: string | null
          game_room_id?: string | null
          game_score?: number | null
          id?: string
          is_demo?: boolean | null
          joined_at?: string
          player_address: string
          status?: string
        }
        Update: {
          bet_amount?: number
          eliminated_at?: string | null
          game_room_id?: string | null
          game_score?: number | null
          id?: string
          is_demo?: boolean | null
          joined_at?: string
          player_address?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_participants_game_room_id_fkey"
            columns: ["game_room_id"]
            isOneToOne: false
            referencedRelation: "game_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      game_rooms: {
        Row: {
          created_at: string
          current_players: number
          difficulty: Database["public"]["Enums"]["game_difficulty"]
          ended_at: string | null
          entry_amount: number
          entry_fee_collected: boolean | null
          game_data: Json | null
          game_type: Database["public"]["Enums"]["game_type"]
          id: string
          max_players: number
          room_code: string
          started_at: string | null
          status: Database["public"]["Enums"]["game_status"]
          token: string
          total_pot: number
          winner_address: string | null
        }
        Insert: {
          created_at?: string
          current_players?: number
          difficulty: Database["public"]["Enums"]["game_difficulty"]
          ended_at?: string | null
          entry_amount: number
          entry_fee_collected?: boolean | null
          game_data?: Json | null
          game_type: Database["public"]["Enums"]["game_type"]
          id?: string
          max_players?: number
          room_code?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["game_status"]
          token?: string
          total_pot?: number
          winner_address?: string | null
        }
        Update: {
          created_at?: string
          current_players?: number
          difficulty?: Database["public"]["Enums"]["game_difficulty"]
          ended_at?: string | null
          entry_amount?: number
          entry_fee_collected?: boolean | null
          game_data?: Json | null
          game_type?: Database["public"]["Enums"]["game_type"]
          id?: string
          max_players?: number
          room_code?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["game_status"]
          token?: string
          total_pot?: number
          winner_address?: string | null
        }
        Relationships: []
      }
      game_transactions: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string | null
          game_room_id: string | null
          id: string
          player_address: string
          signature: string | null
          status: Database["public"]["Enums"]["game_transaction_status"] | null
          token: string
          transaction_type: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string | null
          game_room_id?: string | null
          id?: string
          player_address: string
          signature?: string | null
          status?: Database["public"]["Enums"]["game_transaction_status"] | null
          token?: string
          transaction_type: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string | null
          game_room_id?: string | null
          id?: string
          player_address?: string
          signature?: string | null
          status?: Database["public"]["Enums"]["game_transaction_status"] | null
          token?: string
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_transactions_game_room_id_fkey"
            columns: ["game_room_id"]
            isOneToOne: false
            referencedRelation: "game_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      giveaway_participants: {
        Row: {
          giveaway_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          giveaway_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          giveaway_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "giveaway_participants_giveaway_id_fkey"
            columns: ["giveaway_id"]
            isOneToOne: false
            referencedRelation: "giveaways"
            referencedColumns: ["id"]
          },
        ]
      }
      giveaways: {
        Row: {
          created_at: string
          creator_id: string
          description: string | null
          ends_at: string
          id: string
          min_user_score: number | null
          participants_count: number
          platform_fee_percentage: number | null
          prize_amount: number
          score_type: string | null
          status: string
          target_top_users: number | null
          title: string
          token_type: string
          winner_id: string | null
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          ends_at: string
          id?: string
          min_user_score?: number | null
          participants_count?: number
          platform_fee_percentage?: number | null
          prize_amount: number
          score_type?: string | null
          status?: string
          target_top_users?: number | null
          title: string
          token_type?: string
          winner_id?: string | null
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          ends_at?: string
          id?: string
          min_user_score?: number | null
          participants_count?: number
          platform_fee_percentage?: number | null
          prize_amount?: number
          score_type?: string | null
          status?: string
          target_top_users?: number | null
          title?: string
          token_type?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_creator_id"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "user_tags"
            referencedColumns: ["wallet_address"]
          },
          {
            foreignKeyName: "fk_winner_id"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "user_tags"
            referencedColumns: ["wallet_address"]
          },
        ]
      }
      group_lock_contributions: {
        Row: {
          amount: number
          contributor_address: string | null
          created_at: string
          group_lock_id: string | null
          has_approved_withdrawal: boolean | null
          id: string
          refund_date: string | null
          refund_status: string | null
          token: string
          transaction_signature: string | null
          vault_transaction_signature: string | null
        }
        Insert: {
          amount: number
          contributor_address?: string | null
          created_at?: string
          group_lock_id?: string | null
          has_approved_withdrawal?: boolean | null
          id?: string
          refund_date?: string | null
          refund_status?: string | null
          token: string
          transaction_signature?: string | null
          vault_transaction_signature?: string | null
        }
        Update: {
          amount?: number
          contributor_address?: string | null
          created_at?: string
          group_lock_id?: string | null
          has_approved_withdrawal?: boolean | null
          id?: string
          refund_date?: string | null
          refund_status?: string | null
          token?: string
          transaction_signature?: string | null
          vault_transaction_signature?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_lock_contributions_group_lock_id_fkey"
            columns: ["group_lock_id"]
            isOneToOne: false
            referencedRelation: "group_locks"
            referencedColumns: ["id"]
          },
        ]
      }
      group_lock_invites: {
        Row: {
          created_at: string | null
          expected_amount: number
          group_lock_id: string | null
          id: string
          invite_code: string
          invitee_address: string
          response_at: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          expected_amount: number
          group_lock_id?: string | null
          id?: string
          invite_code?: string
          invitee_address: string
          response_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string | null
          expected_amount?: number
          group_lock_id?: string | null
          id?: string
          invite_code?: string
          invitee_address?: string
          response_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_lock_invites_group_lock_id_fkey"
            columns: ["group_lock_id"]
            isOneToOne: false
            referencedRelation: "group_locks"
            referencedColumns: ["id"]
          },
        ]
      }
      group_locks: {
        Row: {
          cancellation_date: string | null
          cancellation_status: string | null
          contract_address: string | null
          contribution_code: string
          created_at: string
          creator_address: string
          deployment_signature: string | null
          early_unlock_fee: number | null
          edit_history: Json | null
          has_creator_contributed: boolean | null
          id: string
          invitation_only: boolean | null
          last_edited_at: string | null
          lock_type: string
          max_participants: number | null
          notes: string | null
          on_chain_status: string | null
          purpose: string
          status: string
          target_amount: number | null
          target_contributions: Json | null
          total_contributed: number | null
          unlock_date: string
          vault_address: string | null
          withdrawal_status: string | null
          withdrawn_at: string | null
        }
        Insert: {
          cancellation_date?: string | null
          cancellation_status?: string | null
          contract_address?: string | null
          contribution_code: string
          created_at?: string
          creator_address: string
          deployment_signature?: string | null
          early_unlock_fee?: number | null
          edit_history?: Json | null
          has_creator_contributed?: boolean | null
          id?: string
          invitation_only?: boolean | null
          last_edited_at?: string | null
          lock_type?: string
          max_participants?: number | null
          notes?: string | null
          on_chain_status?: string | null
          purpose: string
          status?: string
          target_amount?: number | null
          target_contributions?: Json | null
          total_contributed?: number | null
          unlock_date: string
          vault_address?: string | null
          withdrawal_status?: string | null
          withdrawn_at?: string | null
        }
        Update: {
          cancellation_date?: string | null
          cancellation_status?: string | null
          contract_address?: string | null
          contribution_code?: string
          created_at?: string
          creator_address?: string
          deployment_signature?: string | null
          early_unlock_fee?: number | null
          edit_history?: Json | null
          has_creator_contributed?: boolean | null
          id?: string
          invitation_only?: boolean | null
          last_edited_at?: string | null
          lock_type?: string
          max_participants?: number | null
          notes?: string | null
          on_chain_status?: string | null
          purpose?: string
          status?: string
          target_amount?: number | null
          target_contributions?: Json | null
          total_contributed?: number | null
          unlock_date?: string
          vault_address?: string | null
          withdrawal_status?: string | null
          withdrawn_at?: string | null
        }
        Relationships: []
      }
      lock_transactions: {
        Row: {
          amount: number
          created_at: string | null
          group_lock_id: string | null
          id: string
          lock_id: string | null
          signature: string | null
          status: string | null
          token: string
          transaction_type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          group_lock_id?: string | null
          id?: string
          lock_id?: string | null
          signature?: string | null
          status?: string | null
          token: string
          transaction_type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          group_lock_id?: string | null
          id?: string
          lock_id?: string | null
          signature?: string | null
          status?: string | null
          token?: string
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_group_lock"
            columns: ["group_lock_id"]
            isOneToOne: false
            referencedRelation: "group_locks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_lock"
            columns: ["lock_id"]
            isOneToOne: false
            referencedRelation: "locks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_lock"
            columns: ["lock_id"]
            isOneToOne: false
            referencedRelation: "personal_locks_view"
            referencedColumns: ["id"]
          },
        ]
      }
      locks: {
        Row: {
          amount: number
          created_at: string
          deposit_signature: string | null
          early_unlock_fee: number | null
          id: string
          is_recoverable: boolean | null
          legacy_status: boolean | null
          lock_duration: unknown
          lock_type: string
          notes: string | null
          on_chain_status: string | null
          purpose: string
          status: string
          token: string
          transaction_signature: string | null
          unlock_date: string
          vault_address: string | null
          vault_deployment_signature: string | null
          wallet_address: string
          withdraw_signature: string | null
          withdrawal_status: string | null
          withdrawn_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          deposit_signature?: string | null
          early_unlock_fee?: number | null
          id?: string
          is_recoverable?: boolean | null
          legacy_status?: boolean | null
          lock_duration: unknown
          lock_type?: string
          notes?: string | null
          on_chain_status?: string | null
          purpose: string
          status?: string
          token: string
          transaction_signature?: string | null
          unlock_date: string
          vault_address?: string | null
          vault_deployment_signature?: string | null
          wallet_address: string
          withdraw_signature?: string | null
          withdrawal_status?: string | null
          withdrawn_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          deposit_signature?: string | null
          early_unlock_fee?: number | null
          id?: string
          is_recoverable?: boolean | null
          legacy_status?: boolean | null
          lock_duration?: unknown
          lock_type?: string
          notes?: string | null
          on_chain_status?: string | null
          purpose?: string
          status?: string
          token?: string
          transaction_signature?: string | null
          unlock_date?: string
          vault_address?: string | null
          vault_deployment_signature?: string | null
          wallet_address?: string
          withdraw_signature?: string | null
          withdrawal_status?: string | null
          withdrawn_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      poll_votes: {
        Row: {
          id: string
          option_id: string
          poll_id: string
          user_id: string
          voted_at: string
        }
        Insert: {
          id?: string
          option_id: string
          poll_id: string
          user_id: string
          voted_at?: string
        }
        Update: {
          id?: string
          option_id?: string
          poll_id?: string
          user_id?: string
          voted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          created_at: string
          creator_id: string
          ends_at: string
          id: string
          options: Json
          question: string
          status: string
          total_votes: number
        }
        Insert: {
          created_at?: string
          creator_id: string
          ends_at: string
          id?: string
          options: Json
          question: string
          status?: string
          total_votes?: number
        }
        Update: {
          created_at?: string
          creator_id?: string
          ends_at?: string
          id?: string
          options?: Json
          question?: string
          status?: string
          total_votes?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_creator_id"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "user_tags"
            referencedColumns: ["wallet_address"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reposts: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reposts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string | null
          project_name: string | null
          total_amount_sent: number | null
          total_transactions: number | null
          wallet_address: string
        }
        Insert: {
          created_at?: string
          id?: string | null
          project_name?: string | null
          total_amount_sent?: number | null
          total_transactions?: number | null
          wallet_address: string
        }
        Update: {
          created_at?: string
          id?: string | null
          project_name?: string | null
          total_amount_sent?: number | null
          total_transactions?: number | null
          wallet_address?: string
        }
        Relationships: []
      }
      saved_recipients: {
        Row: {
          created_at: string | null
          id: string
          recipient_address: string
          recipient_name: string | null
          wallet_owner: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          recipient_address: string
          recipient_name?: string | null
          wallet_owner: string
        }
        Update: {
          created_at?: string | null
          id?: string
          recipient_address?: string
          recipient_name?: string | null
          wallet_owner?: string
        }
        Relationships: []
      }
      savings_deposits: {
        Row: {
          amount: number
          created_at: string
          id: string
          savings_plan_id: string
          token: string
          transaction_signature: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          savings_plan_id: string
          token: string
          transaction_signature: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          savings_plan_id?: string
          token?: string
          transaction_signature?: string
        }
        Relationships: [
          {
            foreignKeyName: "savings_deposits_savings_plan_id_fkey"
            columns: ["savings_plan_id"]
            isOneToOne: false
            referencedRelation: "savings_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      savings_plans: {
        Row: {
          created_at: string
          current_amount: number
          deposit_signature: string | null
          description: string | null
          end_date: string | null
          expected_yield_percentage: number
          id: string
          name: string
          plan_type: Database["public"]["Enums"]["savings_plan_type"]
          protocol: string
          start_date: string
          status: Database["public"]["Enums"]["savings_plan_status"]
          target_amount: number | null
          token: string
          updated_at: string
          user_address: string
          withdraw_date: string | null
        }
        Insert: {
          created_at?: string
          current_amount?: number
          deposit_signature?: string | null
          description?: string | null
          end_date?: string | null
          expected_yield_percentage?: number
          id?: string
          name: string
          plan_type: Database["public"]["Enums"]["savings_plan_type"]
          protocol: string
          start_date?: string
          status?: Database["public"]["Enums"]["savings_plan_status"]
          target_amount?: number | null
          token?: string
          updated_at?: string
          user_address: string
          withdraw_date?: string | null
        }
        Update: {
          created_at?: string
          current_amount?: number
          deposit_signature?: string | null
          description?: string | null
          end_date?: string | null
          expected_yield_percentage?: number
          id?: string
          name?: string
          plan_type?: Database["public"]["Enums"]["savings_plan_type"]
          protocol?: string
          start_date?: string
          status?: Database["public"]["Enums"]["savings_plan_status"]
          target_amount?: number | null
          token?: string
          updated_at?: string
          user_address?: string
          withdraw_date?: string | null
        }
        Relationships: []
      }
      security_settings: {
        Row: {
          created_at: string | null
          failed_attempts: number | null
          id: string
          last_pin_update: string | null
          locked_until: string | null
          requires_confirmation_above: number | null
          security_level: Database["public"]["Enums"]["security_level"] | null
          transaction_pin: string | null
          updated_at: string | null
          user_address: string
        }
        Insert: {
          created_at?: string | null
          failed_attempts?: number | null
          id?: string
          last_pin_update?: string | null
          locked_until?: string | null
          requires_confirmation_above?: number | null
          security_level?: Database["public"]["Enums"]["security_level"] | null
          transaction_pin?: string | null
          updated_at?: string | null
          user_address: string
        }
        Update: {
          created_at?: string | null
          failed_attempts?: number | null
          id?: string
          last_pin_update?: string | null
          locked_until?: string | null
          requires_confirmation_above?: number | null
          security_level?: Database["public"]["Enums"]["security_level"] | null
          transaction_pin?: string | null
          updated_at?: string | null
          user_address?: string
        }
        Relationships: []
      }
      social_comments: {
        Row: {
          content: string
          created_at: string
          has_voice_note: boolean | null
          id: string
          parent_id: string | null
          post_id: string
          tag_id: string | null
          user_id: string
          voice_note_url: string | null
        }
        Insert: {
          content: string
          created_at?: string
          has_voice_note?: boolean | null
          id?: string
          parent_id?: string | null
          post_id: string
          tag_id?: string | null
          user_id: string
          voice_note_url?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          has_voice_note?: boolean | null
          id?: string
          parent_id?: string | null
          post_id?: string
          tag_id?: string | null
          user_id?: string
          voice_note_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "social_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_comments_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "user_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      social_posts: {
        Row: {
          comments_count: number
          content: string
          created_at: string
          has_image: boolean | null
          has_voice_note: boolean | null
          id: string
          image_url: string | null
          is_pinned: boolean | null
          likes_count: number
          reposts_count: number | null
          tag_id: string | null
          user_id: string
          voice_note_url: string | null
        }
        Insert: {
          comments_count?: number
          content: string
          created_at?: string
          has_image?: boolean | null
          has_voice_note?: boolean | null
          id?: string
          image_url?: string | null
          is_pinned?: boolean | null
          likes_count?: number
          reposts_count?: number | null
          tag_id?: string | null
          user_id: string
          voice_note_url?: string | null
        }
        Update: {
          comments_count?: number
          content?: string
          created_at?: string
          has_image?: boolean | null
          has_voice_note?: boolean | null
          id?: string
          image_url?: string | null
          is_pinned?: boolean | null
          likes_count?: number
          reposts_count?: number | null
          tag_id?: string | null
          user_id?: string
          voice_note_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_tags"
            referencedColumns: ["wallet_address"]
          },
          {
            foreignKeyName: "social_posts_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "user_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      supported_tokens: {
        Row: {
          created_at: string | null
          decimals: number
          is_active: boolean | null
          mint_address: string
          name: string
          symbol: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          decimals: number
          is_active?: boolean | null
          mint_address: string
          name: string
          symbol: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          decimals?: number
          is_active?: boolean | null
          mint_address?: string
          name?: string
          symbol?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tag_transfer_requests: {
        Row: {
          created_at: string
          id: string
          offer_amount: number
          owner_address: string
          requestor_address: string
          status: string
          tag: string
          token: string
          transaction_signature: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          offer_amount: number
          owner_address: string
          requestor_address: string
          status?: string
          tag: string
          token?: string
          transaction_signature?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          offer_amount?: number
          owner_address?: string
          requestor_address?: string
          status?: string
          tag?: string
          token?: string
          transaction_signature?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      token_distributions: {
        Row: {
          created_at: string | null
          creator_address: string
          distribution_name: string
          distribution_type: string
          id: string
          status: string
          token_id: string | null
          total_amount: string
          total_recipients: number
          transaction_signature: string | null
        }
        Insert: {
          created_at?: string | null
          creator_address: string
          distribution_name: string
          distribution_type: string
          id?: string
          status?: string
          token_id?: string | null
          total_amount: string
          total_recipients: number
          transaction_signature?: string | null
        }
        Update: {
          created_at?: string | null
          creator_address?: string
          distribution_name?: string
          distribution_type?: string
          id?: string
          status?: string
          token_id?: string | null
          total_amount?: string
          total_recipients?: number
          transaction_signature?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "token_distributions_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      token_liquidity_pools: {
        Row: {
          created_at: string | null
          creator_address: string
          id: string
          token_amount: string
          token_id: string | null
          transaction_signature: string | null
          usdc_amount: string
        }
        Insert: {
          created_at?: string | null
          creator_address: string
          id?: string
          token_amount: string
          token_id?: string | null
          transaction_signature?: string | null
          usdc_amount: string
        }
        Update: {
          created_at?: string | null
          creator_address?: string
          id?: string
          token_amount?: string
          token_id?: string | null
          transaction_signature?: string | null
          usdc_amount?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_liquidity_pools_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      tokens: {
        Row: {
          created_at: string | null
          creator_address: string
          decimals: string
          description: string | null
          has_liquidity: boolean | null
          id: string
          initial_supply: string
          is_burnable: boolean | null
          is_mintable: boolean | null
          is_pausable: boolean | null
          logo_url: string | null
          max_supply: string | null
          name: string
          symbol: string
          token_address: string | null
          transaction_signature: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          creator_address: string
          decimals: string
          description?: string | null
          has_liquidity?: boolean | null
          id?: string
          initial_supply: string
          is_burnable?: boolean | null
          is_mintable?: boolean | null
          is_pausable?: boolean | null
          logo_url?: string | null
          max_supply?: string | null
          name: string
          symbol: string
          token_address?: string | null
          transaction_signature?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          creator_address?: string
          decimals?: string
          description?: string | null
          has_liquidity?: boolean | null
          id?: string
          initial_supply?: string
          is_burnable?: boolean | null
          is_mintable?: boolean | null
          is_pausable?: boolean | null
          logo_url?: string | null
          max_supply?: string | null
          name?: string
          symbol?: string
          token_address?: string | null
          transaction_signature?: string | null
          website?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          category: string | null
          created_at: string
          gas_fee: number | null
          id: string
          is_scheduled: boolean | null
          notes: string | null
          receipt_code: string | null
          recipients: Json
          recurring_end_date: string | null
          recurring_type: string | null
          scheduled_for: string | null
          sender_address: string
          sender_id: string | null
          signature: string
          token: string
          total_amount: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          gas_fee?: number | null
          id?: string
          is_scheduled?: boolean | null
          notes?: string | null
          receipt_code?: string | null
          recipients: Json
          recurring_end_date?: string | null
          recurring_type?: string | null
          scheduled_for?: string | null
          sender_address: string
          sender_id?: string | null
          signature: string
          token: string
          total_amount: number
        }
        Update: {
          category?: string | null
          created_at?: string
          gas_fee?: number | null
          id?: string
          is_scheduled?: boolean | null
          notes?: string | null
          receipt_code?: string | null
          recipients?: Json
          recurring_end_date?: string | null
          recurring_type?: string | null
          scheduled_for?: string | null
          sender_address?: string
          sender_id?: string | null
          signature?: string
          token?: string
          total_amount?: number
        }
        Relationships: []
      }
      user_activity_history: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          points_earned: number
          reference_id: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          id?: string
          points_earned: number
          reference_id?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          points_earned?: number
          reference_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_activity_scores: {
        Row: {
          created_at: string
          id: string
          last_activity_at: string | null
          monthly_score: number
          total_score: number
          user_id: string
          weekly_score: number
        }
        Insert: {
          created_at?: string
          id?: string
          last_activity_at?: string | null
          monthly_score?: number
          total_score?: number
          user_id: string
          weekly_score?: number
        }
        Update: {
          created_at?: string
          id?: string
          last_activity_at?: string | null
          monthly_score?: number
          total_score?: number
          user_id?: string
          weekly_score?: number
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          acquired_at: string
          badge_name: string
          badge_type: string
          claim_signature: string | null
          id: string
          is_active: boolean
          is_claimed: boolean | null
          points_boost: number
          user_id: string
        }
        Insert: {
          acquired_at?: string
          badge_name: string
          badge_type: string
          claim_signature?: string | null
          id?: string
          is_active?: boolean
          is_claimed?: boolean | null
          points_boost?: number
          user_id: string
        }
        Update: {
          acquired_at?: string
          badge_name?: string
          badge_type?: string
          claim_signature?: string | null
          id?: string
          is_active?: boolean
          is_claimed?: boolean | null
          points_boost?: number
          user_id?: string
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string
          followed_user_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          followed_user_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          followed_user_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_tags: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          location: string | null
          posts_count: number | null
          tag: string
          updated_at: string
          wallet_address: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          location?: string | null
          posts_count?: number | null
          tag: string
          updated_at?: string
          wallet_address: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          location?: string | null
          posts_count?: number | null
          tag?: string
          updated_at?: string
          wallet_address?: string
          website?: string | null
        }
        Relationships: []
      }
      vault_contributions: {
        Row: {
          amount: number
          contributor_address: string
          created_at: string | null
          id: string
          status: string | null
          transaction_signature: string | null
          vault_id: string | null
        }
        Insert: {
          amount: number
          contributor_address: string
          created_at?: string | null
          id?: string
          status?: string | null
          transaction_signature?: string | null
          vault_id?: string | null
        }
        Update: {
          amount?: number
          contributor_address?: string
          created_at?: string | null
          id?: string
          status?: string | null
          transaction_signature?: string | null
          vault_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_vault_contributions_vault"
            columns: ["vault_id"]
            isOneToOne: false
            referencedRelation: "vaults"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vault_contributions_vault_id_fkey"
            columns: ["vault_id"]
            isOneToOne: false
            referencedRelation: "vaults"
            referencedColumns: ["id"]
          },
        ]
      }
      vault_keys: {
        Row: {
          created_at: string | null
          group_lock_id: string | null
          id: string
          lock_id: string | null
          owner_address: string
          secret_key: number[]
          target_amount: number
          type: string
          vault_address: string
        }
        Insert: {
          created_at?: string | null
          group_lock_id?: string | null
          id?: string
          lock_id?: string | null
          owner_address: string
          secret_key: number[]
          target_amount: number
          type: string
          vault_address: string
        }
        Update: {
          created_at?: string | null
          group_lock_id?: string | null
          id?: string
          lock_id?: string | null
          owner_address?: string
          secret_key?: number[]
          target_amount?: number
          type?: string
          vault_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "vault_keys_group_lock_id_fkey"
            columns: ["group_lock_id"]
            isOneToOne: false
            referencedRelation: "group_locks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vault_keys_lock_id_fkey"
            columns: ["lock_id"]
            isOneToOne: false
            referencedRelation: "locks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vault_keys_lock_id_fkey"
            columns: ["lock_id"]
            isOneToOne: false
            referencedRelation: "personal_locks_view"
            referencedColumns: ["id"]
          },
        ]
      }
      vaults: {
        Row: {
          authority: string
          created_at: string | null
          group_lock_id: string
          id: string
          is_locked: boolean | null
          status: Database["public"]["Enums"]["vault_status"] | null
          target_amount: number
          token: string | null
          total_contributed: number | null
          unlock_time: string
          vault_address: string
        }
        Insert: {
          authority: string
          created_at?: string | null
          group_lock_id: string
          id?: string
          is_locked?: boolean | null
          status?: Database["public"]["Enums"]["vault_status"] | null
          target_amount: number
          token?: string | null
          total_contributed?: number | null
          unlock_time: string
          vault_address: string
        }
        Update: {
          authority?: string
          created_at?: string | null
          group_lock_id?: string
          id?: string
          is_locked?: boolean | null
          status?: Database["public"]["Enums"]["vault_status"] | null
          target_amount?: number
          token?: string | null
          total_contributed?: number | null
          unlock_time?: string
          vault_address?: string
        }
        Relationships: []
      }
      yield_protocols: {
        Row: {
          created_at: string
          current_apy: number
          description: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          max_deposit: number | null
          min_deposit: number | null
          name: string
          risk_level: string
          supported_tokens: string[]
        }
        Insert: {
          created_at?: string
          current_apy: number
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          max_deposit?: number | null
          min_deposit?: number | null
          name: string
          risk_level: string
          supported_tokens?: string[]
        }
        Update: {
          created_at?: string
          current_apy?: number
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          max_deposit?: number | null
          min_deposit?: number | null
          name?: string
          risk_level?: string
          supported_tokens?: string[]
        }
        Relationships: []
      }
    }
    Views: {
      bridge_statistics: {
        Row: {
          average_fee: number | null
          completed_transactions: number | null
          destination_network: string | null
          failed_transactions: number | null
          pending_transactions: number | null
          source_network: string | null
          total_amount: number | null
          total_transactions: number | null
        }
        Relationships: []
      }
      leaderboard: {
        Row: {
          project_name: string | null
          total_amount: number | null
          total_transactions: number | null
          wallet_address: string | null
        }
        Insert: {
          project_name?: string | null
          total_amount?: number | null
          total_transactions?: number | null
          wallet_address?: string | null
        }
        Update: {
          project_name?: string | null
          total_amount?: number | null
          total_transactions?: number | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      personal_locks_view: {
        Row: {
          amount: number | null
          created_at: string | null
          early_unlock_fee: number | null
          id: string | null
          lock_duration: unknown | null
          lock_type: string | null
          notes: string | null
          purpose: string | null
          status: string | null
          token: string | null
          unlock_date: string | null
          wallet_address: string | null
          wallet_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      award_user_badge: {
        Args: {
          p_user_id: string
          p_badge_type: string
          p_badge_name: string
          p_points_boost: number
        }
        Returns: string
      }
      calculate_lock_duration: {
        Args: { unlock_date: string }
        Returns: unknown
      }
      check_vault_key_exists: {
        Args: { vault_addr: string }
        Returns: boolean
      }
      create_notification: {
        Args: {
          p_user_id: string
          p_type: string
          p_title: string
          p_message: string
          p_metadata?: Json
        }
        Returns: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
      }
      create_user_score: {
        Args: {
          p_user_id: string
          p_total_score: number
          p_weekly_score: number
          p_monthly_score: number
        }
        Returns: string
      }
      decrement: {
        Args: { val: number }
        Returns: number
      }
      generate_contribution_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_social_leaderboard: {
        Args: { p_score_type?: string; p_limit?: number }
        Returns: {
          user_id: string
          tag: string
          display_name: string
          avatar_url: string
          score: number
          rank: number
          badge_count: number
        }[]
      }
      get_top_10_leaders: {
        Args: Record<PropertyKey, never>
        Returns: {
          wallet_address: string
          project_name: string
          total_transactions: number
          total_amount: number
          total_recipients: number
        }[]
      }
      get_user_notifications: {
        Args: { p_user_id: string }
        Returns: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }[]
      }
      increment_comment_count: {
        Args: { post_id: string }
        Returns: undefined
      }
      increment_giveaway_participants: {
        Args: { giveaway_id: string }
        Returns: undefined
      }
      increment_poll_vote: {
        Args: { p_poll_id: string; p_option_id: string }
        Returns: undefined
      }
      increment_user_stats: {
        Args: { p_wallet_address: string; p_amount: number }
        Returns: undefined
      }
      is_legacy_vault: {
        Args: { vault_addr: string }
        Returns: boolean
      }
      is_lock_withdrawable: {
        Args: { unlock_date: string }
        Returns: boolean
      }
      mark_legacy_vaults: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      mark_notification_as_read: {
        Args: { p_notification_id: string }
        Returns: undefined
      }
      process_scheduled_transactions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reset_monthly_scores: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reset_weekly_scores: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_group_lock_total: {
        Args: { p_group_lock_id: string; p_amount: number }
        Returns: undefined
      }
      update_user_score: {
        Args: {
          p_user_id: string
          p_activity_type: string
          p_reference_id?: string
        }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "user"
      game_difficulty: "easy" | "intermediate" | "hard"
      game_status: "waiting" | "in_progress" | "completed" | "cancelled"
      game_transaction_status: "pending" | "completed" | "failed" | "refunded"
      game_type: "dice" | "card_match" | "number_guess" | "memory_match"
      savings_plan_status: "active" | "completed" | "withdrawn" | "cancelled"
      savings_plan_type: "regular" | "fixed" | "flexible" | "goal"
      security_level: "low" | "medium" | "high"
      vault_status: "pending" | "active" | "completed" | "cancelled"
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
    Enums: {
      app_role: ["admin", "user"],
      game_difficulty: ["easy", "intermediate", "hard"],
      game_status: ["waiting", "in_progress", "completed", "cancelled"],
      game_transaction_status: ["pending", "completed", "failed", "refunded"],
      game_type: ["dice", "card_match", "number_guess", "memory_match"],
      savings_plan_status: ["active", "completed", "withdrawn", "cancelled"],
      savings_plan_type: ["regular", "fixed", "flexible", "goal"],
      security_level: ["low", "medium", "high"],
      vault_status: ["pending", "active", "completed", "cancelled"],
    },
  },
} as const
