import { createServerSupabaseClient } from '@/lib/auth-server';
import AdminHeader from '@/components/admin/AdminHeader';
import Link from 'next/link';
import { Plus, FileStack, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

async function getPages() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export default async function PagesPage() {
  const pages = await getPages();

  return (
    <>
      <AdminHeader title="Seiten" description={`${pages.length} Einträge`} />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div />
          <Link href="/admin/pages/new">
            <Button className="bg-gradient-to-r from-[#D4AF37] to-[#B8960F]">
              <Plus className="w-4 h-4 mr-2" />
              Neue Seite
            </Button>
          </Link>
        </div>

        <div className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#0A0A0A]">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Titel</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Slug</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Typ</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <FileStack className="w-5 h-5 text-emerald-500" />
                      </div>
                      <p className="text-white font-medium">{page.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-mono text-sm">/{page.slug}</td>
                  <td className="px-6 py-4 text-gray-400 capitalize">{page.page_type || '-'}</td>
                  <td className="px-6 py-4">
                    <Badge className={page.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                      {page.published ? 'Veröffentlicht' : 'Entwurf'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/pages/${page.id}`}>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
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

