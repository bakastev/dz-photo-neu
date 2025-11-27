// Admin User Type - shared between server and client
export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  name?: string;
  avatar_url?: string;
  created_at: string;
}

// Re-export types only - no server imports here
export type { AdminUser as AdminUserType };
