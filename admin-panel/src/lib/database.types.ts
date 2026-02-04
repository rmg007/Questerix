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
      app_landing_pages: {
        Row: {
          app_id: string | null
          benefits_json: Json | null
          canonical_url: string | null
          created_at: string | null
          hero_cta_text: string | null
          hero_headline: string
          hero_image_url: string | null
          hero_subheadline: string | null
          is_published: boolean | null
          landing_page_id: string
          meta_description: string
          meta_title: string
          og_image_url: string | null
          pricing_json: Json | null
          published_at: string | null
          schema_org_json: Json | null
          syllabus_json: Json | null
          testimonials_json: Json | null
          updated_at: string | null
        }
        Insert: {
          app_id?: string | null
          benefits_json?: Json | null
          canonical_url?: string | null
          created_at?: string | null
          hero_cta_text?: string | null
          hero_headline: string
          hero_image_url?: string | null
          hero_subheadline?: string | null
          is_published?: boolean | null
          landing_page_id?: string
          meta_description: string
          meta_title: string
          og_image_url?: string | null
          pricing_json?: Json | null
          published_at?: string | null
          schema_org_json?: Json | null
          syllabus_json?: Json | null
          testimonials_json?: Json | null
          updated_at?: string | null
        }
        Update: {
          app_id?: string | null
          benefits_json?: Json | null
          canonical_url?: string | null
          created_at?: string | null
          hero_cta_text?: string | null
          hero_headline?: string
          hero_image_url?: string | null
          hero_subheadline?: string | null
          is_published?: boolean | null
          landing_page_id?: string
          meta_description?: string
          meta_title?: string
          og_image_url?: string | null
          pricing_json?: Json | null
          published_at?: string | null
          schema_org_json?: Json | null
          syllabus_json?: Json | null
          testimonials_json?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_landing_pages_app_id_fkey"
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
          config_json: Json | null
          created_at: string | null
          description: string | null
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          app_id?: string
          config_json?: Json | null
          created_at?: string | null
          description?: string | null
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          app_id?: string
          config_json?: Json | null
          created_at?: string | null
          description?: string | null
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      assignments: {
        Row: {
          completion_trigger: Json | null
          created_at: string
          due_date: string | null
          group_id: string | null
          id: string
          scope: Database["public"]["Enums"]["assignment_scope"] | null
          status: Database["public"]["Enums"]["assignment_status"] | null
          student_id: string | null
          target_id: string
          type: Database["public"]["Enums"]["assignment_type"]
          updated_at: string
        }
        Insert: {
          completion_trigger?: Json | null
          created_at?: string
          due_date?: string | null
          group_id?: string | null
          id?: string
          scope?: Database["public"]["Enums"]["assignment_scope"] | null
          status?: Database["public"]["Enums"]["assignment_status"] | null
          student_id?: string | null
          target_id: string
          type: Database["public"]["Enums"]["assignment_type"]
          updated_at?: string
        }
        Update: {
          completion_trigger?: Json | null
          created_at?: string
          due_date?: string | null
          group_id?: string | null
          id?: string
          scope?: Database["public"]["Enums"]["assignment_scope"] | null
          status?: Database["public"]["Enums"]["assignment_status"] | null
          student_id?: string | null
          target_id?: string
          type?: Database["public"]["Enums"]["assignment_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
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
      curriculum_meta: {
        Row: {
          id: string
          version: number
          last_published_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          version?: number
          last_published_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          version?: number
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
          content: Json
        }
        Insert: {
          id?: string
          version?: number
          published_at?: string
          domains_count?: number
          skills_count?: number
          questions_count?: number
          created_at?: string
          content?: Json
        }
        Update: {
          id?: string
          version?: number
          published_at?: string
          domains_count?: number
          skills_count?: number
          questions_count?: number
          created_at?: string
          content?: Json
        }
        Relationships: []
      }
      domains: {
        Row: {
          app_id: string | null
          created_at: string | null
          description: string | null
          id: string
          title: string
          slug: string
          sort_order: number
          status: string
        }
        Insert: {
          app_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title: string
          slug: string
          sort_order?: number
          status?: string
        }
        Update: {
          app_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string
          slug?: string
          sort_order?: number
          status?: string
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
      group_members: {
        Row: {
          group_id: string
          is_anonymous: boolean | null
          joined_at: string
          nickname: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          is_anonymous?: boolean | null
          joined_at?: string
          nickname?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          is_anonymous?: boolean | null
          joined_at?: string
          nickname?: string | null
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
          allow_anonymous_join: boolean | null
          app_id: string | null
          code_expires_at: string | null
          created_at: string
          id: string
          join_code: string
          name: string
          owner_id: string
          settings: Json | null
          type: Database["public"]["Enums"]["group_type"]
          updated_at: string
        }
        Insert: {
          allow_anonymous_join?: boolean | null
          app_id?: string | null
          code_expires_at?: string | null
          created_at?: string
          id?: string
          join_code: string
          name: string
          owner_id: string
          settings?: Json | null
          type: Database["public"]["Enums"]["group_type"]
          updated_at?: string
        }
        Update: {
          allow_anonymous_join?: boolean | null
          app_id?: string | null
          code_expires_at?: string | null
          created_at?: string
          id?: string
          join_code?: string
          name?: string
          owner_id?: string
          settings?: Json | null
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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          app_id: string | null
          content: string
          created_at: string | null
          explanation: string | null
          id: string
          options: Json | null
          points: number
          skill_id: string
          solution: Json | null
          sort_order: number
          status: string // User-defined enum inferred as string or specific enum
          type: Database["public"]["Enums"]["question_type"]
          updated_at: string | null
          deleted_at: string | null
        }
        Insert: {
          app_id?: string | null
          content: string
          created_at?: string | null
          explanation?: string | null
          id?: string
          options?: Json | null
          points?: number
          skill_id: string
          solution?: Json | null
          sort_order?: number
          status?: string
          type: Database["public"]["Enums"]["question_type"]
          updated_at?: string | null
          deleted_at?: string | null
        }
        Update: {
          app_id?: string | null
          content?: string
          created_at?: string | null
          explanation?: string | null
          id?: string
          options?: Json | null
          points?: number
          skill_id?: string
          solution?: Json | null
          sort_order?: number
          status?: string
          type?: Database["public"]["Enums"]["question_type"]
          updated_at?: string | null
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          app_id: string | null
          created_at: string | null
          description: string | null
          domain_id: string | null
          id: string
          title: string
          slug: string
          sort_order: number
          status: string
          difficulty_level: number // or string? SQL didn't specify type in my memory, usually integer 1-3.
        }
        Insert: {
          app_id?: string | null
          created_at?: string | null
          description?: string | null
          domain_id?: string | null
          id?: string
          title: string
          slug: string
          sort_order?: number
          status?: string
          difficulty_level?: number 
        }
        Update: {
          app_id?: string | null
          created_at?: string | null
          description?: string | null
          domain_id?: string | null
          id?: string
          title?: string
          slug?: string
          sort_order?: number
          status?: string
          difficulty_level?: number
        }
        Relationships: [
          {
            foreignKeyName: "skills_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          app_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          order_index: number
          updated_at: string | null
        }
        Insert: {
          app_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          order_index: number
          updated_at?: string | null
        }
        Update: {
          app_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          order_index?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subjects_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["app_id"]
          },
        ]
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
          id?: string
          user_id: string
          skill_id: string
          total_attempts?: number
          correct_attempts?: number
          total_points?: number
          mastery_level?: number
          current_streak?: number
          best_streak?: number
          last_attempt_at?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          skill_id?: string
          total_attempts?: number
          correct_attempts?: number
          total_points?: number
          mastery_level?: number
          current_streak?: number
          best_streak?: number
          last_attempt_at?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
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
          }
        ]
      }
      user_progress: {
        Row: {
          completed_at: string | null
          id: string
          is_correct: boolean
          question_id: string | null
          skill_id: string | null
          started_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          is_correct: boolean
          question_id?: string | null
          skill_id?: string | null
          started_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          is_correct?: boolean
          question_id?: string | null
          skill_id?: string | null
          started_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
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
      log_security_event: {
        Args: {
          p_event_type: string
          p_severity: string // Simplified for now
          p_metadata: Json
          p_app_id: string | null
          p_location: Json | null
        }
        Returns: void
      }
      publish_curriculum: {
        Args: Record<PropertyKey, never>
        Returns: {
          success: boolean
          version: number
          published_at: string
        }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never
