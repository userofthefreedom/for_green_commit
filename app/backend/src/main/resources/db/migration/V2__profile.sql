-- Profile 도메인 (표34/표13): SkillProfile, Preference, IDEPreference, TutorialProgress. F002~F004/BR02/BR03.

CREATE TABLE skill_profiles (
    id                    UUID PRIMARY KEY,
    user_id               UUID NOT NULL UNIQUE REFERENCES users (id),
    analyzed_languages    TEXT,
    user_adjusted_skills  TEXT,
    experience_level      TEXT,
    git_pr_confidence     INTEGER,
    updated_at            TIMESTAMPTZ NOT NULL
);

CREATE TABLE preferences (
    id                       UUID PRIMARY KEY,
    user_id                  UUID NOT NULL UNIQUE REFERENCES users (id),
    first_time_contributor   BOOLEAN NOT NULL,
    interest_areas           TEXT,
    contribution_types       TEXT,
    weekly_hours             INTEGER,
    updated_at               TIMESTAMPTZ NOT NULL
);

CREATE TABLE ide_preferences (
    id           UUID PRIMARY KEY,
    user_id      UUID NOT NULL UNIQUE REFERENCES users (id),
    primary_ide  TEXT NOT NULL
);

CREATE TABLE tutorial_progress (
    id            UUID PRIMARY KEY,
    user_id       UUID NOT NULL UNIQUE REFERENCES users (id),
    completed     BOOLEAN NOT NULL,
    skipped       BOOLEAN NOT NULL,
    current_step  TEXT,
    completed_at  TIMESTAMPTZ,
    updated_at    TIMESTAMPTZ NOT NULL
);
