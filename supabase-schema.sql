-- ── Atarax Supabase Schema ────────────────────────────────────────────────
-- Run this SQL in your Supabase project via:
--   Dashboard → SQL Editor → New Query → paste & run
-- Or: supabase db push (if using local Supabase CLI)
-- ─────────────────────────────────────────────────────────────────────────

-- 1. journal_entries
--    Stores morning, midday, evening, weekly, monthly entries
--    and the daily quote rotation state.
CREATE TABLE IF NOT EXISTS journal_entries (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  storage_key TEXT        NOT NULL UNIQUE,   -- e.g. "sj_morning_2024-01-15"
  entry_type  TEXT        NOT NULL,          -- morning | midday | evening | weekly | monthly | quote_state
  date_key    TEXT        NOT NULL,          -- YYYY-MM-DD | YYYY-Www | YYYY-MM | global
  content     JSONB       NOT NULL DEFAULT '{}',
  saved_at    TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS journal_entries_entry_type_idx ON journal_entries (entry_type);
CREATE INDEX IF NOT EXISTS journal_entries_date_key_idx   ON journal_entries (date_key);

-- 2. favorite_quotes
--    Each saved Stoic quote is a separate row.
CREATE TABLE IF NOT EXISTS favorite_quotes (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_text  TEXT        NOT NULL,
  author      TEXT        NOT NULL DEFAULT '',
  source      TEXT        NOT NULL DEFAULT '',
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (quote_text, author)
);

-- 3. challenge_progress
--    One row per challenge type: "seven" (7 Stoic Challenges) and "thirty" (30-Day Journey).
CREATE TABLE IF NOT EXISTS challenge_progress (
  id             uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_type TEXT        NOT NULL UNIQUE,  -- seven | thirty
  data           JSONB       NOT NULL DEFAULT '{}',
  updated_at     TIMESTAMPTZ DEFAULT now()
);

-- 4. reading_list
--    One row per book; tracks whether the user has marked it as read.
CREATE TABLE IF NOT EXISTS reading_list (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id    TEXT        NOT NULL UNIQUE,
  is_read    BOOLEAN     NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. streak_data
--    Miscellaneous single-record state (current streak, last entry date, etc.)
CREATE TABLE IF NOT EXISTS streak_data (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  record_key TEXT        NOT NULL UNIQUE,  -- e.g. "current"
  data       JSONB       NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Row Level Security ────────────────────────────────────────────────────
-- Atarax is a single-user app with no auth; disable RLS so the anon key
-- can read and write all rows freely.
ALTER TABLE journal_entries    DISABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_quotes    DISABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE reading_list       DISABLE ROW LEVEL SECURITY;
ALTER TABLE streak_data        DISABLE ROW LEVEL SECURITY;
