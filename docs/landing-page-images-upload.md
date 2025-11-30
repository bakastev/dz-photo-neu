# Landing Page Bilder Upload

## Problem

Die Bilder von der alten Landing Page (`https://www.dz-photo.at/hochzeit/`) sind nicht mehr unter den ursprünglichen URLs verfügbar. Die Landing Page ist jetzt so konfiguriert, dass sie die Bilder aus Supabase Storage verwendet.

## Lösung: Bilder manuell hochladen

Die Landing Page erwartet die folgenden Bilder in Supabase Storage unter `images/landing-page/`:

### Benötigte Bilder:

1. **Hero-Bild:**
   - Pfad: `landing-page/lp-hero-DDZ_7751-scaled-1.jpg`
   - Original-URL: `https://www.dz-photo.at/hochzeit/wp-content/uploads/sites/24/2023/10/DDZ_7751-scaled-1-1024x683.jpg`

2. **Portfolio-Bilder (10 Stück):**
   - `landing-page/lp-portfolio-DDZ_1292.jpg`
   - `landing-page/lp-portfolio-DDZ_0042-23.jpg`
   - `landing-page/lp-portfolio-DZR50295-scaled-1.jpg`
   - `landing-page/lp-portfolio-DZR52761.jpg`
   - `landing-page/lp-portfolio-DZR52973.jpg`
   - `landing-page/lp-portfolio-DZ_6672-10.jpg`
   - `landing-page/lp-portfolio-DDZ_0106-1.jpg`
   - `landing-page/lp-portfolio-DDZ_0226-25.jpg`
   - `landing-page/lp-portfolio-DZ_6740-14.jpg`
   - `landing-page/lp-portfolio-DZR68020-scaled-1.jpg`

3. **About-Bild:**
   - `landing-page/lp-about-DZ_5066-2.jpg`
   - Original-URL: `https://www.dz-photo.at/hochzeit/wp-content/uploads/sites/24/2023/10/DZ_5066-2-705x470-1.jpg`

## Upload-Methoden

### Option 1: Supabase Dashboard (Empfohlen)

1. Gehe zu [Supabase Dashboard](https://supabase.com/dashboard/project/qljgbskxopjkivkcuypu/storage/buckets/images)
2. Navigiere zu `images` Bucket
3. Erstelle den Ordner `landing-page` (falls nicht vorhanden)
4. Lade die Bilder manuell hoch

### Option 2: Browser-Extension

1. Öffne die alte Landing Page im Browser: `https://www.dz-photo.at/hochzeit/`
2. Öffne die Developer Tools (F12)
3. Gehe zum Network-Tab
4. Lade die Seite neu
5. Filtere nach Bildern (Type: img)
6. Rechtsklick auf jedes Bild → "Save image as..."
7. Speichere die Bilder lokal
8. Lade sie dann zu Supabase hoch

### Option 3: Script (wenn Bilder lokal verfügbar)

Wenn du die Bilder lokal hast, kannst du das Script `scripts/upload-lp-images.ts` verwenden:

```bash
# Passe die URLs im Script an, falls die Bilder lokal verfügbar sind
npx tsx scripts/upload-lp-images.ts
```

## Aktuelle Konfiguration

Die Landing Page verwendet die folgenden Supabase Storage URLs:

```typescript
const LP_IMAGES = {
  hero: 'https://qljgbskxopjkivkcuypu.supabase.co/storage/v1/object/public/images/landing-page/lp-hero-DDZ_7751-scaled-1.jpg',
  portfolio: [
    'https://qljgbskxopjkivkcuypu.supabase.co/storage/v1/object/public/images/landing-page/lp-portfolio-DDZ_1292.jpg',
    // ... weitere Portfolio-Bilder
  ],
  about: 'https://qljgbskxopjkivkcuypu.supabase.co/storage/v1/object/public/images/landing-page/lp-about-DZ_5066-2.jpg',
};
```

## Nach dem Upload

Nach dem Hochladen der Bilder sollten sie automatisch auf der Landing Page unter `/lp/hochzeit` sichtbar sein.

## Fallback

Falls die Bilder nicht verfügbar sind, zeigt die Landing Page einen Fallback (leere Bilder oder Platzhalter).

