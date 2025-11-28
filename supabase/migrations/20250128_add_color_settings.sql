-- Add color settings to site_settings table
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS color_primary TEXT DEFAULT '#D4AF37',
ADD COLUMN IF NOT EXISTS color_background TEXT DEFAULT '#0A0A0A',
ADD COLUMN IF NOT EXISTS color_surface TEXT DEFAULT '#141414',
ADD COLUMN IF NOT EXISTS color_text TEXT DEFAULT '#FFFFFF',
ADD COLUMN IF NOT EXISTS color_gold_light TEXT DEFAULT '#F0EBD2';

-- Update existing records with default colors if they are null
UPDATE site_settings
SET 
  color_primary = COALESCE(color_primary, '#D4AF37'),
  color_background = COALESCE(color_background, '#0A0A0A'),
  color_surface = COALESCE(color_surface, '#141414'),
  color_text = COALESCE(color_text, '#FFFFFF'),
  color_gold_light = COALESCE(color_gold_light, '#F0EBD2')
WHERE color_primary IS NULL OR color_background IS NULL OR color_surface IS NULL OR color_text IS NULL OR color_gold_light IS NULL;

