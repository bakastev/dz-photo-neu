'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/auth-client';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Toaster } from '@/components/ui/toaster';
import ColorThemeProvider from '@/components/admin/ColorThemeProvider';

export default function AdminLayoutContent({ 
  children, 
  adminUserData 
}: { 
  children: React.ReactNode;
  adminUserData: any;
}) {
  const [userData, setUserData] = useState(adminUserData);
  const [loading, setLoading] = useState(!adminUserData);

  useEffect(() => {
    // If we don't have adminUserData from server, load it client-side
    if (!adminUserData) {
      const loadUserData = async () => {
        const supabase = createBrowserSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: adminUser } = await supabase
            .from('admin_users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (adminUser) {
            setUserData({
              id: session.user.id,
              email: session.user.email || '',
              role: adminUser.role || 'editor',
              name: adminUser.name,
              avatar_url: adminUser.avatar_url,
              created_at: adminUser.created_at,
            });
          }
        }
        setLoading(false);
      };
      
      loadUserData();
    }
  }, [adminUserData]);

  if (loading || !userData) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Wird geladen...</p>
        </div>
      </div>
    );
  }
  
  return (
    <ColorThemeProvider>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--admin-color-background, #0A0A0A)' }}>
        <AdminSidebar user={userData} />
        <main className="ml-64 min-h-screen transition-all duration-300">
          {children}
        </main>
        <Toaster />
      </div>
    </ColorThemeProvider>
  );
}

