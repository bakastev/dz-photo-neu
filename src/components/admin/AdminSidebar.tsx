'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Camera,
  LayoutDashboard,
  Home,
  Heart,
  MapPin,
  FileText,
  PartyPopper,
  Star,
  FileStack,
  Image,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createBrowserSupabaseClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Seiten', href: '/admin/pages', icon: FileStack },
  { name: 'Hochzeiten', href: '/admin/weddings', icon: Heart },
  { name: 'Locations', href: '/admin/locations', icon: MapPin },
  { name: 'Blog', href: '/admin/blog', icon: FileText },
  { name: 'Fotobox', href: '/admin/fotobox', icon: PartyPopper },
  { name: 'Bewertungen', href: '/admin/reviews', icon: Star },
  { name: 'Medien', href: '/admin/media', icon: Image },
  { name: 'Einstellungen', href: '/admin/settings', icon: Settings },
];

interface AdminSidebarProps {
  user: {
    email: string;
    name?: string;
    role: string;
  };
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const supabase = createBrowserSupabaseClient();
      await supabase.auth.signOut();
      // Clear any cached data
      window.localStorage.removeItem('dz-photo-supabase-auth');
      // Redirect to login page with full page reload to ensure clean state
      window.location.href = '/admin-login';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, redirect to login
      window.location.href = '/admin-login';
    }
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-admin-background border-r border-white/10 transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(to bottom right, var(--admin-color-primary, #D4AF37), #B8960F)` }}>
              <Camera className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <span className="font-bold text-white text-lg">DZ-Photo</span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  isActive
                    ? 'text-admin-primary border-l-2'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
                style={isActive ? {
                  background: `linear-gradient(to right, var(--admin-color-primary, #D4AF37)33, transparent)`,
                  borderColor: 'var(--admin-color-primary, #D4AF37)',
                  color: 'var(--admin-color-primary, #D4AF37)'
                } : undefined}
              >
                <item.icon className={cn('w-5 h-5 flex-shrink-0')} style={isActive ? { color: 'var(--admin-color-primary, #D4AF37)' } : undefined} />
                {!collapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-white/10 p-4">
          {!collapsed && (
            <div className="mb-3">
              <p className="text-white font-medium truncate">{user.name || user.email}</p>
              <p className="text-gray-500 text-sm capitalize">{user.role}</p>
            </div>
          )}
          <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={loggingOut}
            className={cn(
              'text-gray-400 hover:text-red-400 hover:bg-red-500/10',
              collapsed ? 'w-full justify-center' : 'w-full justify-start gap-3'
            )}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Abmelden</span>}
          </Button>
          {!collapsed && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <Link
                href="https://growing-brands.de"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 transition-colors text-center block"
                style={{ '--hover-color': 'var(--admin-color-primary, #D4AF37)' } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--admin-color-primary, #D4AF37)';
                  const span = e.currentTarget.querySelector('span');
                  if (span) span.style.color = 'var(--admin-color-primary, #D4AF37)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '';
                  const span = e.currentTarget.querySelector('span');
                  if (span) span.style.color = '';
                }}
              >
                powered by{' '}
                <span className="font-semibold text-gray-400">Growing Brands</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

