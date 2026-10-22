-- HUELLA D1 schema draft. Review and apply only after creating the D1 database.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  auth_provider TEXT NOT NULL CHECK (auth_provider IN ('email','google','apple')),
  display_name TEXT,
  mode TEXT NOT NULL DEFAULT 'general' CHECK (mode IN ('general','catholic')),
  age_confirmed_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS actions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (length(body) BETWEEN 1 AND 250),
  action_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  sync_status TEXT NOT NULL DEFAULT 'confirmed' CHECK (sync_status IN ('pending','confirmed'))
);
CREATE INDEX IF NOT EXISTS idx_actions_user_time ON actions(user_id, action_at DESC);
CREATE INDEX IF NOT EXISTS idx_actions_status_time ON actions(sync_status, action_at);

CREATE TABLE IF NOT EXISTS testimonies (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (length(body) BETWEEN 1 AND 500),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','needs_edit','hidden','withdrawn')),
  anonymous_publication INTEGER NOT NULL DEFAULT 1 CHECK (anonymous_publication = 1),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  reviewed_at TEXT,
  reviewer_id TEXT
);
CREATE INDEX IF NOT EXISTS idx_testimonies_status_time ON testimonies(status, created_at DESC);

CREATE TABLE IF NOT EXISTS moderation_events (
  id TEXT PRIMARY KEY,
  testimony_id TEXT NOT NULL REFERENCES testimonies(id) ON DELETE CASCADE,
  moderator_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('approved','rejected','needs_edit','hidden','restored')),
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS community_daily_snapshots (
  day TEXT PRIMARY KEY,
  action_count INTEGER NOT NULL DEFAULT 0,
  people_count INTEGER NOT NULL DEFAULT 0,
  calculated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  reminders_enabled INTEGER NOT NULL DEFAULT 0,
  local_lock_enabled INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);