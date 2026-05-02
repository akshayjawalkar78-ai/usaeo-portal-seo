-- quiz_bowl_teams
CREATE TABLE IF NOT EXISTS public.quiz_bowl_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name TEXT NOT NULL,
  captain_email TEXT NOT NULL,
  school TEXT,
  state TEXT,
  locked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.quiz_bowl_teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quiz_bowl_teams_select" ON public.quiz_bowl_teams FOR SELECT USING (true);
CREATE POLICY "quiz_bowl_teams_insert" ON public.quiz_bowl_teams FOR INSERT WITH CHECK (true);
CREATE POLICY "quiz_bowl_teams_update" ON public.quiz_bowl_teams FOR UPDATE USING (true);
CREATE POLICY "quiz_bowl_teams_delete" ON public.quiz_bowl_teams FOR DELETE USING (true);

-- quiz_bowl_team_members
CREATE TABLE IF NOT EXISTS public.quiz_bowl_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.quiz_bowl_teams(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT,
  role TEXT DEFAULT 'member', -- captain | member
  status TEXT DEFAULT 'active', -- active | pending | invited
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.quiz_bowl_team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quiz_bowl_team_members_select" ON public.quiz_bowl_team_members FOR SELECT USING (true);
CREATE POLICY "quiz_bowl_team_members_insert" ON public.quiz_bowl_team_members FOR INSERT WITH CHECK (true);
CREATE POLICY "quiz_bowl_team_members_update" ON public.quiz_bowl_team_members FOR UPDATE USING (true);
CREATE POLICY "quiz_bowl_team_members_delete" ON public.quiz_bowl_team_members FOR DELETE USING (true);
