import { createServerSupabaseClient } from '@/lib/auth-server';
import { notFound } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import ReviewEditor from '@/components/admin/editors/ReviewEditor';

interface Props {
  params: Promise<{ id: string }>;
}

async function getReview(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

export default async function EditReviewPage({ params }: Props) {
  const { id } = await params;
  const review = await getReview(id);

  if (!review) {
    notFound();
  }

  return (
    <>
      <AdminHeader title="Bewertung bearbeiten" />
      <div className="p-6">
        <ReviewEditor review={review} />
      </div>
    </>
  );
}

