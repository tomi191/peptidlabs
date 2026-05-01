-- Test-email flag for waitlist subscribers.
-- Lets the admin mark internal/QA addresses so they can be targeted by
-- test campaigns (or excluded from production sends) without polluting
-- real subscriber stats.

ALTER TABLE waitlist_subscribers
  ADD COLUMN IF NOT EXISTS is_test BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS waitlist_subscribers_is_test_idx
  ON waitlist_subscribers (is_test)
  WHERE is_test = TRUE;

COMMENT ON COLUMN waitlist_subscribers.is_test IS
  'True for internal/QA addresses used for test sends. Excluded from real campaign analytics.';
