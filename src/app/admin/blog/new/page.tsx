import AdminHeader from '@/components/admin/AdminHeader';
import BlogEditor from '@/components/admin/editors/BlogEditor';

export default function NewBlogPage() {
  return (
    <>
      <AdminHeader title="Neuer Blog-Beitrag" />
      <div className="p-6">
        <BlogEditor isNew />
      </div>
    </>
  );
}



