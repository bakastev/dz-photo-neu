'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/auth-client';
import AdminHeader from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Globe, Bell, Shield, Palette, Loader2, Check, AlertCircle, ExternalLink, Users, UserPlus, Trash2, Mail } from 'lucide-react';
import ToggleField from '@/components/admin/forms/ToggleField';
import TextField from '@/components/admin/forms/TextField';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SiteSettings {
  id: string;
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  default_meta_title: string;
  default_meta_description: string;
  tracking_enabled: boolean;
  google_analytics_id: string;
  meta_pixel_id: string;
  meta_conversion_api_token: string;
  instagram_url: string;
  facebook_url: string;
}

interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  name?: string;
  created_at: string;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Admin Users
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'editor' | 'viewer'>('editor');
  const [inviting, setInviting] = useState(false);

  // Site Settings
  const [siteName, setSiteName] = useState('DZ-Photo');
  const [siteDescription, setSiteDescription] = useState('Hochzeitsfotograf in Oberösterreich');
  const [contactEmail, setContactEmail] = useState('info@dz-photo.at');
  const [contactPhone, setContactPhone] = useState('');

  // SEO Settings
  const [defaultMetaTitle, setDefaultMetaTitle] = useState('DZ-Photo | Hochzeitsfotograf Oberösterreich');
  const [defaultMetaDescription, setDefaultMetaDescription] = useState('Professionelle Hochzeitsfotografie in Oberösterreich');

  // Tracking
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [gaId, setGaId] = useState('');
  const [metaPixelId, setMetaPixelId] = useState('');
  const [metaConversionToken, setMetaConversionToken] = useState('');

  // Social
  const [instagramUrl, setInstagramUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');

  // Color Settings
  const [colorPrimary, setColorPrimary] = useState('#D4AF37');
  const [colorBackground, setColorBackground] = useState('#0A0A0A');
  const [colorSurface, setColorSurface] = useState('#141414');
  const [colorText, setColorText] = useState('#FFFFFF');
  const [colorGoldLight, setColorGoldLight] = useState('#F0EBD2');

  // Load settings on mount
  useEffect(() => {
    loadSettings();
    loadAdminUsers();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'main')
        .single();

      if (error) throw error;

      if (data) {
        setSiteName(data.site_name || 'DZ-Photo');
        setSiteDescription(data.site_description || '');
        setContactEmail(data.contact_email || '');
        setContactPhone(data.contact_phone || '');
        setDefaultMetaTitle(data.default_meta_title || '');
        setDefaultMetaDescription(data.default_meta_description || '');
        setTrackingEnabled(data.tracking_enabled ?? true);
        setGaId(data.google_analytics_id || '');
        setMetaPixelId(data.meta_pixel_id || '');
        setMetaConversionToken(data.meta_conversion_api_token || '');
        setInstagramUrl(data.instagram_url || '');
        setFacebookUrl(data.facebook_url || '');
        setColorPrimary(data.color_primary || '#D4AF37');
        setColorBackground(data.color_background || '#0A0A0A');
        setColorSurface(data.color_surface || '#141414');
        setColorText(data.color_text || '#FFFFFF');
        setColorGoldLight(data.color_gold_light || '#F0EBD2');
      }
    } catch (err: any) {
      console.error('Error loading settings:', err);
      setError('Einstellungen konnten nicht geladen werden');
    } finally {
      setLoading(false);
    }
  };

  const loadAdminUsers = async () => {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading admin users:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        throw error;
      }
      
      console.log('Loaded admin users:', data);
      setAdminUsers(data || []);
    } catch (err: any) {
      console.error('Error loading admin users:', err);
      // Show error to user
      toast({
        title: "Fehler",
        description: `Admin-User konnten nicht geladen werden: ${err.message || 'Unbekannter Fehler'}`,
        variant: "destructive",
      });
    }
  };

  const handleInviteAdmin = async () => {
    if (!newAdminEmail || !newAdminEmail.includes('@')) {
      toast({
        title: "Ungültige E-Mail",
        description: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        variant: "destructive",
      });
      return;
    }

    setInviting(true);
    try {
      // Call API route for admin invitation
      // Include credentials to ensure cookies are sent
      const response = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensure cookies are sent with the request
        body: JSON.stringify({
          email: newAdminEmail,
          role: newAdminRole || 'editor',
        }),
      });

      // Get response text first to handle empty responses
      const responseText = await response.text();
      let data;
      
      if (!responseText || responseText.trim() === '') {
        throw new Error('Empty response from server');
      }
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response:', responseText);
        throw new Error(`Invalid response from server: ${responseText.substring(0, 200)}`);
      }

      if (!response.ok) {
        const errorMessage = data.details 
          ? `${data.error}: ${data.details}` 
          : data.error || 'Einladung fehlgeschlagen';
        throw new Error(errorMessage);
      }

      toast({
        title: "Einladung gesendet!",
        description: data.note || `Eine Einladung wurde an ${newAdminEmail} gesendet. Bitte prüfen Sie auch den Spam-Ordner.`,
      });

      setNewAdminEmail('');
      setNewAdminRole('editor');
      loadAdminUsers();
    } catch (err: any) {
      console.error('Error inviting admin:', err);
      toast({
        title: "Fehler",
        description: err.message || "Die Einladung konnte nicht gesendet werden.",
        variant: "destructive",
      });
    } finally {
      setInviting(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: 'admin' | 'editor' | 'viewer') => {
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase
        .from('admin_users')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Rolle aktualisiert",
        description: "Die Benutzerrolle wurde erfolgreich geändert.",
      });
      loadAdminUsers();
    } catch (err: any) {
      console.error('Error updating role:', err);
      toast({
        title: "Fehler",
        description: "Die Rolle konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveAdmin = async (userId: string, email: string) => {
    if (!confirm(`Möchten Sie ${email} wirklich als Admin entfernen?`)) return;

    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Admin entfernt",
        description: `${email} wurde als Admin entfernt.`,
      });
      loadAdminUsers();
    } catch (err: any) {
      console.error('Error removing admin:', err);
      toast({
        title: "Fehler",
        description: "Der Admin konnte nicht entfernt werden.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const supabase = createBrowserSupabaseClient();
      
      const { error: updateError } = await supabase
        .from('site_settings')
        .update({
          site_name: siteName,
          site_description: siteDescription,
          contact_email: contactEmail,
          contact_phone: contactPhone,
          default_meta_title: defaultMetaTitle,
          default_meta_description: defaultMetaDescription,
          tracking_enabled: trackingEnabled,
          google_analytics_id: gaId || null,
          meta_pixel_id: metaPixelId || null,
          meta_conversion_api_token: metaConversionToken || null,
          instagram_url: instagramUrl || null,
          facebook_url: facebookUrl || null,
          color_primary: colorPrimary,
          color_background: colorBackground,
          color_surface: colorSurface,
          color_text: colorText,
          color_gold_light: colorGoldLight,
          updated_at: new Date().toISOString(),
        })
        .eq('id', 'main');

      if (updateError) throw updateError;

      toast({
        title: "Einstellungen gespeichert!",
        description: "Die Änderungen wurden erfolgreich übernommen.",
      });
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setError(err.message || 'Speichern fehlgeschlagen');
      toast({
        title: "Fehler beim Speichern",
        description: err.message || 'Ein Fehler ist aufgetreten.',
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminHeader title="Einstellungen" />
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Einstellungen" />
      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-[#141414] border border-white/10 flex-wrap">
            <TabsTrigger value="general" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white">
              <Globe className="w-4 h-4 mr-2" />
              Allgemein
            </TabsTrigger>
            <TabsTrigger value="seo" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white">
              <Shield className="w-4 h-4 mr-2" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="tracking" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white">
              <Bell className="w-4 h-4 mr-2" />
              Tracking
            </TabsTrigger>
            <TabsTrigger value="admins" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Admins
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white">
              <Palette className="w-4 h-4 mr-2" />
              Erscheinung
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white">Website-Einstellungen</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  label="Website-Name"
                  name="siteName"
                  value={siteName}
                  onChange={setSiteName}
                />
                <TextField
                  label="Website-Beschreibung"
                  name="siteDescription"
                  value={siteDescription}
                  onChange={setSiteDescription}
                />
                <TextField
                  label="Kontakt-E-Mail"
                  name="contactEmail"
                  value={contactEmail}
                  onChange={setContactEmail}
                />
                <TextField
                  label="Telefonnummer"
                  name="contactPhone"
                  value={contactPhone}
                  onChange={setContactPhone}
                  placeholder="+43 660 123 4567"
                />
              </div>
            </div>

            <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-6 mt-6">
              <h2 className="text-lg font-semibold text-white">Social Media</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  label="Instagram URL"
                  name="instagramUrl"
                  value={instagramUrl}
                  onChange={setInstagramUrl}
                  placeholder="https://instagram.com/dz_photo"
                />
                <TextField
                  label="Facebook URL"
                  name="facebookUrl"
                  value={facebookUrl}
                  onChange={setFacebookUrl}
                  placeholder="https://facebook.com/dzphoto"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seo">
            <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white">SEO-Einstellungen</h2>
              <TextField
                label="Standard Meta-Titel"
                name="defaultMetaTitle"
                value={defaultMetaTitle}
                onChange={setDefaultMetaTitle}
                description="Wird verwendet, wenn keine spezifische Meta-Title gesetzt ist"
              />
              <TextField
                label="Standard Meta-Beschreibung"
                name="defaultMetaDescription"
                value={defaultMetaDescription}
                onChange={setDefaultMetaDescription}
                multiline
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="tracking">
            <div className="space-y-6">
              <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Tracking & Analytics</h2>
                  <div className={`px-3 py-1 rounded-full text-sm ${trackingEnabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {trackingEnabled ? 'Aktiv' : 'Deaktiviert'}
                  </div>
                </div>
                
                <ToggleField
                  label="Tracking aktiviert"
                  description="Aktiviert Google Analytics und Meta Pixel (nur mit Consent)"
                  value={trackingEnabled}
                  onChange={setTrackingEnabled}
                />
              </div>

              <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-md font-semibold text-white">Google Analytics</h3>
                  <a 
                    href="https://analytics.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gold"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <TextField
                  label="Google Analytics Measurement ID"
                  name="gaId"
                  value={gaId}
                  onChange={setGaId}
                  placeholder="G-XXXXXXXXXX"
                  description="Finden Sie diese ID in Google Analytics unter Admin → Datenstreams"
                />
              </div>

              <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-md font-semibold text-white">Meta Pixel (Facebook/Instagram)</h3>
                  <a 
                    href="https://business.facebook.com/events_manager" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gold"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <TextField
                  label="Meta Pixel ID"
                  name="metaPixelId"
                  value={metaPixelId}
                  onChange={setMetaPixelId}
                  placeholder="XXXXXXXXXXXXXXX"
                  description="15-16 stellige Nummer aus dem Meta Events Manager"
                />
                <TextField
                  label="Conversion API Access Token"
                  name="metaConversionToken"
                  value={metaConversionToken}
                  onChange={setMetaConversionToken}
                  placeholder="EAA..."
                  description="Für Server-Side Tracking (optional, aber empfohlen für bessere Datenqualität)"
                />
                
                {metaPixelId && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-green-400">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">Meta Pixel konfiguriert</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      Pixel ID: {metaPixelId}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <h3 className="text-md font-semibold text-blue-400 mb-2">💡 Hinweis zu Environment Variables</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Die Tracking-IDs werden hier in der Datenbank gespeichert. Für optimale Performance 
                  können sie auch als Environment Variables gesetzt werden:
                </p>
                <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-gray-300">
                  <p>NEXT_PUBLIC_GA_ID={gaId || 'G-XXXXXXXXXX'}</p>
                  <p>NEXT_PUBLIC_META_PIXEL_ID={metaPixelId || 'XXXXXXXXXXXXXXX'}</p>
                  <p>META_CONVERSION_API_TOKEN={metaConversionToken ? '***' : 'your-token'}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="admins">
            <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white">Admin-Benutzer verwalten</h2>
              
              {/* Invite New Admin */}
              <div className="p-4 bg-[#0A0A0A] rounded-lg border border-white/10">
                <h3 className="text-md font-medium text-white mb-4 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-gold" />
                  Neuen Admin einladen
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="newAdminEmail" className="text-gray-400 text-sm mb-2 block">
                      E-Mail-Adresse
                    </Label>
                    <Input
                      id="newAdminEmail"
                      type="email"
                      placeholder="admin@example.com"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      className="bg-[#141414] border-white/10 text-white"
                    />
                  </div>
                  <div className="w-full sm:w-48">
                    <Label htmlFor="newAdminRole" className="text-gray-400 text-sm mb-2 block">
                      Rolle
                    </Label>
                    <Select value={newAdminRole} onValueChange={(v: 'admin' | 'editor' | 'viewer') => setNewAdminRole(v)}>
                      <SelectTrigger className="bg-[#141414] border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#141414] border-white/10">
                        <SelectItem value="admin" className="text-white data-[highlighted]:bg-[#D4AF37]/20 data-[highlighted]:text-[#D4AF37]">Admin</SelectItem>
                        <SelectItem value="editor" className="text-white data-[highlighted]:bg-[#D4AF37]/20 data-[highlighted]:text-[#D4AF37]">Editor</SelectItem>
                        <SelectItem value="viewer" className="text-white data-[highlighted]:bg-[#D4AF37]/20 data-[highlighted]:text-[#D4AF37]">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleInviteAdmin}
                      disabled={inviting || !newAdminEmail}
                      className="bg-gradient-to-r from-[#D4AF37] to-[#B8960F] w-full sm:w-auto"
                    >
                      {inviting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Mail className="w-4 h-4 mr-2" />
                      )}
                      Einladen
                    </Button>
                  </div>
                </div>
              </div>

              {/* Current Admins List */}
              <div>
                <h3 className="text-md font-medium text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-gold" />
                  Aktuelle Admins ({adminUsers.length})
                </h3>
                
                {adminUsers.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Keine Admin-Benutzer gefunden.</p>
                ) : (
                  <div className="space-y-3">
                    {adminUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded-lg border border-white/10"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8960F] flex items-center justify-center text-white font-bold">
                            {user.email?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="text-white font-medium">{user.name || user.email}</p>
                            <p className="text-gray-500 text-sm">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Select
                            value={user.role}
                            onValueChange={(v: 'admin' | 'editor' | 'viewer') => handleUpdateRole(user.id, v)}
                          >
                            <SelectTrigger className="w-32 bg-[#141414] border-white/10 text-white text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#141414] border-white/10">
                              <SelectItem value="admin" className="text-white data-[highlighted]:bg-[#D4AF37]/20 data-[highlighted]:text-[#D4AF37]">Admin</SelectItem>
                              <SelectItem value="editor" className="text-white data-[highlighted]:bg-[#D4AF37]/20 data-[highlighted]:text-[#D4AF37]">Editor</SelectItem>
                              <SelectItem value="viewer" className="text-white data-[highlighted]:bg-[#D4AF37]/20 data-[highlighted]:text-[#D4AF37]">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveAdmin(user.id, user.email)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Role Descriptions */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h4 className="text-blue-400 font-medium mb-2">Rollen-Berechtigungen</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li><strong className="text-white">Admin:</strong> Vollzugriff auf alle Funktionen inkl. Benutzerverwaltung</li>
                  <li><strong className="text-white">Editor:</strong> Kann Inhalte erstellen, bearbeiten und löschen</li>
                  <li><strong className="text-white">Viewer:</strong> Nur Lesezugriff auf alle Inhalte</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance">
            <div className="border border-white/10 rounded-xl p-6 space-y-6" style={{ backgroundColor: 'var(--admin-color-surface, #141414)' }}>
              <h2 className="text-lg font-semibold text-white">Erscheinungsbild</h2>
              <p className="text-gray-400">
                Passen Sie die Farben des Design-Systems an:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gold (Primär) */}
                <div className="space-y-2">
                  <Label htmlFor="colorPrimary" className="text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded border border-white/20" style={{ backgroundColor: colorPrimary }} />
                    Gold (Primär)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="colorPrimary"
                      type="color"
                      value={colorPrimary}
                      onChange={(e) => setColorPrimary(e.target.value)}
                      className="w-20 h-10 p-1 bg-[#1A1A1A] border-white/10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={colorPrimary}
                      onChange={(e) => setColorPrimary(e.target.value)}
                      placeholder="#D4AF37"
                      className="flex-1 bg-[#1A1A1A] border-white/10 text-white font-mono"
                    />
                  </div>
                </div>

                {/* Hintergrund */}
                <div className="space-y-2">
                  <Label htmlFor="colorBackground" className="text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded border border-white/20" style={{ backgroundColor: colorBackground }} />
                    Hintergrund
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="colorBackground"
                      type="color"
                      value={colorBackground}
                      onChange={(e) => setColorBackground(e.target.value)}
                      className="w-20 h-10 p-1 bg-[#1A1A1A] border-white/10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={colorBackground}
                      onChange={(e) => setColorBackground(e.target.value)}
                      placeholder="#0A0A0A"
                      className="flex-1 bg-[#1A1A1A] border-white/10 text-white font-mono"
                    />
                  </div>
                </div>

                {/* Oberfläche */}
                <div className="space-y-2">
                  <Label htmlFor="colorSurface" className="text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded border border-white/20" style={{ backgroundColor: colorSurface }} />
                    Oberfläche
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="colorSurface"
                      type="color"
                      value={colorSurface}
                      onChange={(e) => setColorSurface(e.target.value)}
                      className="w-20 h-10 p-1 bg-[#1A1A1A] border-white/10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={colorSurface}
                      onChange={(e) => setColorSurface(e.target.value)}
                      placeholder="#141414"
                      className="flex-1 bg-[#1A1A1A] border-white/10 text-white font-mono"
                    />
                  </div>
                </div>

                {/* Text */}
                <div className="space-y-2">
                  <Label htmlFor="colorText" className="text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded border border-white/20" style={{ backgroundColor: colorText }} />
                    Text
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="colorText"
                      type="color"
                      value={colorText}
                      onChange={(e) => setColorText(e.target.value)}
                      className="w-20 h-10 p-1 bg-[#1A1A1A] border-white/10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={colorText}
                      onChange={(e) => setColorText(e.target.value)}
                      placeholder="#FFFFFF"
                      className="flex-1 bg-[#1A1A1A] border-white/10 text-white font-mono"
                    />
                  </div>
                </div>

                {/* Gold Light */}
                <div className="space-y-2">
                  <Label htmlFor="colorGoldLight" className="text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded border border-white/20" style={{ backgroundColor: colorGoldLight }} />
                    Gold (Hell)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="colorGoldLight"
                      type="color"
                      value={colorGoldLight}
                      onChange={(e) => setColorGoldLight(e.target.value)}
                      className="w-20 h-10 p-1 bg-[#1A1A1A] border-white/10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={colorGoldLight}
                      onChange={(e) => setColorGoldLight(e.target.value)}
                      placeholder="#F0EBD2"
                      className="flex-1 bg-[#1A1A1A] border-white/10 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-6 p-4 bg-[#1A1A1A] rounded-lg border border-white/10">
                <h3 className="text-sm font-medium text-white mb-3">Vorschau</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg border border-white/10" style={{ backgroundColor: colorSurface }}>
                    <div className="w-full h-16 rounded mb-2 shadow-lg" style={{ backgroundColor: colorPrimary }} />
                    <p className="text-xs font-medium mb-1" style={{ color: colorText }}>Gold (Primär)</p>
                    <p className="text-xs font-mono opacity-70" style={{ color: colorText }}>{colorPrimary}</p>
                  </div>
                  <div className="p-3 rounded-lg border border-white/10" style={{ backgroundColor: colorSurface }}>
                    <div className="w-full h-16 rounded mb-2 border-2 border-white/20" style={{ backgroundColor: colorBackground }} />
                    <p className="text-xs font-medium mb-1" style={{ color: colorText }}>Hintergrund</p>
                    <p className="text-xs font-mono opacity-70" style={{ color: colorText }}>{colorBackground}</p>
                  </div>
                  <div className="p-3 rounded-lg border border-white/10" style={{ backgroundColor: colorSurface }}>
                    <div className="w-full h-16 rounded mb-2 border border-white/10" style={{ backgroundColor: colorSurface }} />
                    <p className="text-xs font-medium mb-1" style={{ color: colorText }}>Oberfläche</p>
                    <p className="text-xs font-mono opacity-70" style={{ color: colorText }}>{colorSurface}</p>
                  </div>
                  <div className="p-3 rounded-lg border border-white/10" style={{ backgroundColor: colorSurface }}>
                    <div className="w-full h-16 rounded mb-2 shadow-lg" style={{ backgroundColor: colorText }} />
                    <p className="text-xs font-medium mb-1" style={{ color: colorText }}>Text</p>
                    <p className="text-xs font-mono opacity-70" style={{ color: colorText }}>{colorText}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-400">
                  💡 Hinweis: Nach dem Speichern müssen Sie die Seite neu laden, damit die neuen Farben im gesamten Design-System angewendet werden.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="text-white"
                    style={{
                      background: `linear-gradient(to right, var(--admin-color-primary, #D4AF37), #B8960F)`,
                    }}
                    onMouseEnter={(e) => {
                      if (!saving) {
                        e.currentTarget.style.background = `linear-gradient(to right, #E5C158, var(--admin-color-primary, #D4AF37))`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `linear-gradient(to right, var(--admin-color-primary, #D4AF37), #B8960F)`;
                    }}
                  >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Einstellungen speichern
          </Button>
        </div>
      </div>
    </>
  );
}
