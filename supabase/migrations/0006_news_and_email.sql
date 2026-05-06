-- ============================================================
-- 0006_news_and_email.sql
-- Creates news_articles and email_subscribers tables
-- ============================================================

-- news_articles
CREATE TABLE IF NOT EXISTS public.news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT,
  section TEXT DEFAULT 'updates', -- updates | blog | publications
  author TEXT,
  excerpt TEXT,
  thumbnail_url TEXT,
  content_json TEXT, -- JSON array of content blocks
  layout TEXT DEFAULT 'standard', -- standard | wide
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "news_articles_select" ON public.news_articles FOR SELECT USING (true);
CREATE POLICY "news_articles_insert" ON public.news_articles FOR INSERT WITH CHECK (true);
CREATE POLICY "news_articles_update" ON public.news_articles FOR UPDATE USING (true);
CREATE POLICY "news_articles_delete" ON public.news_articles FOR DELETE USING (true);

-- email_subscribers
CREATE TABLE IF NOT EXISTS public.email_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'website', -- website | footer | notification-bar
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "email_subscribers_select" ON public.email_subscribers FOR SELECT USING (true);
CREATE POLICY "email_subscribers_insert" ON public.email_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "email_subscribers_update" ON public.email_subscribers FOR UPDATE USING (true);
CREATE POLICY "email_subscribers_delete" ON public.email_subscribers FOR DELETE USING (true);
