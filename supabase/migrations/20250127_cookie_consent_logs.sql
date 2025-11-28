-- Cookie Consent Logs Table für DSGVO 2025 Compliance
-- Speichert alle Cookie-Einwilligungen für mindestens 5 Jahre

CREATE TABLE IF NOT EXISTS cookie_consent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Consent Data
  action TEXT NOT NULL CHECK (action IN ('accept_all', 'decline_all', 'custom_preferences', 'withdraw')),
  consent_data JSONB NOT NULL,
  consent_version TEXT DEFAULT '2025-01',
  
  -- User Identification (anonymisiert)
  session_id TEXT,
  user_agent TEXT,
  ip_address INET,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Index für schnelle Abfragen
  CONSTRAINT valid_consent_data CHECK (consent_data ? 'timestamp' AND consent_data ? 'necessary')
);

-- Index für häufige Abfragen
CREATE INDEX IF NOT EXISTS idx_cookie_consent_logs_created_at ON cookie_consent_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cookie_consent_logs_action ON cookie_consent_logs(action);
CREATE INDEX IF NOT EXISTS idx_cookie_consent_logs_session ON cookie_consent_logs(session_id);

-- RLS aktivieren (nur INSERT für alle, SELECT nur für Admins)
ALTER TABLE cookie_consent_logs ENABLE ROW LEVEL SECURITY;

-- Jeder kann Consent-Logs erstellen (für DSGVO-Compliance)
CREATE POLICY "Anyone can insert consent logs"
ON cookie_consent_logs FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Nur Admins können Consent-Logs lesen (für Compliance-Prüfungen)
CREATE POLICY "Only admins can read consent logs"
ON cookie_consent_logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND role IN ('admin', 'editor')
  )
);

-- Funktion zum automatischen Löschen alter Logs (nach 5 Jahren + 1 Jahr Puffer)
CREATE OR REPLACE FUNCTION cleanup_old_consent_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM cookie_consent_logs
  WHERE created_at < NOW() - INTERVAL '6 years';
END;
$$ LANGUAGE plpgsql;

-- Kommentare für Dokumentation
COMMENT ON TABLE cookie_consent_logs IS 'Speichert alle Cookie-Einwilligungen gemäß DSGVO 2025. Daten müssen mindestens 5 Jahre aufbewahrt werden.';
COMMENT ON COLUMN cookie_consent_logs.action IS 'Art der Aktion: accept_all, decline_all, custom_preferences, withdraw';
COMMENT ON COLUMN cookie_consent_logs.consent_data IS 'Vollständige Consent-Daten mit Timestamp, Kategorien (necessary, analytics, marketing)';
COMMENT ON COLUMN cookie_consent_logs.consent_version IS 'Version der Consent-Struktur für zukünftige Migrationen';

