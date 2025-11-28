'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createBrowserSupabaseClient();
        
        // Check session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('SessionGuard: Session check', { hasSession: !!session, error: sessionError });
        
        if (sessionError || !session) {
          console.log('SessionGuard: No session, redirecting to login');
          window.location.href = '/admin-login';
          return;
        }
        
        // Check if user is admin - RLS is disabled so this should work
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('id, role')
          .eq('id', session.user.id)
          .single();
        
        console.log('SessionGuard: Admin check', { hasAdminUser: !!adminUser, error: adminError });
        
        if (adminError || !adminUser) {
          console.log('SessionGuard: No admin user, redirecting to login');
          // Sign out the user if they're not an admin
          await supabase.auth.signOut();
          window.location.href = '/admin-login?error=unauthorized';
          return;
        }
        
        console.log('SessionGuard: Authorized!');
        setIsAuthorized(true);
        setIsLoading(false);
      } catch (err) {
        console.error('SessionGuard: Error', err);
        window.location.href = '/admin-login';
      }
    };
    
    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Wird geladen...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Wird weitergeleitet...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

