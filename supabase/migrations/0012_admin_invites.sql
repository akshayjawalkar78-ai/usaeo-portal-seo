-- Track pending admin invitations sent to unregistered users
CREATE TABLE IF NOT EXISTS admin_invites (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL,
  role_id    UUID REFERENCES admin_roles(id) ON DELETE SET NULL,
  invited_by TEXT NOT NULL,
  invited_at TIMESTAMPTZ DEFAULT now(),
  status     TEXT NOT NULL DEFAULT 'pending'
             CHECK (status IN ('pending', 'accepted', 'cancelled'))
);

CREATE INDEX IF NOT EXISTS admin_invites_email_idx ON admin_invites (email);
CREATE INDEX IF NOT EXISTS admin_invites_status_idx ON admin_invites (status);

-- Super admins can read/write all invites; authenticated users can read their own
ALTER TABLE admin_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admins_all_invites" ON admin_invites
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
        AND profiles.admin_role_id IS NULL
    )
  );

-- Allow any authenticated user to read invites for their own email
-- (needed for auto-grant check in AuthContext)
CREATE POLICY "self_read_invite" ON admin_invites
  FOR SELECT
  USING (
    email = (SELECT email FROM profiles WHERE id = auth.uid())
  );

-- Allow any authenticated user to update status on their own invite
-- (needed for auto-grant acceptance in AuthContext)
CREATE POLICY "self_accept_invite" ON admin_invites
  FOR UPDATE
  USING (
    email = (SELECT email FROM profiles WHERE id = auth.uid())
  );
