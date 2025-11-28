import { createServerSupabaseClient } from '@/lib/auth-server';
import AdminHeader from '@/components/admin/AdminHeader';
import Link from 'next/link';
import { Plus, FileStack, Edit, Home, Scale, FileText, Search, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

async function getPages() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .in('page_type', ['homepage', 'legal', 'content'])
    .order('display_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) return [];
  
  // Sortiere: Homepage zuerst, dann nach Typ, dann alphabetisch
  const sorted = (data || []).sort((a, b) => {
    // Homepage immer zuerst
    if (a.page_type === 'homepage') return -1;
    if (b.page_type === 'homepage') return 1;
    
    // Dann nach Typ
    const typeOrder = { homepage: 1, legal: 2, content: 3 };
    const aOrder = typeOrder[a.page_type as keyof typeof typeOrder] || 99;
    const bOrder = typeOrder[b.page_type as keyof typeof typeOrder] || 99;
    if (aOrder !== bOrder) return aOrder - bOrder;
    
    // Dann alphabetisch nach Titel
    return (a.title || '').localeCompare(b.title || '');
  });
  
  return sorted;
}

function getPageTypeIcon(pageType: string | null) {
  switch (pageType) {
    case 'homepage':
      return Home;
    case 'legal':
      return Scale;
    case 'content':
      return FileText;
    default:
      return FileStack;
  }
}

function getPageTypeLabel(pageType: string | null) {
  switch (pageType) {
    case 'homepage':
      return 'Startseite';
    case 'legal':
      return 'Rechtlich';
    case 'content':
      return 'Content';
    default:
      return pageType || 'Unbekannt';
  }
}

function getPageTypeColor(pageType: string | null) {
  switch (pageType) {
    case 'homepage':
      return 'bg-blue-500/20 text-blue-400';
    case 'legal':
      return 'bg-purple-500/20 text-purple-400';
    case 'content':
      return 'bg-emerald-500/20 text-emerald-400';
    default:
      return 'bg-gray-500/20 text-gray-400';
  }
}

export default async function PagesPage() {
  const pages = await getPages();

  return (
    <>
      <AdminHeader title="Seiten" description={`${pages.length} bearbeitbare Seiten`} />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Seiten durchsuchen..."
                className="pl-10 bg-[#141414] border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
          </div>
          <Link href="/admin/pages/new">
            <Button className="bg-gradient-to-r from-[#D4AF37] to-[#B8960F]">
              <Plus className="w-4 h-4 mr-2" />
              Neue Seite
            </Button>
          </Link>
        </div>

        {pages.length === 0 ? (
          <div className="bg-[#141414] border border-white/10 rounded-xl p-12 text-center">
            <FileStack className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Keine Seiten gefunden</h3>
            <p className="text-gray-400 mb-6">Erstellen Sie Ihre erste Seite, um zu beginnen.</p>
            <Link href="/admin/pages/new">
              <Button className="bg-gradient-to-r from-[#D4AF37] to-[#B8960F]">
                <Plus className="w-4 h-4 mr-2" />
                Neue Seite erstellen
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#0A0A0A]">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Seite</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">URL</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Typ</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pages.map((page) => {
                  const Icon = getPageTypeIcon(page.page_type);
                  return (
                    <tr key={page.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getPageTypeColor(page.page_type)}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{page.title}</p>
                            {page.page_type === 'homepage' && (
                              <p className="text-xs text-gray-500 mt-0.5">Hauptseite der Website</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-gray-400 font-mono text-sm">/{page.slug}</code>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getPageTypeColor(page.page_type)}>
                          {getPageTypeLabel(page.page_type)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={page.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                          {page.published ? 'Veröffentlicht' : 'Entwurf'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/${page.slug}`} target="_blank">
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white" title="Vorschau">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/pages/${page.id}`}>
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" title="Bearbeiten">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

