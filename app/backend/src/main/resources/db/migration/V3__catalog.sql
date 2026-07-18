-- Catalog 도메인 (표34/표16): Repository, RepositorySnapshot, Issue, IssueProfile, ContributionRule. F005~F007.

CREATE TABLE repositories (
    id                            UUID PRIMARY KEY,
    owner_login                   TEXT NOT NULL,
    name                          TEXT NOT NULL,
    full_name                     TEXT NOT NULL UNIQUE,
    description                   TEXT,
    primary_language              TEXT,
    topics                        TEXT,
    repo_url                      TEXT NOT NULL,
    public_benefit_summary        TEXT,
    recent_activity_summary       TEXT,
    contribution_docs_quality     TEXT,
    external_pr_responsiveness    TEXT,
    fit_score                     DOUBLE PRECISION,
    caution_note                  TEXT,
    stars                         INTEGER,
    created_at                    TIMESTAMPTZ NOT NULL
);

CREATE TABLE repository_snapshots (
    id                  UUID PRIMARY KEY,
    repository_id       UUID NOT NULL REFERENCES repositories (id),
    snapshot_at         TIMESTAMPTZ NOT NULL,
    stars_count         INTEGER,
    open_issues_count   INTEGER,
    last_commit_at      TIMESTAMPTZ,
    raw_metadata_json   TEXT
);
CREATE INDEX idx_repository_snapshots_repository_id ON repository_snapshots (repository_id);

CREATE TABLE issues (
    id                  UUID PRIMARY KEY,
    repository_id       UUID NOT NULL REFERENCES repositories (id),
    number              INTEGER NOT NULL,
    title               TEXT NOT NULL,
    url                 TEXT NOT NULL,
    summary             TEXT,
    contribution_type   TEXT,
    estimated_scope     TEXT,
    difficulty          TEXT,
    assignee            TEXT,
    linked_pr_url       TEXT,
    last_updated_at     TIMESTAMPTZ,
    state               TEXT NOT NULL
);
CREATE INDEX idx_issues_repository_id ON issues (repository_id);

CREATE TABLE issue_profiles (
    id                     UUID PRIMARY KEY,
    issue_id               UUID NOT NULL UNIQUE REFERENCES issues (id),
    current_problem        TEXT,
    expected_outcome       TEXT,
    completion_criteria    TEXT,
    created_at             TIMESTAMPTZ NOT NULL
);

CREATE TABLE contribution_rules (
    id           UUID PRIMARY KEY,
    name         TEXT NOT NULL,
    description  TEXT,
    rule_type    TEXT NOT NULL,
    weight       DOUBLE PRECISION,
    active       BOOLEAN NOT NULL
);
