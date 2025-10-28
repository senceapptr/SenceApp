/**
 * Supabase Database TypeScript Definitions
 * 
 * Bu dosya Supabase CLI ile otomatik generate edilecek:
 * npx supabase gen types typescript --project-id "your-project-id" --schema public > lib/database.types.ts
 * 
 * Şimdilik boş Database type tanımı
 */

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
      // Tablolar buraya eklenecek
      [key: string]: {
        Row: Record<string, unknown>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
    }
    Views: {
      [key: string]: {
        Row: Record<string, unknown>
      }
    }
    Functions: {
      [key: string]: unknown
    }
    Enums: {
      [key: string]: string
    }
  }
}





