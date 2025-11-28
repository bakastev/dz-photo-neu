import { createServerSupabaseClient } from '@/lib/auth-server';
import { notFound } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import FotoboxEditor from '@/components/admin/editors/FotoboxEditor';

interface Props {
  params: Promise<{ id: string }>;
}

async function getFotoboxService(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('fotobox_services')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

export default async function EditFotoboxPage({ params }: Props) {
  const { id } = await params;
  const service = await getFotoboxService(id);

  if (!service) {
    notFound();
  }

  return (
    <>
      <AdminHeader title="Fotobox Service bearbeiten" />
      <div className="p-6">
        <FotoboxEditor service={service} />
      </div>
    </>
  );
}



