-- Quiz Bowl tournament scheduling & matchmaking engine.
-- Adds tournament config, brackets, matches, ref shift pool, the
-- "Hold & Verify" slot holds, live-match lobby, and protest log.
-- RLS: enabled with permissive policies, mirroring 0004_quiz_bowl_teams.

-- ── Tournament config (single row) ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.quiz_bowl_config (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_date         TIMESTAMPTZ,
  group_stage_end    TIMESTAMPTZ,        -- Day 4 night cutoff
  playoff_start      TIMESTAMPTZ,        -- Day 5
  round_deadlines    JSONB DEFAULT '{}'::jsonb,  -- { "1": iso, "2": iso, ... }
  neg_penalty_value  INTEGER DEFAULT 500,
  phase              TEXT DEFAULT 'pre', -- pre | group | playoff | done
  registration_closed BOOLEAN DEFAULT false,
  playoff_generated  BOOLEAN DEFAULT false,
  created_at         TIMESTAMPTZ DEFAULT now(),
  updated_at         TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.quiz_bowl_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "qb_config_select" ON public.quiz_bowl_config FOR SELECT USING (true);
CREATE POLICY "qb_config_insert" ON public.quiz_bowl_config FOR INSERT WITH CHECK (true);
CREATE POLICY "qb_config_update" ON public.quiz_bowl_config FOR UPDATE USING (true);
CREATE POLICY "qb_config_delete" ON public.quiz_bowl_config FOR DELETE USING (true);

-- ── Brackets ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.quiz_bowl_brackets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  stage           TEXT DEFAULT 'group',   -- group | playoff
  region          TEXT,
  is_international BOOLEAN DEFAULT false,
  round_count     INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.quiz_bowl_brackets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "qb_brackets_select" ON public.quiz_bowl_brackets FOR SELECT USING (true);
CREATE POLICY "qb_brackets_insert" ON public.quiz_bowl_brackets FOR INSERT WITH CHECK (true);
CREATE POLICY "qb_brackets_update" ON public.quiz_bowl_brackets FOR UPDATE USING (true);
CREATE POLICY "qb_brackets_delete" ON public.quiz_bowl_brackets FOR DELETE USING (true);

-- ── Team tournament columns ─────────────────────────────────────
ALTER TABLE public.quiz_bowl_teams
  ADD COLUMN IF NOT EXISTS bracket_id       UUID REFERENCES public.quiz_bowl_brackets(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_international  BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS cumulative_score INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS wins             INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS losses           INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS draws            INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS clinched         BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS qualified        BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS eliminated       BOOLEAN DEFAULT false;

-- ── Matches ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.quiz_bowl_matches (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bracket_id        UUID REFERENCES public.quiz_bowl_brackets(id) ON DELETE CASCADE,
  stage             TEXT DEFAULT 'group',   -- group | playoff
  round             INTEGER DEFAULT 1,
  playoff_slot      INTEGER,                -- position in single-elim tree
  team_a_id         UUID REFERENCES public.quiz_bowl_teams(id) ON DELETE SET NULL,
  team_b_id         UUID REFERENCES public.quiz_bowl_teams(id) ON DELETE SET NULL,
  status            TEXT DEFAULT 'unscheduled', -- unscheduled|negotiating|locked|live|completed|draw|forfeit
  scheduled_at      TIMESTAMPTZ,
  deadline          TIMESTAMPTZ,
  ref_email         TEXT,
  ref_shift_id      UUID,
  meet_link         TEXT,
  kahoot_link       TEXT,
  kahoot_pin        TEXT,
  buzzer_link       TEXT,
  team_a_score      INTEGER,
  team_b_score      INTEGER,
  winner_team_id    UUID REFERENCES public.quiz_bowl_teams(id) ON DELETE SET NULL,
  score_locked_at   TIMESTAMPTZ,
  warn_24h_sent     BOOLEAN DEFAULT false,
  last_interaction_at TIMESTAMPTZ DEFAULT now(),
  created_at        TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.quiz_bowl_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "qb_matches_select" ON public.quiz_bowl_matches FOR SELECT USING (true);
CREATE POLICY "qb_matches_insert" ON public.quiz_bowl_matches FOR INSERT WITH CHECK (true);
CREATE POLICY "qb_matches_update" ON public.quiz_bowl_matches FOR UPDATE USING (true);
CREATE POLICY "qb_matches_delete" ON public.quiz_bowl_matches FOR DELETE USING (true);

-- ── Referee shift pool ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.quiz_bowl_ref_shifts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_email  TEXT NOT NULL,
  ref_name   TEXT,
  start_at   TIMESTAMPTZ NOT NULL,
  end_at     TIMESTAMPTZ NOT NULL,
  status     TEXT DEFAULT 'open',  -- open | held | claimed
  match_id   UUID REFERENCES public.quiz_bowl_matches(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.quiz_bowl_ref_shifts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "qb_ref_shifts_select" ON public.quiz_bowl_ref_shifts FOR SELECT USING (true);
CREATE POLICY "qb_ref_shifts_insert" ON public.quiz_bowl_ref_shifts FOR INSERT WITH CHECK (true);
CREATE POLICY "qb_ref_shifts_update" ON public.quiz_bowl_ref_shifts FOR UPDATE USING (true);
CREATE POLICY "qb_ref_shifts_delete" ON public.quiz_bowl_ref_shifts FOR DELETE USING (true);

-- ── Slot holds ("Hold & Verify") ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.quiz_bowl_slot_holds (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id          UUID REFERENCES public.quiz_bowl_ref_shifts(id) ON DELETE CASCADE,
  match_id          UUID REFERENCES public.quiz_bowl_matches(id) ON DELETE CASCADE,
  proposing_team_id UUID REFERENCES public.quiz_bowl_teams(id) ON DELETE CASCADE,
  proposed_time     TIMESTAMPTZ,
  status            TEXT DEFAULT 'holding', -- holding|claimed|declined|change_requested|expired
  change_reason     TEXT,
  expires_at        TIMESTAMPTZ NOT NULL,
  created_at        TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.quiz_bowl_slot_holds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "qb_slot_holds_select" ON public.quiz_bowl_slot_holds FOR SELECT USING (true);
CREATE POLICY "qb_slot_holds_insert" ON public.quiz_bowl_slot_holds FOR INSERT WITH CHECK (true);
CREATE POLICY "qb_slot_holds_update" ON public.quiz_bowl_slot_holds FOR UPDATE USING (true);
CREATE POLICY "qb_slot_holds_delete" ON public.quiz_bowl_slot_holds FOR DELETE USING (true);

-- ── Live-match lobby ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.quiz_bowl_lobby (
  match_id            UUID PRIMARY KEY REFERENCES public.quiz_bowl_matches(id) ON DELETE CASCADE,
  team_a_ready_at     TIMESTAMPTZ,
  team_b_ready_at     TIMESTAMPTZ,
  ref_joined_at       TIMESTAMPTZ,
  tech_check_started_at TIMESTAMPTZ,
  tech_check_ends_at  TIMESTAMPTZ,
  links_released      BOOLEAN DEFAULT false,
  updated_at          TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.quiz_bowl_lobby ENABLE ROW LEVEL SECURITY;
CREATE POLICY "qb_lobby_select" ON public.quiz_bowl_lobby FOR SELECT USING (true);
CREATE POLICY "qb_lobby_insert" ON public.quiz_bowl_lobby FOR INSERT WITH CHECK (true);
CREATE POLICY "qb_lobby_update" ON public.quiz_bowl_lobby FOR UPDATE USING (true);
CREATE POLICY "qb_lobby_delete" ON public.quiz_bowl_lobby FOR DELETE USING (true);

-- ── Protest log ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.quiz_bowl_protests (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id           UUID REFERENCES public.quiz_bowl_matches(id) ON DELETE CASCADE,
  team_id            UUID REFERENCES public.quiz_bowl_teams(id) ON DELETE SET NULL,
  captain_email      TEXT,
  reason             TEXT,
  status             TEXT DEFAULT 'open', -- open | resolved
  resolution_note    TEXT,
  window_expires_at  TIMESTAMPTZ NOT NULL,
  created_at         TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.quiz_bowl_protests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "qb_protests_select" ON public.quiz_bowl_protests FOR SELECT USING (true);
CREATE POLICY "qb_protests_insert" ON public.quiz_bowl_protests FOR INSERT WITH CHECK (true);
CREATE POLICY "qb_protests_update" ON public.quiz_bowl_protests FOR UPDATE USING (true);
CREATE POLICY "qb_protests_delete" ON public.quiz_bowl_protests FOR DELETE USING (true);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_qb_matches_bracket ON public.quiz_bowl_matches(bracket_id);
CREATE INDEX IF NOT EXISTS idx_qb_matches_status  ON public.quiz_bowl_matches(status);
CREATE INDEX IF NOT EXISTS idx_qb_holds_status    ON public.quiz_bowl_slot_holds(status);
CREATE INDEX IF NOT EXISTS idx_qb_holds_expires   ON public.quiz_bowl_slot_holds(expires_at);
CREATE INDEX IF NOT EXISTS idx_qb_shifts_status   ON public.quiz_bowl_ref_shifts(status);
CREATE INDEX IF NOT EXISTS idx_qb_teams_bracket   ON public.quiz_bowl_teams(bracket_id);
