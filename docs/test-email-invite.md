# Test der E-Mail-Einladungsfunktion

## Status der Konfiguration

✅ **Edge Function deployed**: `send-email` ist aktiv
✅ **Secrets gesetzt**: `RESEND_API_KEY` ist konfiguriert
✅ **Auth Hook konfiguriert**: Send Email Hook sollte aktiv sein
✅ **Site URL konfiguriert**: Sollte auf `http://localhost:3000` oder `https://dz-photo-neu.vercel.app` gesetzt sein
✅ **Redirect URLs konfiguriert**: Sollten `admin-login` URLs enthalten

## Test-Schritte

1. **Öffne die Admin-Einstellungen**:
   - Gehe zu `/admin/settings`
   - Stelle sicher, dass du als Admin eingeloggt bist

2. **Sende eine Test-Einladung**:
   - Gib eine Test-E-Mail-Adresse ein (z.B. deine eigene E-Mail)
   - Wähle eine Rolle (z.B. "editor")
   - Klicke auf "Einladung senden"

3. **Prüfe die Logs**:
   - **Server-Logs** (Terminal): Sollte zeigen:
     - `🔐 [Invite API] Starting invite request...`
     - `✅ [Invite API] Invitation sent successfully`
   - **Supabase Edge Function Logs**: Sollte zeigen:
     - `📧 [Send Email Hook] Processing email`
     - `✅ [Send Email Hook] Email sent successfully`
   - **Resend Dashboard**: Sollte die versendete E-Mail zeigen

4. **Prüfe dein E-Mail-Postfach**:
   - E-Mail sollte von `login@mail.growing-brands.de` kommen
   - Betreff: "Einladung zum DZ Photo Admin-Bereich"
   - Enthält einen Link zur Bestätigung und einen Code

## Troubleshooting

### E-Mail wird nicht versendet:
1. Prüfe die Edge Function Logs im Supabase Dashboard
2. Stelle sicher, dass `SEND_EMAIL_HOOK_SECRET` korrekt gesetzt ist
3. Prüfe, ob der Auth Hook aktiviert ist
4. Prüfe die Resend API Logs

### Hook wird nicht aufgerufen:
1. Prüfe, ob `verify_jwt` auf `false` gesetzt ist (sollte automatisch sein für Auth Hooks)
2. Stelle sicher, dass die Hook-URL korrekt ist: `https://qljgbskxopjkivkcuypu.supabase.co/functions/v1/send-email`
3. Prüfe die Webhook-Secret-Konfiguration

### E-Mail landet im Spam:
1. Stelle sicher, dass DKIM, DMARC und SPF für `mail.growing-brands.de` korrekt konfiguriert sind
2. Prüfe die Resend-Domain-Verifizierung

