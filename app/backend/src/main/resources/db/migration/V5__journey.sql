-- Journey 도메인 (표34/부록B): ContributionMission, JourneySession, JourneyStep, StepPreference, JourneyCheckpoint. F008.

CREATE TABLE contribution_missions (
    id             UUID PRIMARY KEY,
    user_id        UUID NOT NULL REFERENCES users (id),
    repository_id  UUID NOT NULL REFERENCES repositories (id),
    issue_id       UUID NOT NULL REFERENCES issues (id),
    title          TEXT NOT NULL,
    status         TEXT NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_contribution_missions_user_id ON contribution_missions (user_id);

CREATE TABLE journey_sessions (
    id            UUID PRIMARY KEY,
    mission_id    UUID NOT NULL UNIQUE REFERENCES contribution_missions (id),
    status        TEXT NOT NULL,
    started_at    TIMESTAMPTZ NOT NULL,
    completed_at  TIMESTAMPTZ
);

CREATE TABLE journey_steps (
    id          UUID PRIMARY KEY,
    session_id  UUID NOT NULL REFERENCES journey_sessions (id),
    step_type   TEXT NOT NULL,
    sequence    INTEGER NOT NULL,
    state       TEXT NOT NULL,
    mode        TEXT,
    updated_at  TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_journey_steps_session_id ON journey_steps (session_id);

CREATE TABLE step_preferences (
    id             UUID PRIMARY KEY,
    user_id        UUID NOT NULL REFERENCES users (id),
    step_type      TEXT NOT NULL,
    default_skip   BOOLEAN NOT NULL,
    default_mode   TEXT
);
CREATE INDEX idx_step_preferences_user_id ON step_preferences (user_id);

CREATE TABLE journey_checkpoints (
    id                UUID PRIMARY KEY,
    session_id        UUID NOT NULL REFERENCES journey_sessions (id),
    step_type         TEXT NOT NULL,
    checkpoint_data   TEXT,
    created_at        TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_journey_checkpoints_session_id ON journey_checkpoints (session_id);
