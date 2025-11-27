import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/auth-server';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Toaster } from '@/components/ui/toaster';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminUser = await getAdminUser();

  // Redirect to login if not authenticated
  if (!adminUser) {
    redirect('/admin-login');
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <AdminSidebar user={adminUser} />
      <main className="ml-64 min-h-screen transition-all duration-300">
        {children}
      </main>
      <Toaster />
    </div>
  );
}

