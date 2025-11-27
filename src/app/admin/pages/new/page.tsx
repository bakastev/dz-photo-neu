import AdminHeader from '@/components/admin/AdminHeader';
import PageEditor from '@/components/admin/editors/PageEditor';

export default function NewPagePage() {
  return (
    <>
      <AdminHeader title="Neue Seite" />
      <div className="p-6">
        <PageEditor isNew />
      </div>
    </>
  );
}

