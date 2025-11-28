'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Loader2, AlertCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin';
  const errorParam = searchParams.get('error');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    errorParam === 'unauthorized' ? 'Sie haben keine Berechtigung für den Admin-Bereich.' : null
  );

  // Check if already logged in and redirect if so (only once on mount)
  useEffect(() => {
    let isMounted = true;
    
    const checkExistingSession = async () => {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (session) {
          // Verify user is admin before redirecting
          const { data: adminUser } = await supabase
            .from('admin_users')
            .select('id, role')
            .eq('id', session.user.id)
            .single();
          
          if (!isMounted) return;
          
          if (adminUser) {
            // User is already logged in and is admin, redirect to admin dashboard
            window.location.href = redirect;
            return;
          } else {
            // User is logged in but not admin, sign them out
            await supabase.auth.signOut();
          }
        }
      } catch (err) {
        // Ignore errors during session check
        console.error('Session check error:', err);
      }
    };
    
    checkExistingSession();
    
    return () => {
      isMounted = false;
    };
  }, [redirect]); // Only depend on redirect, not router

  // Handle invite token from URL hash
  useEffect(() => {
    const handleInviteToken = async () => {
      if (typeof window === 'undefined') return;

      // Check if there's an access_token in the URL hash (from Supabase invite)
      const hash = window.location.hash;
      if (!hash || !hash.includes('access_token=')) return;

      setLoading(true);
      
      try {
        const supabase = createBrowserSupabaseClient();
        
        // Parse hash parameters
        const hashParams = new URLSearchParams(hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const expiresAt = hashParams.get('expires_at');
        const tokenType = hashParams.get('token_type') || 'bearer';

        if (!accessToken) {
          setError('Ungültiger Einladungslink.');
          setLoading(false);
          return;
        }

        // Set the session using the tokens from the hash
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (sessionError || !sessionData.session) {
          console.error('Session error:', sessionError);
          setError('Fehler beim Anmelden. Bitte versuchen Sie es erneut.');
          setLoading(false);
          return;
        }

        // Check if user is in admin_users table
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('id, role')
          .eq('id', sessionData.session.user.id)
          .single();

        if (adminError || !adminUser) {
          // User might not be in admin_users yet - this should not happen if invite worked correctly
          // But if it does, we need to call an API route to add them (RLS prevents direct insert)
          const response = await fetch('/api/admin/invite', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: sessionData.session.user.email,
              role: sessionData.session.user.user_metadata?.role || 'editor',
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Error adding user to admin_users via API:', errorData);
            // If it's a duplicate or user already exists, that's okay
            if (!errorData.error?.includes('already') && !errorData.error?.includes('duplicate')) {
              setError('Fehler beim Erstellen des Admin-Benutzers. Bitte kontaktieren Sie einen Administrator.');
              setLoading(false);
              return;
            }
          }
          
          // Re-check admin_users after API call
          const { data: adminUserAfterInsert } = await supabase
            .from('admin_users')
            .select('id, role')
            .eq('id', sessionData.session.user.id)
            .single();

          if (!adminUserAfterInsert) {
            setError('Fehler beim Erstellen des Admin-Benutzers. Bitte kontaktieren Sie einen Administrator.');
            setLoading(false);
            return;
          }
        }

        // Clear hash and redirect
        window.history.replaceState(null, '', window.location.pathname);
        router.push(redirect);
        router.refresh();
      } catch (err: any) {
        console.error('Error handling invite token:', err);
        setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
        setLoading(false);
      }
    };

    handleInviteToken();
  }, [router, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('🔐 Starting login process...');
      const supabase = createBrowserSupabaseClient();
      
      console.log('📧 Attempting sign in with email:', email);
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('❌ Sign in error:', signInError);
        setError('Ungültige E-Mail oder Passwort.');
        setLoading(false);
        return;
      }

      if (!data.user) {
        console.error('❌ No user data returned');
        setError('Anmeldung fehlgeschlagen.');
        setLoading(false);
        return;
      }

      console.log('✅ Sign in successful, user ID:', data.user.id);

      // Check if user is admin
      console.log('🔍 Checking admin status...');
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('id, role')
        .eq('id', data.user.id)
        .single();

      if (adminError) {
        console.error('❌ Admin check error:', adminError);
        await supabase.auth.signOut();
        setError(`Fehler bei der Berechtigungsprüfung: ${adminError.message}`);
        setLoading(false);
        return;
      }

      if (!adminUser) {
        console.error('❌ User is not an admin');
        await supabase.auth.signOut();
        setError('Sie haben keine Berechtigung für den Admin-Bereich.');
        setLoading(false);
        return;
      }

      console.log('✅ Admin check passed, role:', adminUser.role);
      
      // Wait a moment for cookies to be set
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Force redirect with full page reload - use replace to avoid back button issues
      window.location.href = redirect;
    } catch (err: any) {
      console.error('❌ Exception during login:', err);
      setError(`Ein Fehler ist aufgetreten: ${err.message || 'Unbekannter Fehler'}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8960F] mb-4">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">DZ-Photo Admin</h1>
          <p className="text-gray-400 mt-2">Melden Sie sich an, um fortzufahren</p>
        </div>

        {/* Login Form */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dz-photo.at"
                required
                className="bg-[#1A1A1A] border-white/10 text-white placeholder:text-gray-500 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Passwort</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-[#1A1A1A] border-white/10 text-white placeholder:text-gray-500 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8960F] hover:from-[#E5C158] hover:to-[#D4AF37] text-white font-semibold py-3 rounded-full transition-all duration-300"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Anmelden...
                </>
              ) : (
                'Anmelden'
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} DZ-Photo. Alle Rechte vorbehalten.
        </p>
      </div>
    </div>
  );
}

function LoginFormFallback() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8960F] mb-4">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">DZ-Photo Admin</h1>
          <p className="text-gray-400 mt-2">Wird geladen...</p>
        </div>
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginFormFallback />}>
      <LoginForm />
    </Suspense>
  );
}

