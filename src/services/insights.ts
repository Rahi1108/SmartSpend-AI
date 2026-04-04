import { supabase } from './supabase';
import type { Database } from '../types/database';

type AIInsightRow = Database['public']['Tables']['ai_insights']['Row'];
type AIInsightInsert = Database['public']['Tables']['ai_insights']['Insert'];

export const getInsights = async (userId: string, limit = 50): Promise<AIInsightRow[]> => {
  const { data, error } = await supabase
    .from('ai_insights')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
};

export const createInsight = async (insight: AIInsightInsert): Promise<AIInsightRow> => {
  const { data, error } = await (supabase as any)
    .from('ai_insights')
    .insert(insight)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getUnreadInsights = async (userId: string): Promise<AIInsightRow[]> => {
  const { data, error } = await supabase
    .from('ai_insights')
    .select('*')
    .eq('user_id', userId)
    .eq('is_read', false)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const markInsightAsRead = async (id: string): Promise<AIInsightRow> => {
  const { data, error } = await (supabase as any)
    .from('ai_insights')
    .update({ is_read: true })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const dismissInsight = async (id: string): Promise<AIInsightRow> => {
  const { data, error } = await (supabase as any)
    .from('ai_insights')
    .update({ is_dismissed: true })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getInsightsByType = async (userId: string, type: AIInsightRow['type']): Promise<AIInsightRow[]> => {
  const { data, error } = await supabase
    .from('ai_insights')
    .select('*')
    .eq('user_id', userId)
    .eq('type', type)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};
