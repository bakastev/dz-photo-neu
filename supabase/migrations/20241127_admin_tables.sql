-- Admin Users Table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  role TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Log for tracking changes
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'publish', 'unpublish')),
  entity_type TEXT NOT NULL,
  entity_id UUID,
  entity_title TEXT,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-Save Drafts
CREATE TABLE IF NOT EXISTS drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, entity_type, entity_id)
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users
CREATE POLICY "Admin users can view all admin users"
ON admin_users FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

CREATE POLICY "Only admins can manage admin users"
ON admin_users FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for activity_log
CREATE POLICY "Admin users can view activity log"
ON activity_log FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

CREATE POLICY "Admin users can insert activity log"
ON activity_log FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

-- RLS Policies for drafts
CREATE POLICY "Users can manage their own drafts"
ON drafts FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_drafts_user ON drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_drafts_entity ON drafts(entity_type, entity_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drafts_updated_at
  BEFORE UPDATE ON drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for content tables (allow admin write access)
-- Weddings
DROP POLICY IF EXISTS "Admins can manage weddings" ON weddings;
CREATE POLICY "Admins can manage weddings"
ON weddings FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

-- Locations
DROP POLICY IF EXISTS "Admins can manage locations" ON locations;
CREATE POLICY "Admins can manage locations"
ON locations FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

-- Blog Posts
DROP POLICY IF EXISTS "Admins can manage blog_posts" ON blog_posts;
CREATE POLICY "Admins can manage blog_posts"
ON blog_posts FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

-- Fotobox Services
DROP POLICY IF EXISTS "Admins can manage fotobox_services" ON fotobox_services;
CREATE POLICY "Admins can manage fotobox_services"
ON fotobox_services FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

-- Reviews
DROP POLICY IF EXISTS "Admins can manage reviews" ON reviews;
CREATE POLICY "Admins can manage reviews"
ON reviews FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

-- Pages
DROP POLICY IF EXISTS "Admins can manage pages" ON pages;
CREATE POLICY "Admins can manage pages"
ON pages FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);



