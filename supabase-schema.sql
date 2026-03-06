-- ── Atarax Supabase Schema (v2 — with Auth) ──────────────────────────────
--
-- Run this SQL in your Supabase project:
--   Dashboard → SQL Editor → New Query → paste & run
--
-- IMPORTANT: This replaces the v1 schema.  If you already ran v1, run the
-- migration block at the bottom of this file instead of the full CREATE
-- statements, so existing data is preserved.
-- ─────────────────────────────────────────────────────────────────────────


-- ══ FRESH INSTALL (run if tables don't exist yet) ════════════════════════

-- 1. journal_entries
--    Stores morning, midday, evening, weekly, monthly entries.
CREATE TABLE IF NOT EXISTS journal_entries (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_key TEXT        NOT NULL,           -- e.g. "sj_morning_2024-01-15"
  entry_type  TEXT        NOT NULL,           -- morning | midday | evening | weekly | monthly | quote_state
  date_key    TEXT        NOT NULL,           -- YYYY-MM-DD | YYYY-Www | YYYY-MM | global
  content     JSONB       NOT NULL DEFAULT '{}',
  saved_at    TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, storage_key)
);

CREATE INDEX IF NOT EXISTS journal_entries_user_idx       ON journal_entries (user_id);
CREATE INDEX IF NOT EXISTS journal_entries_entry_type_idx ON journal_entries (user_id, entry_type);
CREATE INDEX IF NOT EXISTS journal_entries_date_key_idx   ON journal_entries (user_id, date_key);

-- 2. favorite_quotes
CREATE TABLE IF NOT EXISTS favorite_quotes (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quote_text  TEXT        NOT NULL,
  author      TEXT        NOT NULL DEFAULT '',
  source      TEXT        NOT NULL DEFAULT '',
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, quote_text, author)
);

CREATE INDEX IF NOT EXISTS favorite_quotes_user_idx ON favorite_quotes (user_id);

-- 3. challenge_progress
--    One row per user per challenge type: "seven" or "thirty".
CREATE TABLE IF NOT EXISTS challenge_progress (
  id             uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_type TEXT        NOT NULL,   -- seven | thirty
  data           JSONB       NOT NULL DEFAULT '{}',
  updated_at     TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, challenge_type)
);

CREATE INDEX IF NOT EXISTS challenge_progress_user_idx ON challenge_progress (user_id);

-- 4. reading_list
CREATE TABLE IF NOT EXISTS reading_list (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id    TEXT        NOT NULL,
  is_read    BOOLEAN     NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, book_id)
);

CREATE INDEX IF NOT EXISTS reading_list_user_idx ON reading_list (user_id);

-- 5. streak_data
CREATE TABLE IF NOT EXISTS streak_data (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  record_key TEXT        NOT NULL,   -- e.g. "current"
  data       JSONB       NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, record_key)
);

CREATE INDEX IF NOT EXISTS streak_data_user_idx ON streak_data (user_id);


-- ══ ROW LEVEL SECURITY ════════════════════════════════════════════════════
-- Each user can only read and write their own rows.

ALTER TABLE journal_entries    ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_quotes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_list       ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_data        ENABLE ROW LEVEL SECURITY;

-- journal_entries
DROP POLICY IF EXISTS "journal_entries_user_policy" ON journal_entries;
CREATE POLICY "journal_entries_user_policy" ON journal_entries
  FOR ALL
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- favorite_quotes
DROP POLICY IF EXISTS "favorite_quotes_user_policy" ON favorite_quotes;
CREATE POLICY "favorite_quotes_user_policy" ON favorite_quotes
  FOR ALL
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- challenge_progress
DROP POLICY IF EXISTS "challenge_progress_user_policy" ON challenge_progress;
CREATE POLICY "challenge_progress_user_policy" ON challenge_progress
  FOR ALL
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- reading_list
DROP POLICY IF EXISTS "reading_list_user_policy" ON reading_list;
CREATE POLICY "reading_list_user_policy" ON reading_list
  FOR ALL
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- streak_data
DROP POLICY IF EXISTS "streak_data_user_policy" ON streak_data;
CREATE POLICY "streak_data_user_policy" ON streak_data
  FOR ALL
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ══ MIGRATION (only if you already ran the v1 schema) ════════════════════
-- Run this block if the tables already exist WITHOUT a user_id column.
-- Skip if you are doing a fresh install above.
--
-- DO $$
-- BEGIN
--
--   -- Drop old single-column unique constraints before adding user_id
--   ALTER TABLE journal_entries    DROP CONSTRAINT IF EXISTS journal_entries_storage_key_key;
--   ALTER TABLE favorite_quotes    DROP CONSTRAINT IF EXISTS favorite_quotes_quote_text_author_key;
--   ALTER TABLE challenge_progress DROP CONSTRAINT IF EXISTS challenge_progress_challenge_type_key;
--   ALTER TABLE reading_list       DROP CONSTRAINT IF EXISTS reading_list_book_id_key;
--   ALTER TABLE streak_data        DROP CONSTRAINT IF EXISTS streak_data_record_key_key;
--
--   -- Add user_id column (nullable first so existing rows don't fail)
--   ALTER TABLE journal_entries    ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
--   ALTER TABLE favorite_quotes    ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
--   ALTER TABLE challenge_progress ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
--   ALTER TABLE reading_list       ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
--   ALTER TABLE streak_data        ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
--
--   -- NOTE: existing rows will have user_id = NULL.
--   -- You must either DELETE old rows or assign them to a real user id before
--   -- applying the NOT NULL constraint and new unique indexes below.
--   -- e.g.:  UPDATE journal_entries SET user_id = '<your-user-uuid>' WHERE user_id IS NULL;
--
--   -- After assigning user_ids:
--   ALTER TABLE journal_entries    ALTER COLUMN user_id SET NOT NULL;
--   ALTER TABLE favorite_quotes    ALTER COLUMN user_id SET NOT NULL;
--   ALTER TABLE challenge_progress ALTER COLUMN user_id SET NOT NULL;
--   ALTER TABLE reading_list       ALTER COLUMN user_id SET NOT NULL;
--   ALTER TABLE streak_data        ALTER COLUMN user_id SET NOT NULL;
--
--   -- New composite unique constraints
--   ALTER TABLE journal_entries    ADD CONSTRAINT journal_entries_user_key_unique    UNIQUE (user_id, storage_key);
--   ALTER TABLE favorite_quotes    ADD CONSTRAINT favorite_quotes_user_text_unique   UNIQUE (user_id, quote_text, author);
--   ALTER TABLE challenge_progress ADD CONSTRAINT challenge_progress_user_type_unique UNIQUE (user_id, challenge_type);
--   ALTER TABLE reading_list       ADD CONSTRAINT reading_list_user_book_unique      UNIQUE (user_id, book_id);
--   ALTER TABLE streak_data        ADD CONSTRAINT streak_data_user_key_unique        UNIQUE (user_id, record_key);
--
-- END $$;
