import { createServerSupabaseClient } from '@/lib/auth-server';
import { notFound } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import WeddingEditor from '@/components/admin/editors/WeddingEditor';

interface Props {
  params: Promise<{ id: string }>;
}

async function getWedding(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('weddings')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

export default async function EditWeddingPage({ params }: Props) {
  const { id } = await params;
  const wedding = await getWedding(id);

  if (!wedding) {
    notFound();
  }

  return (
    <>
      <AdminHeader title="Hochzeit bearbeiten" />
      <div className="p-6">
        <WeddingEditor wedding={wedding} />
      </div>
    </>
  );
}

