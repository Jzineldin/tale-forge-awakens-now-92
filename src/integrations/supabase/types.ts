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
      admin_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          animated_video_status: string
          audio_generation_status: string
          created_at: string
          description: string | null
          full_story_audio_url: string | null
          id: string
          is_completed: boolean
          is_public: boolean
          narrative_context: Json | null
          published_at: string | null
          segment_count: number
          shotstack_render_id: string | null
          shotstack_status: string
          shotstack_video_url: string | null
          story_mode: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          user_id: string | null
          visual_context: Json | null
        }
        Insert: {
          animated_video_status?: string
          audio_generation_status?: string
          created_at?: string
          description?: string | null
          full_story_audio_url?: string | null
          id?: string
          is_completed?: boolean
          is_public?: boolean
          narrative_context?: Json | null
          published_at?: string | null
          segment_count?: number
          shotstack_render_id?: string | null
          shotstack_status?: string
          shotstack_video_url?: string | null
          story_mode?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
          visual_context?: Json | null
        }
        Update: {
          animated_video_status?: string
          audio_generation_status?: string
          created_at?: string
          description?: string | null
          full_story_audio_url?: string | null
          id?: string
          is_completed?: boolean
          is_public?: boolean
          narrative_context?: Json | null
          published_at?: string | null
          segment_count?: number
          shotstack_render_id?: string | null
          shotstack_status?: string
          shotstack_video_url?: string | null
          story_mode?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
          visual_context?: Json | null
        }
        Relationships: []
      }
      story_segments: {
        Row: {
          animated_video_status: string
          animated_video_url: string | null
          audio_duration: number | null
          audio_generation_status: string
          audio_url: string | null
          choices: string[]
          created_at: string
          id: string
          image_generation_status: string
          image_url: string | null
          is_end: boolean
          parent_segment_id: string | null
          segment_text: string
          story_id: string
          triggering_choice_text: string | null
          word_count: number | null
        }
        Insert: {
          animated_video_status?: string
          animated_video_url?: string | null
          audio_duration?: number | null
          audio_generation_status?: string
          audio_url?: string | null
          choices?: string[]
          created_at?: string
          id?: string
          image_generation_status?: string
          image_url?: string | null
          is_end?: boolean
          parent_segment_id?: string | null
          segment_text: string
          story_id: string
          triggering_choice_text?: string | null
          word_count?: number | null
        }
        Update: {
          animated_video_status?: string
          animated_video_url?: string | null
          audio_duration?: number | null
          audio_generation_status?: string
          audio_url?: string | null
          choices?: string[]
          created_at?: string
          id?: string
          image_generation_status?: string
          image_url?: string | null
          is_end?: boolean
          parent_segment_id?: string | null
          segment_text?: string
          story_id?: string
          triggering_choice_text?: string | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "story_segments_parent_segment_id_fkey"
            columns: ["parent_segment_id"]
            isOneToOne: false
            referencedRelation: "story_segments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_segments_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist_entries: {
        Row: {
          created_at: string
          email: string
          id: string
          marketing_consent: boolean
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          marketing_consent?: boolean
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          marketing_consent?: boolean
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_story_and_segments: {
        Args: { p_story_id: string }
        Returns: undefined
      }
      end_story_at_segment: {
        Args: { p_segment_id: string }
        Returns: {
          animated_video_status: string
          animated_video_url: string | null
          audio_duration: number | null
          audio_generation_status: string
          audio_url: string | null
          choices: string[]
          created_at: string
          id: string
          image_generation_status: string
          image_url: string | null
          is_end: boolean
          parent_segment_id: string | null
          segment_text: string
          story_id: string
          triggering_choice_text: string | null
          word_count: number | null
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
