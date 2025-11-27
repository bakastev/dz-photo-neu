#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

const BASE_URL = 'https://www.dz-photo.at';

interface ContentItem {
  id: string;
  type: 'wedding' | 'location' | 'blog' | 'fotobox' | 'review' | 'page';
  title: string;
  description?: string;
  content?: string;
  slug: string;
  meta_description?: string;
  focus_keywords?: string[];
  related_keywords?: string[];
}

interface AISuggestion {
  suggestion_type: string;
  field_name?: string;
  original_text?: string;
  suggested_text: string;
  confidence_score: number;
  reasoning: string;
}

async function optimizeAllContent() {
  console.log('🤖 Starting AI Content Optimization...');
  
  // 1. Populate SEO Keywords Database
  console.log('\n📊 Populating SEO Keywords...');
  await populateSEOKeywords();
  
  // 2. Optimize Weddings
  console.log('\n💒 Optimizing Wedding Content...');
  await optimizeWeddings();
  
  // 3. Optimize Locations
  console.log('\n🏰 Optimizing Location Content...');
  await optimizeLocations();
  
  // 4. Optimize Blog Posts
  console.log('\n📝 Optimizing Blog Content...');
  await optimizeBlogPosts();
  
  // 5. Optimize Services
  console.log('\n📸 Optimizing Service Content...');
  await optimizeServices();
  
  // 6. Optimize Pages
  console.log('\n📄 Optimizing Page Content...');
  await optimizePages();
  
  // 7. Generate Quality Reports
  console.log('\n📊 Generating Quality Reports...');
  await generateQualityReports();
  
  console.log('\n✅ AI Content Optimization completed!');
}

async function populateSEOKeywords() {
  const keywords = [
    // Primary Keywords
    { keyword: 'Hochzeitsfotograf Oberösterreich', search_volume: 1200, competition_level: 'medium', relevance_score: 1.0, keyword_type: 'primary' },
    { keyword: 'Hochzeitsfotografie Linz', search_volume: 800, competition_level: 'medium', relevance_score: 0.95, keyword_type: 'primary' },
    { keyword: 'Hochzeitsfotograf Wels', search_volume: 600, competition_level: 'low', relevance_score: 0.9, keyword_type: 'primary' },
    
    // Secondary Keywords
    { keyword: 'Hochzeitsbilder Oberösterreich', search_volume: 400, competition_level: 'low', relevance_score: 0.8, keyword_type: 'secondary' },
    { keyword: 'Hochzeitslocation Oberösterreich', search_volume: 500, competition_level: 'medium', relevance_score: 0.85, keyword_type: 'secondary' },
    { keyword: 'Fotobox Hochzeit', search_volume: 300, competition_level: 'low', relevance_score: 0.7, keyword_type: 'secondary' },
    
    // Long-tail Keywords
    { keyword: 'Hochzeitsfotograf Oberösterreich günstig', search_volume: 150, competition_level: 'low', relevance_score: 0.6, keyword_type: 'long_tail' },
    { keyword: 'Hochzeitsfotos natürlich emotional', search_volume: 100, competition_level: 'low', relevance_score: 0.7, keyword_type: 'long_tail' },
    { keyword: 'Hochzeit fotografieren lassen Kosten', search_volume: 200, competition_level: 'medium', relevance_score: 0.65, keyword_type: 'long_tail' },
    
    // Local Keywords
    { keyword: 'Hochzeitsfotograf Steyr', search_volume: 250, competition_level: 'low', relevance_score: 0.8, keyword_type: 'local' },
    { keyword: 'Hochzeitsfotograf Vöcklabruck', search_volume: 180, competition_level: 'low', relevance_score: 0.75, keyword_type: 'local' },
    { keyword: 'Hochzeitsfotograf Eferding', search_volume: 120, competition_level: 'low', relevance_score: 0.7, keyword_type: 'local' },
    
    // Semantic Keywords
    { keyword: 'Brautpaarshooting', search_volume: 300, competition_level: 'medium', relevance_score: 0.8, keyword_type: 'semantic' },
    { keyword: 'Engagement Shooting', search_volume: 250, competition_level: 'medium', relevance_score: 0.75, keyword_type: 'semantic' },
    { keyword: 'Hochzeitsreportage', search_volume: 200, competition_level: 'medium', relevance_score: 0.8, keyword_type: 'semantic' }
  ];
  
  let inserted = 0;
  for (const kw of keywords) {
    const { error } = await supabase
      .from('seo_keywords')
      .upsert(kw, { onConflict: 'keyword' });
    
    if (!error) inserted++;
  }
  
  console.log(`✅ Inserted ${inserted} SEO keywords`);
}

async function optimizeWeddings() {
  const { data: weddings } = await supabase
    .from('weddings')
    .select('*');
  
  if (!weddings) return;
  
  let optimized = 0;
  
  for (const wedding of weddings) {
    const suggestions: AISuggestion[] = [];
    
    // 1. Optimize Meta Description
    if (!wedding.meta_description || wedding.meta_description.length < 120) {
      const metaDescription = generateWeddingMetaDescription(wedding);
      suggestions.push({
        suggestion_type: 'meta_description',
        field_name: 'meta_description',
        original_text: wedding.meta_description || '',
        suggested_text: metaDescription,
        confidence_score: 0.9,
        reasoning: 'Meta-Description zu kurz oder fehlend. Optimiert für SEO mit Fokus-Keywords.'
      });
    }
    
    // 2. Generate Focus Keywords
    const focusKeywords = generateWeddingKeywords(wedding);
    suggestions.push({
      suggestion_type: 'focus_keywords',
      field_name: 'focus_keywords',
      original_text: (wedding.focus_keywords || []).join(', '),
      suggested_text: focusKeywords.join(', '),
      confidence_score: 0.85,
      reasoning: 'Fokus-Keywords basierend auf Hochzeitslocation und Paar-Namen generiert.'
    });
    
    // 3. Optimize Canonical URL
    const canonicalUrl = `${BASE_URL}/hochzeit/${wedding.slug}`;
    suggestions.push({
      suggestion_type: 'canonical_url',
      field_name: 'canonical_url',
      original_text: wedding.canonical_url || '',
      suggested_text: canonicalUrl,
      confidence_score: 1.0,
      reasoning: 'Canonical URL für eindeutige Identifikation und Duplicate Content Vermeidung.'
    });
    
    // 4. Generate OG Description
    const ogDescription = generateWeddingOGDescription(wedding);
    suggestions.push({
      suggestion_type: 'og_description',
      field_name: 'og_image_url',
      original_text: wedding.og_image_url || '',
      suggested_text: `${BASE_URL}/images/weddings/${wedding.slug}-og.jpg`,
      confidence_score: 0.8,
      reasoning: 'Open Graph Bild für bessere Social Media Darstellung.'
    });
    
    // Store suggestions
    for (const suggestion of suggestions) {
      await supabase
        .from('ai_content_suggestions')
        .upsert({
          content_type: 'wedding',
          content_id: wedding.id,
          ...suggestion
        }, {
          onConflict: 'content_type,content_id,suggestion_type,field_name'
        });
    }
    
    // Apply high-confidence suggestions automatically
    const updates: any = {};
    for (const suggestion of suggestions) {
      if (suggestion.confidence_score >= 0.9) {
        updates[suggestion.field_name!] = suggestion.suggested_text;
      }
    }
    
    if (Object.keys(updates).length > 0) {
      await supabase
        .from('weddings')
        .update(updates)
        .eq('id', wedding.id);
      
      // Mark suggestions as applied
      for (const suggestion of suggestions) {
        if (suggestion.confidence_score >= 0.9) {
          await supabase
            .from('ai_content_suggestions')
            .update({ applied: true, applied_at: new Date().toISOString() })
            .eq('content_type', 'wedding')
            .eq('content_id', wedding.id)
            .eq('suggestion_type', suggestion.suggestion_type);
        }
      }
    }
    
    optimized++;
  }
  
  console.log(`✅ Optimized ${optimized} weddings`);
}

async function optimizeLocations() {
  const { data: locations } = await supabase
    .from('locations')
    .select('*');
  
  if (!locations) return;
  
  let optimized = 0;
  
  for (const location of locations) {
    const suggestions: AISuggestion[] = [];
    
    // 1. Optimize Meta Description
    const metaDescription = generateLocationMetaDescription(location);
    suggestions.push({
      suggestion_type: 'meta_description',
      field_name: 'meta_description',
      original_text: location.meta_description || '',
      suggested_text: metaDescription,
      confidence_score: 0.9,
      reasoning: 'Meta-Description für Hochzeitslocation mit lokalen SEO-Keywords optimiert.'
    });
    
    // 2. Generate Focus Keywords
    const focusKeywords = generateLocationKeywords(location);
    suggestions.push({
      suggestion_type: 'focus_keywords',
      field_name: 'focus_keywords',
      original_text: (location.focus_keywords || []).join(', '),
      suggested_text: focusKeywords.join(', '),
      confidence_score: 0.85,
      reasoning: 'Lokale SEO-Keywords für bessere Auffindbarkeit in der Region.'
    });
    
    // 3. Canonical URL
    const canonicalUrl = `${BASE_URL}/locations/${location.slug}`;
    suggestions.push({
      suggestion_type: 'canonical_url',
      field_name: 'canonical_url',
      original_text: location.canonical_url || '',
      suggested_text: canonicalUrl,
      confidence_score: 1.0,
      reasoning: 'Canonical URL für Location-Seite.'
    });
    
    // Store and apply suggestions
    for (const suggestion of suggestions) {
      await supabase
        .from('ai_content_suggestions')
        .upsert({
          content_type: 'location',
          content_id: location.id,
          ...suggestion
        }, {
          onConflict: 'content_type,content_id,suggestion_type,field_name'
        });
    }
    
    // Apply high-confidence suggestions
    const updates: any = {};
    for (const suggestion of suggestions) {
      if (suggestion.confidence_score >= 0.9) {
        updates[suggestion.field_name!] = suggestion.suggested_text;
      }
    }
    
    if (Object.keys(updates).length > 0) {
      await supabase
        .from('locations')
        .update(updates)
        .eq('id', location.id);
    }
    
    optimized++;
  }
  
  console.log(`✅ Optimized ${optimized} locations`);
}

async function optimizeBlogPosts() {
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('*');
  
  if (!blogPosts) return;
  
  let optimized = 0;
  
  for (const post of blogPosts) {
    const suggestions: AISuggestion[] = [];
    
    // 1. Optimize Meta Description
    const metaDescription = generateBlogMetaDescription(post);
    suggestions.push({
      suggestion_type: 'meta_description',
      field_name: 'meta_description',
      original_text: post.meta_description || '',
      suggested_text: metaDescription,
      confidence_score: 0.9,
      reasoning: 'Meta-Description für Hochzeitstipp mit relevanten Keywords optimiert.'
    });
    
    // 2. Generate Focus Keywords
    const focusKeywords = generateBlogKeywords(post);
    suggestions.push({
      suggestion_type: 'focus_keywords',
      field_name: 'focus_keywords',
      original_text: (post.focus_keywords || []).join(', '),
      suggested_text: focusKeywords.join(', '),
      confidence_score: 0.8,
      reasoning: 'Keywords für Hochzeitstipps und Ratgeber-Content.'
    });
    
    // 3. Canonical URL
    const canonicalUrl = `${BASE_URL}/tipp/${post.slug}`;
    suggestions.push({
      suggestion_type: 'canonical_url',
      field_name: 'canonical_url',
      original_text: post.canonical_url || '',
      suggested_text: canonicalUrl,
      confidence_score: 1.0,
      reasoning: 'Canonical URL für Blog-Post.'
    });
    
    // Store and apply suggestions
    for (const suggestion of suggestions) {
      await supabase
        .from('ai_content_suggestions')
        .upsert({
          content_type: 'blog',
          content_id: post.id,
          ...suggestion
        }, {
          onConflict: 'content_type,content_id,suggestion_type,field_name'
        });
    }
    
    // Apply high-confidence suggestions
    const updates: any = {};
    for (const suggestion of suggestions) {
      if (suggestion.confidence_score >= 0.9) {
        updates[suggestion.field_name!] = suggestion.suggested_text;
      }
    }
    
    if (Object.keys(updates).length > 0) {
      await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', post.id);
    }
    
    optimized++;
  }
  
  console.log(`✅ Optimized ${optimized} blog posts`);
}

async function optimizeServices() {
  const { data: services } = await supabase
    .from('fotobox_services')
    .select('*');
  
  if (!services) return;
  
  let optimized = 0;
  
  for (const service of services) {
    const suggestions: AISuggestion[] = [];
    
    // 1. Optimize Meta Description
    const metaDescription = generateServiceMetaDescription(service);
    suggestions.push({
      suggestion_type: 'meta_description',
      field_name: 'meta_description',
      original_text: service.meta_description || '',
      suggested_text: metaDescription,
      confidence_score: 0.9,
      reasoning: 'Meta-Description für Fotobox-Service mit Service-Keywords optimiert.'
    });
    
    // 2. Generate Focus Keywords
    const focusKeywords = generateServiceKeywords(service);
    suggestions.push({
      suggestion_type: 'focus_keywords',
      field_name: 'focus_keywords',
      original_text: (service.focus_keywords || []).join(', '),
      suggested_text: focusKeywords.join(', '),
      confidence_score: 0.85,
      reasoning: 'Service-spezifische Keywords für bessere Auffindbarkeit.'
    });
    
    // Store and apply suggestions
    for (const suggestion of suggestions) {
      await supabase
        .from('ai_content_suggestions')
        .upsert({
          content_type: 'fotobox',
          content_id: service.id,
          ...suggestion
        }, {
          onConflict: 'content_type,content_id,suggestion_type,field_name'
        });
    }
    
    // Apply high-confidence suggestions
    const updates: any = {};
    for (const suggestion of suggestions) {
      if (suggestion.confidence_score >= 0.9) {
        updates[suggestion.field_name!] = suggestion.suggested_text;
      }
    }
    
    if (Object.keys(updates).length > 0) {
      await supabase
        .from('fotobox_services')
        .update(updates)
        .eq('id', service.id);
    }
    
    optimized++;
  }
  
  console.log(`✅ Optimized ${optimized} services`);
}

async function optimizePages() {
  const { data: pages } = await supabase
    .from('pages')
    .select('*');
  
  if (!pages) return;
  
  let optimized = 0;
  
  for (const page of pages) {
    const suggestions: AISuggestion[] = [];
    
    // 1. Optimize Meta Description
    const metaDescription = generatePageMetaDescription(page);
    suggestions.push({
      suggestion_type: 'meta_description',
      field_name: 'meta_description',
      original_text: page.meta_description || '',
      suggested_text: metaDescription,
      confidence_score: 0.85,
      reasoning: 'Meta-Description für statische Seite optimiert.'
    });
    
    // Store suggestions
    for (const suggestion of suggestions) {
      await supabase
        .from('ai_content_suggestions')
        .upsert({
          content_type: 'page',
          content_id: page.id,
          ...suggestion
        }, {
          onConflict: 'content_type,content_id,suggestion_type,field_name'
        });
    }
    
    optimized++;
  }
  
  console.log(`✅ Optimized ${optimized} pages`);
}

// Helper Functions for Content Generation

function generateWeddingMetaDescription(wedding: any): string {
  const couple = wedding.couple_names || 'Brautpaar';
  const location = wedding.location || 'Oberösterreich';
  return `Hochzeitsfotografie ${couple} - Professionelle Hochzeitsbilder von Daniel Zangerle. Natürliche und emotionale Fotos in ${location}. Jetzt Portfolio ansehen!`;
}

function generateWeddingKeywords(wedding: any): string[] {
  const keywords = ['Hochzeitsfotografie', 'Hochzeitsbilder'];
  
  if (wedding.couple_names) {
    keywords.push(`Hochzeit ${wedding.couple_names}`);
  }
  
  if (wedding.location) {
    keywords.push(`Hochzeit ${wedding.location}`);
    keywords.push(`Hochzeitsfotograf ${wedding.location}`);
  }
  
  keywords.push('Daniel Zangerle', 'dz-photo', 'Oberösterreich');
  
  return keywords;
}

function generateWeddingOGDescription(wedding: any): string {
  const couple = wedding.couple_names || 'Brautpaar';
  return `Wunderschöne Hochzeitsbilder von ${couple} - Professionelle Hochzeitsfotografie von Daniel Zangerle`;
}

function generateLocationMetaDescription(location: any): string {
  const name = location.name;
  const city = location.city || 'Oberösterreich';
  return `Hochzeitslocation ${name} in ${city} - Traumhafte Hochzeitsbilder von Daniel Zangerle. Professionelle Fotografie für euren besonderen Tag. Portfolio ansehen!`;
}

function generateLocationKeywords(location: any): string[] {
  const keywords = ['Hochzeitslocation'];
  
  if (location.name) {
    keywords.push(location.name);
    keywords.push(`Hochzeit ${location.name}`);
  }
  
  if (location.city) {
    keywords.push(location.city);
    keywords.push(`Hochzeitslocation ${location.city}`);
    keywords.push(`Hochzeitsfotograf ${location.city}`);
  }
  
  keywords.push('Oberösterreich', 'Daniel Zangerle', 'Hochzeitsfotografie');
  
  return keywords;
}

function generateBlogMetaDescription(post: any): string {
  const title = post.title;
  const tipNumber = post.number ? `#${post.number}` : '';
  return `${title} ${tipNumber} - Hochzeitstipp von Daniel Zangerle. Professionelle Ratschläge für eure Hochzeitsplanung. Jetzt lesen!`;
}

function generateBlogKeywords(post: any): string[] {
  const keywords = ['Hochzeitstipp', 'Hochzeitsplanung', 'Ratgeber'];
  
  if (post.number) {
    keywords.push(`Tipp ${post.number}`);
  }
  
  // Extract keywords from title
  const title = post.title.toLowerCase();
  if (title.includes('schuhe')) keywords.push('Hochzeitsschuhe');
  if (title.includes('blumen')) keywords.push('Hochzeitsblumen');
  if (title.includes('einladung')) keywords.push('Hochzeitseinladungen');
  if (title.includes('checkliste')) keywords.push('Hochzeitscheckliste');
  
  keywords.push('Daniel Zangerle', 'dz-photo');
  
  return keywords;
}

function generateServiceMetaDescription(service: any): string {
  const name = service.name;
  const type = service.service_type || 'Fotobox';
  return `${name} - ${type} Service von Daniel Zangerle. Professionelle Fotobox für eure Hochzeit in Oberösterreich. Jetzt informieren!`;
}

function generateServiceKeywords(service: any): string[] {
  const keywords = ['Fotobox', 'Photobooth', 'Hochzeit'];
  
  if (service.name) {
    keywords.push(service.name);
  }
  
  if (service.service_type) {
    keywords.push(service.service_type);
  }
  
  keywords.push('Daniel Zangerle', 'dz-photo', 'Oberösterreich');
  
  return keywords;
}

function generatePageMetaDescription(page: any): string {
  const title = page.title;
  const type = page.page_type;
  
  if (type === 'contact') {
    return `${title} - Kontakt zu Daniel Zangerle, Hochzeitsfotograf in Oberösterreich. Jetzt unverbindlich anfragen für eure Hochzeitsfotografie!`;
  } else if (type === 'about') {
    return `${title} - Daniel Zangerle, professioneller Hochzeitsfotograf aus Oberösterreich. Erfahrt mehr über meine Leidenschaft für Hochzeitsfotografie.`;
  } else {
    return `${title} - dz-photo, Daniel Zangerle Hochzeitsfotografie in Oberösterreich. Professionelle Hochzeitsbilder für euren besonderen Tag.`;
  }
}

async function generateQualityReports() {
  // Count suggestions by type
  const { data: suggestionStats } = await supabase
    .from('ai_content_suggestions')
    .select('suggestion_type, applied')
    .then(({ data }) => {
      if (!data) return { data: [] };
      const stats = data.reduce((acc: any, item) => {
        const key = item.suggestion_type;
        if (!acc[key]) acc[key] = { total: 0, applied: 0 };
        acc[key].total++;
        if (item.applied) acc[key].applied++;
        return acc;
      }, {});
      return { data: Object.entries(stats) };
    });
  
  console.log('\n📊 AI Optimization Summary:');
  if (suggestionStats) {
    for (const [type, stats] of suggestionStats) {
      const { total, applied } = stats as any;
      console.log(`  ${type}: ${applied}/${total} applied (${Math.round(applied/total*100)}%)`);
    }
  }
  
  // Count by content type
  const { data: contentStats } = await supabase
    .from('ai_content_suggestions')
    .select('content_type')
    .then(({ data }) => {
      if (!data) return { data: [] };
      const counts = data.reduce((acc: any, item) => {
        acc[item.content_type] = (acc[item.content_type] || 0) + 1;
        return acc;
      }, {});
      return { data: Object.entries(counts) };
    });
  
  console.log('\n📈 Suggestions by content type:');
  if (contentStats) {
    for (const [type, count] of contentStats) {
      console.log(`  ${type}: ${count} suggestions`);
    }
  }
}

// Run AI optimization
if (require.main === module) {
  optimizeAllContent().catch(console.error);
}

export { optimizeAllContent };
