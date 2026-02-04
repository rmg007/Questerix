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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_generation_sessions: {
        Row: {
          created_at: string
          created_by: string
          deleted_at: string | null
          difficulty_distribution: Json | null
          generation_time_ms: number | null
          id: string
          model_used: string
          prompt_text: string
          questions_generated: number
          questions_imported: number
          raw_response: Json | null
          reviewed_at: string | null
          reviewed_by: string | null
          skill_id: string | null
          source_document_id: string | null
          status: string | null
          token_count: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          deleted_at?: string | null
          difficulty_distribution?: Json | null
          generation_time_ms?: number | null
          id?: string
          model_used: string
          prompt_text: string
          questions_generated?: number
          questions_imported?: number
          raw_response?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          skill_id?: string | null
          source_document_id?: string | null
          status?: string | null
          token_count?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          difficulty_distribution?: Json | null
          generation_time_ms?: number | null
          id?: string
          model_used?: string
          prompt_text?: string
          questions_generated?: number
          questions_imported?: number
          raw_response?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          skill_id?: string | null
          source_document_id?: string | null
          status?: string | null
          token_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_generation_sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_generation_sessions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_generation_sessions_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_generation_sessions_source_document_id_fkey"
            columns: ["source_document_id"]
            isOneToOne: false
            referencedRelation: "source_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_governance_quotas: {
        Row: {
          app_id: string
          created_at: string
          id: string
          monthly_limit_tokens: number
          period_end: string
          period_start: string
          tokens_used: number
          updated_at: string
        }
        Insert: {
          app_id: string
          created_at?: string
          id?: string
          monthly_limit_tokens?: number
          period_end: string
          period_start: string
          tokens_used?: number
          updated_at?: string
        }
        Update: {
          app_id?: string
          created_at?: string
          id?: string
          monthly_limit_tokens?: number
          period_end?: string
          period_start?: string
          tokens_used?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_governance_quotas_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["app_id"]
          },
        ]
      }
      apps: {
        Row: {
          app_id: string
          created_at: string
          display_name: string
          is_active: boolean
          slug: string
          subdomain: string | null
          theme_color: string | null
          updated_at: string
        }
        Insert: {
          app_id?: string
          created_at?: string
          display_name: string
          is_active?: boolean
          slug: string
          subdomain?: string | null
          theme_color?: string | null
          updated_at?: string
        }
        Update: {
          app_id?: string
          created_at?: string
          display_name?: string
          is_active?: boolean
          slug?: string
          subdomain?: string | null
          theme_color?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      assignments: {
        Row: {
          assigned_at: string
          assigned_by: string
          completed_at: string | null
          created_at: string
          deadline: string | null
          group_id: string
          id: string
          scope: Database["public"]["Enums"]["assignment_scope"]
          skill_id: string
          status: Database["public"]["Enums"]["assignment_status"]
          student_id: string | null
          type: Database["public"]["Enums"]["assignment_type"]
        }
        Insert: {
          assigned_at?: string
          assigned_by: string
          completed_at?: string | null
          created_at?: string
          deadline?: string | null
          group_id: string
          id?: string
          scope?: Database["public"]["Enums"]["assignment_scope"]
          skill_id: string
          status?: Database["public"]["Enums"]["assignment_status"]
          student_id?: string | null
          type?: Database["public"]["Enums"]["assignment_type"]
        }
        Update: {
          assigned_at?: string
          assigned_by?: string
          completed_at?: string | null
          created_at?: string
          deadline?: string | null
          group_id?: string
          id?: string
          scope?: Database["public"]["Enums"]["assignment_scope"]
          skill_id?: string
          status?: Database["public"]["Enums"]["assignment_status"]
          student_id?: string | null
          type?: Database["public"]["Enums"]["assignment_type"]
        }
        Relationships: [
          {
            foreignKeyName: "assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      attempts: {
        Row: {
          answer: string
          created_at: string
          difficulty: number | null
          id: string
          is_correct: boolean
          question_id: string
          response_time_ms: number | null
          session_id: string
          user_id: string
        }
        Insert: {
          answer: string
          created_at?: string
          difficulty?: number | null
          id?: string
          is_correct: boolean
          question_id: string
          response_time_ms?: number | null
          session_id: string
          user_id: string
        }
        Update: {
          answer?: string
          created_at?: string
          difficulty?: number | null
          id?: string
          is_correct?: boolean
          question_id?: string
          response_time_ms?: number | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attempts_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_meta: {
        Row: {
          id: string
          last_published_at: string | null
          status: Database["public"]["Enums"]["curriculum_status"]
          updated_at: string
          version: number
        }
        Insert: {
          id?: string
          last_published_at?: string | null
          status?: Database["public"]["Enums"]["curriculum_status"]
          updated_at?: string
          version?: number
        }
        Update: {
          id?: string
          last_published_at?: string | null
          status?: Database["public"]["Enums"]["curriculum_status"]
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      curriculum_snapshots: {
        Row: {
          content: Json | null
          created_at: string
          domains_count: number
          id: string
          published_at: string
          questions_count: number
          skills_count: number
          version: number
        }
        Insert: {
          content?: Json | null
          created_at?: string
          domains_count?: number
          id?: string
          published_at?: string
          questions_count?: number
          skills_count?: number
          version: number
        }
        Update: {
          content?: Json | null
          created_at?: string
          domains_count?: number
          id?: string
          published_at?: string
          questions_count?: number
          skills_count?: number
          version?: number
        }
        Relationships: []
      }
      doc_indexes: {
        Row: {
          chunk_index: number
          chunk_text: string
          doc_path: string
          embedding: string | null
          id: string
          indexed_at: string
          last_hash: string | null
          metadata: Json | null
        }
        Insert: {
          chunk_index: number
          chunk_text: string
          doc_path: string
          embedding?: string | null
          id?: string
          indexed_at?: string
          last_hash?: string | null
          metadata?: Json | null
        }
        Update: {
          chunk_index?: number
          chunk_text?: string
          doc_path?: string
          embedding?: string | null
          id?: string
          indexed_at?: string
          last_hash?: string | null
          metadata?: Json | null
        }
        Relationships: []
      }
      domains: {
        Row: {
          app_id: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          is_published: boolean
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["curriculum_status"]
          subject_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          app_id?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["curriculum_status"]
          subject_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          app_id?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["curriculum_status"]
          subject_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "domains_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["app_id"]
          },
        ]
      }
      error_logs: {
        Row: {
          app_id: string | null
          app_version: string | null
          created_at: string | null
          error_message: string
          error_type: string
          extra_context: Json | null
          id: string
          occurred_at: string | null
          platform: string
          promoted_to_issue_id: string | null
          stack_trace: string | null
          status: string
          url: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          app_id?: string | null
          app_version?: string | null
          created_at?: string | null
          error_message: string
          error_type: string
          extra_context?: Json | null
          id?: string
          occurred_at?: string | null
          platform: string
          promoted_to_issue_id?: string | null
          stack_trace?: string | null
          status?: string
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          app_id?: string | null
          app_version?: string | null
          created_at?: string | null
          error_message?: string
          error_type?: string
          extra_context?: Json | null
          id?: string
          occurred_at?: string | null
          platform?: string
          promoted_to_issue_id?: string | null
          stack_trace?: string | null
          status?: string
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "error_logs_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["app_id"]
          },
          {
            foreignKeyName: "error_logs_promoted_to_issue_id_fkey"
            columns: ["promoted_to_issue_id"]
            isOneToOne: false
            referencedRelation: "known_issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "error_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          created_at: string
          group_id: string
          id: string
          nickname: string | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          nickname?: string | null
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          nickname?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          allow_anonymous_join: boolean
          app_id: string | null
          created_at: string
          id: string
          join_code: string
          name: string
          owner_id: string
          type: Database["public"]["Enums"]["group_type"]
          updated_at: string
        }
        Insert: {
          allow_anonymous_join?: boolean
          app_id?: string | null
          created_at?: string
          id?: string
          join_code?: string
          name: string
          owner_id: string
          type?: Database["public"]["Enums"]["group_type"]
          updated_at?: string
        }
        Update: {
          allow_anonymous_join?: boolean
          app_id?: string | null
          created_at?: string
          id?: string
          join_code?: string
          name?: string
          owner_id?: string
          type?: Database["public"]["Enums"]["group_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["app_id"]
          },
          {
            foreignKeyName: "groups_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invitation_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          max_uses: number | null
          role: Database["public"]["Enums"]["user_role"]
          used_at: string | null
          used_by: string | null
          uses: number
        }
        Insert: {
          code?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          used_at?: string | null
          used_by?: string | null
          uses?: number
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          used_at?: string | null
          used_by?: string | null
          uses?: number
        }
        Relationships: [
          {
            foreignKeyName: "invitation_codes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitation_codes_used_by_fkey"
            columns: ["used_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_metrics: {
        Row: {
          created_at: string
          id: string
          metric_key: string
          metric_value: Json
          registry_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_key: string
          metric_value: Json
          registry_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_key?: string
          metric_value?: Json
          registry_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kb_metrics_registry_id_fkey"
            columns: ["registry_id"]
            isOneToOne: false
            referencedRelation: "kb_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_registry: {
        Row: {
          category: string | null
          created_at: string
          dependencies: string[] | null
          exports: string[] | null
          file_path: string
          id: string
          last_synced_at: string
          line_count: number | null
          purpose: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          dependencies?: string[] | null
          exports?: string[] | null
          file_path: string
          id?: string
          last_synced_at?: string
          line_count?: number | null
          purpose?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          dependencies?: string[] | null
          exports?: string[] | null
          file_path?: string
          id?: string
          last_synced_at?: string
          line_count?: number | null
          purpose?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      known_issues: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string
          description: string
          id: string
          resolution_notes: string | null
          resolved_at: string | null
          sentry_link: string | null
          severity: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          description: string
          id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          sentry_link?: string | null
          severity?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          sentry_link?: string | null
          severity?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "known_issues_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          app_id: string | null
          avatar_url: string | null
          created_at: string
          deleted_at: string | null
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          app_id?: string | null
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          app_id?: string | null
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["app_id"]
          },
        ]
      }
      questions: {
        Row: {
          app_id: string | null
          content: string
          created_at: string
          deleted_at: string | null
          explanation: string | null
          id: string
          is_published: boolean
          options: Json | null
          points: number
          skill_id: string
          solution: Json | null
          sort_order: number
          status: Database["public"]["Enums"]["curriculum_status"]
          type: Database["public"]["Enums"]["question_type"]
          updated_at: string
        }
        Insert: {
          app_id?: string | null
          content: string
          created_at?: string
          deleted_at?: string | null
          explanation?: string | null
          id?: string
          is_published?: boolean
          options?: Json | null
          points?: number
          skill_id: string
          solution?: Json | null
          sort_order?: number
          status?: Database["public"]["Enums"]["curriculum_status"]
          type?: Database["public"]["Enums"]["question_type"]
          updated_at?: string
        }
        Update: {
          app_id?: string | null
          content?: string
          created_at?: string
          deleted_at?: string | null
          explanation?: string | null
          id?: string
          is_published?: boolean
          options?: Json | null
          points?: number
          skill_id?: string
          solution?: Json | null
          sort_order?: number
          status?: Database["public"]["Enums"]["curriculum_status"]
          type?: Database["public"]["Enums"]["question_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["app_id"]
          },
          {
            foreignKeyName: "questions_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          correct_count: number
          created_at: string
          ended_at: string | null
          id: string
          session_type: string
          skill_id: string
          total_count: number
          user_id: string
        }
        Insert: {
          correct_count?: number
          created_at?: string
          ended_at?: string | null
          id?: string
          session_type: string
          skill_id: string
          total_count?: number
          user_id: string
        }
        Update: {
          correct_count?: number
          created_at?: string
          ended_at?: string | null
          id?: string
          session_type?: string
          skill_id?: string
          total_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_progress: {
        Row: {
          correct_streak: number
          created_at: string
          id: string
          is_mastered: boolean
          last_practiced_at: string | null
          mastery_score: number
          skill_id: string
          total_attempts: number
          total_correct: number
          updated_at: string
          user_id: string
        }
        Insert: {
          correct_streak?: number
          created_at?: string
          id?: string
          is_mastered?: boolean
          last_practiced_at?: string | null
          mastery_score?: number
          skill_id: string
          total_attempts?: number
          total_correct?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          correct_streak?: number
          created_at?: string
          id?: string
          is_mastered?: boolean
          last_practiced_at?: string | null
          mastery_score?: number
          skill_id?: string
          total_attempts?: number
          total_correct?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_progress_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          app_id: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          difficulty_level: number
          domain_id: string
          id: string
          is_published: boolean
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["curriculum_status"]
          title: string
          updated_at: string
        }
        Insert: {
          app_id?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          difficulty_level?: number
          domain_id: string
          id?: string
          is_published?: boolean
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["curriculum_status"]
          title: string
          updated_at?: string
        }
        Update: {
          app_id?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          difficulty_level?: number
          domain_id?: string
          id?: string
          is_published?: boolean
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["curriculum_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["app_id"]
          },
          {
            foreignKeyName: "skills_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
      }
      source_documents: {
        Row: {
          content_hash: string | null
          created_at: string
          created_by: string
          deleted_at: string | null
          file_name: string
          file_size: number | null
          file_type: string
          id: string
          processing_status: string | null
          raw_text: string | null
          storage_path: string | null
          updated_at: string
        }
        Insert: {
          content_hash?: string | null
          created_at?: string
          created_by: string
          deleted_at?: string | null
          file_name: string
          file_size?: number | null
          file_type: string
          id?: string
          processing_status?: string | null
          raw_text?: string | null
          storage_path?: string | null
          updated_at?: string
        }
        Update: {
          content_hash?: string | null
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          id?: string
          processing_status?: string | null
          raw_text?: string | null
          storage_path?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      staged_questions: {
        Row: {
          correct_answer: string
          created_at: string
          difficulty: number | null
          id: string
          is_selected: boolean
          options: Json | null
          question_text: string
          session_id: string
          skill_id: string | null
          type: Database["public"]["Enums"]["question_type"] | null
          updated_at: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          difficulty?: number | null
          id?: string
          is_selected?: boolean
          options?: Json | null
          question_text: string
          session_id: string
          skill_id?: string | null
          type?: Database["public"]["Enums"]["question_type"] | null
          updated_at?: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          difficulty?: number | null
          id?: string
          is_selected?: boolean
          options?: Json | null
          question_text?: string
          session_id?: string
          skill_id?: string | null
          type?: Database["public"]["Enums"]["question_type"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staged_questions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_generation_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staged_questions_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      student_recovery_keys: {
        Row: {
          created_at: string
          id: string
          secret_phrase: string
          student_id: string
          updated_at: string
          usage_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          secret_phrase: string
          student_id: string
          updated_at?: string
          usage_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          secret_phrase?: string
          student_id?: string
          updated_at?: string
          usage_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "student_recovery_keys_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_app_access: {
        Args: { user_id: string; target_app_id: string }
        Returns: boolean
      }
      generate_join_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_secret_phrase: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_app_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      match_documents: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: string
          doc_path: string
          chunk_text: string
          similarity: number
        }[]
      }
    }
    Enums: {
      assignment_scope: "mandatory" | "suggested"
      assignment_status: "pending" | "completed" | "late"
      assignment_type: "skill_mastery" | "time_goal" | "custom"
      curriculum_status: "draft" | "published" | "live"
      group_type: "class" | "family"
      question_type:
        | "multiple_choice"
        | "mcq_multi"
        | "text_input"
        | "boolean"
        | "reorder_steps"
      user_role: "super_admin" | "admin" | "student" | "mentor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  TableName extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][TableName]["Row"]

export type TablesInsert<
  TableName extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][TableName]["Insert"]

export type TablesUpdate<
  TableName extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][TableName]["Update"]

export type Enums<
  EnumName extends keyof DefaultSchema["Enums"]
> = DefaultSchema["Enums"][EnumName]

export const Constants = {
  public: {
    Enums: {
      assignment_scope: ["mandatory", "suggested"],
      assignment_status: ["pending", "completed", "late"],
      assignment_type: ["skill_mastery", "time_goal", "custom"],
      curriculum_status: ["draft", "published", "live"],
      group_type: ["class", "family"],
      question_type: [
        "multiple_choice",
        "mcq_multi",
        "text_input",
        "boolean",
        "reorder_steps",
      ],
      user_role: ["super_admin", "admin", "student", "mentor"],
    },
  },
} as const
