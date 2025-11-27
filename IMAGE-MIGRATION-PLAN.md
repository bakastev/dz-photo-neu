# Robuster Bildmigrations-Plan für DZ-Photo

## ✅ MIGRATION ABGESCHLOSSEN

### Finaler Status (27.11.2025)
- **Storage**: 1 Bucket (`images`) mit 455 Dateien
- **Qualität**: Hochauflösende Originalbilder (400KB - 1.3MB)
- **Struktur**: Sauber organisiert in Ordnern

### Storage-Struktur
```
images/
├── location/     # 227 Bilder (11 Locations, je 7-30 Bilder)
├── wedding/      # 14 Bilder (14 Weddings, je 1 Bild - Rezensionen!)
├── blog/         # 108 Bilder
├── fotobox/      # 32 Bilder
├── other/        # 72 Bilder
├── pages/        # 1 Bild
└── reviews/      # 1 Bild
```

### Wichtige Erkenntnis: Wedding-Seiten sind REZENSIONEN
Die "Hochzeit"-Seiten auf der alten Website sind **Testimonials/Rezensionen**, keine Galerien!
- Jede Wedding-Seite hat nur 1-2 Bilder (Thumbnail + ggf. Portrait)
- Die eigentlichen Hochzeitsfotos sind in den **Location-Galerien**
- Videos sind extern auf s3.amazonaws.com gehostet (nicht migrierbar)

---

## Ursprüngliche Problem-Analyse (historisch)

### Bildgrößen in WordPress
| Größe | Suffix | Verwendung | Status |
|-------|--------|------------|--------|
| Original | `-scaled.jpg` oder ohne Suffix | Lightbox, Galerie | ❌ Fehlt größtenteils |
| Large | `1024x` | Detailseiten | ❌ Fehlt |
| Medium | `400x284` | Thumbnails | ✅ Vorhanden |
| Small | `300x200`, `150x150` | Grid-Ansichten | ✅ Vorhanden |

### Bilder pro Content-Typ
| Typ | Heruntergeladen | Benötigt (geschätzt) | Qualität |
|-----|-----------------|----------------------|----------|
| Locations | 226 | ~300 (volle Größe) | ❌ Nur Thumbnails |
| Weddings | 13 | ~50-100 (volle Größe) | ❌ Nur Thumbnails |
| Blog | 107 | ~100 | ⚠️ Gemischt |
| Reviews | 1 | ~5 | ❌ |
| Pages | 1 | ~10 | ❌ |

---

## Migrations-Plan

### Phase 1: Vollständige URL-Extraktion (30 min)
**Ziel**: Alle Bild-URLs aus den HTML-Dateien extrahieren und nach Qualität kategorisieren

```bash
# Script: extract-all-image-urls.ts
# Input: /dz-photo-alt/html/*.html
# Output: comprehensive-image-mapping.json
```

**Aufgaben**:
1. Alle HTML-Dateien parsen
2. Alle `<img src>` und `<a href>` mit Bildern extrahieren
3. Duplikate entfernen (gleiche Basis, verschiedene Größen)
4. Für jedes Bild: Volle URL + alle Thumbnail-Varianten identifizieren
5. Content-Typ (wedding/location/blog) zuordnen

### Phase 2: Intelligentes URL-Mapping (15 min)
**Ziel**: Für jedes Bild die beste verfügbare Version finden

**Strategie**:
```
Priorität 1: Original ohne Suffix (z.B. DDZ_1234.jpg)
Priorität 2: -scaled Version (z.B. DDZ_1234-scaled.jpg)
Priorität 3: Größte verfügbare Thumbnail (1024x, 800x)
Fallback: 400x284 (aktuell vorhanden)
```

**Output**: `high-quality-image-urls.json`
```json
{
  "locations/feichthub": {
    "images": [
      {
        "original": "https://dz-photo.at/.../DDZ_1292.jpg",
        "scaled": "https://dz-photo.at/.../DDZ_1292-scaled.jpg",
        "fallback": "https://dz-photo.at/.../DDZ_1292-400x284.jpg",
        "bestAvailable": null // wird nach Download-Test gesetzt
      }
    ]
  }
}
```

### Phase 3: Verfügbarkeits-Check (20 min)
**Ziel**: Prüfen welche URLs noch erreichbar sind

```typescript
// Für jede URL: HEAD-Request senden
// Status 200 = verfügbar
// Status 404 = nicht verfügbar → nächste Priorität testen
```

**Wichtig**: WordPress kann alte Bilder gelöscht haben!

### Phase 4: Download der besten Versionen (60-90 min)
**Ziel**: Alle verfügbaren hochauflösenden Bilder herunterladen

**Konfiguration**:
- Parallel Downloads: 5 gleichzeitig
- Timeout: 30s pro Bild
- Retry: 3 Versuche bei Fehler
- Mindestgröße: 100KB (sonst Thumbnail verwenden)

**Output-Struktur**:
```
downloads/images-hq/
├── weddings/
│   ├── lisa-patrick/
│   │   ├── DDZ_1234.jpg (Original)
│   │   └── DDZ_1234-thumb.jpg (400x284 für Vorschau)
├── locations/
│   ├── feichthub/
│   │   ├── DDZ_1292.jpg
│   │   ├── DDZ_1293.jpg
│   │   └── ...
└── blog/
    └── ...
```

### Phase 5: Upload zu Supabase Storage (30 min)
**Ziel**: Alle Bilder in korrekter Struktur hochladen

**Bucket-Struktur**:
```
images/
├── weddings/
│   └── {slug}/
│       ├── gallery/
│       │   ├── 001.jpg
│       │   ├── 002.jpg
│       │   └── ...
│       └── cover.jpg
├── locations/
│   └── {slug}/
│       ├── gallery/
│       │   └── ...
│       └── cover.jpg
└── blog/
    └── {slug}/
        └── featured.jpg
```

### Phase 6: Datenbank-Update (15 min)
**Ziel**: Alle DB-Einträge mit korrekten Bildpfaden aktualisieren

```sql
UPDATE locations SET
  cover_image = 'locations/{slug}/cover.jpg',
  images = '[
    "locations/{slug}/gallery/001.jpg",
    "locations/{slug}/gallery/002.jpg",
    ...
  ]'::jsonb
WHERE slug = '{slug}';
```

---

## Implementierungs-Reihenfolge

### Script 1: `analyze-image-sources.ts`
```typescript
// 1. Alle HTML-Dateien lesen
// 2. Bild-URLs extrahieren (img src, a href, srcset)
// 3. Basis-Dateinamen identifizieren
// 4. Alle Größenvarianten gruppieren
// 5. JSON-Report erstellen
```

### Script 2: `find-best-quality-images.ts`
```typescript
// 1. Für jedes Bild: Verfügbarkeit der besten Version prüfen
// 2. HEAD-Requests parallel ausführen
// 3. Beste verfügbare URL speichern
// 4. Download-Liste erstellen
```

### Script 3: `download-hq-images.ts`
```typescript
// 1. Download-Liste laden
// 2. Parallel herunterladen (5 gleichzeitig)
// 3. Dateigröße validieren (>100KB)
// 4. In korrekter Ordnerstruktur speichern
// 5. Fortschritt loggen
```

### Script 4: `upload-to-supabase-storage.ts`
```typescript
// 1. Lokale Bilder scannen
// 2. In Supabase Storage hochladen
// 3. Öffentliche URLs generieren
// 4. Mapping für DB-Update erstellen
```

### Script 5: `update-database-images.ts`
```typescript
// 1. Mapping laden
// 2. DB-Einträge aktualisieren
// 3. Validierung durchführen
```

---

## Qualitätssicherung

### Validierungen
- [ ] Jede Location hat mindestens 5 Galerie-Bilder
- [ ] Jede Wedding hat mindestens 1 Cover-Bild
- [ ] Alle Bilder sind > 100KB (keine Thumbnails als Hauptbilder)
- [ ] Alle Bilder sind erreichbar (200 OK)
- [ ] Keine Duplikate in der Galerie

### Fallback-Strategie
Falls Original nicht verfügbar:
1. Thumbnail verwenden
2. Placeholder mit Hinweis "Bild wird aktualisiert"
3. Ähnliches Bild aus gleicher Location/Wedding

---

## Zeitschätzung

| Phase | Dauer | Automatisiert |
|-------|-------|---------------|
| 1. URL-Extraktion | 30 min | ✅ |
| 2. URL-Mapping | 15 min | ✅ |
| 3. Verfügbarkeits-Check | 20 min | ✅ |
| 4. Download | 60-90 min | ✅ |
| 5. Upload | 30 min | ✅ |
| 6. DB-Update | 15 min | ✅ |
| **Gesamt** | **~3 Stunden** | |

---

## Nächste Schritte

1. **Sofort**: Script 1 ausführen (Analyse)
2. **Dann**: Scripts 2-5 nacheinander
3. **Zum Schluss**: Visuelle Überprüfung der Webseite

## Risiken

- WordPress-Server könnte alte Bilder gelöscht haben
- Rate-Limiting beim Download
- Große Dateien (>5MB) könnten Timeout verursachen

## Alternativen falls Originalbilder nicht verfügbar

1. **Wayback Machine** (archive.org) für alte Versionen
2. **Upscaling** der Thumbnails mit AI (z.B. Real-ESRGAN)
3. **Kontakt zum Kunden** für Original-Dateien

