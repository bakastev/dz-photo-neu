# Technische Übersicht: Admin-Bereich

## Inhaltsverzeichnis

1. [Architektur-Übersicht](#architektur-übersicht)
2. [Authentifizierung & Autorisierung](#authentifizierung--autorisierung)
3. [Datenbankstruktur](#datenbankstruktur)
4. [API-Routen](#api-routen)
5. [Komponenten-Struktur](#komponenten-struktur)
6. [Edge Functions](#edge-functions)
7. [Sicherheit](#sicherheit)
8. [Deployment & Konfiguration](#deployment--konfiguration)

---

## Architektur-Übersicht

### Tech Stack

- **Framework**: Next.js 16.0.5 (App Router, Turbopack)
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Editor**: Lexical (Rich Text Editor)
- **Email**: Resend (via Supabase Edge Functions)

### Routing-Struktur

```
/admin
├── layout.tsx              # Root Layout mit Auth-Check
├── page.tsx                # Dashboard
├── settings/               # Admin-Verwaltung
├── homepage/              # Homepage-Editor
├── weddings/              # Hochzeitsreportagen
│   ├── page.tsx           # Liste
│   ├── [id]/page.tsx      # Editor
│   └── new/page.tsx       # Neu erstellen
├── locations/             # Locations
├── blog/                  # Blog-Posts
├── fotobox/               # Fotobox-Services
├── reviews/               # Bewertungen
├── pages/                 # Statische Seiten
└── media/                 # Media-Library
```

---

## Authentifizierung & Autorisierung

### Flow

```
1. User besucht /admin
   ↓
2. AdminLayout (Server Component)
   - Versucht Session zu lesen
   - Lädt admin_users Daten
   ↓
3. SessionGuard (Client Component)
   - Prüft Session im Browser
   - Prüft admin_users Tabelle
   - Redirect bei fehlender Auth
   ↓
4. AdminLayoutContent
   - Rendert Sidebar + Content
```

### Komponenten

#### `src/app/admin/layout.tsx`
- **Server Component** - Initiale Session-Prüfung
- Lädt `admin_users` Daten server-side
- Übergibt Daten an Client Components

#### `src/components/admin/SessionGuard.tsx`
- **Client Component** - Finale Auth-Prüfung
- Verwendet `createBrowserSupabaseClient()`
- Prüft:
  1. Supabase Session vorhanden?
  2. User in `admin_users` Tabelle?
- Redirect zu `/admin-login` bei Fehler

#### `src/components/admin/AdminLayoutContent.tsx`
- **Client Component** - Layout-Wrapper
- Rendert Sidebar + Toaster + ColorThemeProvider
- Lädt User-Daten nach falls server-side fehlschlägt

### Auth-Helper

#### Server-Side (`src/lib/auth-server.ts`)

```typescript
// Server Components
createServerSupabaseClient()  // Mit cookies() von Next.js

// API Routes
createApiSupabaseClient(request)  // Liest Cookies aus Request

// Helper Functions
getSession()      // Aktuelle Session
getUser()         // Aktueller User
getAdminUser()    // Admin-User mit Role
isAdmin()         // Boolean Check
```

#### Client-Side (`src/lib/auth-client.ts`)

```typescript
// Browser Client (Singleton)
createBrowserSupabaseClient()  // Verwendet @supabase/ssr

// Helper Functions
signIn(email, password)
signOut()
getClientSession()
getClientUser()
getClientAdminUser()
```

### Rollen-System

```sql
-- admin_users Tabelle
role: 'admin' | 'editor'

-- Permissions:
admin:  Vollzugriff (inkl. User-Verwaltung)
editor: Content-Management (keine User-Verwaltung)
```

---

## Datenbankstruktur

### Core Tables

#### `admin_users`
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS**: Aktiviert, aber deaktiviert für Admin-Zugriff (siehe Migration)

#### `activity_log`
```sql
CREATE TABLE activity_log (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES admin_users(id),
  action TEXT CHECK (action IN ('create', 'update', 'delete', 'publish', 'unpublish')),
  entity_type TEXT NOT NULL,
  entity_id UUID,
  entity_title TEXT,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `drafts`
```sql
CREATE TABLE drafts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES admin_users(id),
  entity_type TEXT NOT NULL,
  entity_id UUID,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, entity_type, entity_id)
);
```

### Content Tables (mit Admin-Policies)

- `weddings` - Hochzeitsreportagen
- `locations` - Locations
- `blog_posts` - Blog-Artikel
- `fotobox_services` - Fotobox-Services
- `reviews` - Bewertungen
- `pages` - Statische Seiten
- `homepage_sections` - Homepage-Content

**RLS Policy Pattern**:
```sql
CREATE POLICY "Admins can manage [table]"
ON [table] FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
```

---

## API-Routen

### `/api/admin/invite` (POST)

**Zweck**: Neue Admin-User einladen

**Flow**:
```
1. Auth-Check (Session vorhanden?)
2. Admin-Check (User ist admin?)
3. Edge Function aufrufen: invite-admin
4. Edge Function:
   - Erstellt/Updated User in Supabase Auth
   - Setzt generiertes Passwort
   - Fügt Eintrag in admin_users hinzu
   - Sendet E-Mail via Resend
```

**Request**:
```json
{
  "email": "user@example.com",
  "role": "editor"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Invitation sent successfully",
  "user": { "id": "...", "email": "..." },
  "note": "Die Einladung wurde versendet..."
}
```

**Datei**: `src/app/api/admin/invite/route.ts`

### `/api/admin/invite/test` (POST)

**Zweck**: Test-Endpoint für Debugging (sendet keine E-Mail)

**Datei**: `src/app/api/admin/invite/test/route.ts`

---

## Komponenten-Struktur

### Layout-Komponenten

```
src/components/admin/
├── AdminLayoutContent.tsx    # Main Layout Wrapper
├── AdminSidebar.tsx          # Navigation Sidebar
├── AdminHeader.tsx           # Top Header (optional)
├── SessionGuard.tsx          # Auth Guard
└── ColorThemeProvider.tsx    # Theme Context
```

### Editor-Komponenten

```
src/components/admin/editors/
├── BlogEditor.tsx
├── WeddingEditor.tsx
├── LocationEditor.tsx
├── FotoboxEditor.tsx
├── ReviewEditor.tsx
├── PageEditor.tsx
└── HomepageEditorContent.tsx
```

### Form-Komponenten

```
src/components/admin/forms/
├── TextField.tsx
├── ImageField.tsx
├── GalleryField.tsx
├── SlugField.tsx
├── DateField.tsx
├── SelectField.tsx
├── ToggleField.tsx
└── TagsField.tsx
```

### Homepage-Editoren

```
src/components/admin/homepage/
├── HeroSectionEditor.tsx
├── AboutSectionEditor.tsx
├── ServicesSectionEditor.tsx
├── PortfolioSectionEditor.tsx
├── BlogSectionEditor.tsx
├── TestimonialsSectionEditor.tsx
├── FAQSectionEditor.tsx
├── ContactSectionEditor.tsx
└── FotoboxSectionEditor.tsx
```

### Preview-Komponenten

```
src/components/admin/preview/
├── PreviewPanel.tsx
├── WeddingPreview.tsx
├── BlogPreview.tsx
├── LocationPreview.tsx
└── PreviewProvider.tsx
```

### Weitere Komponenten

- `LexicalEditor.tsx` - Rich Text Editor (Lexical)
- `MediaPicker.tsx` - Media-Auswahl Dialog

---

## Edge Functions

### `invite-admin`

**Zweck**: Erstellt Admin-User und sendet Einladungs-E-Mail

**Location**: `supabase/functions/invite-admin/index.ts`

**Flow**:
```
1. Validiert Input (email, role, redirectTo)
2. Prüft ob User existiert
   - Wenn ja: Updated Passwort, fügt zu admin_users hinzu
   - Wenn nein: Erstellt User mit Passwort
3. Generiert sicheres 16-stelliges Passwort
4. Sendet E-Mail via Resend mit:
   - E-Mail-Adresse
   - Passwort
   - Link zur Login-Seite
```

**Environment Variables** (Supabase Secrets):
- `RESEND_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_URL`

**Request**:
```json
{
  "email": "user@example.com",
  "role": "editor",
  "redirectTo": "http://localhost:3000/admin-login"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Invitation sent successfully",
  "user": { "id": "...", "email": "..." },
  "note": "Die Einladung wurde versendet..."
}
```

### `send-email` (Legacy)

**Zweck**: E-Mail-Versand via Resend (wird nicht mehr für Invites verwendet)

**Location**: `supabase/functions/send-email/index.ts`

**Hinweis**: Wird als Supabase Auth Hook konfiguriert, aber aktuell nicht aktiv genutzt.

---

## Sicherheit

### Authentifizierung

1. **Supabase Auth**: Session-basiert via Cookies
2. **SessionGuard**: Client-side Prüfung vor jedem Render
3. **Server-Side Check**: Initiale Prüfung im Layout

### Autorisierung

1. **Role-Based Access Control (RBAC)**:
   - `admin`: Vollzugriff
   - `editor`: Content-Management

2. **RLS Policies**:
   - Alle Content-Tables haben Admin-Policies
   - `admin_users` Tabelle: Nur Admins können verwalten

### API-Sicherheit

- **Session-Check**: Jede API-Route prüft Session
- **Admin-Check**: User-Verwaltung nur für Admins
- **Service Key**: Nur für Edge Functions (Server-seitig)

### Best Practices

1. **Keine Service Keys im Client**: Nur in Edge Functions/API Routes
2. **Cookie-basierte Sessions**: Automatisches Refresh
3. **RLS aktiviert**: Zusätzliche Sicherheitsebene
4. **Input-Validierung**: In API Routes und Edge Functions

---

## Deployment & Konfiguration

### Environment Variables

#### `.env.local` (Lokal)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://qljgbskxopjkivkcuypu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...  # Nur für API Routes
```

#### Supabase Secrets (für Edge Functions)
```bash
RESEND_API_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_URL=https://qljgbskxopjkivkcuypu.supabase.co
```

### Deployment

1. **Next.js App**: Vercel/Netlify
2. **Supabase**: Edge Functions werden automatisch deployed
3. **Migrations**: Werden via Supabase Dashboard oder CLI ausgeführt

### Migrationen

**Wichtige Migrations**:
- `20241127_admin_tables.sql` - Admin-Tabellen & RLS Policies
- `20250127_cookie_consent_logs.sql` - Cookie Consent Logging
- `20250128_add_color_settings.sql` - Color Settings

### Edge Function Deployment

```bash
# Via Supabase MCP Tools (automatisch)
# Oder manuell:
supabase functions deploy invite-admin
```

---

## Login-Flow

### `/admin-login`

**Datei**: `src/app/(auth)/admin-login/page.tsx`

**Flow**:
```
1. User gibt E-Mail + Passwort ein
2. signInWithPassword() via Supabase
3. Session wird in Cookies gespeichert
4. Redirect zu /admin
5. SessionGuard prüft Session
6. Bei Erfolg: Admin-Dashboard
```

**Invite-Token Flow** (Legacy):
- Wird nicht mehr verwendet
- Stattdessen: Passwort in E-Mail

---

## Wichtige Dateien

### Core
- `src/app/admin/layout.tsx` - Root Layout
- `src/components/admin/SessionGuard.tsx` - Auth Guard
- `src/lib/auth-server.ts` - Server Auth Helpers
- `src/lib/auth-client.ts` - Client Auth Helpers

### API
- `src/app/api/admin/invite/route.ts` - Invite API
- `supabase/functions/invite-admin/index.ts` - Invite Edge Function

### Database
- `supabase/migrations/20241127_admin_tables.sql` - Admin Schema

---

## Troubleshooting

### Session-Probleme

**Symptom**: User wird immer zu `/admin-login` redirected

**Lösung**:
1. Prüfe Browser-Cookies (`sb-*-auth-token`)
2. Prüfe Supabase Session in DevTools
3. Prüfe `admin_users` Tabelle (User vorhanden?)
4. Prüfe RLS Policies (sollten deaktiviert sein für Admin)

### Invite-Probleme

**Symptom**: E-Mail wird nicht versendet

**Lösung**:
1. Prüfe Supabase Edge Function Logs
2. Prüfe Resend API Key in Supabase Secrets
3. Prüfe `RESEND_API_KEY` ist gesetzt
4. Prüfe Verified Domain in Resend Dashboard

### JSON-Parsing-Fehler

**Symptom**: "Unexpected end of JSON input"

**Lösung**:
- Frontend verwendet jetzt `response.text()` vor `JSON.parse()`
- Edge Function gibt immer gültiges JSON zurück

---

## Zukünftige Verbesserungen

1. **Activity Logging**: Vollständige Implementierung
2. **Draft System**: Auto-Save für Editoren
3. **Role Permissions**: Granulare Permissions pro Feature
4. **Audit Trail**: Vollständige Änderungshistorie
5. **2FA**: Zwei-Faktor-Authentifizierung
6. **Session Management**: Aktive Sessions verwalten

---

**Letzte Aktualisierung**: 2025-01-28
**Version**: 1.0.0

