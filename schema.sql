PRAGMA foreign_keys = ON;
-- Stage 1 beta schema. Device IDs are pseudonymous, NOT authentication. Do not use for sensitive private journals until real accounts/auth are implemented.
CREATE TABLE IF NOT EXISTS actions (
 id TEXT PRIMARY KEY,
 device_id TEXT NOT NULL,
 body TEXT NOT NULL CHECK (length(body) BETWEEN 1 AND 250),
 action_at TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 sync_status TEXT NOT NULL DEFAULT 'confirmed' CHECK (sync_status IN ('pending','confirmed'))
);
CREATE INDEX IF NOT EXISTS idx_actions_device_time ON actions(device_id, action_at DESC);
CREATE INDEX IF NOT EXISTS idx_actions_created ON actions(created_at, sync_status);
CREATE TABLE IF NOT EXISTS testimonies (
 id TEXT PRIMARY KEY,
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
