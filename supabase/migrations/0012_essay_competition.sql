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

-- Seed the 5 prompts (update body text as needed)
insert into essay_prompts (prompt_number, title, body, visible) values
  (1, 'Inflation & Monetary Policy',
   'Analyze the causes and consequences of the 2021–2023 inflation surge in the United States. Evaluate the Federal Reserve''s policy response and propose what, if anything, should have been done differently. Support your argument with economic theory and empirical evidence.',
   true),
  (2, 'Income Inequality',
   'To what extent does income inequality harm or help long-run economic growth? Draw on at least two competing economic perspectives and evaluate the empirical evidence. Conclude with a policy recommendation and its trade-offs.',
   true),
  (3, 'Climate Economics',
   'Compare carbon taxes and cap-and-trade systems as mechanisms for reducing greenhouse gas emissions. Analyze efficiency, equity, and political feasibility. Which approach do you recommend for the United States, and why?',
   true),
  (4, 'Globalization & Trade',
   'Has globalization been a net positive for American workers? Examine the distributional effects of trade liberalization since the 1990s, and evaluate whether recent protectionist policies are an appropriate response.',
   true),
  (5, 'Technology & Labor Markets',
   'How is automation and artificial intelligence reshaping the U.S. labor market? Assess the empirical evidence on job displacement and creation, and propose policies to ensure broadly shared prosperity in an AI-driven economy.',
   true)
on conflict do nothing;
