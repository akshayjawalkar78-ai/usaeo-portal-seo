create table if not exists partner_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('competition', 'program', 'workshop')),
  status text not null default 'upcoming' check (status in ('upcoming', 'past')),
  partner text,
  partner_short text,
  partner_logo text,
  partner_url text,
  title text not null,
  date text,
  iso_date text,
  category text,
  badge text,
  description text,
  external_url text,
  highlights jsonb default '[]'::jsonb,
  co_partner text,
  co_partner_logo text,
  co_partner_url text,
  time text,
  instructor text,
  role text,
  topic text,
  zoom_url text,
  open_to text,
  free boolean default false,
  created_at timestamptz not null default now()
);

alter table partner_events enable row level security;
create policy "allow all" on partner_events for all using (true);

-- Seed existing partner events from partnerEventsSeed.js
insert into partner_events (
  event_type, status, partner, partner_short, partner_logo, partner_url,
  co_partner, co_partner_logo, co_partner_url,
  title, date, iso_date, badge, category, description, highlights, external_url
) values (
  'competition', 'upcoming', 'Youth Economy Lab', 'YEL', '/logos/YEL.png', 'https://youtheconomylab.com/',
  'Synthica', '/logos/synthica.png', 'https://www.synthica.org/',
  'YEL Student Scholars Research Competition', 'Dates TBA', '2026-12-31',
  'Ongoing · Virtual · Global', 'Research Proposal Competition',
  'Submit an original economics or finance research proposal (1-2 pages). Top 5 winners earn guaranteed admission to the Synthica Research Cohort (normally ~2% acceptance), academic publication mentorship, and signed certificates from YEL and Synthica. Open to high school students worldwide. Co-hosted with Synthica Research Group.',
  '["Top 5 → guaranteed Synthica Research Cohort admission","Publication pathway to indexed academic journals","Judged on research design, originality, methodology, and clarity (100 pts)","Top 20 pitch live at a research seminar to Synthica professors"]'::jsonb,
  'https://youtheconomylab.com/events'
);

insert into partner_events (
  event_type, status, partner, partner_short, partner_logo, partner_url,
  title, date, iso_date, badge, category, description, external_url
) values (
  'program', 'upcoming', 'Youth Economics Lab', 'YEL', '/logos/YEL.png', 'https://youtheconomylab.com/',
  'YEL Research Fellowship', 'Dates TBA', '2026-12-31',
  'Ongoing · Virtual', 'Fellowship',
  'YEL pairs students with economists and PhD mentors for mentored original research, with a pathway to publication in the YEL student journal.',
  'https://youtheconomylab.com/events'
);

insert into partner_events (
  event_type, status, partner, partner_short, partner_logo, partner_url,
  title, date, iso_date, time, instructor, role, topic, description,
  zoom_url, free, open_to
) values (
  'workshop', 'upcoming', 'Youth Economics Lab', 'YEL', '/logos/YEL.png', 'https://youtheconomylab.com/',
  'Breaking into Finance 101', 'May 9, 2026', '2026-05-09', '3:00 PM UTC',
  'Mr. Mukesh Agarwal', 'CFO, Spinneys Group; Former EY Executive',
  'Career pathways in finance and economics, the Spinneys IPO, breaking into Finance from high school',
  'Join CFO of Spinneys Group (one of the largest premium food retail chains in the Middle East and a former EY executive) as he breaks down his career journey, his role in launching the Spinneys IPO, and practical pathways for students to break into Finance and Economics. Free and open to all high school and university students and recent graduates.',
  'https://us06web.zoom.us/meeting/register/DV9X8YOpRWGFFiVD10lEpw',
  true, 'High school students, university students, recent graduates'
);
