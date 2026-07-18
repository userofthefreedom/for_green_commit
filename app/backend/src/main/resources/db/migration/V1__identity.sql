-- Identity 도메인 (표34): User, GitHubAccount, Consent, OAuthCredential. F001/BR01.

CREATE TABLE users (
    id             UUID PRIMARY KEY,
    github_id      BIGINT NOT NULL UNIQUE,
    github_login   TEXT NOT NULL UNIQUE,
    email          TEXT,
    display_name   TEXT,
    avatar_url     TEXT,
    created_at     TIMESTAMPTZ NOT NULL,
    updated_at     TIMESTAMPTZ NOT NULL
);

CREATE TABLE github_accounts (
    id                  UUID PRIMARY KEY,
    user_id             UUID NOT NULL UNIQUE REFERENCES users (id),
    github_user_id      BIGINT NOT NULL,
    login               TEXT NOT NULL,
    profile_url         TEXT,
    public_repos_count  INTEGER,
    followers           INTEGER,
    connected_at        TIMESTAMPTZ NOT NULL
);

CREATE TABLE consents (
    id            UUID PRIMARY KEY,
    user_id       UUID NOT NULL REFERENCES users (id),
    consent_type  TEXT NOT NULL,
    granted       BOOLEAN NOT NULL,
    granted_at    TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_consents_user_id ON consents (user_id);

CREATE TABLE oauth_credentials (
    id             UUID PRIMARY KEY,
    user_id        UUID NOT NULL UNIQUE REFERENCES users (id),
    provider       TEXT NOT NULL,
    access_token   TEXT,
    refresh_token  TEXT,
    scope          TEXT,
    expires_at     TIMESTAMPTZ
);
