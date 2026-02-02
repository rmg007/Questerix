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
          created_at: string | null
          display_name: string
          full_domain: string | null
          grade_level: string
          grade_number: number | null
          is_active: boolean | null
          launch_date: string | null
          subdomain: string
          subject_id: string | null
          updated_at: string | null
        }
        Insert: {
          app_id?: string
          created_at?: string | null
          display_name: string
          grade_level: string
          grade_number?: number | null
          is_active?: boolean | null
          launch_date?: string | null
          subdomain: string
          subject_id?: string | null
          updated_at?: string | null
        }
        Update: {
          app_id?: string
          display_name?: string
          grade_level?: string
          subdomain?: string
        }
        Relationships: [
          {
            foreignKeyName: "apps_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["subject_id"]
          },
        ]
      }
      subjects: {
        Row: {
          color_hex: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          icon_url: string | null
          launch_date: string | null
          name: string
          slug: string
          status: string | null
          subject_id: string
          updated_at: string | null
        }
        Insert: {
          name: string
          slug: string
        }
        Update: {
          name?: string
        }
        Relationships: []
      }
    }
  }
}
