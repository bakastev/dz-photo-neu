import AdminHeader from '@/components/admin/AdminHeader';
import FotoboxEditor from '@/components/admin/editors/FotoboxEditor';

export default function NewFotoboxPage() {
  return (
    <>
      <AdminHeader title="Neuer Fotobox Service" />
      <div className="p-6">
        <FotoboxEditor isNew />
      </div>
    </>
  );
}



