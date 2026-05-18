-- Essay Competition tables

create table if not exists essay_prompts (
  id uuid primary key default gen_random_uuid(),
  prompt_number integer not null check (prompt_number between 1 and 5),
  title text not null,
  body text not null,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists essay_submissions (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  user_name text not null default '',
  school text not null default '',
  state text not null default '',
  prompt_id uuid references essay_prompts(id) on delete set null,
  file_url text not null,
  file_name text not null,
  file_type text not null default '',
  submitted_at timestamptz not null default now()
);

create table if not exists essay_reviews (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references essay_submissions(id) on delete cascade,
  review_status text not null default 'to_grade'
    check (review_status in ('to_grade', 'grading', 'graded', 'disqualified')),
  reviewer_email text,
  notes text,
  -- AI detection scores (0–100, percentage likelihood AI-written)
  gptzero_score numeric,
  turnitin_score numeric,
  originality_score numeric,
  copyleaks_score numeric,
  writer_score numeric,
  -- Computed weighted average of provided scores
  ai_total_score numeric,
  updated_at timestamptz not null default now()
);

-- One review record per submission
create unique index if not exists essay_reviews_submission_unique
  on essay_reviews(submission_id);

-- RLS (permissive, matching existing tables)
alter table essay_prompts enable row level security;
create policy "allow all" on essay_prompts for all using (true);

alter table essay_submissions enable row level security;
create policy "allow all" on essay_submissions for all using (true);

alter table essay_reviews enable row level security;
create policy "allow all" on essay_reviews for all using (true);

-- Seed the 5 prompts
insert into essay_prompts (prompt_number, title, body, visible) values
  (1, 'Microeconomics',
   'Should governments intervene in markets where competition appears strong but consumer choice is still limited by data, network effects, or switching costs?',
   true),
  (2, 'Macroeconomics',
   'Should central banks tolerate higher inflation temporarily to reduce unemployment and protect growth, or does doing so create greater long-term economic harm?',
   true),
  (3, 'International Economics',
   'Has globalization become more of a strategic vulnerability than an economic advantage for countries in the 21st century?',
   true),
  (4, 'Economic Development',
   'Are cash transfers or investments in education and infrastructure more effective at reducing poverty and promoting long term development?',
   true),
  (5, 'Current Economic Issues',
   'Should governments prioritize protecting consumers from the cost of living crisis even if it means slower business growth and weaker investment?',
   true)
on conflict do nothing;
