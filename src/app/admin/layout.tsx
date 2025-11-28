import { createServerSupabaseClient } from '@/lib/auth-server';
import SessionGuard from '@/components/admin/SessionGuard';
import AdminLayoutContent from '@/components/admin/AdminLayoutContent';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Try to get user on server side first
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let adminUserData = null;
  
  if (user) {
    // Get admin user - RLS is disabled so this should work
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (adminUser) {
      adminUserData = {
        id: user.id,
        email: user.email || '',
        role: adminUser.role || 'editor',
        name: adminUser.name,
        avatar_url: adminUser.avatar_url,
        created_at: adminUser.created_at,
      };
    }
  }
  
  // Let SessionGuard handle auth check on client side
  // This avoids server-side cookie issues
  return (
    <SessionGuard>
      <AdminLayoutContent adminUserData={adminUserData}>
        {children}
      </AdminLayoutContent>
    </SessionGuard>
  );
}

