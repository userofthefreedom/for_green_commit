-- AI 도메인 (표34): OrchestrationRun, LocalAnalysisResult, RetrievalEvidence, AIExecutionLog.
-- F021/F022(Phase 99 보류) — 테이블만 존재, 어떤 서비스도 채우지 않는다.

CREATE TABLE orchestration_runs (
    id              UUID PRIMARY KEY,
    user_id         UUID REFERENCES users (id),
    input_summary   TEXT,
    output_summary  TEXT,
    created_at      TIMESTAMPTZ NOT NULL
);

CREATE TABLE local_analysis_results (
    id             UUID PRIMARY KEY,
    repository_id  UUID REFERENCES repositories (id),
    result_json    TEXT,
    created_at     TIMESTAMPTZ NOT NULL
);

CREATE TABLE retrieval_evidences (
    id                    UUID PRIMARY KEY,
    orchestration_run_id  UUID REFERENCES orchestration_runs (id),
    source_url            TEXT,
    snippet               TEXT,
    created_at            TIMESTAMPTZ NOT NULL
);

CREATE TABLE ai_execution_logs (
    id                    UUID PRIMARY KEY,
    orchestration_run_id  UUID REFERENCES orchestration_runs (id),
    model_name            TEXT,
    prompt_summary        TEXT,
    created_at            TIMESTAMPTZ NOT NULL
);
