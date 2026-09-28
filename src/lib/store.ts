import { supabase } from './supabase';

export async function fetchAll<T>(table: string, options?: { orderBy?: string, ascending?: boolean, filters?: Record<string, any> }): Promise<T[]> {
  let query = supabase.from(table).select('*');
  
  if (options?.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
  }
  
  if (options?.orderBy) {
    query = query.order(options.orderBy, { ascending: options.ascending ?? true });
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error(`Error fetching from ${table}:`, error);
    throw error;
  }
  
  return data as T[];
}

export async function fetchById<T>(table: string, id: string): Promise<T | null> {
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error(`Error fetching ${table} by id:`, error);
    throw error;
  }
  
  return data as T;
}

export async function create<T>(table: string, data: Partial<T>): Promise<T> {
  const { data: created, error } = await supabase.from(table).insert(data).select().single();
  
  if (error) {
    console.error(`Error creating in ${table}:`, error);
    throw error;
  }
  
  return created as T;
}

export async function update<T>(table: string, id: string, data: Partial<T>): Promise<T> {
  const { data: updated, error } = await supabase.from(table).update(data).eq('id', id).select().single();
  
  if (error) {
    console.error(`Error updating ${table}:`, error);
    throw error;
  }
  
  return updated as T;
}

export async function softDelete(table: string, id: string): Promise<void> {
  const { error } = await supabase.from(table).update({ deleted_at: new Date().toISOString() }).eq('id', id);
  
  if (error) {
    console.error(`Error deleting from ${table}:`, error);
    throw error;
  }
}

export async function search<T>(table: string, query: string, fields: string[]): Promise<T[]> {
  const searchFilter = fields.map(field => `${field}.ilike.%${query}%`).join(',');
  const { data, error } = await supabase.from(table).select('*').or(searchFilter);
  
  if (error) {
    console.error(`Error searching in ${table}:`, error);
    throw error;
  }
  
  return data as T[];
}

export function generateCode(prefix: string, sequence: number, year?: number): string {
  const currentYear = year || new Date().getFullYear();
  const paddedSequence = sequence.toString().padStart(4, '0');
  return `${prefix}-${currentYear}-${paddedSequence}`;
}
