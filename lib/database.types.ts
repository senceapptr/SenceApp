export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          created_at: string | null
          data: Json | null
          description: string | null
          id: string
          is_public: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      comment_likes: {
        Row: {
          comment_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments_with_likes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          likes_count: number | null
          question_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          question_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          question_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_selections: {
        Row: {
          coupon_id: string | null
          created_at: string | null
          id: string
          is_boosted: boolean | null
          odds: number
          question_id: string | null
          status: string | null
          vote: string
        }
        Insert: {
          coupon_id?: string | null
          created_at?: string | null
          id?: string
          is_boosted?: boolean | null
          odds: number
          question_id?: string | null
          status?: string | null
          vote: string
        }
        Update: {
          coupon_id?: string | null
          created_at?: string | null
          id?: string
          is_boosted?: boolean | null
          odds?: number
          question_id?: string | null
          status?: string | null
          vote?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_selections_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_selections_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          correct_selections: number | null
          coupon_code: string
          created_at: string | null
          display_id: number
          id: string
          is_claimed: boolean | null
          potential_win: number
          resolved_at: string | null
          selections_count: number
          stake_amount: number
          status: string | null
          total_odds: number
          user_id: string | null
        }
        Insert: {
          correct_selections?: number | null
          coupon_code: string
          created_at?: string | null
          display_id?: number
          id?: string
          is_claimed?: boolean | null
          potential_win: number
          resolved_at?: string | null
          selections_count: number
          stake_amount: number
          status?: string | null
          total_odds: number
          user_id?: string | null
        }
        Update: {
          correct_selections?: number | null
          coupon_code?: string
          created_at?: string | null
          display_id?: number
          id?: string
          is_claimed?: boolean | null
          potential_win?: number
          resolved_at?: string | null
          selections_count?: number
          stake_amount?: number
          status?: string | null
          total_odds?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupons_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_verification_codes: {
        Row: {
          attempts: number | null
          code: string
          created_at: string | null
          email: string
          expires_at: string
          id: string
          is_used: boolean | null
          user_id: string
        }
        Insert: {
          attempts?: number | null
          code: string
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          is_used?: boolean | null
          user_id: string
        }
        Update: {
          attempts?: number | null
          code?: string
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          is_used?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_verification_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      followers: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      league_chat_messages: {
        Row: {
          created_at: string | null
          id: string
          league_id: string | null
          message: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          league_id?: string | null
          message: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          league_id?: string | null
          message?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "league_chat_messages_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      league_categories: {
        Row: {
          category_id: string
          created_at: string
          league_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          league_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          league_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "league_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_categories_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      league_invitations: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          invitee_id: string | null
          inviter_id: string | null
          league_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          invitee_id?: string | null
          inviter_id?: string | null
          league_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          invitee_id?: string | null
          inviter_id?: string | null
          league_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "league_invitations_invitee_id_fkey"
            columns: ["invitee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_invitations_inviter_id_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_invitations_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      league_members: {
        Row: {
          correct_predictions: number | null
          id: string
          joined_at: string | null
          league_id: string | null
          points: number | null
          rank: number | null
          status: string | null
          total_predictions: number | null
          user_id: string | null
        }
        Insert: {
          correct_predictions?: number | null
          id?: string
          joined_at?: string | null
          league_id?: string | null
          points?: number | null
          rank?: number | null
          status?: string | null
          total_predictions?: number | null
          user_id?: string | null
        }
        Update: {
          correct_predictions?: number | null
          id?: string
          joined_at?: string | null
          league_id?: string | null
          points?: number | null
          rank?: number | null
          status?: string | null
          total_predictions?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "league_members_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      league_questions: {
        Row: {
          created_at: string | null
          id: string
          league_id: string | null
          points: number | null
          question_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          league_id?: string | null
          points?: number | null
          question_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          league_id?: string | null
          points?: number | null
          question_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "league_questions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      league_votes: {
        Row: {
          created_at: string | null
          id: string
          league_id: string | null
          odds_at_vote: number
          points_earned: number | null
          question_id: string | null
          resolved_at: string | null
          status: string | null
          user_id: string | null
          vote: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          league_id?: string | null
          odds_at_vote: number
          points_earned?: number | null
          question_id?: string | null
          resolved_at?: string | null
          status?: string | null
          user_id?: string | null
          vote: string
        }
        Update: {
          created_at?: string | null
          id?: string
          league_id?: string | null
          odds_at_vote?: number
          points_earned?: number | null
          question_id?: string | null
          resolved_at?: string | null
          status?: string | null
          user_id?: string | null
          vote?: string
        }
        Relationships: [
          {
            foreignKeyName: "league_votes_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_votes_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leagues: {
        Row: {
          category_id: string | null
          created_at: string | null
          creator_id: string | null
          current_members: number | null
          description: string | null
          end_date: string | null
          entry_fee: number | null
          id: string
          icon_color: string
          icon_name: string
          image_url: string | null
          is_featured: boolean | null
          league_code: string
          max_members: number | null
          name: string
          prize_pool: number | null
          start_date: string | null
          status: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          creator_id?: string | null
          current_members?: number | null
          description?: string | null
          end_date?: string | null
          entry_fee?: number | null
          id?: string
          icon_color?: string
          icon_name?: string
          image_url?: string | null
          is_featured?: boolean | null
          league_code: string
          max_members?: number | null
          name: string
          prize_pool?: number | null
          start_date?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          creator_id?: string | null
          current_members?: number | null
          description?: string | null
          end_date?: string | null
          entry_fee?: number | null
          id?: string
          icon_color?: string
          icon_name?: string
          image_url?: string | null
          is_featured?: boolean | null
          league_code?: string
          max_members?: number | null
          name?: string
          prize_pool?: number | null
          start_date?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leagues_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leagues_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      market_items: {
        Row: {
          badge: string | null
          category_id: string | null
          created_at: string | null
          description: string | null
          effect_data: Json | null
          featured: boolean | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          original_price: number | null
          price: number
          requires_shipping: boolean
          stock: number | null
          status: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          badge?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          effect_data?: Json | null
          featured?: boolean | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          original_price?: number | null
          price: number
          requires_shipping?: boolean
          stock?: number | null
          status?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          badge?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          effect_data?: Json | null
          featured?: boolean | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          original_price?: number | null
          price?: number
          requires_shipping?: boolean
          stock?: number | null
          status?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "market_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          coupon_results: boolean | null
          created_at: string | null
          friend_requests: boolean | null
          id: string
          league_updates: boolean | null
          marketing_emails: boolean | null
          prediction_results: boolean | null
          system_announcements: boolean | null
          task_completions: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          coupon_results?: boolean | null
          created_at?: string | null
          friend_requests?: boolean | null
          id?: string
          league_updates?: boolean | null
          marketing_emails?: boolean | null
          prediction_results?: boolean | null
          system_announcements?: boolean | null
          task_completions?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          coupon_results?: boolean | null
          created_at?: string | null
          friend_requests?: boolean | null
          id?: string
          league_updates?: boolean | null
          marketing_emails?: boolean | null
          prediction_results?: boolean | null
          system_announcements?: boolean | null
          task_completions?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          priority: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          priority?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          priority?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      odds_history: {
        Row: {
          created_at: string | null
          id: string
          no_odds: number
          no_percentage: number | null
          question_id: string | null
          raw_no_odds: number | null
          raw_yes_odds: number | null
          real_no_amount: number
          real_yes_amount: number
          total_no_pool: number
          total_votes: number | null
          total_yes_pool: number
          virtual_no_amount: number
          virtual_yes_amount: number
          yes_odds: number
          yes_percentage: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          no_odds: number
          no_percentage?: number | null
          question_id?: string | null
          raw_no_odds?: number | null
          raw_yes_odds?: number | null
          real_no_amount?: number
          real_yes_amount?: number
          total_no_pool?: number
          total_votes?: number | null
          total_yes_pool?: number
          virtual_no_amount?: number
          virtual_yes_amount?: number
          yes_odds: number
          yes_percentage?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          no_odds?: number
          no_percentage?: number | null
          question_id?: string | null
          raw_no_odds?: number | null
          raw_yes_odds?: number | null
          real_no_amount?: number
          real_yes_amount?: number
          total_no_pool?: number
          total_votes?: number | null
          total_yes_pool?: number
          virtual_no_amount?: number
          virtual_yes_amount?: number
          yes_odds?: number
          yes_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "odds_history_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      predictions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          odds: number
          potential_win: number
          question_id: string | null
          resolved_at: string | null
          status: string | null
          user_id: string | null
          vote: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          odds: number
          potential_win: number
          question_id?: string | null
          resolved_at?: string | null
          status?: string | null
          user_id?: string | null
          vote: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          odds?: number
          potential_win?: number
          question_id?: string | null
          resolved_at?: string | null
          status?: string | null
          user_id?: string | null
          vote?: string
        }
        Relationships: [
          {
            foreignKeyName: "predictions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "predictions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          cover_image: string | null
          created_at: string | null
          credits: number | null
          email: string
          experience: number | null
          follower_count: number | null
          following_count: number | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          is_banned: boolean | null
          is_verified: boolean | null
          league_quota: number
          level: number | null
          profile_image: string | null
          tickets: number
          updated_at: string | null
          username: string
        }
        Insert: {
          bio?: string | null
          cover_image?: string | null
          created_at?: string | null
          credits?: number | null
          email: string
          experience?: number | null
          follower_count?: number | null
          following_count?: number | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          is_banned?: boolean | null
          is_verified?: boolean | null
          league_quota?: number
          level?: number | null
          profile_image?: string | null
          tickets?: number
          updated_at?: string | null
          username: string
        }
        Update: {
          bio?: string | null
          cover_image?: string | null
          created_at?: string | null
          credits?: number | null
          email?: string
          experience?: number | null
          follower_count?: number | null
          following_count?: number | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          is_banned?: boolean | null
          is_verified?: boolean | null
          league_quota?: number
          level?: number | null
          profile_image?: string | null
          tickets?: number
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      question_risk_limits: {
        Row: {
          created_at: string | null
          current_no_exposure: number | null
          current_yes_exposure: number | null
          id: string
          is_betting_paused: boolean | null
          max_exposure: number | null
          max_exposure_reached_at: string | null
          max_single_bet: number | null
          pause_reason: string | null
          question_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_no_exposure?: number | null
          current_yes_exposure?: number | null
          id?: string
          is_betting_paused?: boolean | null
          max_exposure?: number | null
          max_exposure_reached_at?: string | null
          max_single_bet?: number | null
          pause_reason?: string | null
          question_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_no_exposure?: number | null
          current_yes_exposure?: number | null
          id?: string
          is_betting_paused?: boolean | null
          max_exposure?: number | null
          max_exposure_reached_at?: string | null
          max_single_bet?: number | null
          pause_reason?: string | null
          question_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_risk_limits_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: true
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_statistics: {
        Row: {
          id: string
          no_amount: number | null
          question_id: string | null
          total_amount: number | null
          total_predictions: number | null
          unique_users: number | null
          updated_at: string | null
          yes_amount: number | null
        }
        Insert: {
          id?: string
          no_amount?: number | null
          question_id?: string | null
          total_amount?: number | null
          total_predictions?: number | null
          unique_users?: number | null
          updated_at?: string | null
          yes_amount?: number | null
        }
        Update: {
          id?: string
          no_amount?: number | null
          question_id?: string | null
          total_amount?: number | null
          total_predictions?: number | null
          unique_users?: number | null
          updated_at?: string | null
          yes_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "question_statistics_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: true
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          ai_analysis: Json | null
          category_id: string | null
          commission_rate: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_trending: boolean | null
          last_odds_update: string | null
          no_odds: number | null
          no_percentage: number | null
          no_votes: number | null
          publish_date: string | null
          raw_no_odds: number | null
          raw_yes_odds: number | null
          rejection_reason: string | null
          resolution_admin_note: string | null
          resolution_source_display: string | null
          resolved_at: string | null
          result: string | null
          secondary_category_id: string | null
          status: string | null
          suggested_result: string | null
          suggested_result_source: string | null
          suggested_result_source_detail: string | null
          third_category_id: string | null
          title: string
          total_amount: number | null
          total_votes: number | null
          updated_at: string | null
          use_dynamic_odds: boolean | null
          virtual_no_amount: number | null
          virtual_yes_amount: number | null
          yes_odds: number | null
          yes_percentage: number | null
          yes_votes: number | null
        }
        Insert: {
          ai_analysis?: Json | null
          category_id?: string | null
          commission_rate?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date: string
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_trending?: boolean | null
          last_odds_update?: string | null
          no_odds?: number | null
          no_percentage?: number | null
          no_votes?: number | null
          publish_date?: string | null
          raw_no_odds?: number | null
          raw_yes_odds?: number | null
          rejection_reason?: string | null
          resolution_admin_note?: string | null
          resolution_source_display?: string | null
          resolved_at?: string | null
          result?: string | null
          secondary_category_id?: string | null
          status?: string | null
          suggested_result?: string | null
          suggested_result_source?: string | null
          suggested_result_source_detail?: string | null
          third_category_id?: string | null
          title: string
          total_amount?: number | null
          total_votes?: number | null
          updated_at?: string | null
          use_dynamic_odds?: boolean | null
          virtual_no_amount?: number | null
          virtual_yes_amount?: number | null
          yes_odds?: number | null
          yes_percentage?: number | null
          yes_votes?: number | null
        }
        Update: {
          ai_analysis?: Json | null
          category_id?: string | null
          commission_rate?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_trending?: boolean | null
          last_odds_update?: string | null
          no_odds?: number | null
          no_percentage?: number | null
          no_votes?: number | null
          publish_date?: string | null
          raw_no_odds?: number | null
          raw_yes_odds?: number | null
          rejection_reason?: string | null
          resolution_admin_note?: string | null
          resolution_source_display?: string | null
          resolved_at?: string | null
          result?: string | null
          secondary_category_id?: string | null
          status?: string | null
          suggested_result?: string | null
          suggested_result_source?: string | null
          suggested_result_source_detail?: string | null
          third_category_id?: string | null
          title?: string
          total_amount?: number | null
          total_votes?: number | null
          updated_at?: string | null
          use_dynamic_odds?: boolean | null
          virtual_no_amount?: number | null
          virtual_yes_amount?: number | null
          yes_odds?: number | null
          yes_percentage?: number | null
          yes_votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_secondary_category_id_fkey"
            columns: ["secondary_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_third_category_id_fkey"
            columns: ["third_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      system_config: {
        Row: {
          description: string | null
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          requirement_type: string
          requirement_value: number
          reset_period: string | null
          reward_credits: number
          reward_experience: number | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          requirement_type: string
          requirement_value: number
          reset_period?: string | null
          reward_credits: number
          reward_experience?: number | null
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          requirement_type?: string
          requirement_value?: number
          reset_period?: string | null
          reward_credits?: number
          reward_experience?: number | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      user_daily_games: {
        Row: {
          created_at: string | null
          daily_bonus_amount: number | null
          daily_bonus_claimed: boolean | null
          daily_progress: number | null
          daily_spin_reward: number | null
          daily_spin_used: boolean | null
          date: string
          higher_lower_completed: boolean | null
          higher_lower_reward: number | null
          id: string
          updated_at: string | null
          user_id: string
          zip_completed: boolean | null
          zip_reward: number | null
        }
        Insert: {
          created_at?: string | null
          daily_bonus_amount?: number | null
          daily_bonus_claimed?: boolean | null
          daily_progress?: number | null
          daily_spin_reward?: number | null
          daily_spin_used?: boolean | null
          date?: string
          higher_lower_completed?: boolean | null
          higher_lower_reward?: number | null
          id?: string
          updated_at?: string | null
          user_id: string
          zip_completed?: boolean | null
          zip_reward?: number | null
        }
        Update: {
          created_at?: string | null
          daily_bonus_amount?: number | null
          daily_bonus_claimed?: boolean | null
          daily_progress?: number | null
          daily_spin_reward?: number | null
          daily_spin_used?: boolean | null
          date?: string
          higher_lower_completed?: boolean | null
          higher_lower_reward?: number | null
          id?: string
          updated_at?: string | null
          user_id?: string
          zip_completed?: boolean | null
          zip_reward?: number | null
        }
        Relationships: []
      }
      user_purchases: {
        Row: {
          created_at: string | null
          id: string
          item_id: string | null
          purchased_at: string | null
          quantity: number | null
          requires_shipping: boolean
          shipping_address: Json | null
          shipping_status: string
          status: string | null
          total_price: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id?: string | null
          purchased_at?: string | null
          quantity?: number | null
          requires_shipping?: boolean
          shipping_address?: Json | null
          shipping_status?: string
          status?: string | null
          total_price: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string | null
          purchased_at?: string | null
          quantity?: number | null
          requires_shipping?: boolean
          shipping_address?: Json | null
          shipping_status?: string
          status?: string | null
          total_price?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_purchases_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "market_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          allow_friend_requests: boolean | null
          created_at: string | null
          email_notifications: boolean | null
          id: string
          language: string | null
          notifications_enabled: boolean | null
          privacy_level: string | null
          push_notifications: boolean | null
          show_online_status: boolean | null
          sound_enabled: boolean | null
          theme: string | null
          updated_at: string | null
          user_id: string | null
          vibration_enabled: boolean | null
        }
        Insert: {
          allow_friend_requests?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          privacy_level?: string | null
          push_notifications?: boolean | null
          show_online_status?: boolean | null
          sound_enabled?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string | null
          vibration_enabled?: boolean | null
        }
        Update: {
          allow_friend_requests?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          privacy_level?: string | null
          push_notifications?: boolean | null
          show_online_status?: boolean | null
          sound_enabled?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string | null
          vibration_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          accuracy_rate: number | null
          correct_predictions: number | null
          created_at: string | null
          current_streak: number | null
          id: string
          longest_streak: number | null
          total_coupons: number | null
          total_earnings: number | null
          total_predictions: number | null
          updated_at: string | null
          user_id: string | null
          won_coupons: number | null
        }
        Insert: {
          accuracy_rate?: number | null
          correct_predictions?: number | null
          created_at?: string | null
          current_streak?: number | null
          id?: string
          longest_streak?: number | null
          total_coupons?: number | null
          total_earnings?: number | null
          total_predictions?: number | null
          updated_at?: string | null
          user_id?: string | null
          won_coupons?: number | null
        }
        Update: {
          accuracy_rate?: number | null
          correct_predictions?: number | null
          created_at?: string | null
          current_streak?: number | null
          id?: string
          longest_streak?: number | null
          total_coupons?: number | null
          total_earnings?: number | null
          total_predictions?: number | null
          updated_at?: string | null
          user_id?: string | null
          won_coupons?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tasks: {
        Row: {
          claimed_at: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          is_claimed: boolean | null
          is_completed: boolean | null
          progress: number | null
          reset_at: string | null
          task_id: string | null
          user_id: string | null
        }
        Insert: {
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_claimed?: boolean | null
          is_completed?: boolean | null
          progress?: number | null
          reset_at?: string | null
          task_id?: string | null
          user_id?: string | null
        }
        Update: {
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_claimed?: boolean | null
          is_completed?: boolean | null
          progress?: number | null
          reset_at?: string | null
          task_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      zip_puzzles: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          cells: Json
          created_at: string | null
          daily_date: string
          difficulty: string | null
          id: string
          size: number
          status: string | null
          total_numbers: number
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          cells: Json
          created_at?: string | null
          daily_date: string
          difficulty?: string | null
          id?: string
          size?: number
          status?: string | null
          total_numbers: number
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          cells?: Json
          created_at?: string | null
          daily_date?: string
          difficulty?: string | null
          id?: string
          size?: number
          status?: string | null
          total_numbers?: number
        }
        Relationships: [
          {
            foreignKeyName: "zip_puzzles_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      comments_with_likes: {
        Row: {
          content: string | null
          created_at: string | null
          id: string | null
          likes_count: number | null
          question_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_league_vote_points: {
        Args: { p_odds: number; p_result: string; p_vote: string }
        Returns: number
      }
      claim_coupon_reward: { Args: { coupon_id_param: string }; Returns: Json }
      cleanup_expired_verification_codes: { Args: never; Returns: undefined }
      close_expired_questions: {
        Args: never
        Returns: {
          closed_count: number
        }[]
      }
      decrease_user_credits: {
        Args: { amount_param: number; user_id_param: string }
        Returns: undefined
      }
      get_config_value: {
        Args: { config_key: string; default_value?: string }
        Returns: string
      }
      get_follower_count: { Args: { p_user_id: string }; Returns: number }
      get_following_count: { Args: { p_user_id: string }; Returns: number }
      get_unanswered_league_questions: {
        Args: { p_league_id: string; p_limit?: number; p_user_id: string }
        Returns: {
          category_icon: string
          category_name: string
          description: string
          end_date: string
          id: string
          image_url: string
          no_odds: number
          no_percentage: number
          title: string
          total_votes: number
          yes_odds: number
          yes_percentage: number
        }[]
      }
      get_user_coupons_with_selections: {
        Args: { user_id_param: string }
        Returns: {
          correct_selections: number
          coupon_code: string
          coupon_selections: Json
          created_at: string
          display_id: number
          id: string
          potential_win: number
          resolved_at: string
          selections_count: number
          stake_amount: number
          status: string
          total_odds: number
          user_id: string
        }[]
      }
      increase_user_credits: {
        Args: { amount_param: number; user_id_param: string }
        Returns: undefined
      }
      is_following: {
        Args: { p_follower_id: string; p_following_id: string }
        Returns: boolean
      }
      purchase_market_item: {
        Args: { p_item_id: string; p_quantity?: number; p_shipping_address?: Json }
        Returns: {
          created_at: string | null
          id: string
          item_id: string | null
          purchased_at: string | null
          quantity: number | null
          requires_shipping: boolean
          shipping_address: Json | null
          shipping_status: string
          status: string | null
          total_price: number
          updated_at: string | null
          user_id: string | null
        }
      }
      recalculate_all_active_odds: {
        Args: never
        Returns: {
          new_no_odds: number
          new_yes_odds: number
          old_no_odds: number
          old_yes_odds: number
          question_id: string
        }[]
      }
      recalculate_question_odds: {
        Args: { target_question_id: string }
        Returns: undefined
      }
      resolve_coupon: { Args: { coupon_id_param: string }; Returns: undefined }
      resolve_league_votes_for_question: {
        Args: { p_question_id: string; p_result: string }
        Returns: number
      }
      update_coupon_status_if_resolved: {
        Args: { coupon_id_param: string }
        Returns: undefined
      }
      update_question_vote_counts_for_question: {
        Args: { target_question_id: string }
        Returns: undefined
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
