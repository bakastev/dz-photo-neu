#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

interface ContentItem {
  id: string;
  type: 'wedding' | 'location' | 'blog' | 'fotobox' | 'review' | 'page';
  text: string;
  metadata: any;
}

async function generateEmbedding(text: string): Promise<number[]> {
  // Call Supabase Edge Function that uses OpenAI API
  const { data, error } = await supabase.functions.invoke('generate-embedding', {
    body: { text }
  });
  
  if (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
  
  return data.embedding;
}

async function generateAllEmbeddings() {
  console.log('🧠 Starting embeddings generation...');
  
  const contentItems: ContentItem[] = [];
  
  // 1. Process Weddings
  console.log('\n🤵👰 Processing weddings...');
  const { data: weddings } = await supabase
    .from('weddings')
    .select('*');
  
  if (weddings) {
    for (const wedding of weddings) {
      const text = [
        wedding.title,
        wedding.couple_names,
        wedding.description,
        wedding.location,
        wedding.meta_description
      ].filter(Boolean).join(' ');
      
      contentItems.push({
        id: wedding.id,
        type: 'wedding',
        text,
        metadata: {
          slug: wedding.slug,
          couple_names: wedding.couple_names,
          wedding_date: wedding.wedding_date,
          location: wedding.location,
          featured: wedding.featured
        }
      });
    }
  }
  
  // 2. Process Locations
  console.log('\n🏰 Processing locations...');
  const { data: locations } = await supabase
    .from('locations')
    .select('*');
  
  if (locations) {
    for (const location of locations) {
      const text = [
        location.name,
        location.description,
        location.address,
        location.city,
        location.region,
        Array.isArray(location.features) ? location.features.join(' ') : '',
        location.meta_description
      ].filter(Boolean).join(' ');
      
      contentItems.push({
        id: location.id,
        type: 'location',
        text,
        metadata: {
          slug: location.slug,
          name: location.name,
          city: location.city,
          region: location.region,
          features: location.features,
          capacity_min: location.capacity_min,
          capacity_max: location.capacity_max
        }
      });
    }
  }
  
  // 3. Process Blog Posts
  console.log('\n📝 Processing blog posts...');
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('*');
  
  if (blogPosts) {
    for (const post of blogPosts) {
      const text = [
        post.title,
        post.content,
        post.excerpt,
        post.meta_description
      ].filter(Boolean).join(' ');
      
      contentItems.push({
        id: post.id,
        type: 'blog',
        text,
        metadata: {
          slug: post.slug,
          number: post.number,
          title: post.title,
          published_at: post.published_at
        }
      });
    }
  }
  
  // 4. Process Fotobox Services
  console.log('\n📸 Processing fotobox services...');
  const { data: services } = await supabase
    .from('fotobox_services')
    .select('*');
  
  if (services) {
    for (const service of services) {
      const text = [
        service.name,
        service.description,
        service.content,
        Array.isArray(service.features) ? service.features.join(' ') : '',
        service.service_type,
        service.meta_description
      ].filter(Boolean).join(' ');
      
      contentItems.push({
        id: service.id,
        type: 'fotobox',
        text,
        metadata: {
          slug: service.slug,
          name: service.name,
          service_type: service.service_type,
          price: service.price,
          popular: service.popular,
          features: service.features
        }
      });
    }
  }
  
  // 5. Process Reviews
  console.log('\n⭐ Processing reviews...');
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*');
  
  if (reviews) {
    for (const review of reviews) {
      const text = [
        review.author_name,
        review.review_text,
        review.source
      ].filter(Boolean).join(' ');
      
      contentItems.push({
        id: review.id,
        type: 'review',
        text,
        metadata: {
          author_name: review.author_name,
          rating: review.rating,
          source: review.source,
          featured: review.featured
        }
      });
    }
  }
  
  // 6. Process Pages
  console.log('\n📄 Processing pages...');
  const { data: pages } = await supabase
    .from('pages')
    .select('*');
  
  if (pages) {
    for (const page of pages) {
      const text = [
        page.title,
        page.content,
        page.page_type,
        page.meta_description
      ].filter(Boolean).join(' ');
      
      contentItems.push({
        id: page.id,
        type: 'page',
        text,
        metadata: {
          slug: page.slug,
          title: page.title,
          page_type: page.page_type
        }
      });
    }
  }
  
  console.log(`\n📊 Total content items to process: ${contentItems.length}`);
  
  // Generate embeddings for all content
  console.log('\n🧠 Generating embeddings...');
  let processed = 0;
  let errors = 0;
  
  for (const item of contentItems) {
    try {
      console.log(`Processing ${item.type}: ${item.metadata.slug || item.metadata.name || item.id}`);
      
      // Generate embedding
      const embedding = await generateEmbedding(item.text);
      
      // Store in database
      const { error } = await supabase
        .from('embeddings')
        .upsert({
          content_type: item.type,
          content_id: item.id,
          content_text: item.text.substring(0, 2000), // Limit text length
          embedding: embedding,
          metadata: item.metadata
        }, {
          onConflict: 'content_type,content_id'
        });
      
      if (error) {
        console.error(`❌ Error storing embedding for ${item.id}:`, error);
        errors++;
      } else {
        console.log(`✅ Generated embedding for ${item.type}: ${item.metadata.slug || item.metadata.name}`);
        processed++;
      }
      
      // Rate limiting - wait between requests
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Error processing ${item.id}:`, error);
      errors++;
    }
  }
  
  console.log(`\n✅ Embeddings generation completed!`);
  console.log(`📊 Processed: ${processed}, Errors: ${errors}, Total: ${contentItems.length}`);
}

// Create Supabase Edge Function for OpenAI API calls
async function createEmbeddingFunction() {
  console.log('📝 Creating Supabase Edge Function for embeddings...');
  
  const functionCode = `
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text } = await req.json()
    
    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get OpenAI API key from Supabase secrets
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Call OpenAI Embeddings API
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${openaiApiKey}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: text,
        model: 'text-embedding-ada-002',
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenAI API error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to generate embedding' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    const embedding = data.data[0].embedding

    return new Response(
      JSON.stringify({ embedding }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
`;

  console.log('📋 Edge Function code created. Deploy it manually to Supabase:');
  console.log('1. Create supabase/functions/generate-embedding/index.ts');
  console.log('2. Deploy with: supabase functions deploy generate-embedding');
  console.log('3. Then run this script again');
}

// Run embeddings generation
if (require.main === module) {
  // Check if we should create the function first
  const args = process.argv.slice(2);
  if (args.includes('--create-function')) {
    createEmbeddingFunction();
  } else {
    generateAllEmbeddings().catch(console.error);
  }
}

export { generateAllEmbeddings };
