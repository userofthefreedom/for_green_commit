-- Learning 도메인 (표34): Question, Answer, Hint, ContributionPlan, GrowthEvidence. F011/F012/BR08/BR09.

CREATE TABLE questions (
    id            UUID PRIMARY KEY,
    session_id    UUID NOT NULL REFERENCES journey_sessions (id),
    question_text TEXT NOT NULL,
    depth         INTEGER NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_questions_session_id ON questions (session_id);

CREATE TABLE answers (
    id           UUID PRIMARY KEY,
    question_id  UUID NOT NULL REFERENCES questions (id),
    answer_text  TEXT NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_answers_question_id ON answers (question_id);

CREATE TABLE hints (
    id           UUID PRIMARY KEY,
    question_id  UUID NOT NULL REFERENCES questions (id),
    hint_text    TEXT NOT NULL,
    level        INTEGER NOT NULL
);
CREATE INDEX idx_hints_question_id ON hints (question_id);

CREATE TABLE contribution_plans (
    id          UUID PRIMARY KEY,
    session_id  UUID NOT NULL REFERENCES journey_sessions (id),
    plan_text   TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_contribution_plans_session_id ON contribution_plans (session_id);

CREATE TABLE growth_evidences (
    id             UUID PRIMARY KEY,
    user_id        UUID NOT NULL REFERENCES users (id),
    session_id     UUID REFERENCES journey_sessions (id),
    evidence_text  TEXT NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_growth_evidences_user_id ON growth_evidences (user_id);
