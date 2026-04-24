-- ============================================================
-- 0003_admin_schema_fixes.sql
-- Fills schema-cache columns missing from admin console + adds
-- applications and site_content tables.
-- ============================================================

-- announcements: published + urgent
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS urgent BOOLEAN DEFAULT false;

-- workshops: zoom_link
ALTER TABLE public.workshops ADD COLUMN IF NOT EXISTS zoom_link TEXT;

-- resources: file_url, file_size, tag, public
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS file_url TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS file_size TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS tag TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS public BOOLEAN DEFAULT true;

-- rankings: student_name, stage, visible
ALTER TABLE public.rankings ADD COLUMN IF NOT EXISTS student_name TEXT;
ALTER TABLE public.rankings ADD COLUMN IF NOT EXISTS stage TEXT DEFAULT 'qualifiers';
ALTER TABLE public.rankings ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT true;

-- chapters: founder_name, founder_email, invite_code
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS founder_name TEXT;
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS founder_email TEXT;
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS invite_code TEXT;

-- applications: generic program-application inbox
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  user_name TEXT,
  program TEXT NOT NULL, -- research | ambassador | chapter | other
  payload JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending', -- pending | approved | rejected
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- site_content: editable marketing-site blocks (used by admin "Edit Website")
CREATE TABLE IF NOT EXISTS public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,           -- home | partners | chapters | ...
  block TEXT NOT NULL,          -- hero_title | hero_subtitle | stat_1 | ...
  content JSONB DEFAULT '{}'::jsonb, -- { text, html, color, bg, imageUrl, bold, italic }
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (page, block)
);
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "site_content_select" ON public.site_content;
DROP POLICY IF EXISTS "site_content_insert" ON public.site_content;
DROP POLICY IF EXISTS "site_content_update" ON public.site_content;
DROP POLICY IF EXISTS "site_content_delete" ON public.site_content;
CREATE POLICY "site_content_select" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "site_content_insert" ON public.site_content FOR INSERT WITH CHECK (true);
CREATE POLICY "site_content_update" ON public.site_content FOR UPDATE USING (true);
CREATE POLICY "site_content_delete" ON public.site_content FOR DELETE USING (true);

DROP POLICY IF EXISTS "applications_select" ON public.applications;
DROP POLICY IF EXISTS "applications_insert" ON public.applications;
DROP POLICY IF EXISTS "applications_update" ON public.applications;
DROP POLICY IF EXISTS "applications_delete" ON public.applications;
CREATE POLICY "applications_select" ON public.applications FOR SELECT USING (true);
CREATE POLICY "applications_insert" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "applications_update" ON public.applications FOR UPDATE USING (true);
CREATE POLICY "applications_delete" ON public.applications FOR DELETE USING (true);

-- Force PostgREST to reload its schema cache so new columns/tables are usable
-- immediately from the REST API (otherwise you'll get "Could not find the X
-- column of Y in the schema cache" errors from supabase-js).
NOTIFY pgrst, 'reload schema';
