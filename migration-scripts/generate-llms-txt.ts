#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Supabase client
const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

const BASE_URL = 'https://www.dz-photo.at';
const BUSINESS_NAME = 'dz-photo';
const PHOTOGRAPHER_NAME = 'Daniel Zangerle';

interface LLMsContent {
  url: string;
  priority: number;
  lastUpdated: string;
  description: string;
  contentType: string;
  slug: string;
  keywords: string[];
}

interface LLMsRelation {
  source: string;
  target: string;
  type: string;
  strength: number;
}

async function generateLLMsTxt() {
  console.log('📄 Generating llms.txt for KI-Agent-Steuerung...');
  
  // Collect all content with priorities
  const content: LLMsContent[] = [];
  
  // 1. Homepage (highest priority)
  const { data: homepage } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', 'home')
    .single();
  
  if (homepage) {
    content.push({
      url: `${BASE_URL}/`,
      priority: 1.0,
      lastUpdated: homepage.updated_at || homepage.created_at,
      description: 'Professionelle Hochzeitsfotografie in Oberösterreich. Hauptseite mit Überblick über Services und Portfolio.',
      contentType: 'homepage',
      slug: 'home',
      keywords: ['Hochzeitsfotograf', 'Oberösterreich', 'Fotografie', 'Daniel Zangerle']
    });
  }
  
  // 2. Featured Weddings (high priority)
  const { data: weddings } = await supabase
    .from('weddings')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (weddings) {
    for (const wedding of weddings) {
      content.push({
        url: `${BASE_URL}/hochzeit/${wedding.slug}`,
        priority: 0.9,
        lastUpdated: wedding.updated_at || wedding.created_at,
        description: `Hochzeitsfotografie ${wedding.couple_names} - ${wedding.description || 'Professionelle Hochzeitsbilder'}`,
        contentType: 'wedding',
        slug: wedding.slug,
        keywords: ['Hochzeit', wedding.couple_names, wedding.location].filter(Boolean)
      });
    }
  }
  
  // 3. All Weddings (medium-high priority)
  const { data: allWeddings } = await supabase
    .from('weddings')
    .select('*')
    .eq('featured', false)
    .order('created_at', { ascending: false });
  
  if (allWeddings) {
    for (const wedding of allWeddings) {
      content.push({
        url: `${BASE_URL}/hochzeit/${wedding.slug}`,
        priority: 0.8,
        lastUpdated: wedding.updated_at || wedding.created_at,
        description: `Hochzeitsfotografie ${wedding.couple_names} - ${wedding.description || 'Hochzeitsbilder'}`,
        contentType: 'wedding',
        slug: wedding.slug,
        keywords: ['Hochzeit', wedding.couple_names, wedding.location].filter(Boolean)
      });
    }
  }
  
  // 4. Locations (high priority for local SEO)
  const { data: locations } = await supabase
    .from('locations')
    .select('*')
    .order('name');
  
  if (locations) {
    for (const location of locations) {
      content.push({
        url: `${BASE_URL}/locations/${location.slug}`,
        priority: 0.85,
        lastUpdated: location.updated_at || location.created_at,
        description: `Hochzeitslocation ${location.name} in ${location.city} - ${location.description || 'Traumhafte Hochzeitslocation'}`,
        contentType: 'location',
        slug: location.slug,
        keywords: ['Hochzeitslocation', location.name, location.city, 'Oberösterreich'].filter(Boolean)
      });
    }
  }
  
  // 5. Popular Blog Posts (medium priority)
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (blogPosts) {
    for (const post of blogPosts) {
      const priority = post.slug.includes('tipp-') ? 0.7 : 0.6;
      content.push({
        url: `${BASE_URL}/tipp/${post.slug}`,
        priority: priority,
        lastUpdated: post.updated_at || post.created_at,
        description: `${post.title} - ${post.excerpt || 'Hochzeitstipp für eure Planung'}`,
        contentType: 'blog',
        slug: post.slug,
        keywords: ['Hochzeitstipp', 'Planung', 'Ratgeber'].concat(post.focus_keywords || [])
      });
    }
  }
  
  // 6. Fotobox Services (medium priority)
  const { data: services } = await supabase
    .from('fotobox_services')
    .select('*')
    .order('popular', { ascending: false });
  
  if (services) {
    for (const service of services) {
      content.push({
        url: `${BASE_URL}/fotobox/${service.slug}`,
        priority: service.popular ? 0.75 : 0.65,
        lastUpdated: service.updated_at || service.created_at,
        description: `${service.name} - ${service.description || 'Fotobox Service für Hochzeiten'}`,
        contentType: 'fotobox',
        slug: service.slug,
        keywords: ['Fotobox', 'Photobooth', 'Hochzeit', service.service_type].filter(Boolean)
      });
    }
  }
  
  // 7. Important Pages (medium priority)
  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .neq('slug', 'home')
    .in('page_type', ['about', 'contact', 'services']);
  
  if (pages) {
    for (const page of pages) {
      const priority = page.page_type === 'about' ? 0.8 : 0.6;
      content.push({
        url: `${BASE_URL}/${page.slug}`,
        priority: priority,
        lastUpdated: page.updated_at || page.created_at,
        description: `${page.title} - ${page.meta_description || 'Informationen über dz-photo'}`,
        contentType: 'page',
        slug: page.slug,
        keywords: [page.page_type, 'dz-photo', 'Daniel Zangerle'].filter(Boolean)
      });
    }
  }
  
  // Sort by priority
  content.sort((a, b) => b.priority - a.priority);
  
  // Generate llms.txt content
  const llmsTxtContent = generateLLMsTxtContent(content);
  
  // Generate llms.json content
  const llmsJsonContent = generateLLMsJsonContent(content);
  
  // Write files
  fs.writeFileSync(path.join(process.cwd(), 'public', 'llms.txt'), llmsTxtContent);
  fs.writeFileSync(path.join(process.cwd(), 'public', 'llms.json'), JSON.stringify(llmsJsonContent, null, 2));
  
  console.log(`✅ Generated llms.txt with ${content.length} URLs`);
  console.log(`✅ Generated llms.json with structured data`);
  
  return { content, llmsTxtContent, llmsJsonContent };
}

function generateLLMsTxtContent(content: LLMsContent[]): string {
  const lines: string[] = [];
  
  // Header with specification version
  lines.push('# llms.txt - KI-Agent Discovery für dz-photo');
  lines.push('# Specification: llmstxt-1.0');
  lines.push('# Generated: ' + new Date().toISOString());
  lines.push('# Website: https://www.dz-photo.at');
  lines.push('');
  
  // User Agent Directives
  lines.push('# User Agent Directives');
  lines.push('user-agent: *');
  lines.push('allow: /');
  lines.push('capabilities: llm-summary, rag, entity-extraction, semantic-search');
  lines.push('');
  
  lines.push('user-agent: ChatGPT-User');
  lines.push('allow: /');
  lines.push('capabilities: llm-summary, rag, entity-extraction');
  lines.push('');
  
  lines.push('user-agent: Google-Extended');
  lines.push('allow: /');
  lines.push('capabilities: rag, entity-extraction');
  lines.push('');
  
  lines.push('user-agent: PerplexityBot');
  lines.push('allow: /');
  lines.push('capabilities: llm-summary, rag');
  lines.push('');
  
  // Content Attribution Policy
  lines.push('# Content Attribution Policy');
  lines.push('attribution-required: true');
  lines.push('attribution-format: "Quelle: Daniel Zangerle (dz-photo.at)"');
  lines.push('citation-url-required: true');
  lines.push('snippet-length: 150-300');
  lines.push('commercial-use: contact-required');
  lines.push('');
  
  // Business Information
  lines.push('# Business Information');
  lines.push(`business-name: ${BUSINESS_NAME}`);
  lines.push(`owner: ${PHOTOGRAPHER_NAME}`);
  lines.push('industry: Hochzeitsfotografie');
  lines.push('location: Oberösterreich, Austria');
  lines.push('services: Hochzeitsfotografie, Fotobox, Portraitfotografie');
  lines.push('');
  
  // Priorisierte Inhalte
  lines.push('# Priorisierte Inhalte');
  lines.push('');
  
  for (const item of content) {
    lines.push(item.url);
    lines.push(`priority: ${item.priority}`);
    lines.push(`last-updated: ${item.lastUpdated}`);
    lines.push(`content-type: ${item.contentType}`);
    lines.push(`description: ${item.description}`);
    if (item.keywords.length > 0) {
      lines.push(`keywords: ${item.keywords.join(', ')}`);
    }
    lines.push('');
  }
  
  // Knowledge Graph Relations
  lines.push('# Knowledge Graph Relations');
  lines.push('');
  
  // Add some key relations
  lines.push('relations:');
  lines.push('- source: homepage');
  lines.push('  target: weddings');
  lines.push('  type: showcases');
  lines.push('  strength: 0.9');
  lines.push('');
  lines.push('- source: weddings');
  lines.push('  target: locations');
  lines.push('  type: photographed_at');
  lines.push('  strength: 0.8');
  lines.push('');
  lines.push('- source: blog');
  lines.push('  target: weddings');
  lines.push('  type: provides_tips_for');
  lines.push('  strength: 0.7');
  lines.push('');
  
  // Contact & Feedback
  lines.push('# Contact & Feedback');
  lines.push('contact-email: info@dz-photo.at');
  lines.push('feedback-policy: welcome');
  lines.push('update-frequency: weekly');
  lines.push('');
  
  return lines.join('\n');
}

function generateLLMsJsonContent(content: LLMsContent[]): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': `${BASE_URL}/llms.json`,
    'name': 'dz-photo KI-Agent Discovery Data',
    'description': 'Strukturierte Daten für KI-Agenten zur Entdeckung und Indexierung von dz-photo Inhalten',
    'url': `${BASE_URL}/llms.json`,
    'version': '1.0.0',
    'dateModified': new Date().toISOString(),
    'creator': {
      '@type': 'Organization',
      'name': BUSINESS_NAME,
      'url': BASE_URL
    },
    'license': 'https://creativecommons.org/licenses/by-nc/4.0/',
    'distribution': [
      {
        '@type': 'DataDownload',
        'encodingFormat': 'application/ld+json',
        'contentUrl': `${BASE_URL}/llms.json`
      },
      {
        '@type': 'DataDownload',
        'encodingFormat': 'text/plain',
        'contentUrl': `${BASE_URL}/llms.txt`
      }
    ],
    'contentPolicy': {
      'attributionRequired': true,
      'attributionFormat': 'Quelle: Daniel Zangerle (dz-photo.at)',
      'citationUrlRequired': true,
      'snippetLength': {
        'min': 150,
        'max': 300,
        'recommended': 200
      },
      'commercialUse': 'contact-required',
      'contactEmail': 'info@dz-photo.at'
    },
    'capabilities': [
      'llm-summary',
      'rag',
      'entity-extraction',
      'semantic-search'
    ],
    'userAgentPolicies': {
      'ChatGPT-User': {
        'allowed': true,
        'capabilities': ['llm-summary', 'rag', 'entity-extraction']
      },
      'Google-Extended': {
        'allowed': true,
        'capabilities': ['rag', 'entity-extraction']
      },
      'PerplexityBot': {
        'allowed': true,
        'capabilities': ['llm-summary', 'rag']
      }
    },
    'businessInfo': {
      '@type': 'LocalBusiness',
      'name': BUSINESS_NAME,
      'owner': PHOTOGRAPHER_NAME,
      'industry': 'Hochzeitsfotografie',
      'location': 'Oberösterreich, Austria',
      'services': ['Hochzeitsfotografie', 'Fotobox', 'Portraitfotografie'],
      'url': BASE_URL
    },
    'contentIndex': content.map(item => ({
      '@type': 'WebPage',
      'url': item.url,
      'name': item.description.split(' - ')[0],
      'description': item.description,
      'contentType': item.contentType,
      'priority': item.priority,
      'dateModified': item.lastUpdated,
      'keywords': item.keywords,
      'inLanguage': 'de-AT'
    })),
    'knowledgeGraph': {
      'entities': [
        {
          '@type': 'Person',
          '@id': `${BASE_URL}/#photographer`,
          'name': PHOTOGRAPHER_NAME,
          'jobTitle': 'Hochzeitsfotograf',
          'worksFor': {
            '@id': `${BASE_URL}/#business`
          }
        },
        {
          '@type': 'LocalBusiness',
          '@id': `${BASE_URL}/#business`,
          'name': BUSINESS_NAME,
          'industry': 'Hochzeitsfotografie',
          'areaServed': 'Oberösterreich'
        }
      ],
      'relations': [
        {
          'source': `${BASE_URL}/#photographer`,
          'target': `${BASE_URL}/#business`,
          'type': 'worksFor',
          'strength': 1.0
        }
      ]
    },
    'updateFrequency': 'weekly',
    'lastCrawled': null,
    'feedbackWelcome': true
  };
}

async function createPublicDirectory() {
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log('📁 Created public directory');
  }
}

async function testLLMsGeneration() {
  console.log('\n🧪 Testing llms.txt generation...');
  
  // Check if files were created
  const llmsTxtPath = path.join(process.cwd(), 'public', 'llms.txt');
  const llmsJsonPath = path.join(process.cwd(), 'public', 'llms.json');
  
  if (fs.existsSync(llmsTxtPath)) {
    const txtSize = fs.statSync(llmsTxtPath).size;
    console.log(`✅ llms.txt created (${txtSize} bytes)`);
    
    // Show first few lines
    const content = fs.readFileSync(llmsTxtPath, 'utf-8');
    const lines = content.split('\n').slice(0, 10);
    console.log('📄 First 10 lines of llms.txt:');
    lines.forEach((line, i) => console.log(`  ${i + 1}: ${line}`));
  }
  
  if (fs.existsSync(llmsJsonPath)) {
    const jsonSize = fs.statSync(llmsJsonPath).size;
    console.log(`✅ llms.json created (${jsonSize} bytes)`);
    
    // Validate JSON
    try {
      const jsonContent = JSON.parse(fs.readFileSync(llmsJsonPath, 'utf-8'));
      console.log(`📊 JSON contains ${jsonContent.contentIndex?.length || 0} content items`);
    } catch (error) {
      console.error('❌ Invalid JSON generated:', error);
    }
  }
}

// Run llms.txt generation
if (require.main === module) {
  createPublicDirectory()
    .then(() => generateLLMsTxt())
    .then(() => testLLMsGeneration())
    .catch(console.error);
}

export { generateLLMsTxt };
