-- Recommendation 도메인 (표34): Recommendation, RecommendationEvidence, GraphPath. F006/F020(보류).

CREATE TABLE recommendations (
    id             UUID PRIMARY KEY,
    user_id        UUID REFERENCES users (id),
    repository_id  UUID NOT NULL REFERENCES repositories (id),
    score          DOUBLE PRECISION NOT NULL,
    rank           INTEGER NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_recommendations_user_id ON recommendations (user_id);
CREATE INDEX idx_recommendations_repository_id ON recommendations (repository_id);

CREATE TABLE recommendation_evidences (
    id                 UUID PRIMARY KEY,
    recommendation_id  UUID NOT NULL REFERENCES recommendations (id),
    evidence_type      TEXT NOT NULL,
    source_url         TEXT,
    description        TEXT,
    rule_name          TEXT,
    captured_at        TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_recommendation_evidences_recommendation_id ON recommendation_evidences (recommendation_id);

-- F020(Phase 99 보류): Knowledge Graph 추천 경로. 테이블만 존재, 어떤 서비스도 채우지 않는다.
CREATE TABLE graph_paths (
    id                 UUID PRIMARY KEY,
    recommendation_id  UUID REFERENCES recommendations (id),
    path_json          TEXT,
    created_at         TIMESTAMPTZ NOT NULL
);
