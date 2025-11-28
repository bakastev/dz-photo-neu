# Resend Edge Function Setup für Supabase

## 1. Edge Function deployen

Die Edge Function wurde bereits erstellt unter `supabase/functions/send-email/index.ts`.

### Deployen:

```bash
# Stelle sicher, dass du im Projekt-Root bist
cd /Users/stevebaka/dz-photo-neu

# Deploy die Edge Function
supabase functions deploy send-email --no-verify-jwt
```

**Wichtig**: Die Funktion muss mit `--no-verify-jwt` deployed werden, da sie als Auth Hook verwendet wird.

## 2. Secrets setzen

Die folgenden Secrets müssen in Supabase gesetzt werden:

```bash
# Setze die Secrets
supabase secrets set RESEND_API_KEY=dein_resend_api_key
supabase secrets set SEND_EMAIL_HOOK_SECRET=dein_hook_secret
```

**Hinweis**: 
- `RESEND_API_KEY`: Der Resend API Key (bereits in Supabase Secrets gesetzt)
- `SEND_EMAIL_HOOK_SECRET`: Wird im nächsten Schritt generiert

## 3. Auth Hook konfigurieren

1. Gehe zu deinem Supabase Dashboard
2. Navigiere zu **Authentication** → **Hooks**
3. Klicke auf **Create a new hook**
4. Wähle **Send Email Hook**
5. Konfiguriere:
   - **Hook Type**: HTTPS
   - **URL**: `https://qljgbskxopjkivkcuypu.supabase.co/functions/v1/send-email`
   - **Secret**: Klicke auf "Generate Secret" und kopiere den Secret
6. Klicke auf **Create**

**Wichtig**: Der generierte Secret muss dann als `SEND_EMAIL_HOOK_SECRET` in Supabase Secrets gesetzt werden (siehe Schritt 2).

## 4. Site URL und Redirect URLs konfigurieren

Gehe zu **Authentication** → **URL Configuration**:

### Site URL:
- Für lokale Entwicklung: `http://localhost:3000`
- Für Vercel: `https://dz-photo-neu.vercel.app`

### Redirect URLs hinzufügen:
- `http://localhost:3000/admin-login`
- `http://localhost:3000/admin-login/**`
- `https://dz-photo-neu.vercel.app/admin-login`
- `https://dz-photo-neu.vercel.app/admin-login/**`

## 5. Testen

Nach der Konfiguration:
1. Versuche eine Admin-Einladung zu senden
2. Prüfe die E-Mail im Posteingang (auch Spam-Ordner)
3. Die E-Mail sollte von `login@mail.growing-brands.de` kommen
4. Prüfe die Supabase Edge Function Logs auf Fehler

## Troubleshooting

### E-Mail wird nicht versendet:
1. Prüfe die Edge Function Logs im Supabase Dashboard
2. Stelle sicher, dass `RESEND_API_KEY` und `SEND_EMAIL_HOOK_SECRET` korrekt gesetzt sind
3. Prüfe, ob die Domain `mail.growing-brands.de` in Resend verifiziert ist

### Hook wird nicht aufgerufen:
1. Prüfe, ob der Hook in **Authentication** → **Hooks** aktiviert ist
2. Stelle sicher, dass die URL korrekt ist
3. Prüfe die Webhook-Secret-Konfiguration

### E-Mail landet im Spam:
1. Stelle sicher, dass DKIM, DMARC und SPF für `mail.growing-brands.de` korrekt konfiguriert sind
2. Prüfe die Resend-Domain-Verifizierung

