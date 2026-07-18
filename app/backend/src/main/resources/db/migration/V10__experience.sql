-- Experience 도메인 (표34): Notification, ContributionHistory, NextMissionRecommendation.
-- F019 초안(ContributionHistory) MVP-real. Notification(F018)·NextMissionRecommendation은 Phase 99 보류.

CREATE TABLE contribution_histories (
    id                UUID PRIMARY KEY,
    user_id           UUID NOT NULL REFERENCES users (id),
    pr_link_id        UUID REFERENCES pull_request_links (id),
    journey_summary   TEXT,
    created_at        TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_contribution_histories_user_id ON contribution_histories (user_id);

CREATE TABLE notifications (
    id          UUID PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES users (id),
    message     TEXT,
    is_read     BOOLEAN NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL
);

CREATE TABLE next_mission_recommendations (
    id               UUID PRIMARY KEY,
    user_id          UUID NOT NULL REFERENCES users (id),
    suggestion_text  TEXT,
    created_at       TIMESTAMPTZ NOT NULL
);
