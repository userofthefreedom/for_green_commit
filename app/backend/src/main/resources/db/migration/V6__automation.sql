-- Automation 도메인 (표34): AutomationExecution, IDELaunchAttempt, GitOperationCheckpoint. F009/F010/F013/BR06/BR07.

CREATE TABLE automation_executions (
    id                UUID PRIMARY KEY,
    user_id           UUID NOT NULL REFERENCES users (id),
    session_id        UUID REFERENCES journey_sessions (id),
    automation_type   TEXT NOT NULL,
    status            TEXT NOT NULL,
    requested_at      TIMESTAMPTZ NOT NULL,
    completed_at      TIMESTAMPTZ,
    result_detail     TEXT
);
CREATE INDEX idx_automation_executions_user_id ON automation_executions (user_id);

CREATE TABLE ide_launch_attempts (
    id             UUID PRIMARY KEY,
    user_id        UUID NOT NULL REFERENCES users (id),
    ide            TEXT NOT NULL,
    deep_link_url  TEXT,
    launched_at    TIMESTAMPTZ NOT NULL,
    succeeded      BOOLEAN
);
CREATE INDEX idx_ide_launch_attempts_user_id ON ide_launch_attempts (user_id);

CREATE TABLE git_operation_checkpoints (
    id             UUID PRIMARY KEY,
    session_id     UUID NOT NULL REFERENCES journey_sessions (id),
    operation      TEXT NOT NULL,
    checkpoint_at  TIMESTAMPTZ NOT NULL,
    note           TEXT
);
CREATE INDEX idx_git_operation_checkpoints_session_id ON git_operation_checkpoints (session_id);
