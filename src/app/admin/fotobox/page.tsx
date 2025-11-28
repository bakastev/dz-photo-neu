import { createServerSupabaseClient } from '@/lib/auth-server';
import AdminHeader from '@/components/admin/AdminHeader';
import Link from 'next/link';
import { Plus, PartyPopper, Eye, Edit, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';

async function getFotoboxServices() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('fotobox_services')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export default async function FotoboxPage() {
  const services = await getFotoboxServices();

  return (
    <>
      <AdminHeader title="Fotobox Services" description={`${services.length} Einträge`} />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div />
          <Link href="/admin/fotobox/new">
            <Button className="bg-gradient-to-r from-[#D4AF37] to-[#B8960F]">
              <Plus className="w-4 h-4 mr-2" />
              Neuer Service
            </Button>
          </Link>
        </div>

        <div className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#0A0A0A]">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Name</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Typ</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Preis</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <PartyPopper className="w-5 h-5 text-orange-500" />
                      </div>
                      <p className="text-white font-medium">{service.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 capitalize">{service.service_type || '-'}</td>
                  <td className="px-6 py-4 text-gray-400">{service.price ? formatPrice(service.price) : '-'}</td>
                  <td className="px-6 py-4">
                    <Badge className={service.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                      {service.published ? 'Aktiv' : 'Entwurf'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/fotobox/${service.id}`}>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

