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
      apps: {
        Row: {
          app_id: string
          subject_id: string | null
          is_active: boolean
          launch_date: string | null
          created_at: string
          updated_at: string
          grade_number: number | null
          grade_level: string
          display_name: string
          subdomain: string
          full_domain: string | null
        }
        Insert: {
          app_id?: string
          subject_id?: string | null
          is_active?: boolean
          launch_date?: string | null
          created_at?: string
          updated_at?: string
          grade_number?: number | null
          grade_level: string
          display_name: string
          subdomain: string
          full_domain?: string | null
        }
        Update: {
          app_id?: string
          subject_id?: string | null
          is_active?: boolean
          launch_date?: string | null
          created_at?: string
          updated_at?: string
          grade_number?: number | null
          grade_level?: string
          display_name?: string
          subdomain?: string
          full_domain?: string | null
        }
      }
      domains: {
        Row: {
          id: string
          app_id: string
          title: string
          slug: string
          description: string | null
          sort_order: number
          status: Database["public"]["Enums"]["curriculum_status"]
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          app_id: string
          title: string
          slug: string
          description?: string | null
          sort_order: number
          status?: Database["public"]["Enums"]["curriculum_status"]
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          app_id?: string
          title?: string
          slug?: string
          description?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["curriculum_status"]
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      skills: {
        Row: {
          id: string
          app_id: string
          domain_id: string
          title: string
          slug: string
          description: string | null
          difficulty_level: number
          sort_order: number
          status: Database["public"]["Enums"]["curriculum_status"]
          is_published: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          app_id: string
          domain_id: string
          title: string
          slug: string
          description?: string | null
          difficulty_level?: number
          sort_order?: number
          status?: Database["public"]["Enums"]["curriculum_status"]
          is_published?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          app_id?: string
          domain_id?: string
          title?: string
          slug?: string
          description?: string | null
          difficulty_level?: number
          sort_order?: number
          status?: Database["public"]["Enums"]["curriculum_status"]
          is_published?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      questions: {
        Row: {
          id: string
          app_id: string
          skill_id: string
          type: Database["public"]["Enums"]["question_type"]
          content: string
          options: Json
          solution: Json
          explanation: string | null
          points: number
          status: Database["public"]["Enums"]["curriculum_status"]
          is_published: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
          sort_order: number | null
        }
        Insert: {
          id?: string
          app_id: string
          skill_id: string
          type: Database["public"]["Enums"]["question_type"]
          content: string
          options: Json
          solution: Json
          explanation?: string | null
          points?: number
          status?: Database["public"]["Enums"]["curriculum_status"]
          is_published?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          sort_order?: number | null
        }
        Update: {
          id?: string
          app_id?: string
          skill_id?: string
          type?: Database["public"]["Enums"]["question_type"]
          content?: string
          options?: Json
          solution?: Json
          explanation?: string | null
          points?: number
          status?: Database["public"]["Enums"]["curriculum_status"]
          is_published?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          sort_order?: number | null
        }
      }
      profiles: {
        Row: {
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
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      curriculum_status: "draft" | "published" | "live"
      question_type:
        | "multiple_choice"
        | "mcq_multi"
        | "text_input"
        | "boolean"
        | "reorder_steps"
      user_role: "super_admin" | "admin" | "student"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
