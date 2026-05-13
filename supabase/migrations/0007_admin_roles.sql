-- Custom admin roles for granular page-level access control.
-- Super admins: role='admin' with admin_role_id IS NULL → full access.
-- Custom admins: role='admin' with admin_role_id set → restricted to allowed_pages.

CREATE TABLE IF NOT EXISTS admin_roles (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL UNIQUE,
  allowed_pages text[]    NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS admin_role_id uuid REFERENCES admin_roles(id) ON DELETE SET NULL;

-- All authenticated users can read roles (needed for AuthContext to resolve allowed pages).
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_roles_select_authenticated"
  ON admin_roles FOR SELECT
  TO authenticated
  USING (true);

-- Only super admins (role='admin' with no custom role restriction) can mutate roles.
CREATE POLICY "admin_roles_mutate_superadmin"
  ON admin_roles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role = 'admin'
        AND admin_role_id IS NULL
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role = 'admin'
        AND admin_role_id IS NULL
    )
  );
