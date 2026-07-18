# Green Commit — Project Rules

## 프로젝트 개요
그린 커밋(Green Commit)은 주니어 개발자에게 오픈소스 Repository·Issue를 추천하고,
질문 기반 Coach와 실제 GitHub Journey(Fork·Clone·Commit·PR·Review)를 통해
첫 오픈소스 기여를 완주하도록 돕는 AI 기반 Web 서비스다.

이 저장소는 **프로토타입 v4**다 — 기획서(`docs/그린커밋_WEB_서비스_기획서_v0.6.2.docx`)의
요구사항을 완전히 만족하는 완성형 제품은 아니지만, 폴더 구조·엔티티·API·화면 라우팅이
기획서와 1:1로 매핑되어 있어 어떤 기능이 어디서 구현되는지 코드만 보고 알 수 있어야 한다.
이전 프로토타입인 `docs/green-commit-prototype-v3.html`(클라이언트 mock)도 함께 참고한다.

## 반드시 읽어야 할 문서 (구현 전)
- `docs/그린커밋_WEB_서비스_기획서_v0.6.2.docx` — 요구사항 원본(화면 SCR001~018,
  기능 F001~024, 비즈니스 규칙 BR01~14, 도메인 엔티티, API 초안)
- `docs/green-commit-prototype-v3.html` — 이전 프로토타입의 UX/문구 참고
- `.harness/PRD.md`, `.harness/SPEC.md`, `.harness/PHASE.md` — 이번 빌드의 범위·설계·현재 Phase
  (이 파일들은 gitignore 대상이라 로컬에만 있음 — 세션 시작 시 반드시 먼저 읽을 것)

## 기술 스택 (기획서 SECTION V-1, 임의 변경 금지)
| 계층 | 기술 |
|---|---|
| Web Client | React + Vite + TypeScript (+ Nginx, 프로덕션 빌드용) |
| Core Backend | Java 21 + Spring Boot + JPA + Spring Batch |
| AI Service | Python 3.12 + FastAPI + Pydantic |
| Primary/Vector DB | PostgreSQL + pgvector |
| Cache/Queue | Redis |
| Graph DB | Neo4j |
| Object Storage | MinIO (S3 호환) |
| Runtime | Docker + Docker Compose |

## 코드 스타일·컨벤션
- 백엔드: 패키지는 기획서 도메인(Identity/Profile/Catalog/Recommendation/Journey/
  Automation/Learning/AI/PR Tracking/Experience)별로 나눈다 (`com.greencommit.backend.<domain>`).
  기획서의 기능·규칙 ID(F0xx, BR0x, UC0x)를 관련 클래스/메서드 Javadoc에 짧게 인용해
  나중에 grep으로 추적 가능하게 한다.
- 프론트엔드: 화면 하나 = `features/<domain>/` 폴더 하나, 파일명에 SCR ID를 주석으로 남긴다.
- AI 서비스: 라우터는 기획서 SECTION IV 구성요소(Orchestrator/RAG/Local GPU/Quality Gate)
  1:1로 매핑한다.

## 인증키·`.env` 관리
- 실제 시크릿(GitHub OAuth Client Secret 등)은 절대 커밋하지 않는다.
- 각 앱 폴더의 `.env.example`만 커밋하고, 실제 값은 `.env`(gitignore 대상)에 둔다.

## 워크플로 규칙
- 한 번에 하나의 Phase만 구현한다 (`.harness/PHASE.md` 기준, WIP=1).
- 구현 전에 Plan을 먼저 설명하고, 사용자 승인 후 코드를 작성한다.
- 테스트/빌드 없이 완료로 보지 않는다 — 관련 테스트와 빌드를 실행하고 결과를 보고한다.
- 기존에 동작하는 기능을 수정해야 할 때는 먼저 이유를 설명하고 승인을 받는다.
- `.harness/` 안의 문서는 git에 올라가지 않는다 — 팀 공유용 기록은 `README.md`/코드 자체로 남긴다.
- git commit/push는 사용자가 명시적으로 요청했을 때만 수행한다.

## 실행 명령어 (Phase 진행에 따라 채워짐)
- 인프라: `docker compose -f app/infra/docker-compose.yml up -d postgres redis neo4j minio`
- 백엔드: `cd app/backend && ./gradlew bootRun` (Windows: `gradlew.bat bootRun`)
- 프론트엔드: `cd app/frontend && npm install && npm run dev`
- AI 서비스: `cd app/ai && py -3.12 -m venv .venv && .venv\Scripts\activate && pip install -r requirements.txt && uvicorn app.main:app --reload`
