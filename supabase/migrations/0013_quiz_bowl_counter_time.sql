-- Add counter_proposed_time and proposer_note to slot holds.
-- counter_proposed_time: opposing team's structured alternative time within same shift window.
-- proposer_note: optional message from the initial proposing team.
ALTER TABLE public.quiz_bowl_slot_holds
  ADD COLUMN IF NOT EXISTS counter_proposed_time TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS proposer_note TEXT;
