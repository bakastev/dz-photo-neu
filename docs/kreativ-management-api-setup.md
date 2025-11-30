# Kreativ.Management API Integration Setup

## Übersicht

Die Landing Page `/lp/hochzeit` verwendet ein eigenes Kontaktformular, das die Daten direkt an die kreativ.management API sendet.

## API-Konfiguration

### 1. Formular in Kreativ.Management erstellen

1. Gehe zu Kreativ.Management → Kontaktformulare
2. Erstelle ein neues Kontaktformular mit dem Typ **"Kontaktformular API Extern"**
3. Kopiere den **API Key** (Formular ID) aus den Einstellungen
4. Optional: Definiere einen Standard-Auftragstyp für dieses Formular

### 2. Environment Variable setzen

Füge den API-Key zu deinen Environment Variables hinzu:

**Lokal (.env.local):**
```env
KREATIV_MANAGEMENT_FORM_ID=dein-api-key-hier
```

**Vercel:**
1. Gehe zu Project Settings → Environment Variables
2. Füge hinzu:
   - Key: `KREATIV_MANAGEMENT_FORM_ID`
   - Value: Dein API-Key von Kreativ.Management
   - Environment: Production, Preview, Development

### 3. API-Endpoint

Die API-Route ist unter `/api/contact/kreativ-management` verfügbar.

**Endpoint:** `https://api.kreativ.management/Form/SubmitExternal`

**Format:** JSON
```json
{
  "formId": "dein-api-key",
  "values": {
    "firstname": "Max",
    "lastname": "Mustermann",
    "email": "max@example.com",
    "telephone": "+43 XXX XXX XXXX",
    "weddingdate": "2026-06-15",
    "location": "Schloss Ort, Gmunden",
    "message": "Ihre Nachricht hier"
  }
}
```

## Feld-Mapping

Die Formularfelder werden gemäß der [kreativ.management Dokumentation](https://intercom.help/kreativmanagement/de/articles/4635035-kontaktformular-api-extern-infos) gemappt:

| Formularfeld | API Key | Beschreibung |
|-------------|---------|--------------|
| Vorname | `firstname` | Vorname des Hauptkontakts |
| Nachname | `lastname` | Nachname des Hauptkontakts |
| E-Mail | `email` | **Erforderlich** - E-Mail-Adresse |
| Telefon | `telephone` | Telefonnummer |
| Hochzeitsdatum | `weddingdate` | Hochzeitstag (Format: YYYY-MM-DD) |
| Location | `location` | Hochzeitslocation |
| Nachricht | `message` | Nachricht des Kunden |

### Zusätzliche Felder

- `knownby`: Automatisch auf "Landing Page /lp/hochzeit" gesetzt
- `notes`: Enthält Metadaten (Zeitstempel, Location, Hochzeitsdatum)

## Formular-Component

Das Formular-Component befindet sich in:
- `src/components/shared/LandingPageContactForm.tsx`

Es verwendet:
- React Hooks für State Management
- Tracking für Conversion-Analyse
- Success/Error States
- Responsive Design

## API-Route

Die API-Route befindet sich in:
- `src/app/api/contact/kreativ-management/route.ts`

**Funktionen:**
- Validierung der erforderlichen Felder
- Mapping der Formulardaten zu kreativ.management Format
- Fehlerbehandlung
- Logging für Debugging

## Testing

1. Fülle das Formular auf `/lp/hochzeit` aus
2. Sende das Formular ab
3. Prüfe in Kreativ.Management, ob die Anfrage angekommen ist
4. Prüfe die Browser-Console für Fehler
5. Prüfe die Server-Logs für API-Antworten

## Fehlerbehebung

### "API-Konfiguration fehlt"
- Prüfe, ob `KREATIV_MANAGEMENT_FORM_ID` in den Environment Variables gesetzt ist
- Stelle sicher, dass die Variable in allen Environments (Production, Preview, Development) vorhanden ist

### "Fehler beim Senden an kreativ.management"
- Prüfe die Server-Logs für Details
- Stelle sicher, dass der API-Key korrekt ist
- Prüfe, ob alle erforderlichen Felder gesendet werden (email, firstname, lastname, message)

### Formular wird nicht angezeigt
- Prüfe, ob das Component korrekt importiert ist
- Prüfe die Browser-Console für JavaScript-Fehler
- Stelle sicher, dass alle Dependencies installiert sind

## Weitere Informationen

- [Kreativ.Management API Dokumentation](https://intercom.help/kreativmanagement/de/articles/4635035-kontaktformular-api-extern-infos)
- [Mapping-Referenz](https://intercom.help/kreativmanagement/de/articles/4635035-kontaktformular-api-extern-infos#4-mapping-der-variablen-zu-kreativmanagement)

