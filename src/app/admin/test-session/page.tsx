'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/auth-client';

export default function TestSessionPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [session, setSession] = useState<any>(null);
  const [adminUser, setAdminUser] = useState<any>(null);

  const addLog = (msg: string) => {
    console.log(msg);
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${msg}`]);
  };

  useEffect(() => {
    const checkSession = async () => {
      addLog('🔍 Checking session...');
      const supabase = createBrowserSupabaseClient();
      
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        addLog(`❌ Session error: ${sessionError.message}`);
        return;
      }
      
      if (!currentSession) {
        addLog('❌ No session found');
        return;
      }
      
      addLog(`✅ Session found, user ID: ${currentSession.user.id}`);
      addLog(`📧 User email: ${currentSession.user.email}`);
      setSession(currentSession);
      
      // Check admin_users
      addLog('🔍 Checking admin_users...');
      const { data: admin, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', currentSession.user.id)
        .single();
      
      if (adminError) {
        addLog(`❌ Admin check error: ${adminError.message}`);
        addLog(`❌ Error code: ${adminError.code}`);
        addLog(`❌ Error details: ${JSON.stringify(adminError)}`);
        return;
      }
      
      if (!admin) {
        addLog('❌ No admin user found');
        return;
      }
      
      addLog(`✅ Admin user found: ${admin.email}, role: ${admin.role}`);
      setAdminUser(admin);
    };

    checkSession();
  }, []);

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Session Test</h1>
      <div className="bg-gray-900 p-4 rounded mb-4">
        <h2 className="text-lg font-semibold mb-2">Session:</h2>
        <pre className="text-xs overflow-auto">{JSON.stringify(session, null, 2)}</pre>
      </div>
      <div className="bg-gray-900 p-4 rounded mb-4">
        <h2 className="text-lg font-semibold mb-2">Admin User:</h2>
        <pre className="text-xs overflow-auto">{JSON.stringify(adminUser, null, 2)}</pre>
      </div>
      <div className="bg-gray-900 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Logs:</h2>
        <div className="space-y-1">
          {logs.map((log, i) => (
            <div key={i} className="text-xs font-mono">{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

