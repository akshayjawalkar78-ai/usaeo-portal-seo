-- Add counter_proposed_time to slot holds so the opposing team can suggest
-- a specific alternative time within the same ref shift window, rather than
-- creating a competing hold on a different shift.
ALTER TABLE public.quiz_bowl_slot_holds
  ADD COLUMN IF NOT EXISTS counter_proposed_time TIMESTAMPTZ;
