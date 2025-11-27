import AdminHeader from '@/components/admin/AdminHeader';
import LocationEditor from '@/components/admin/editors/LocationEditor';

export default function NewLocationPage() {
  return (
    <>
      <AdminHeader title="Neue Location" />
      <div className="p-6">
        <LocationEditor isNew />
      </div>
    </>
  );
}

