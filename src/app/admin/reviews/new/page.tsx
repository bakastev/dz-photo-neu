import AdminHeader from '@/components/admin/AdminHeader';
import ReviewEditor from '@/components/admin/editors/ReviewEditor';

export default function NewReviewPage() {
  return (
    <>
      <AdminHeader title="Neue Bewertung" />
      <div className="p-6">
        <ReviewEditor isNew />
      </div>
    </>
  );
}



