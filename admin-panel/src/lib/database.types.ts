export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      attempts: {
        Row: {
          id: string
          user_id: string
          question_id: string
          response: any
          is_correct: boolean
          score_awarded: number
          time_spent_ms: number | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id: string
          user_id: string
          question_id: string
          response: any
          is_correct: boolean
          score_awarded: number
          time_spent_ms?: number | null
          created_at: string
          updated_at: string
          deleted_at?: string | null
        }
        Update: {
          id?: string | null
          user_id?: string | null
          question_id?: string | null
          response?: any | null
          is_correct?: boolean | null
          score_awarded?: number | null
          time_spent_ms?: number | null
          created_at?: string | null
          updated_at?: string | null
          deleted_at?: string | null
        }
        Relationships: []
      }
      curriculum_meta: {
        Row: {
          id: string
          version: number
          last_published_at: string | null
          updated_at: string
        }
        Insert: {
          id: string
          version: number
          last_published_at?: string | null
          updated_at: string
        }
        Update: {
          id?: string | null
          version?: number | null
          last_published_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      curriculum_snapshots: {
        Row: {
          id: string
          version: number
          published_at: string
          domains_count: number
          skills_count: number
          questions_count: number
          created_at: string
        }
        Insert: {
          id: string
          version: number
          published_at: string
          domains_count: number
          skills_count: number
          questions_count: number
          created_at: string
        }
        Update: {
          id?: string | null
          version?: number | null
          published_at?: string | null
          domains_count?: number | null
          skills_count?: number | null
          questions_count?: number | null
          created_at?: string | null
        }
        Relationships: []
      }
      domains: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          sort_order: number
          is_published: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
          status: string
        }
        Insert: {
          id: string
          slug: string
          title: string
          description?: string | null
          sort_order: number
          is_published: boolean
          created_at: string
          updated_at: string
          deleted_at?: string | null
          status: string
        }
        Update: {
          id?: string | null
          slug?: string | null
          title?: string | null
          description?: string | null
          sort_order?: number | null
          is_published?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          deleted_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      invitation_codes: {
        Row: {
          id: string
          code: string
          created_by: string | null
          expires_at: string | null
          max_uses: number | null
          times_used: number | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          code: string
          created_by?: string | null
          expires_at?: string | null
          max_uses?: number | null
          times_used?: number | null
          is_active?: boolean | null
          created_at: string
          updated_at: string
        }
        Update: {
          id?: string | null
          code?: string | null
          created_by?: string | null
          expires_at?: string | null
          max_uses?: number | null
          times_used?: number | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      outbox: {
        Row: {
          id: string
          table_name: string
          action: string
          record_id: string
          payload: any
          created_at: string
          synced_at: string | null
          error_message: string | null
          retry_count: number
        }
        Insert: {
          id: string
          table_name: string
          action: string
          record_id: string
          payload: any
          created_at: string
          synced_at?: string | null
          error_message?: string | null
          retry_count: number
        }
        Update: {
          id?: string | null
          table_name?: string | null
          action?: string | null
          record_id?: string | null
          payload?: any | null
          created_at?: string | null
          synced_at?: string | null
          error_message?: string | null
          retry_count?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          role: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id: string
          role: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at: string
          updated_at: string
          deleted_at?: string | null
        }
        Update: {
          id?: string | null
          role?: string | null
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
          deleted_at?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          id: string
          skill_id: string
          type: string
          content: string
          options: any
          solution: any
          explanation: string | null
          points: number
          is_published: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
          status: string
        }
        Insert: {
          id: string
          skill_id: string
          type: string
          content: string
          options: any
          solution: any
          explanation?: string | null
          points: number
          is_published: boolean
          created_at: string
          updated_at: string
          deleted_at?: string | null
          status: string
        }
        Update: {
          id?: string | null
          skill_id?: string | null
          type?: string | null
          content?: string | null
          options?: any | null
          solution?: any | null
          explanation?: string | null
          points?: number | null
          is_published?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          deleted_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          skill_id: string | null
          started_at: string
          ended_at: string | null
          questions_attempted: number
          questions_correct: number
          total_time_ms: number
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id: string
          user_id: string
          skill_id?: string | null
          started_at: string
          ended_at?: string | null
          questions_attempted: number
          questions_correct: number
          total_time_ms: number
          created_at: string
          updated_at: string
          deleted_at?: string | null
        }
        Update: {
          id?: string | null
          user_id?: string | null
          skill_id?: string | null
          started_at?: string | null
          ended_at?: string | null
          questions_attempted?: number | null
          questions_correct?: number | null
          total_time_ms?: number | null
          created_at?: string | null
          updated_at?: string | null
          deleted_at?: string | null
        }
        Relationships: []
      }
      skill_progress: {
        Row: {
          id: string
          user_id: string
          skill_id: string
          total_attempts: number
          correct_attempts: number
          total_points: number
          mastery_level: number
          current_streak: number
          best_streak: number
          last_attempt_at: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id: string
          user_id: string
          skill_id: string
          total_attempts: number
          correct_attempts: number
          total_points: number
          mastery_level: number
          current_streak: number
          best_streak: number
          last_attempt_at?: string | null
          created_at: string
          updated_at: string
          deleted_at?: string | null
        }
        Update: {
          id?: string | null
          user_id?: string | null
          skill_id?: string | null
          total_attempts?: number | null
          correct_attempts?: number | null
          total_points?: number | null
          mastery_level?: number | null
          current_streak?: number | null
          best_streak?: number | null
          last_attempt_at?: string | null
          created_at?: string | null
          updated_at?: string | null
          deleted_at?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          id: string
          domain_id: string
          slug: string
          title: string
          description: string | null
          difficulty_level: number | null
          sort_order: number
          is_published: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
          status: string
        }
        Insert: {
          id: string
          domain_id: string
          slug: string
          title: string
          description?: string | null
          difficulty_level?: number | null
          sort_order: number
          is_published: boolean
          created_at: string
          updated_at: string
          deleted_at?: string | null
          status: string
        }
        Update: {
          id?: string | null
          domain_id?: string | null
          slug?: string | null
          title?: string | null
          description?: string | null
          difficulty_level?: number | null
          sort_order?: number | null
          is_published?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          deleted_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      sync_meta: {
        Row: {
          table_name: string
          last_synced_at: string
          sync_version: number
          updated_at: string
        }
        Insert: {
          table_name: string
          last_synced_at: string
          sync_version: number
          updated_at: string
        }
        Update: {
          table_name?: string | null
          last_synced_at?: string | null
          sync_version?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      submit_attempt_and_update_progress: {
        Args: { attempts_json: Json }
        Returns: Database['public']['Tables']['skill_progress']['Row'][]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      publish_curriculum: {
        Args: Record<PropertyKey, never>
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
