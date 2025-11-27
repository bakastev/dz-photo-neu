import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { CookieOptions } from '@supabase/ssr';
import type { AdminUser } from './auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qljgbskxopjkivkcuypu.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM';

// Server Client (für Server Components & API Routes)
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component - ignore
        }
      },
    },
  });
}

// Auth Helper Functions (Server-side only)
export async function getSession() {
  const supabase = await createServerSupabaseClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  
  return session;
}

export async function getUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  
  return user;
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createServerSupabaseClient();
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

export async function isAdmin(): Promise<boolean> {
  const adminUser = await getAdminUser();
  return adminUser !== null;
}

