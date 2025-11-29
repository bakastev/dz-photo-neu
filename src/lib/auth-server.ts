import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { CookieOptions } from '@supabase/ssr';
import type { AdminUser } from './auth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qljgbskxopjkivkcuypu.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM';

// Server Client (für Server Components)
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

// Static Generation Client (für generateStaticParams - keine Cookies)
export function createStaticSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

// API Route Client (für API Routes - liest Cookies aus Request und setzt sie in Response)
export function createApiSupabaseClient(request: NextRequest) {
  let response = NextResponse.next();
  
  const supabaseClient = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        const cookies = request.cookies.getAll();
        // Log cookies for debugging (only in development)
        if (process.env.NODE_ENV === 'development') {
          const cookieNames = cookies.map(c => c.name).join(', ');
          console.log('🍪 [API Client] Cookies found:', cookieNames || 'NO COOKIES');
          // Log all cookie values for debugging
          cookies.forEach(c => {
            console.log(`  - ${c.name}: ${c.value.substring(0, 20)}...`);
          });
        }
        return cookies;
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        // Update request cookies
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        // Update response cookies - CRITICAL for session refresh
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });
  
  return {
    client: supabaseClient,
    getResponse: () => response,
  };
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
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ Auth error in getAdminUser:', userError);
      return null;
    }
    
    if (!user) {
      console.log('❌ No user in getAdminUser');
      return null;
    }
    
    console.log('🔍 Checking admin_users for user:', user.id);
    // Get admin user profile
    const { data: adminUser, error: profileError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Profile error in getAdminUser:', profileError);
      return null;
    }
    
    if (!adminUser) {
      console.log('❌ No admin user found for user:', user.id);
      return null;
    }
    
    console.log('✅ Admin user found:', adminUser.email);
    return {
      id: user.id,
      email: user.email || '',
      role: adminUser.role || 'editor',
      name: adminUser.name,
      avatar_url: adminUser.avatar_url,
      created_at: adminUser.created_at,
    };
  } catch (err: any) {
    console.error('❌ Exception in getAdminUser:', err);
    return null;
  }
}

export async function isAdmin(): Promise<boolean> {
  const adminUser = await getAdminUser();
  return adminUser !== null;
}



