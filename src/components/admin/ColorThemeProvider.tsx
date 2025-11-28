'use client';

import { useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/auth-client';

export default function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const loadColors = async () => {
      const supabase = createBrowserSupabaseClient();
      const { data } = await supabase
        .from('site_settings')
        .select('color_primary, color_background, color_surface, color_text, color_gold_light')
        .eq('id', 'main')
        .single();

      if (data) {
        // Set CSS variables for admin area only
        const root = document.documentElement;
        root.style.setProperty('--admin-color-primary', data.color_primary || '#D4AF37');
        root.style.setProperty('--admin-color-background', data.color_background || '#0A0A0A');
        root.style.setProperty('--admin-color-surface', data.color_surface || '#141414');
        root.style.setProperty('--admin-color-text', data.color_text || '#FFFFFF');
        root.style.setProperty('--admin-color-gold-light', data.color_gold_light || '#F0EBD2');
      }
    };

    loadColors();
  }, []);

  return <>{children}</>;
}

