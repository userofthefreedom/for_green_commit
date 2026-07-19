# Green Commit (그린 커밋) — Prototype v4

주니어 개발자에게 오픈소스 Repository·Issue를 추천하고, 근거 기반 질문 Coach와 실제
GitHub Journey(Fork → Clone → Repo/Issue 분석 → 학습 → Commit/PR → 상태 추적)를 통해
첫 오픈소스 기여를 완주하도록 돕는 AI Web 서비스입니다.

이 저장소는 **prototype v3**(클라이언트 사이드 mock, `docs/green-commit-prototype-v3.html`)의
후속으로, 기획서(`docs/그린커밋_WEB_서비스_기획서_v0.6.2.docx`) 요구사항을 실제 애플리케이션
구조(엔티티·API·화면 라우팅)로 구체화한 프로토타입 v4입니다. 완성형 제품은 아니지만, 어떤
기능이 어느 파일에서 어떻게 구현될지 저장소 구조만으로 파악할 수 있도록 만들었습니다.

## 문서
- [`docs/그린커밋_WEB_서비스_기획서_v0.6.2.docx`](docs/그린커밋_WEB_서비스_기획서_v0.6.2.docx) — 기획서 원본
- [`docs/green-commit-prototype-v3.html`](docs/green-commit-prototype-v3.html) — 이전 프로토타입(mock)
- [`docs/setup-guide.txt`](docs/setup-guide.txt) — 로컬 개발 환경(Java 21·Python 3.12 등) 설치 가이드
- [`docs/github-oauth-app-guide.txt`](docs/github-oauth-app-guide.txt) — GitHub OAuth App 발급 가이드 (BR01 로그인 게이트에 필요)
- [`CLAUDE.md`](CLAUDE.md) — 프로젝트 공통 규칙 / 코드 컨벤션

## 저장소 구조
```
app/
├── frontend/   # React + Vite + TypeScript — 화면 SCR001~018
├── backend/    # Java 21 + Spring Boot — 도메인별 패키지, REST API, JPA
├── ai/         # Python 3.12 + FastAPI — Orchestrator/RAG/Quality Gate
└── infra/      # docker-compose.yml — Postgres/pgvector, Redis, Neo4j, MinIO
```

## 기술 스택
React·Vite·TypeScript / Java 21·Spring Boot·JPA·Spring Batch / Python 3.12·FastAPI /
PostgreSQL+pgvector / Redis / Neo4j / MinIO / Docker

## 시작하기
1. 로컬에 Docker, Node.js, Java 21(JDK), Python 3.12가 설치되어 있어야 합니다.
2. 인프라(DB 등) 기동:
   ```bash
   docker compose -f app/infra/docker-compose.yml up -d postgres redis neo4j minio
   ```
3. 백엔드 실행:
   ```bash
   cd app/backend && ./gradlew bootRun
   ```
4. AI 서비스 실행:
   ```bash
   cd app/ai && py -3.12 -m venv .venv && .venv/Scripts/activate && pip install -r requirements.txt && uvicorn app.main:app --reload
   ```
5. 프론트엔드 실행:
   ```bash
   cd app/frontend && npm install && npm run dev
   ```
6. 각 앱 폴더의 `.env.example`을 참고해 `.env`를 만들고, GitHub OAuth App Client ID/Secret 등
   실제 값을 채웁니다. (`.env`는 커밋되지 않습니다.)

## 현재 진행 상태
**MVP E2E 완성.** 회원가입(GitHub OAuth 실로그인) → 추가 프로필/튜토리얼 → Repository·Issue
추천/선택 → Journey(Fork·Clone·Repo/Issue Brief·질문 Coach) → Commit·PR 등록 → PR 상태 1회
조회 → 나의 기여 History까지 전 구간이 실제로 동작합니다.

기획서 표21 기준 "필수 확장"·"선택" 범위(PR 상태 **주기적** 추적, 알림 보관함, Knowledge
Graph, Orchestrator 실연동, Local GPU 실분석, 게임화 실데이터, Repository 확장 배치,
Observability 등)는 이번 라운드에서 의도적으로 구현하지 않았습니다 — 실제 로직 없이 엔티티/
화면 뼈대만 존재합니다(코드 주석에 `Phase 99` 또는 `팀 확인 후 구현`으로 표시되어 있어요).
어떤 항목을 다음에 만들지는 팀 리뷰 후 결정합니다.
