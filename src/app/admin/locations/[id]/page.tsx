import { createServerSupabaseClient } from '@/lib/auth-server';
import { notFound } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import LocationEditor from '@/components/admin/editors/LocationEditor';

interface Props {
  params: Promise<{ id: string }>;
}

async function getLocation(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

export default async function EditLocationPage({ params }: Props) {
  const { id } = await params;
  const location = await getLocation(id);

  if (!location) {
    notFound();
  }

  return (
    <>
      <AdminHeader title="Location bearbeiten" />
      <div className="p-6">
        <LocationEditor location={location} />
      </div>
    </>
  );
}

