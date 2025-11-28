import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/auth-server';

// Redirect /admin/homepage zu /admin/pages/{homepage-id}
// Die Startseite wird jetzt als normale Seite unter "Seiten" verwaltet
export default async function HomepagePage() {
  const supabase = await createServerSupabaseClient();
  
  // Finde die Homepage-Seite
  const { data: homepage } = await supabase
    .from('pages')
    .select('id')
    .eq('page_type', 'homepage')
    .single();

  if (homepage?.id) {
    redirect(`/admin/pages/${homepage.id}`);
  } else {
    // Fallback: Redirect zu Seiten-Liste
    redirect('/admin/pages');
  }
}
