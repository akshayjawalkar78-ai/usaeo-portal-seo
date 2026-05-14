-- Add per-page view/edit permissions to admin roles.
-- page_permissions: jsonb map of { pageId: 'view' | 'edit' }
-- allowed_pages is kept in sync (derived as the keys) for backward-compat nav filtering.

ALTER TABLE admin_roles
  ADD COLUMN IF NOT EXISTS page_permissions jsonb NOT NULL DEFAULT '{}'::jsonb;
