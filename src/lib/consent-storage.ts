/**
 * Cookie Consent Storage für DSGVO 2025 Compliance
 * Speichert Consent-Daten sowohl in localStorage (Backup) als auch in Supabase (primär)
 */

import { supabase } from './supabase';

export interface ConsentData {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
  version?: string;
}

export interface ConsentLogEntry {
  action: 'accept_all' | 'decline_all' | 'custom_preferences' | 'withdraw';
  timestamp: number;
  consent: ConsentData;
}

/**
 * Speichert Consent-Daten in Supabase und localStorage
 */
export async function saveConsentToSupabase(
  action: 'accept_all' | 'decline_all' | 'custom_preferences' | 'withdraw',
  consentData: ConsentData
): Promise<void> {
  try {
    // 1. Speichere in Supabase (primär)
    const { error } = await supabase
      .from('cookie_consent_logs')
      .insert({
        action,
        consent_data: consentData,
        consent_version: consentData.version || '2025-01',
        session_id: typeof window !== 'undefined' ? getSessionId() : null,
        user_agent: typeof window !== 'undefined' ? navigator.userAgent : null,
        // IP wird server-seitig gesetzt (via Edge Function oder Middleware)
      });

    if (error) {
      console.error('[Consent Storage] Fehler beim Speichern in Supabase:', error);
      // Fallback: Speichere nur in localStorage wenn Supabase fehlschlägt
      saveConsentToLocalStorage(action, consentData);
      return;
    }

    // 2. Speichere auch in localStorage als Backup
    saveConsentToLocalStorage(action, consentData);
  } catch (error) {
    console.error('[Consent Storage] Unerwarteter Fehler:', error);
    // Fallback: localStorage
    saveConsentToLocalStorage(action, consentData);
  }
}

/**
 * Speichert Consent-Daten in localStorage (Backup)
 */
export function saveConsentToLocalStorage(
  action: 'accept_all' | 'decline_all' | 'custom_preferences' | 'withdraw',
  consentData: ConsentData
): void {
  if (typeof window === 'undefined') return;

  try {
    const consentLog: ConsentLogEntry[] = JSON.parse(
      localStorage.getItem('dzphoto-consent-log') || '[]'
    );
    
    consentLog.push({
      action,
      timestamp: Date.now(),
      consent: consentData,
    });
    
    localStorage.setItem('dzphoto-consent-log', JSON.stringify(consentLog));
  } catch (error) {
    console.error('[Consent Storage] Fehler beim Speichern in localStorage:', error);
  }
}

/**
 * Generiert eine Session-ID für anonyme Tracking
 */
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('dzphoto-session-id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('dzphoto-session-id', sessionId);
  }
  return sessionId;
}

/**
 * Lädt Consent-Logs aus localStorage (für Offline-Zugriff)
 */
export function loadConsentLogsFromLocalStorage(): ConsentLogEntry[] {
  if (typeof window === 'undefined') return [];
  
  try {
    return JSON.parse(localStorage.getItem('dzphoto-consent-log') || '[]');
  } catch (error) {
    console.error('[Consent Storage] Fehler beim Laden aus localStorage:', error);
    return [];
  }
}

