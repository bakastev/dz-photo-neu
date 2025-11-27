import { createServerSupabaseClient } from '@/lib/auth-server';
import { notFound } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import PageEditor from '@/components/admin/editors/PageEditor';

interface Props {
  params: Promise<{ id: string }>;
}

async function getPage(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

export default async function EditPagePage({ params }: Props) {
  const { id } = await params;
  const page = await getPage(id);

  if (!page) {
    notFound();
  }

  return (
    <>
      <AdminHeader title="Seite bearbeiten" />
      <div className="p-6">
        <PageEditor page={page} />
      </div>
    </>
  );
}

