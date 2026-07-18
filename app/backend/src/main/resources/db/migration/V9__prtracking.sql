-- PR Tracking 도메인 (표34): PullRequestLink, PRStatusSnapshot, ReviewEvent, PollingJob.
-- F016(MVP-real) + F017 MVP 1회 조회 슬라이스. PRStatusSnapshot/ReviewEvent/PollingJob은
-- Phase 99 보류(주기적 Monitoring) 대상으로 테이블만 존재한다.

CREATE TABLE pull_request_links (
    id          UUID PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES users (id),
    session_id  UUID REFERENCES journey_sessions (id),
    repo_owner  TEXT NOT NULL,
    repo_name   TEXT NOT NULL,
    pr_number   INTEGER NOT NULL,
    pr_url      TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_pull_request_links_user_id ON pull_request_links (user_id);

CREATE TABLE pr_status_snapshots (
    id          UUID PRIMARY KEY,
    pr_link_id  UUID NOT NULL REFERENCES pull_request_links (id),
    state       TEXT NOT NULL,
    merged      BOOLEAN,
    checked_at  TIMESTAMPTZ NOT NULL
);

CREATE TABLE review_events (
    id          UUID PRIMARY KEY,
    pr_link_id  UUID NOT NULL REFERENCES pull_request_links (id),
    reviewer    TEXT,
    event_type  TEXT,
    created_at  TIMESTAMPTZ NOT NULL
);

CREATE TABLE polling_jobs (
    id               UUID PRIMARY KEY,
    pr_link_id       UUID NOT NULL REFERENCES pull_request_links (id),
    cron_expression  TEXT,
    last_run_at      TIMESTAMPTZ,
    active           BOOLEAN NOT NULL
);
