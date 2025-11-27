import { createServerSupabaseClient } from '@/lib/auth-server';
import AdminHeader from '@/components/admin/AdminHeader';
import { Heart, MapPin, FileText, PartyPopper, Star, FileStack, TrendingUp, Eye, Calendar } from 'lucide-react';
import Link from 'next/link';

async function getDashboardStats() {
  const supabase = await createServerSupabaseClient();
  
  const [
    { count: weddingsCount },
    { count: locationsCount },
    { count: blogCount },
    { count: fotoboxCount },
    { count: reviewsCount },
    { count: pagesCount },
    { data: recentWeddings },
    { data: recentBlog },
  ] = await Promise.all([
    supabase.from('weddings').select('*', { count: 'exact', head: true }),
    supabase.from('locations').select('*', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
    supabase.from('fotobox_services').select('*', { count: 'exact', head: true }),
    supabase.from('reviews').select('*', { count: 'exact', head: true }),
    supabase.from('pages').select('*', { count: 'exact', head: true }),
    supabase.from('weddings').select('id, title, slug, created_at, published').order('created_at', { ascending: false }).limit(5),
    supabase.from('blog_posts').select('id, title, slug, created_at, published').order('created_at', { ascending: false }).limit(5),
  ]);

  return {
    stats: {
      weddings: weddingsCount || 0,
      locations: locationsCount || 0,
      blog: blogCount || 0,
      fotobox: fotoboxCount || 0,
      reviews: reviewsCount || 0,
      pages: pagesCount || 0,
    },
    recentWeddings: recentWeddings || [],
    recentBlog: recentBlog || [],
  };
}

export default async function AdminDashboard() {
  const { stats, recentWeddings, recentBlog } = await getDashboardStats();

  const statCards = [
    { name: 'Hochzeiten', value: stats.weddings, icon: Heart, href: '/admin/weddings', color: 'from-pink-500 to-rose-500' },
    { name: 'Locations', value: stats.locations, icon: MapPin, href: '/admin/locations', color: 'from-blue-500 to-cyan-500' },
    { name: 'Blog-Beiträge', value: stats.blog, icon: FileText, href: '/admin/blog', color: 'from-purple-500 to-violet-500' },
    { name: 'Fotobox', value: stats.fotobox, icon: PartyPopper, href: '/admin/fotobox', color: 'from-orange-500 to-amber-500' },
    { name: 'Bewertungen', value: stats.reviews, icon: Star, href: '/admin/reviews', color: 'from-yellow-500 to-lime-500' },
    { name: 'Seiten', value: stats.pages, icon: FileStack, href: '/admin/pages', color: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" description="Willkommen im DZ-Photo Admin-Bereich" />
      
      <div className="p-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((stat) => (
            <Link
              key={stat.name}
              href={stat.href}
              className="group bg-[#141414] border border-white/10 rounded-xl p-5 hover:border-[#D4AF37]/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.name}</p>
            </Link>
          ))}
        </div>

        {/* Recent Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Weddings */}
          <div className="bg-[#141414] border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Neueste Hochzeiten</h2>
              <Link href="/admin/weddings" className="text-sm text-[#D4AF37] hover:underline">
                Alle anzeigen
              </Link>
            </div>
            <div className="space-y-3">
              {recentWeddings.length > 0 ? (
                recentWeddings.map((wedding: any) => (
                  <Link
                    key={wedding.id}
                    href={`/admin/weddings/${wedding.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="w-4 h-4 text-pink-500" />
                      <span className="text-white">{wedding.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${wedding.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {wedding.published ? 'Veröffentlicht' : 'Entwurf'}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Keine Hochzeiten vorhanden</p>
              )}
            </div>
          </div>

          {/* Recent Blog Posts */}
          <div className="bg-[#141414] border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Neueste Blog-Beiträge</h2>
              <Link href="/admin/blog" className="text-sm text-[#D4AF37] hover:underline">
                Alle anzeigen
              </Link>
            </div>
            <div className="space-y-3">
              {recentBlog.length > 0 ? (
                recentBlog.map((post: any) => (
                  <Link
                    key={post.id}
                    href={`/admin/blog/${post.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-purple-500" />
                      <span className="text-white truncate max-w-[200px]">{post.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${post.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {post.published ? 'Veröffentlicht' : 'Entwurf'}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Keine Blog-Beiträge vorhanden</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#141414] border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Schnellaktionen</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/weddings/new"
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-dashed border-white/20 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all"
            >
              <Heart className="w-6 h-6 text-[#D4AF37] mb-2" />
              <span className="text-sm text-white">Neue Hochzeit</span>
            </Link>
            <Link
              href="/admin/blog/new"
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-dashed border-white/20 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all"
            >
              <FileText className="w-6 h-6 text-[#D4AF37] mb-2" />
              <span className="text-sm text-white">Neuer Beitrag</span>
            </Link>
            <Link
              href="/admin/media"
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-dashed border-white/20 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all"
            >
              <Eye className="w-6 h-6 text-[#D4AF37] mb-2" />
              <span className="text-sm text-white">Medien verwalten</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-dashed border-white/20 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all"
            >
              <Calendar className="w-6 h-6 text-[#D4AF37] mb-2" />
              <span className="text-sm text-white">Website ansehen</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

