-- Migrate chapter applications from event_registrations to applications table
INSERT INTO applications (user_email, user_name, program, payload, status, created_at)
SELECT
  user_email,
  user_name,
  'chapter' AS program,
  jsonb_build_object(
    'school', school,
    'grade', grade,
    'state', state,
    'notes', notes
  ) AS payload,
  CASE status
    WHEN 'registered' THEN 'pending'
    ELSE COALESCE(status, 'pending')
  END AS status,
  COALESCE(registered_at, created_at)
FROM event_registrations
WHERE event_type = 'chapter';

DELETE FROM event_registrations WHERE event_type = 'chapter';
