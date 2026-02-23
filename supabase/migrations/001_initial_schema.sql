-- ============================================================
-- Portfolio — Initial Schema
-- ============================================================

-- ── Profile (single-row) ──
CREATE TABLE profile (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  title      text NOT NULL,
  bio        text NOT NULL,
  avatar_url text,
  email      text NOT NULL,
  github     text,
  linkedin   text,
  website    text,
  resume_url text,
  updated_at timestamptz DEFAULT now()
);

-- ── Projects ──
CREATE TABLE projects (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  description text NOT NULL,
  tech_stack  text[] NOT NULL DEFAULT '{}',
  live_url    text,
  repo_url    text,
  thumbnail   text,
  status      text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  is_featured boolean NOT NULL DEFAULT false,
  sort_order  int DEFAULT 0,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- ── Experience ──
CREATE TABLE experience (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_title        text NOT NULL,
  company          text NOT NULL,
  start_date       text NOT NULL,
  end_date         text,
  responsibilities text[] NOT NULL DEFAULT '{}',
  company_logo     text,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

-- ── Blog Posts ──
CREATE TABLE blog_posts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  slug         text NOT NULL UNIQUE,
  body         text NOT NULL,
  excerpt      text,
  tags         text[] DEFAULT '{}',
  status       text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at timestamptz,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- ── Contact Messages ──
CREATE TABLE contact_messages (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name  text NOT NULL,
  sender_email text NOT NULL,
  subject      text NOT NULL,
  body         text NOT NULL,
  is_read      boolean DEFAULT false,
  created_at   timestamptz DEFAULT now()
);

-- ============================================================
-- updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON experience
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Row-Level Security
-- ============================================================
ALTER TABLE profile          ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects         ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience       ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read: profile (all rows)
CREATE POLICY "Public read profile"
  ON profile FOR SELECT TO anon USING (true);

-- Public read: published projects only
CREATE POLICY "Public read published projects"
  ON projects FOR SELECT TO anon USING (status = 'published');

-- Public read: all experience
CREATE POLICY "Public read experience"
  ON experience FOR SELECT TO anon USING (true);

-- Public read: published blog posts only
CREATE POLICY "Public read published blog_posts"
  ON blog_posts FOR SELECT TO anon USING (status = 'published');

-- Public insert: contact messages (anonymous visitors)
CREATE POLICY "Public insert contact_messages"
  ON contact_messages FOR INSERT TO anon WITH CHECK (true);

-- Authenticated: full access to everything
CREATE POLICY "Auth full access profile"
  ON profile FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Auth full access projects"
  ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Auth full access experience"
  ON experience FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Auth full access blog_posts"
  ON blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Auth full access contact_messages"
  ON contact_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- Seed: placeholder profile
-- ============================================================
INSERT INTO profile (name, title, bio, email, github, linkedin)
VALUES (
  'Rajiv Rago',
  'Full-Stack Developer',
  'Full-Stack Developer building backend systems, APIs, and AI-powered tools. Skilled in Python, TypeScript, and cloud infrastructure. Currently prototyping AI agents and workflows at an R&D biotech startup.',
  'ragorajiv2@gmail.com',
  'https://github.com/rajiv-rago',
  'https://linkedin.com/in/rajiv-rago'
);
