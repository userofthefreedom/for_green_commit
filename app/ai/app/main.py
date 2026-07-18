"""Green Commit AI Service — Orchestrator / RAG / Local GPU Model / Quality Gate.

기획서 SECTION IV 구성요소와 라우터 1:1 매핑:
  orchestration.py       -> Orchestrator LLM
  retrieval.py            -> RAG / Vector
  repository_analysis.py -> Local GPU Model
  quality_gate.py         -> Quality Gate
"""
from fastapi import FastAPI

from app.routers import orchestration, quality_gate, repository_analysis, retrieval

app = FastAPI(
    title="Green Commit AI Service",
    description="Orchestrator LLM / RAG / Local GPU Model / Quality Gate",
    version="0.1.0",
)

app.include_router(orchestration.router)
app.include_router(retrieval.router)
app.include_router(repository_analysis.router)
app.include_router(quality_gate.router)


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "green-commit-ai"}
