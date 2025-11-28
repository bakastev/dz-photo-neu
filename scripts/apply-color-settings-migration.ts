#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import 'dotenvx/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('💡 Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  console.log('🔄 Applying color settings migration...');

  try {
    // Add color columns
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE site_settings
        ADD COLUMN IF NOT EXISTS color_primary TEXT DEFAULT '#D4AF37',
        ADD COLUMN IF NOT EXISTS color_background TEXT DEFAULT '#0A0A0A',
        ADD COLUMN IF NOT EXISTS color_surface TEXT DEFAULT '#141414',
        ADD COLUMN IF NOT EXISTS color_text TEXT DEFAULT '#FFFFFF',
        ADD COLUMN IF NOT EXISTS color_gold_light TEXT DEFAULT '#F0EBD2';
      `
    });

    if (alterError) {
      // Try direct SQL execution via REST API
      console.log('⚠️ RPC method not available, trying direct SQL...');
      
      // Use REST API to execute SQL
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          sql: `
            ALTER TABLE site_settings
            ADD COLUMN IF NOT EXISTS color_primary TEXT DEFAULT '#D4AF37',
            ADD COLUMN IF NOT EXISTS color_background TEXT DEFAULT '#0A0A0A',
            ADD COLUMN IF NOT EXISTS color_surface TEXT DEFAULT '#141414',
            ADD COLUMN IF NOT EXISTS color_text TEXT DEFAULT '#FFFFFF',
            ADD COLUMN IF NOT EXISTS color_gold_light TEXT DEFAULT '#F0EBD2';
          `
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    // Update existing records
    const { error: updateError } = await supabase
      .from('site_settings')
      .update({
        color_primary: '#D4AF37',
        color_background: '#0A0A0A',
        color_surface: '#141414',
        color_text: '#FFFFFF',
        color_gold_light: '#F0EBD2',
      })
      .is('color_primary', null);

    if (updateError && updateError.code !== 'PGRST116') {
      console.warn('⚠️ Could not update existing records:', updateError.message);
    }

    console.log('✅ Migration applied successfully!');
    console.log('💡 You can now use the color settings in the admin panel.');
  } catch (error: any) {
    console.error('❌ Error applying migration:', error.message);
    console.error('💡 Please run this SQL manually in Supabase:');
    console.log(`
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS color_primary TEXT DEFAULT '#D4AF37',
ADD COLUMN IF NOT EXISTS color_background TEXT DEFAULT '#0A0A0A',
ADD COLUMN IF NOT EXISTS color_surface TEXT DEFAULT '#141414',
ADD COLUMN IF NOT EXISTS color_text TEXT DEFAULT '#FFFFFF',
ADD COLUMN IF NOT EXISTS color_gold_light TEXT DEFAULT '#F0EBD2';

UPDATE site_settings
SET 
  color_primary = COALESCE(color_primary, '#D4AF37'),
  color_background = COALESCE(color_background, '#0A0A0A'),
  color_surface = COALESCE(color_surface, '#141414'),
  color_text = COALESCE(color_text, '#FFFFFF'),
  color_gold_light = COALESCE(color_gold_light, '#F0EBD2')
WHERE color_primary IS NULL OR color_background IS NULL OR color_surface IS NULL OR color_text IS NULL OR color_gold_light IS NULL;
    `);
    process.exit(1);
  }
}

applyMigration();

