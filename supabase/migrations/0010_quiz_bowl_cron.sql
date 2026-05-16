-- Schedules the quiz-bowl-cron edge function every 10 minutes.
--
-- Requires the `pg_cron` and `pg_net` extensions (available on Supabase).
-- The edge function URL + service-role key are read from custom GUC
-- settings so this migration contains no secrets. Before relying on the
-- schedule, set them once (SQL editor, as superuser/postgres):
--
--   ALTER DATABASE postgres SET app.qb_cron_url   = 'https://<project-ref>.supabase.co/functions/v1/quiz-bowl-cron';
--   ALTER DATABASE postgres SET app.qb_service_key = '<service-role-key>';
--
-- If pg_cron / pg_net are unavailable on the project tier, this migration
-- degrades gracefully (no schedule created) and the admin "Run scheduler
-- now" button (Quiz Bowl Portal → Settings) is the supported fallback.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_available_extensions WHERE name = 'pg_cron')
     AND EXISTS (SELECT 1 FROM pg_available_extensions WHERE name = 'pg_net') THEN

    CREATE EXTENSION IF NOT EXISTS pg_cron;
    CREATE EXTENSION IF NOT EXISTS pg_net;

    -- Drop any prior schedule so re-running the migration is idempotent.
    PERFORM cron.unschedule(jobid)
    FROM cron.job
    WHERE jobname = 'quiz_bowl_cron_tick';

    PERFORM cron.schedule(
      'quiz_bowl_cron_tick',
      '*/10 * * * *',
      $cron$
      SELECT net.http_post(
        url     := current_setting('app.qb_cron_url', true),
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.qb_service_key', true)
        ),
        body    := jsonb_build_object('source', 'pg_cron')
      )
      WHERE current_setting('app.qb_cron_url', true) IS NOT NULL;
      $cron$
    );
  ELSE
    RAISE NOTICE 'pg_cron/pg_net unavailable — skipping schedule. Use the admin "Run scheduler now" button.';
  END IF;
END
$$;
