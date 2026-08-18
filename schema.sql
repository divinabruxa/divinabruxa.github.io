CREATE TABLE IF NOT EXISTS subscriptions (
  customer_id TEXT PRIMARY KEY,
  email TEXT,
  plan TEXT NOT NULL DEFAULT 'premium',
  status TEXT NOT NULL DEFAULT 'inactive',
  current_period_end INTEGER,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS usage (
  customer_id TEXT NOT NULL,
  month TEXT NOT NULL,
  persona_count INTEGER NOT NULL DEFAULT 0,
  tarot_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (customer_id, month)
);

CREATE TABLE IF NOT EXISTS ai_budget (
  month TEXT PRIMARY KEY,
  estimated_usd REAL NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON subscriptions(email);
