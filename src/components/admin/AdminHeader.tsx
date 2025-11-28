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
    <header className="sticky top-0 z-30 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/10">
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
              className="w-64 pl-10 bg-[#141414] border-white/10 text-white placeholder:text-gray-500 focus:border-[#D4AF37]"
            />
          </div>

          {/* Quick Add */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-gradient-to-r from-[#D4AF37] to-[#B8960F] hover:from-[#E5C158] hover:to-[#D4AF37] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Neu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#141414] border-white/10">
              <DropdownMenuLabel className="text-gray-400">Erstellen</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem asChild className="text-white hover:bg-white/10 cursor-pointer">
                <Link href="/admin/weddings/new">Hochzeit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-white hover:bg-white/10 cursor-pointer">
                <Link href="/admin/locations/new">Location</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-white hover:bg-white/10 cursor-pointer">
                <Link href="/admin/blog/new">Blog-Beitrag</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-white hover:bg-white/10 cursor-pointer">
                <Link href="/admin/fotobox/new">Fotobox-Service</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-white hover:bg-white/10 cursor-pointer">
                <Link href="/admin/reviews/new">Bewertung</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-white hover:bg-white/10 cursor-pointer">
                <Link href="/admin/pages/new">Seite</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#D4AF37] rounded-full" />
          </Button>
        </div>
      </div>
    </header>
  );
}



