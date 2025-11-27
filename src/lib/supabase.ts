import { createClient } from '@supabase/supabase-js';

// TEMPORARY: Use hardcoded values to ensure it works
const supabaseUrl = 'https://qljgbskxopjkivkcuypu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      'Accept': 'application/json',
      'Prefer': 'return=representation',
    },
  },
});

// Automatischer Connection-Test beim Client-Start
if (typeof window !== 'undefined') {
  supabase.from('weddings').select('id, slug, title', { count: 'exact' })
    .then(({ data, count, error }) => {
      if (error) {
        console.error('❌ Supabase connection test FAILED:', error);
      } else {
        console.log('✅ Supabase connection OK!', { weddings: count, data: data?.slice(0, 2) });
      }
    });
}

// Types für TypeScript
export interface Wedding {
  id: string;
  slug: string;
  title: string;
  couple_names?: string;
  wedding_date?: string;
  location?: string;
  description?: string;
  content?: string;
  cover_image?: string;
  images?: any[];
  featured?: boolean;
  published?: boolean;
  guest_count?: number;
  venue_name?: string;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_image_url?: string;
  focus_keywords?: string[];
  related_keywords?: string[];
  readability_score?: number;
  word_count?: number;
  schema_org_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Location {
  id: string;
  slug: string;
  name: string;
  city?: string;
  region?: string;
  address?: string;
  description?: string;
  content?: string;
  latitude?: number;
  longitude?: number;
  google_place_id?: string;
  google_maps_url?: string;
  postal_code?: string;
  country?: string;
  timezone?: string;
  elevation_meters?: number;
  what3words?: string;
  cover_image?: string;
  images?: any[];
  features?: string[];
  featured?: boolean;
  capacity_min?: number;
  capacity_max?: number;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  focus_keywords?: string[];
  schema_org_id?: string;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  number?: number;
  excerpt?: string;
  content?: string;
  cover_image?: string;
  featured_image?: string;
  category?: string;
  tags?: string[];
  featured?: boolean;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  focus_keywords?: string[];
  word_count?: number;
  published?: boolean;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FotoboxService {
  id: string;
  slug: string;
  name: string;
  service_type?: string;
  description?: string;
  features?: string[];
  cover_image?: string;
  images?: string[];
  price?: number;
  currency?: string;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  focus_keywords?: string[];
  popular?: boolean;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  author_name: string;
  rating: number;
  review_text?: string;
  review_date?: string;
  location_id?: string;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  published?: boolean;
  created_at?: string;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  content?: string;
  page_type?: 'home' | 'about' | 'contact' | 'legal' | 'services';
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  focus_keywords?: string[];
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}
