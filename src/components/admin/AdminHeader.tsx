'use client';

import { Bell, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminHeaderProps {
  title: string;
  description?: string;
}

export default function AdminHeader({ title, description }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl border-b border-white/10" style={{ backgroundColor: 'var(--admin-color-background, #0A0A0A)CC' }}>
      <div className="flex items-center justify-between h-16 px-6">
        {/* Title */}
        <div>
          <h1 className="text-xl font-bold text-white">{title}</h1>
          {description && (
            <p className="text-sm text-gray-400">{description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Suchen..."
              className="w-64 pl-10 border-white/10 text-white placeholder:text-gray-500"
              style={{ backgroundColor: 'var(--admin-color-surface, #141414)' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--admin-color-primary, #D4AF37)'}
              onBlur={(e) => e.target.style.borderColor = ''}
            />
          </div>

          {/* Quick Add */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                className="text-white"
                style={{
                  background: `linear-gradient(to right, var(--admin-color-primary, #D4AF37), #B8960F)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `linear-gradient(to right, #E5C158, var(--admin-color-primary, #D4AF37))`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `linear-gradient(to right, var(--admin-color-primary, #D4AF37), #B8960F)`;
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Neu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 border-white/10" style={{ backgroundColor: 'var(--admin-color-surface, #141414)' }}>
              <DropdownMenuLabel className="text-gray-400">Erstellen</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem asChild className="text-white cursor-pointer"
                style={{
                  '--hover-bg': 'var(--admin-color-primary, #D4AF37)33',
                  '--hover-text': 'var(--admin-color-primary, #D4AF37)',
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--admin-color-primary, #D4AF37)33';
                  e.currentTarget.style.color = 'var(--admin-color-primary, #D4AF37)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                  e.currentTarget.style.color = '';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--admin-color-primary, #D4AF37)33';
                  e.currentTarget.style.color = 'var(--admin-color-primary, #D4AF37)';
                }}
              >
                <Link href="/admin/weddings/new">Hochzeit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-white cursor-pointer"
                style={{
                  '--hover-bg': 'var(--admin-color-primary, #D4AF37)33',
                  '--hover-text': 'var(--admin-color-primary, #D4AF37)',
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--admin-color-primary, #D4AF37)33';
                  e.currentTarget.style.color = 'var(--admin-color-primary, #D4AF37)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                  e.currentTarget.style.color = '';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--admin-color-primary, #D4AF37)33';
                  e.currentTarget.style.color = 'var(--admin-color-primary, #D4AF37)';
                }}
              >
                <Link href="/admin/locations/new">Location</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-white cursor-pointer"
                style={{
                  '--hover-bg': 'var(--admin-color-primary, #D4AF37)33',
                  '--hover-text': 'var(--admin-color-primary, #D4AF37)',
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--admin-color-primary, #D4AF37)33';
                  e.currentTarget.style.color = 'var(--admin-color-primary, #D4AF37)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                  e.currentTarget.style.color = '';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--admin-color-primary, #D4AF37)33';
                  e.currentTarget.style.color = 'var(--admin-color-primary, #D4AF37)';
                }}
              >
                <Link href="/admin/blog/new">Blog-Beitrag</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-white cursor-pointer"
                style={{
                  '--hover-bg': 'var(--admin-color-primary, #D4AF37)33',
                  '--hover-text': 'var(--admin-color-primary, #D4AF37)',
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--admin-color-primary, #D4AF37)33';
                  e.currentTarget.style.color = 'var(--admin-color-primary, #D4AF37)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                  e.currentTarget.style.color = '';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--admin-color-primary, #D4AF37)33';
                  e.currentTarget.style.color = 'var(--admin-color-primary, #D4AF37)';
                }}
              >
                <Link href="/admin/fotobox/new">Fotobox-Service</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-white cursor-pointer"
                style={{
                  '--hover-bg': 'var(--admin-color-primary, #D4AF37)33',
                  '--hover-text': 'var(--admin-color-primary, #D4AF37)',
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--admin-color-primary, #D4AF37)33';
                  e.currentTarget.style.color = 'var(--admin-color-primary, #D4AF37)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                  e.currentTarget.style.color = '';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--admin-color-primary, #D4AF37)33';
                  e.currentTarget.style.color = 'var(--admin-color-primary, #D4AF37)';
                }}
              >
                <Link href="/admin/reviews/new">Bewertung</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-white cursor-pointer"
                style={{
                  '--hover-bg': 'var(--admin-color-primary, #D4AF37)33',
                  '--hover-text': 'var(--admin-color-primary, #D4AF37)',
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--admin-color-primary, #D4AF37)33';
                  e.currentTarget.style.color = 'var(--admin-color-primary, #D4AF37)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                  e.currentTarget.style.color = '';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--admin-color-primary, #D4AF37)33';
                  e.currentTarget.style.color = 'var(--admin-color-primary, #D4AF37)';
                }}
              >
                <Link href="/admin/pages/new">Seite</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--admin-color-primary, #D4AF37)' }} />
          </Button>
        </div>
      </div>
    </header>
  );
}



