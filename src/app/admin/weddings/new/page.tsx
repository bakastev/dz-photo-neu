import AdminHeader from '@/components/admin/AdminHeader';
import WeddingEditor from '@/components/admin/editors/WeddingEditor';

export default function NewWeddingPage() {
  return (
    <>
      <AdminHeader title="Neue Hochzeit" />
      <div className="p-6">
        <WeddingEditor isNew />
      </div>
    </>
  );
}

