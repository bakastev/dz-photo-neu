'use client';

import { useState, Suspense } from 'react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createBrowserSupabaseClient();
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError('Ungültige E-Mail oder Passwort.');
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError('Anmeldung fehlgeschlagen.');
        setLoading(false);
        return;
      }

      // Check if user is admin
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('id, role')
        .eq('id', data.user.id)
        .single();

      if (adminError || !adminUser) {
        await supabase.auth.signOut();
        setError('Sie haben keine Berechtigung für den Admin-Bereich.');
        setLoading(false);
        return;
      }

      // Success - redirect
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
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

