export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          currency: string;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          currency?: string;
          timezone?: string;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          currency?: string;
          timezone?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          type: 'expense' | 'income';
          category_id: string | null;
          category_name: string;
          description: string | null;
          vendor: string | null;
          date: string;
          time: string | null;
          notes: string | null;
          tags: string[] | null;
          is_recurring: boolean;
          recurring_frequency: string | null;
          ai_parsed: boolean;
          ai_confidence: number | null;
          original_input: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          amount: number;
          type: 'expense' | 'income';
          category_id?: string | null;
          category_name: string;
          description?: string | null;
          vendor?: string | null;
          date: string;
          time?: string | null;
          notes?: string | null;
          tags?: string[] | null;
          is_recurring?: boolean;
          recurring_frequency?: string | null;
          ai_parsed?: boolean;
          ai_confidence?: number | null;
          original_input?: string | null;
        };
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>;
      };
      budgets: {
        Row: {
          id: string;
          user_id: string;
          category_id: string | null;
          category_name: string;
          amount: number;
          period: 'weekly' | 'monthly' | 'yearly';
          start_date: string;
          end_date: string | null;
          is_active: boolean;
          alert_threshold: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          category_id?: string | null;
          category_name: string;
          amount: number;
          period: 'weekly' | 'monthly' | 'yearly';
          start_date: string;
          end_date?: string | null;
          is_active?: boolean;
          alert_threshold?: number;
        };
        Update: Partial<Database['public']['Tables']['budgets']['Insert']>;
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          target_amount: number;
          current_amount: number;
          deadline: string | null;
          category: string | null;
          priority: 'low' | 'medium' | 'high';
          status: 'active' | 'completed' | 'paused' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          description?: string | null;
          target_amount: number;
          current_amount?: number;
          deadline?: string | null;
          category?: string | null;
          priority?: 'low' | 'medium' | 'high';
          status?: 'active' | 'completed' | 'paused' | 'cancelled';
        };
        Update: Partial<Database['public']['Tables']['goals']['Insert']>;
      };
      categories: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          icon: string;
          color: string;
          type: 'expense' | 'income' | 'both';
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          user_id?: string | null;
          name: string;
          icon: string;
          color: string;
          type: 'expense' | 'income' | 'both';
          is_default?: boolean;
        };
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      ai_insights: {
        Row: {
          id: string;
          user_id: string;
          type: 'behavioral' | 'predictive' | 'anomaly' | 'recommendation' | 'summary';
          title: string;
          content: string;
          data: Json | null;
          priority: 'low' | 'medium' | 'high';
          is_read: boolean;
          is_dismissed: boolean;
          valid_until: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          type: 'behavioral' | 'predictive' | 'anomaly' | 'recommendation' | 'summary';
          title: string;
          content: string;
          data?: Json | null;
          priority?: 'low' | 'medium' | 'high';
          is_read?: boolean;
          is_dismissed?: boolean;
          valid_until?: string | null;
        };
        Update: Partial<Database['public']['Tables']['ai_insights']['Insert']>;
      };
      alerts: {
        Row: {
          id: string;
          user_id: string;
          type: 'budget_warning' | 'budget_exceeded' | 'goal_progress' | 'anomaly' | 'tip';
          title: string;
          message: string;
          related_id: string | null;
          related_type: string | null;
          severity: 'info' | 'warning' | 'error' | 'success';
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          type: 'budget_warning' | 'budget_exceeded' | 'goal_progress' | 'anomaly' | 'tip';
          title: string;
          message: string;
          related_id?: string | null;
          related_type?: string | null;
          severity?: 'info' | 'warning' | 'error' | 'success';
          is_read?: boolean;
        };
        Update: Partial<Database['public']['Tables']['alerts']['Insert']>;
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type Budget = Database['public']['Tables']['budgets']['Row'];
export type Goal = Database['public']['Tables']['goals']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type AIInsight = Database['public']['Tables']['ai_insights']['Row'];
export type Alert = Database['public']['Tables']['alerts']['Row'];
