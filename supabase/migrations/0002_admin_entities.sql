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
-- Seed: 51 canonical chapters (April 2026 list)
-- ============================================================
INSERT INTO public.chapters (name, school, city, state, lat, lng, status) VALUES
  ('Tottenville High School', 'Tottenville High School', 'Staten Island', 'NY', 40.5279, -74.1956, 'active'),
  ('High Tech High School', 'High Tech High School', 'Jersey City', 'NJ', 40.7282, -74.0776, 'active'),
  ('Museum High School', 'Museum High School', 'New York', 'NY', 40.7794, -73.9632, 'active'),
  ('Brooklyn Tech High School', 'Brooklyn Tech High School', 'Brooklyn', 'NY', 40.6882, -73.9767, 'active'),
  ('South Brunswick High School', 'South Brunswick High School', 'South Brunswick', 'NJ', 40.3915, -74.5246, 'active'),
  ('New Hope-Solebury High School', 'New Hope-Solebury High School', 'New Hope', 'PA', 40.3628, -74.9513, 'active'),
  ('Downingtown East High School', 'Downingtown East High School', 'Exton', 'PA', 40.0115, -75.6557, 'active'),
  ('Weymouth High School', 'Weymouth High School', 'Weymouth', 'MA', 42.2175, -70.9397, 'active'),
  ('Green Hope High School', 'Green Hope High School', 'Cary', 'NC', 35.8236, -78.8503, 'active'),
  ('Hamilton High School', 'Hamilton High School', 'Chandler', 'AZ', 33.2541, -111.8234, 'active'),
  ('John Champe High School', 'John Champe High School', 'Aldie', 'VA', 38.9659, -77.6200, 'active'),
  ('West Boca Raton Community High School', 'West Boca Raton Community High School', 'Boca Raton', 'FL', 26.3583, -80.1817, 'active'),
  ('The Frazer School', 'The Frazer School', 'Gainesville', 'FL', 29.6516, -82.3248, 'active'),
  ('NCSSM', 'NCSSM', 'Durham', 'NC', 35.9961, -78.9014, 'active'),
  ('Lambert High School', 'Lambert High School', 'Forsyth County', 'GA', 34.1662, -84.0911, 'active'),
  ('Eastside High School', 'Eastside High School', 'Gainesville', 'FL', 29.6528, -82.2937, 'active'),
  ('Stanton College Preparatory', 'Stanton College Preparatory', 'Jacksonville', 'FL', 30.3288, -81.6572, 'active'),
  ('Ravenwood High School', 'Ravenwood High School', 'Brentwood', 'TN', 35.9715, -86.8103, 'active'),
  ('Denmark High School', 'Denmark High School', 'Forsyth County', 'GA', 34.1421, -84.1300, 'active'),
  ('Green Level High School', 'Green Level High School', 'Cary', 'NC', 35.8463, -78.9134, 'active'),
  ('Hickory Ridge High School', 'Hickory Ridge High School', 'Harrisburg', 'NC', 35.3177, -80.6535, 'active'),
  ('Adlai E. Stevenson High School (Buffalo Grove)', 'Adlai E. Stevenson High School', 'Buffalo Grove', 'IL', 42.1663, -87.9806, 'active'),
  ('Adlai E. Stevenson High School (Long Grove)', 'Adlai E. Stevenson High School', 'Long Grove', 'IL', 42.1818, -87.9956, 'active'),
  ('Blue Valley North High School', 'Blue Valley North High School', 'Overland Park', 'KS', 38.9293, -94.6718, 'active'),
  ('Zionsville Community High School', 'Zionsville Community High School', 'Zionsville', 'IN', 39.9645, -86.2522, 'active'),
  ('Justin Wakeland High School', 'Justin Wakeland High School', 'Frisco', 'TX', 33.1700, -96.8900, 'active'),
  ('Heritage High School', 'Heritage High School', 'Frisco', 'TX', 33.1316, -96.7910, 'active'),
  ('Coppell High School', 'Coppell High School', 'Coppell', 'TX', 32.9543, -97.0150, 'active'),
  ('Obra D. Tompkins High School', 'Obra D. Tompkins High School', 'Katy', 'TX', 29.7858, -95.8245, 'active'),
  ('Obra D. Tompkins High School (2)', 'Obra D. Tompkins High School', 'Katy', 'TX', 29.7858, -95.8245, 'active'),
  ('Lebanon Trail High School', 'Lebanon Trail High School', 'Frisco', 'TX', 33.1581, -96.8230, 'active'),
  ('Seven Lakes High School', 'Seven Lakes High School', 'Katy', 'TX', 29.7258, -95.8049, 'active'),
  ('Tom Glenn High School', 'Tom Glenn High School', 'Austin', 'TX', 30.1710, -97.8950, 'active'),
  ('Frisco High School', 'Frisco High School', 'Frisco', 'TX', 33.1501, -96.8236, 'active'),
  ('California High School', 'California High School', 'San Ramon', 'CA', 37.7600, -121.9550, 'active'),
  ('Cupertino High School', 'Cupertino High School', 'Cupertino', 'CA', 37.3187, -122.0313, 'active'),
  ('Los Gatos High School', 'Los Gatos High School', 'Los Gatos', 'CA', 37.2278, -121.9733, 'active'),
  ('Cosumnes Oaks High School', 'Cosumnes Oaks High School', 'Elk Grove', 'CA', 38.3969, -121.3826, 'active'),
  ('Mountain House High School', 'Mountain House High School', 'Mountain House', 'CA', 37.7810, -121.5420, 'active'),
  ('Western Sierra Collegiate Academy', 'Western Sierra Collegiate Academy', 'Roseville', 'CA', 38.7896, -121.2355, 'active'),
  ('Chaminade College Preparatory', 'Chaminade College Preparatory', 'Los Angeles', 'CA', 34.1908, -118.5736, 'active'),
  ('Arcadia High School', 'Arcadia High School', 'Arcadia', 'CA', 34.1297, -118.0181, 'active'),
  ('Dougherty Valley High School', 'Dougherty Valley High School', 'San Ramon', 'CA', 37.7492, -121.9013, 'active'),
  ('River Hill High School', 'River Hill High School', 'Clarksville', 'MD', 39.2032, -76.9497, 'active'),
  ('North Shore Hebrew Academy High School', 'North Shore Hebrew Academy High School', 'Long Island', 'NY', 40.8176, -73.7169, 'active'),
  ('Independence High School', 'Independence High School', 'Frisco', 'TX', 33.1250, -96.8550, 'active'),
  ('Lone Star High School', 'Lone Star High School', 'Frisco', 'TX', 33.1550, -96.8000, 'active'),
  ('Liberty High School', 'Liberty High School', 'Frisco', 'TX', 33.1200, -96.8200, 'active'),
  ('Centennial High School', 'Centennial High School', 'Frisco', 'TX', 33.1450, -96.7710, 'active'),
  ('Lebanon Trail High School (2)', 'Lebanon Trail High School', 'Frisco', 'TX', 33.1581, -96.8230, 'active'),
  ('Frisco High School (2)', 'Frisco High School', 'Frisco', 'TX', 33.1501, -96.8236, 'active')
ON CONFLICT DO NOTHING;
