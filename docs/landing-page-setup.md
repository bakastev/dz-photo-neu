# Landing Page für Google Ads - Setup Guide

## Route
Die optimierte Landing Page ist unter `/lp/hochzeit` verfügbar.

**URL:** `https://www.dz-photo.at/lp/hochzeit`

## Subdomain Setup (Vercel)

### Option 1: Subdomain über Vercel Domain Settings
1. Gehe zu Vercel Dashboard → Project Settings → Domains
2. Füge eine neue Domain hinzu: `lp.dz-photo.at`
3. Vercel erstellt automatisch einen DNS-Eintrag
4. In Vercel Project Settings → Domains → `lp.dz-photo.at` → Rewrites
5. Füge einen Rewrite hinzu:
   - Source: `/`
   - Destination: `/lp/hochzeit`

### Option 2: Subdomain über vercel.json (empfohlen)
Die `vercel.json` wurde bereits mit einem Redirect aktualisiert:
```json
{
  "redirects": [
    {
      "source": "/lp-hochzeit",
      "destination": "/lp/hochzeit",
      "permanent": false
    }
  ]
}
```

Für eine echte Subdomain (`lp.dz-photo.at`):
1. Domain in Vercel hinzufügen (siehe Option 1)
2. Rewrite in `vercel.json` hinzufügen:
```json
{
  "rewrites": [
    {
      "source": "/",
      "destination": "/lp/hochzeit",
      "has": [
        {
          "type": "host",
          "value": "lp.dz-photo.at"
        }
      ]
    }
  ]
}
```

## Features der Landing Page

### Conversion-Optimierungen
- ✅ Keine Navbar/Footer (weniger Ablenkung)
- ✅ Prominenter Hero mit klarem CTA
- ✅ Urgency-Message: "2026 Termine noch verfügbar"
- ✅ Trust Badges: "15+ Jahre Erfahrung", "200+ Hochzeiten", "Kostenlose Beratung"
- ✅ Reduziertes Portfolio (6 statt alle)
- ✅ Testimonials prominenter platziert
- ✅ 3-Schritte-Prozess klar dargestellt
- ✅ Externes Formular von kreativ.management eingebettet

### Externes Formular
Das Formular wird von `kreativ.management` geladen:
- Form ID: `472b1e77-ff01-486e-91c4-02ca208351ec`
- Script: `https://api.kreativ.management/Form/GetContactFormWidget`
- Wird lazy geladen für bessere Performance

### Bilder
- Verwendet originale Bilder aus der Supabase-Datenbank
- Nur featured Weddings werden angezeigt (max. 6)
- Optimierte Bildgrößen für schnelles Laden

## Google Ads Integration

### Conversion Tracking
1. Google Ads Conversion Tag in die Landing Page einbetten
2. Conversion-Action: "Formular-Absendung"
3. Event-Tracking für Scroll-Tiefe und Engagement

### A/B Testing
Die Landing Page kann einfach dupliziert werden:
- `/lp/hochzeit-v2` für Variante B
- Tracking-Parameter: `?utm_source=google&utm_medium=cpc&utm_campaign=hochzeit-2026`

## Performance
- Server-Side Rendering (SSR)
- Optimierte Bilder mit Next.js Image
- Lazy Loading für externe Scripts
- Minimale JavaScript-Dependencies

## SEO
- Meta-Tags optimiert für "Hochzeitsfotograf Oberösterreich 2026"
- Schema.org Markup für Service
- Canonical URL gesetzt

