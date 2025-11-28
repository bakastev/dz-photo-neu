'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { AdminUser } from './auth';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qljgbskxopjkivkcuypu.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM';

// Global singleton - initialized once per browser context
// Use a global variable that persists across hot reloads
let browserClient: SupabaseClient | null = null;

// Browser Client (für Client Components)
// Uses a true singleton pattern to prevent multiple GoTrueClient instances
// createBrowserClient from @supabase/ssr automatically handles cookies for SSR compatibility
export function createBrowserSupabaseClient(): SupabaseClient {
  // Only create client if it doesn't exist and we're in browser
  if (typeof window !== 'undefined' && !browserClient) {
    // createBrowserClient automatically uses cookies for session storage
    // This ensures API routes can read the session from cookies
    browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  
  // Fallback for SSR (shouldn't happen in client components, but just in case)
  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }
  
  return browserClient;
}

// Client-side auth helpers
export async function signIn(email: string, password: string) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
}

export async function signOut() {
  const supabase = createBrowserSupabaseClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getClientSession() {
  const supabase = createBrowserSupabaseClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  
  return session;
}

export async function getClientUser() {
  const supabase = createBrowserSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  
  return user;
}

export async function getClientAdminUser(): Promise<AdminUser | null> {
  const supabase = createBrowserSupabaseClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return null;
  }
  
  // Get admin user profile
  const { data: adminUser, error: profileError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (profileError || !adminUser) {
    return null;
  }
  
  return {
    id: user.id,
    email: user.email || '',
    role: adminUser.role || 'editor',
    name: adminUser.name,
    avatar_url: adminUser.avatar_url,
    created_at: adminUser.created_at,
  };
}



