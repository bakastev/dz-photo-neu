# Admin-Bereich: Verbesserungsplan für Seiten-Verwaltung

## 🎯 Problem-Analyse

### Aktuelle Situation:
1. **"Seiten" Reiter** (`/admin/pages`)
   - Zeigt alle Seiten aus der `pages` Tabelle
   - Nur Metadaten sichtbar (Titel, Slug, Typ, Status)
   - **KEIN Content-Editor** - Seiten können nicht wirklich bearbeitet werden
   - Verwirrend für Nutzer

2. **"Startseite" Reiter** (`/admin/homepage`)
   - Separater Reiter nur für Homepage
   - Vollständiger Editor für Homepage-Sektionen (Hero, About, Services, etc.)
   - Funktioniert gut, aber ist isoliert

3. **Probleme:**
   - Doppelte Struktur: Startseite ist auch eine "Seite", aber separat
   - "Seiten" Reiter ist nutzlos, da keine Bearbeitung möglich
   - Unklare Struktur: Was kann wo bearbeitet werden?

---

## ✅ Ziel-Zustand

### Neue Struktur:
1. **"Seiten" Reiter** (`/admin/pages`)
   - Zeigt **NUR** vollständig bearbeitbare Seiten
   - Startseite ist eine normale Seite in dieser Liste
   - Jede Seite hat einen vollständigen Content-Editor
   - Klare Struktur: Alles was bearbeitbar ist, ist hier

2. **Entfernt:**
   - "Startseite" Reiter wird entfernt
   - Startseite wird als normale Seite unter "Seiten" behandelt

3. **Seiten-Typen:**
   - **Startseite** (`page_type: 'homepage'`) - Vollständiger Editor für Sektionen
   - **Rechtliche Seiten** (`page_type: 'legal'`) - Impressum, Datenschutz, AGB - Lexical Editor
   - **Content-Seiten** (`page_type: 'content'`) - Allgemeine Seiten - Lexical Editor

---

## 📋 Implementierungs-Plan

### Phase 1: Datenbank-Anpassungen

#### 1.1 Startseite als normale Seite behandeln
```sql
-- Startseite in pages Tabelle einfügen (falls nicht vorhanden)
INSERT INTO pages (
  slug, 
  title, 
  page_type, 
  published,
  content
) VALUES (
  'home',
  'Startseite',
  'homepage',
  true,
  '{}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  page_type = 'homepage',
  updated_at = NOW();
```

#### 1.2 Seiten-Typen definieren
- `homepage` - Startseite mit Sektions-Editor
- `legal` - Rechtliche Seiten (Impressum, Datenschutz, AGB)
- `content` - Allgemeine Content-Seiten

---

### Phase 2: Seiten-Editor Komponente

#### 2.1 Universal Page Editor erstellen
**Datei:** `src/components/admin/editors/PageEditor.tsx`

```typescript
interface PageEditorProps {
  page: Page;
}

// Editor wählt basierend auf page_type den richtigen Editor:
// - homepage → HomepageSectionEditor (bestehend)
// - legal → LexicalEditor (für HTML-Content)
// - content → LexicalEditor (für HTML-Content)
```

**Features:**
- Dynamischer Editor basierend auf `page_type`
- Startseite: Sektions-basierter Editor (bestehend)
- Andere Seiten: Lexical Editor für HTML-Content
- SEO-Felder (meta_title, meta_description)
- Slug-Generierung
- Veröffentlichungs-Status

---

### Phase 3: Seiten-Liste überarbeiten

#### 3.1 Seiten-Liste anpassen
**Datei:** `src/app/admin/pages/page.tsx`

**Änderungen:**
- Filter: Nur Seiten mit `page_type IN ('homepage', 'legal', 'content')`
- Startseite wird als erste Seite angezeigt
- Klare Kennzeichnung des Seiten-Typs
- "Neue Seite" Button mit Typ-Auswahl

**UI-Verbesserungen:**
- Badge für Seiten-Typ (Startseite, Rechtlich, Content)
- Quick-Actions: Vorschau, Bearbeiten, Duplizieren
- Suchfunktion
- Filter nach Typ

---

### Phase 4: Navigation anpassen

#### 4.1 Sidebar aktualisieren
**Datei:** `src/components/admin/AdminSidebar.tsx`

**Änderungen:**
```typescript
const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  // ❌ ENTFERNT: { name: 'Startseite', href: '/admin/homepage', icon: Home },
  { name: 'Seiten', href: '/admin/pages', icon: FileStack }, // ✅ BEHALTEN
  { name: 'Hochzeiten', href: '/admin/weddings', icon: Heart },
  // ... rest
];
```

---

### Phase 5: Routing anpassen

#### 5.1 Startseite-Route umleiten
**Datei:** `src/app/admin/homepage/page.tsx`

**Option A:** Redirect zu `/admin/pages/home`
```typescript
import { redirect } from 'next/navigation';

export default async function HomepagePage() {
  redirect('/admin/pages/home');
}
```

**Option B:** Route entfernen und 404 zeigen

#### 5.2 Seiten-Editor Route
**Datei:** `src/app/admin/pages/[id]/page.tsx`

**Anpassungen:**
- Unterstützt alle Seiten-Typen
- Dynamischer Editor basierend auf `page_type`
- Startseite: Lädt HomepageSectionEditor
- Andere: Lädt LexicalEditor

---

### Phase 6: Migration bestehender Daten

#### 6.1 Homepage-Sektionen migrieren
- Homepage-Sektionen bleiben in `homepage_sections` Tabelle
- Startseite in `pages` Tabelle verweist auf diese Sektionen
- Keine Daten-Duplikation

#### 6.2 Rechtliche Seiten prüfen
- Impressum, Datenschutz, AGB sind bereits in `pages` Tabelle
- Sicherstellen, dass sie `page_type: 'legal'` haben
- Editor-Funktionalität hinzufügen

---

## 🎨 UI/UX Verbesserungen

### Seiten-Liste:
```
┌─────────────────────────────────────────────────┐
│  Seiten                              [+ Neue Seite] │
├─────────────────────────────────────────────────┤
│  🔍 Suche...  [Typ: Alle ▼]  [Status: Alle ▼]   │
├─────────────────────────────────────────────────┤
│  🏠 Startseite                    [Bearbeiten]   │
│     /home · homepage · ✅ Veröffentlicht        │
├─────────────────────────────────────────────────┤
│  📄 Impressum                    [Bearbeiten]   │
│     /impressum · legal · ✅ Veröffentlicht      │
├─────────────────────────────────────────────────┤
│  📄 Datenschutz                  [Bearbeiten]   │
│     /datenschutz · legal · ✅ Veröffentlicht    │
└─────────────────────────────────────────────────┘
```

### Seiten-Editor:
```
┌─────────────────────────────────────────────────┐
│  Startseite bearbeiten                          │
├─────────────────────────────────────────────────┤
│  [Tabs: Hero | About | Services | ...]         │
│                                                 │
│  [Editor-Bereich]                              │
│                                                 │
│  [Speichern] [Vorschau] [Veröffentlichen]      │
└─────────────────────────────────────────────────┘
```

---

## 📝 Checkliste

### Datenbank:
- [ ] Startseite in `pages` Tabelle einfügen/aktualisieren
- [ ] `page_type` für alle Seiten korrekt setzen
- [ ] Migration für bestehende Daten

### Komponenten:
- [ ] `PageEditor.tsx` erstellen (Universal Editor)
- [ ] `HomepageSectionEditor` in `PageEditor` integrieren
- [ ] `LexicalEditor` für Content-Seiten integrieren
- [ ] Seiten-Liste überarbeiten (`/admin/pages/page.tsx`)
- [ ] Seiten-Editor Route anpassen (`/admin/pages/[id]/page.tsx`)

### Navigation:
- [ ] "Startseite" Reiter aus Sidebar entfernen
- [ ] "Seiten" Reiter behalten
- [ ] Dashboard-Links aktualisieren

### Routing:
- [ ] `/admin/homepage` → Redirect zu `/admin/pages/home`
- [ ] Oder Route komplett entfernen

### Testing:
- [ ] Startseite bearbeiten funktioniert
- [ ] Rechtliche Seiten bearbeiten funktioniert
- [ ] Neue Seiten erstellen funktioniert
- [ ] Navigation ist klar und intuitiv

---

## 🚀 Vorteile der neuen Struktur

1. **Klarheit:** Alles was bearbeitbar ist, ist unter "Seiten"
2. **Konsistenz:** Startseite wird wie jede andere Seite behandelt
3. **Skalierbarkeit:** Neue Seiten-Typen einfach hinzufügbar
4. **Benutzerfreundlichkeit:** Keine Verwirrung mehr über "wo bearbeite ich was"
5. **Wartbarkeit:** Einheitliche Struktur, weniger Code-Duplikation

---

## ⚠️ Breaking Changes

- `/admin/homepage` Route wird entfernt/umgeleitet
- Nutzer müssen sich an neue Navigation gewöhnen
- Bookmarks auf `/admin/homepage` funktionieren nicht mehr

---

## 📅 Geschätzter Aufwand

- **Phase 1 (Datenbank):** 30 Min
- **Phase 2 (Editor):** 2-3 Stunden
- **Phase 3 (Liste):** 1-2 Stunden
- **Phase 4 (Navigation):** 30 Min
- **Phase 5 (Routing):** 30 Min
- **Phase 6 (Migration):** 30 Min
- **Testing:** 1 Stunde

**Gesamt: ~6-8 Stunden**

