import { createServerSupabaseClient } from '@/lib/auth-server';
import { notFound } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import BlogEditor from '@/components/admin/editors/BlogEditor';

interface Props {
  params: Promise<{ id: string }>;
}

async function getBlogPost(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) {
    notFound();
  }

  return (
    <>
      <AdminHeader title="Beitrag bearbeiten" />
      <div className="p-6">
        <BlogEditor post={post} />
      </div>
    </>
  );
}

