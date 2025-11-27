import { createServerSupabaseClient } from '@/lib/auth-server';
import AdminHeader from '@/components/admin/AdminHeader';
import Link from 'next/link';
import { Plus, Star, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

async function getReviews() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <>
      <AdminHeader title="Bewertungen" description={`${reviews.length} Einträge`} />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div />
          <Link href="/admin/reviews/new">
            <Button className="bg-gradient-to-r from-[#D4AF37] to-[#B8960F]">
              <Plus className="w-4 h-4 mr-2" />
              Neue Bewertung
            </Button>
          </Link>
        </div>

        <div className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#0A0A0A]">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Autor</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Bewertung</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Datum</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                        <Star className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{review.author_name}</p>
                        <p className="text-sm text-gray-500 truncate max-w-[200px]">{review.review_text}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {review.review_date ? formatDate(review.review_date) : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={review.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                      {review.published ? 'Sichtbar' : 'Versteckt'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/reviews/${review.id}`}>
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

