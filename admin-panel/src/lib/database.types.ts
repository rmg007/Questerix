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
      // ... (truncated for brevity - the full types were generated)
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      batch_submit_attempts: {
        Args: {
          attempts_json: Json
        }
        Returns: {
          id: string
          user_id: string
          question_id: string
          response: Json
          is_correct: boolean
          score_awarded: number
          time_spent_ms: number | null
          created_at: string
          updated_at: string
          deleted_at: string | null
          app_id: string | null
        }[]
      }
      // ... (other functions)
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

type DefaultSchema = Database["public"]

export type Tables<
  TableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends TableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[TableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = TableNameOrOptions extends { schema: keyof Database }
  ? Database[TableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : TableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][TableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  TableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends TableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[TableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = TableNameOrOptions extends { schema: keyof Database }
  ? Database[TableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : TableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][TableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  TableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends TableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[TableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = TableNameOrOptions extends { schema: keyof Database }
  ? Database[TableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : TableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][TableNameOrOptions] extends {
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
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never
