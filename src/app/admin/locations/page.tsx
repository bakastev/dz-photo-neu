import { createServerSupabaseClient } from '@/lib/auth-server';
import AdminHeader from '@/components/admin/AdminHeader';
import Link from 'next/link';
import { Plus, MapPin, Eye, Edit, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

async function getLocations() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
  return data || [];
}

export default async function LocationsPage() {
  const locations = await getLocations();

  return (
    <>
      <AdminHeader title="Locations" description={`${locations.length} Einträge`} />

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button variant="outline" className="border-white/10 text-gray-400 hover:text-white">
              Alle
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Veröffentlicht
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Entwürfe
            </Button>
          </div>
          <Link href="/admin/locations/new">
            <Button className="bg-gradient-to-r from-[#D4AF37] to-[#B8960F] hover:from-[#E5C158] hover:to-[#D4AF37]">
              <Plus className="w-4 h-4 mr-2" />
              Neue Location
            </Button>
          </Link>
        </div>

        <div className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#0A0A0A]">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Name</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Stadt</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Region</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {locations.map((location) => (
                <tr key={location.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-blue-500" />
                      </div>
                      <p className="text-white font-medium">{location.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{location.city || '-'}</td>
                  <td className="px-6 py-4 text-gray-400">{location.region || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={location.published ? 'default' : 'secondary'}
                        className={location.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}
                      >
                        {location.published ? 'Veröffentlicht' : 'Entwurf'}
                      </Badge>
                      {location.featured && (
                        <Badge className="bg-[#D4AF37]/20 text-[#D4AF37]">Featured</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/locations/${location.slug}`} target="_blank">
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/locations/${location.id}`}>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#141414] border-white/10">
                          <DropdownMenuItem className="text-white hover:bg-white/10 cursor-pointer">
                            Duplizieren
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 cursor-pointer">
                            Löschen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
              {locations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Keine Locations vorhanden
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

