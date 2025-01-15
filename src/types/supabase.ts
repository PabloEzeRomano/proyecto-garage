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
      items: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          image_url?: string | null
          created_at?: string
        }
      }
      stock: {
        Row: {
          id: string
          item_id: string
          quantity: number
          name: string
          cost: number
          created_at: string
        }
        Insert: {
          id?: string
          item_id: string
          quantity: number
          name: string
          cost: number
          created_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          quantity?: number
          name?: string
          cost?: number
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          short_description: string
          price: number | null
          date: string
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          short_description: string
          price?: number | null
          date: string
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          short_description?: string
          price?: number | null
          date?: string
          image_url?: string | null
          created_at?: string
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
      user_role: 'USER' | 'ADMIN'
    }
  }
}