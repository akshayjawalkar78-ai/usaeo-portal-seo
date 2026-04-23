-- ============================================================
-- 0002_admin_entities.sql
-- Creates all admin-managed entity tables + event_registrations
-- ============================================================

-- announcements
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT,
  type TEXT DEFAULT 'info',
  visible BOOLEAN DEFAULT true,
  created_date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "announcements_select" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "announcements_insert" ON public.announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "announcements_update" ON public.announcements FOR UPDATE USING (true);
CREATE POLICY "announcements_delete" ON public.announcements FOR DELETE USING (true);

-- workshops
CREATE TABLE IF NOT EXISTS public.workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  instructor TEXT,
  instructor_title TEXT,
  date TEXT,
  time TEXT,
  duration TEXT,
  subject TEXT,
  level TEXT,
  status TEXT DEFAULT 'upcoming',
  recording_url TEXT,
  slides_url TEXT,
  created_date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "workshops_select" ON public.workshops FOR SELECT USING (true);
CREATE POLICY "workshops_insert" ON public.workshops FOR INSERT WITH CHECK (true);
CREATE POLICY "workshops_update" ON public.workshops FOR UPDATE USING (true);
CREATE POLICY "workshops_delete" ON public.workshops FOR DELETE USING (true);

-- resources
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  type TEXT DEFAULT 'document',
  subject TEXT,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "resources_select" ON public.resources FOR SELECT USING (true);
CREATE POLICY "resources_insert" ON public.resources FOR INSERT WITH CHECK (true);
CREATE POLICY "resources_update" ON public.resources FOR UPDATE USING (true);
CREATE POLICY "resources_delete" ON public.resources FOR DELETE USING (true);

-- rankings
CREATE TABLE IF NOT EXISTS public.rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rank INTEGER,
  team_name TEXT NOT NULL,
  school TEXT,
  state TEXT,
  score NUMERIC,
  competition TEXT,
  year INTEGER,
  user_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.rankings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rankings_select" ON public.rankings FOR SELECT USING (true);
CREATE POLICY "rankings_insert" ON public.rankings FOR INSERT WITH CHECK (true);
CREATE POLICY "rankings_update" ON public.rankings FOR UPDATE USING (true);
CREATE POLICY "rankings_delete" ON public.rankings FOR DELETE USING (true);

-- chapters
CREATE TABLE IF NOT EXISTS public.chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  school TEXT,
  city TEXT,
  state TEXT,
  lat NUMERIC,
  lng NUMERIC,
  status TEXT DEFAULT 'active',
  member_count INTEGER DEFAULT 0,
  founded_date TEXT,
  contact_email TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chapters_select" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "chapters_insert" ON public.chapters FOR INSERT WITH CHECK (true);
CREATE POLICY "chapters_update" ON public.chapters FOR UPDATE USING (true);
CREATE POLICY "chapters_delete" ON public.chapters FOR DELETE USING (true);

-- chapter_members
CREATE TABLE IF NOT EXISTS public.chapter_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT,
  role TEXT DEFAULT 'member', -- founder | chapter_admin | member
  status TEXT DEFAULT 'active', -- active | pending | removed
  joined_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.chapter_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chapter_members_select" ON public.chapter_members FOR SELECT USING (true);
CREATE POLICY "chapter_members_insert" ON public.chapter_members FOR INSERT WITH CHECK (true);
CREATE POLICY "chapter_members_update" ON public.chapter_members FOR UPDATE USING (true);
CREATE POLICY "chapter_members_delete" ON public.chapter_members FOR DELETE USING (true);

-- chapter_announcements
CREATE TABLE IF NOT EXISTS public.chapter_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  author_email TEXT,
  created_date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.chapter_announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chapter_announcements_select" ON public.chapter_announcements FOR SELECT USING (true);
CREATE POLICY "chapter_announcements_insert" ON public.chapter_announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "chapter_announcements_update" ON public.chapter_announcements FOR UPDATE USING (true);
CREATE POLICY "chapter_announcements_delete" ON public.chapter_announcements FOR DELETE USING (true);

-- competition_events
CREATE TABLE IF NOT EXISTS public.competition_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase TEXT NOT NULL,
  description TEXT,
  date_range TEXT,
  status TEXT DEFAULT 'upcoming', -- upcoming | current | done
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.competition_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "competition_events_select" ON public.competition_events FOR SELECT USING (true);
CREATE POLICY "competition_events_insert" ON public.competition_events FOR INSERT WITH CHECK (true);
CREATE POLICY "competition_events_update" ON public.competition_events FOR UPDATE USING (true);
CREATE POLICY "competition_events_delete" ON public.competition_events FOR DELETE USING (true);

-- curriculum_units
CREATE TABLE IF NOT EXISTS public.curriculum_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_number INTEGER,
  title TEXT NOT NULL,
  topics TEXT,
  hours TEXT,
  url TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.curriculum_units ENABLE ROW LEVEL SECURITY;
CREATE POLICY "curriculum_units_select" ON public.curriculum_units FOR SELECT USING (true);
CREATE POLICY "curriculum_units_insert" ON public.curriculum_units FOR INSERT WITH CHECK (true);
CREATE POLICY "curriculum_units_update" ON public.curriculum_units FOR UPDATE USING (true);
CREATE POLICY "curriculum_units_delete" ON public.curriculum_units FOR DELETE USING (true);

-- event_registrations
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  user_name TEXT,
  school TEXT,
  grade TEXT,
  state TEXT,
  event_type TEXT, -- quiz-bowl | essay | chapter | workshop
  event_name TEXT,
  registered_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT,
  status TEXT DEFAULT 'registered',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "event_registrations_select" ON public.event_registrations FOR SELECT USING (true);
CREATE POLICY "event_registrations_insert" ON public.event_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "event_registrations_update" ON public.event_registrations FOR UPDATE USING (true);
CREATE POLICY "event_registrations_delete" ON public.event_registrations FOR DELETE USING (true);

-- ============================================================
-- Seed: 48 real chapters
-- ============================================================
INSERT INTO public.chapters (name, school, city, state, lat, lng, status) VALUES
  ('Obra D. Tompkins HS', 'Obra D. Tompkins HS', 'Katy', 'TX', 29.7858, -95.8245, 'active'),
  ('Lebanon Trail HS', 'Lebanon Trail HS', 'Frisco', 'TX', 33.1581, -96.8230, 'active'),
  ('Frisco HS', 'Frisco HS', 'Frisco', 'TX', 33.1501, -96.8236, 'active'),
  ('Westwood HS', 'Westwood HS', 'Austin', 'TX', 30.4406, -97.7836, 'active'),
  ('Plano West Senior HS', 'Plano West Senior HS', 'Plano', 'TX', 33.0198, -96.7836, 'active'),
  ('Flower Mound HS', 'Flower Mound HS', 'Flower Mound', 'TX', 33.0148, -97.0969, 'active'),
  ('Southlake Carroll HS', 'Southlake Carroll HS', 'Southlake', 'TX', 32.9401, -97.1340, 'active'),
  ('Jesuit College Preparatory', 'Jesuit College Preparatory', 'Dallas', 'TX', 32.8678, -96.8370, 'active'),
  ('Highland Park HS', 'Highland Park HS', 'Dallas', 'TX', 32.8367, -96.7973, 'active'),
  ('Prosper HS', 'Prosper HS', 'Prosper', 'TX', 33.2368, -96.8009, 'active'),
  ('Coppell HS', 'Coppell HS', 'Coppell', 'TX', 32.9543, -97.0150, 'active'),
  ('Allen HS', 'Allen HS', 'Allen', 'TX', 33.0951, -96.6641, 'active'),
  ('McKinney Boyd HS', 'McKinney Boyd HS', 'McKinney', 'TX', 33.1972, -96.6397, 'active'),
  ('Lovejoy HS', 'Lovejoy HS', 'Lucas', 'TX', 33.1029, -96.5780, 'active'),
  ('Hebron HS', 'Hebron HS', 'Carrollton', 'TX', 33.0001, -96.9301, 'active'),
  ('Rockwall HS', 'Rockwall HS', 'Rockwall', 'TX', 32.9290, -96.4597, 'active'),
  ('Wakeland HS', 'Wakeland HS', 'Frisco', 'TX', 33.1700, -96.8900, 'active'),
  ('Centennial HS', 'Centennial HS', 'Frisco', 'TX', 33.1450, -96.7710, 'active'),
  ('Liberty HS (Frisco)', 'Liberty HS', 'Frisco', 'TX', 33.1200, -96.8200, 'active'),
  ('Lone Star HS', 'Lone Star HS', 'Frisco', 'TX', 33.1550, -96.8000, 'active'),
  ('Memorial HS (Houston)', 'Memorial HS', 'Houston', 'TX', 29.7643, -95.5277, 'active'),
  ('Dulles HS', 'Dulles HS', 'Sugar Land', 'TX', 29.5724, -95.6397, 'active'),
  ('Seven Lakes HS', 'Seven Lakes HS', 'Katy', 'TX', 29.7258, -95.8049, 'active'),
  ('Clements HS', 'Clements HS', 'Sugar Land', 'TX', 29.5701, -95.6671, 'active'),
  ('Ridge Point HS', 'Ridge Point HS', 'Missouri City', 'TX', 29.5387, -95.5780, 'active'),
  ('Cypress Creek HS', 'Cypress Creek HS', 'Houston', 'TX', 29.9463, -95.6613, 'active'),
  ('Strake Jesuit College Prep', 'Strake Jesuit', 'Houston', 'TX', 29.7134, -95.4887, 'active'),
  ('Cinco Ranch HS', 'Cinco Ranch HS', 'Katy', 'TX', 29.7539, -95.7677, 'active'),
  ('Jasper HS (Plano)', 'Jasper HS', 'Plano', 'TX', 33.0200, -96.7200, 'active'),
  ('Thomas Jefferson HS (San Antonio)', 'Thomas Jefferson HS', 'San Antonio', 'TX', 29.4441, -98.5034, 'active'),
  ('James Madison HS (San Antonio)', 'James Madison HS', 'San Antonio', 'TX', 29.5523, -98.4955, 'active'),
  ('Ronald Reagan HS (San Antonio)', 'Ronald Reagan HS', 'San Antonio', 'TX', 29.6131, -98.4231, 'active'),
  ('Walter Payton College Prep', 'Walter Payton College Prep', 'Chicago', 'IL', 41.9050, -87.6381, 'active'),
  ('Northside College Prep', 'Northside College Prep', 'Chicago', 'IL', 41.9803, -87.7180, 'active'),
  ('Niles West HS', 'Niles West HS', 'Skokie', 'IL', 42.0386, -87.7408, 'active'),
  ('Niles North HS', 'Niles North HS', 'Skokie', 'IL', 42.0539, -87.7408, 'active'),
  ('Naperville Central HS', 'Naperville Central HS', 'Naperville', 'IL', 41.7703, -88.1536, 'active'),
  ('Thomas Jefferson HS (Virginia)', 'TJHSST', 'Falls Church', 'VA', 38.8173, -77.1993, 'active'),
  ('Langley HS', 'Langley HS', 'McLean', 'VA', 38.9218, -77.1947, 'active'),
  ('McLean HS', 'McLean HS', 'McLean', 'VA', 38.9337, -77.1801, 'active'),
  ('South Lakes HS', 'South Lakes HS', 'Reston', 'VA', 38.9462, -77.3439, 'active'),
  ('Westfield HS (Virginia)', 'Westfield HS', 'Chantilly', 'VA', 38.8844, -77.4075, 'active'),
  ('Lynbrook HS', 'Lynbrook HS', 'San Jose', 'CA', 37.3526, -121.9843, 'active'),
  ('Monta Vista HS', 'Monta Vista HS', 'Cupertino', 'CA', 37.3230, -122.0452, 'active'),
  ('Stuyvesant HS', 'Stuyvesant HS', 'New York', 'NY', 40.7176, -74.0137, 'active'),
  ('Townsend Harris HS', 'Townsend Harris HS', 'Flushing', 'NY', 40.7289, -73.8200, 'active'),
  ('Lexington HS', 'Lexington HS', 'Lexington', 'MA', 42.4474, -71.2150, 'active'),
  ('Brookline HS', 'Brookline HS', 'Brookline', 'MA', 42.3321, -71.1397, 'active')
ON CONFLICT DO NOTHING;
