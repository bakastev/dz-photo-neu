import { createServerSupabaseClient } from '@/lib/auth-server';
import AdminHeader from '@/components/admin/AdminHeader';
import Link from 'next/link';
import { Plus, Heart, Eye, Edit, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/utils';

async function getWeddings() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('weddings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching weddings:', error);
    return [];
  }
  return data || [];
}

export default async function WeddingsPage() {
  const weddings = await getWeddings();

  return (
    <>
      <AdminHeader title="Hochzeiten" description={`${weddings.length} Einträge`} />

      <div className="p-6">
        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button variant="outline" className="border-white/30 bg-[#1A1A1A] text-white hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-white">
              Alle
            </Button>
            <Button variant="ghost" className="text-white bg-[#1A1A1A] hover:bg-[#D4AF37] hover:text-white">
              Veröffentlicht
            </Button>
            <Button variant="ghost" className="text-white bg-[#1A1A1A] hover:bg-[#D4AF37] hover:text-white">
              Entwürfe
            </Button>
          </div>
          <Link href="/admin/weddings/new">
            <Button className="bg-gradient-to-r from-[#D4AF37] to-[#B8960F] hover:from-[#E5C158] hover:to-[#D4AF37]">
              <Plus className="w-4 h-4 mr-2" />
              Neue Hochzeit
            </Button>
          </Link>
        </div>

        {/* Table */}
        <div className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#0A0A0A]">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Titel</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Paar</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Datum</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {weddings.map((wedding) => (
                <tr key={wedding.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-pink-500" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{wedding.title}</p>
                        <p className="text-sm text-gray-500">{wedding.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{wedding.couple_names || '-'}</td>
                  <td className="px-6 py-4 text-gray-400">
                    {wedding.wedding_date ? formatDate(wedding.wedding_date) : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={wedding.published ? 'default' : 'secondary'}
                        className={wedding.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}
                      >
                        {wedding.published ? 'Veröffentlicht' : 'Entwurf'}
                      </Badge>
                      {wedding.featured && (
                        <Badge className="bg-[#D4AF37]/20 text-[#D4AF37]">Featured</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/hochzeit/${wedding.slug}`} target="_blank">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/weddings/${wedding.id}`}>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#141414] border-white/10">
                          <DropdownMenuItem className="text-white hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] focus:bg-[#D4AF37]/20 focus:text-[#D4AF37] cursor-pointer">
                            Duplizieren
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400 hover:bg-red-500/20 hover:text-red-300 focus:bg-red-500/20 focus:text-red-300 cursor-pointer">
                            Löschen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
              {weddings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Keine Hochzeiten vorhanden
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

