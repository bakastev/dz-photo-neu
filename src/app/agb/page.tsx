import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'AGB | DZ-Photo',
  description: 'Allgemeine Geschäftsbedingungen für Daniel Zangerle - DZ-Photo',
  robots: {
    index: true,
    follow: true,
  },
};

async function getAGBPage() {
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', 'agb')
      .eq('published', true)
      .single();

    if (error || !data) {
      console.error('Error fetching AGB page:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching AGB page:', error);
    return null;
  }
}

export default async function AGBPage() {
  const page = await getAGBPage();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <div className="container mx-auto px-4 md:px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">
              {page?.title || 'Allgemeine Geschäftsbedingungen'}
            </h1>
            
            {page?.content ? (
              <div
                className="prose prose-lg prose-invert max-w-none
                  prose-headings:font-serif prose-headings:text-white
                  prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-6 prose-h1:mt-8
                  prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-4 prose-h2:mt-6
                  prose-h3:text-2xl prose-h3:font-semibold prose-h3:mb-3 prose-h3:mt-4
                  prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                  prose-a:text-gold prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-white prose-strong:font-semibold
                  prose-em:text-gray-200
                  prose-ul:text-gray-300 prose-ol:text-gray-300
                  prose-li:mb-2
                  prose-blockquote:border-l-gold prose-blockquote:text-gray-300 prose-blockquote:italic"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            ) : (
              <div className="text-gray-300">
                <p>Die AGB werden geladen...</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

