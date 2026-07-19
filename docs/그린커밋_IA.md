# 그린 커밋(Green Commit) — MVP 정보구조(IA)

기준 기획서: 그린커밋_WEB_서비스_기획서_v1.1.docx · 기준 코드: commit e91bb73(2026-07-19) · 작성일: 2026-07-20
함께 보는 문서: `그린커밋_요구사항정의서_MVP.xlsx`, `그린커밋_화면정의서_MVP.xlsx`, `그린커밋_ERD.dbml`

---

## 범위

router.tsx 기준 실제 라우트 18개(로그인 전 3개 `/`,`/login`,`/auth/callback` + AuthGuard 보호 15개)
중, MVP 기능(F001~F016+F019)이 아닌 SCR015(알림)·SCR017(설정)은 화면 자체는 존재하지만 점선/회색으로
표시해 "지금은 장식/미구현"임을 구분했습니다.

> [정정 2026-07-20] 초판은 이 숫자를 "19개(2+17)"로 잘못 적었고, 아래 사이트맵의 전역 메뉴도
> "3개(알림/기여/설정)"로 적어 실제 TopBar.tsx의 NAV_ITEMS(미션 찾기·나의 기여·알림·설정 4개)와
> 라우트 표(18행) 양쪽 모두와 문서 내부적으로 맞지 않았다. fable 기반 재평가로 발견해 정정.

---

## 사이트맵 트리

```
/ (SCR001 Landing) — 로그인 불필요
└─ /login (SCR002) — 로그인 불필요
   └─ (GitHub OAuth) → /auth/callback — 로그인 불필요
      └─ [이하 전부 AuthGuard 보호, 로그인 필수]
         ├─ /onboarding/analysis (SCR003 GitHub 분석)
         │  └─ /onboarding/profile (SCR004 추가 프로필)
         │     ├─ [BR03: 첫 기여 = 예] /onboarding/tutorial (SCR005 튜토리얼)
         │     │  └─ /recommend/repositories (SCR006 추천)
         │     └─ [BR03: 첫 기여 = 아니오] /recommend/repositories (SCR006 추천)
         │
         ├─ /recommend/repositories (SCR006 추천)
         │  └─ /recommend/issues (SCR007 이슈 선택)
         │     └─ [POST /journeys] /journey/overview (SCR008 Journey 개요)
         │        └─ /journey/fork (SCR009 Fork·Clone 통합)
         │           └─ /journey/brief (SCR010 Repo·Issue Brief)
         │              └─ /journey/coach (SCR011 질문 Coach)
         │                 └─ /journey/ship (SCR012 Commit·PR)
         │                    └─ [PR 등록] /journey/monitoring (SCR013 Monitoring)
         │                       └─ /journey/result (SCR014 결과)
         │                          ├─ → /recommend/repositories (다음 미션)
         │                          └─ → /contributions (기록 보기)
         │
         └─ 전역 메뉴(TopBar NAV_ITEMS, 4개 — 어느 화면에서든 접근 가능)
            ├─ /recommend/repositories (SCR006, "미션 찾기") — 위 Journey 트리와 동일 화면
            ├─ /notifications (SCR015 알림) ┈┈ [범위밖, mock 표시 중]
            ├─ /contributions (SCR016 나의 기여) — History만 실데이터
            └─ /settings (SCR017 설정) ┈┈ [범위밖, 장식용]

         └─ 전역 셸(SCR000, TopBar 자체 — 위 메뉴와 별개로 모든 화면에 항상 렌더링됨)
            ├─ XP/레벨/배지/사고관여 칩 4종 ┈┈ [범위밖, 전부 하드코딩 placeholder]
            └─ 알림 벨의 미읽음 뱃지 "2" ┈┈ [범위밖][코드-스펙 괴리] 하드코딩값, SCR015 mock과 무관하게
               항상 표시됨 — 화면정의서 SCR000 참고
```

---

## 화면 전이도 (Mermaid)

```mermaid
flowchart TD
    Landing["SCR001<br/>Landing"]
    Login["SCR002<br/>로그인"]
    Callback(("OAuth<br/>콜백"))
    Analysis["SCR003<br/>GitHub 분석"]
    Profile["SCR004<br/>추가 프로필"]
    Tutorial["SCR005<br/>튜토리얼"]
    Recommend["SCR006<br/>Repository 추천"]
    IssueSel["SCR007<br/>Issue 선택"]
    Overview["SCR008<br/>Journey 개요"]
    ForkClone["SCR009<br/>Fork·Clone 통합"]
    Brief["SCR010<br/>Repo·Issue Brief"]
    Coach["SCR011<br/>질문 Coach"]
    Ship["SCR012<br/>Commit·PR"]
    Monitor["SCR013<br/>PR Monitoring"]
    Result["SCR014<br/>결과"]
    Notif["SCR015<br/>알림"]
    MyContrib["SCR016<br/>나의 기여"]
    Settings["SCR017<br/>설정"]

    Landing -->|"GitHub로 시작하기"| Login
    Landing -->|"오픈소스가 처음이에요"| Login
    Login -->|"GitHub OAuth 완료"| Callback
    Callback --> Analysis
    Analysis -->|"내 정보 보정하기"| Profile
    Profile -->|"BR03: 첫 기여 = 예"| Tutorial
    Profile -->|"BR03: 첫 기여 = 아니오"| Recommend
    Tutorial --> Recommend
    Recommend -->|"레포 선택"| IssueSel
    IssueSel -->|"POST /journeys"| Overview
    Overview -->|"Fork부터 시작할게요"| ForkClone
    ForkClone --> Brief
    Brief --> Coach
    Coach --> Ship
    Ship -->|"PR 등록"| Monitor
    Monitor --> Result
    Result -.->|"다음 미션"| Recommend
    Result -.->|"기록 보기"| MyContrib

    Recommend -.->|"전역 메뉴"| Notif
    Recommend -.->|"전역 메뉴"| MyContrib
    Recommend -.->|"전역 메뉴"| Settings

    classDef scope fill:#e3f0e8,stroke:#2e7d5b,color:#1e3a2c
    classDef outofscope fill:#f0f0f0,stroke:#999,color:#666,stroke-dasharray: 4 3
    classDef auth fill:#e6eaf6,stroke:#3e5c99,color:#324b80

    class Landing,Login,Callback auth
    class Analysis,Profile,Tutorial,Recommend,IssueSel,Overview,ForkClone,Brief,Coach,Ship,Monitor,Result,MyContrib scope
    class Notif,Settings outofscope
```

**범례**: 파란색 = 로그인 전 구간 · 초록색 = MVP로 실제 구현된 구간 · 회색 점선 = 범위밖(화면은 있으나 장식/mock)

---

## 라우트 표

| # | URL 경로 | 화면ID | 화면명 | 인증 | 진입 지점 |
|---|---|---|---|---|---|
| 1 | `/` | SCR001 | Landing | 불필요 | 최초 접속 |
| 2 | `/login` | SCR002 | GitHub 회원가입 | 불필요 | Landing 버튼 2종 |
| 3 | `/auth/callback` | — | OAuth 콜백 | 불필요 | GitHub 리다이렉트 |
| 4 | `/onboarding/analysis` | SCR003 | GitHub 분석 | 필요 | 로그인 직후 |
| 5 | `/onboarding/profile` | SCR004 | 추가 프로필 | 필요 | SCR003 |
| 6 | `/onboarding/tutorial` | SCR005 | 초보자 튜토리얼 | 필요 | SCR004(BR03=예) |
| 7 | `/recommend/repositories` | SCR006 | Repository 추천 | 필요 | SCR004(BR03=아니오)/SCR005/SCR014/전역메뉴("미션 찾기") |
| 8 | `/recommend/issues` | SCR007 | Issue 선택 | 필요 | SCR006(쿼리스트링 repositoryId 필수, BR04) |
| 9 | `/journey/overview` | SCR008 | Journey 개요 | 필요 | SCR007(Journey 생성 직후) |
| 10 | `/journey/fork` | SCR009 | Fork·Clone 통합 | 필요 | SCR008 |
| 11 | `/journey/brief` | SCR010 | Repo·Issue Brief | 필요 | SCR009 |
| 12 | `/journey/coach` | SCR011 | 질문 Coach | 필요 | SCR010 |
| 13 | `/journey/ship` | SCR012 | Commit·PR | 필요 | SCR011 |
| 14 | `/journey/monitoring` | SCR013 | PR Monitoring | 필요 | SCR012(PR 등록 직후) |
| 15 | `/journey/result` | SCR014 | 결과 | 필요 | SCR013 |
| 16 | `/notifications` | SCR015 | 알림 | 필요 | 전역 메뉴 |
| 17 | `/contributions` | SCR016 | 나의 기여 | 필요 | 전역 메뉴, SCR014 |
| 18 | `/settings` | SCR017 | 설정 | 필요 | 전역 메뉴 |

---

## 네비게이션 구조 메모

- **선형 Journey 구간(SCR006~014)**: 뒤로가기 개념이 명시적 UI로 없음 — 브라우저 뒤로가기는 되지만
  각 화면이 이전 단계 데이터를 다시 물어오는 방식이라 사실상 "이전 단계로 안전하게 돌아가기" 버튼은
  Coach 화면의 "← 접근 다시 고르기"/"← 파일 다시 찾기" 정도만 존재. [설계제안] Journey 구간 전체에
  일관된 뒤로가기 정책이 필요.
- **JourneyRail(사이드바)**: `/journey`로 시작하는 경로에서만 노출되는 보조 네비게이션. 현재는 실제
  진행 상태가 아니라 "지금 URL이 무엇이냐"만으로 하이라이트하는 정적 로직(Phase1 스캐폴드) — 실제
  JourneyStep 상태 연동은 [v1.1 설계target].
- **깊이(Depth)**: 로그인 전 1단계(Landing→Login) → 온보딩 3단계(분석→프로필→튜토리얼, 분기 있음) →
  추천~결과 9단계 선형 Journey → 상시 메뉴 4개(미션찾기/알림/기여/설정)는 깊이 1로 항상 접근 가능.
  전체적으로 "깊이보다 길이"가 긴 구조 — 트리가 아니라 파이프라인에 가까움.
- **재방문 경로가 설계에 없음** [코드-스펙 괴리][중대, 2026-07-20 추가]: OAuth 콜백(AuthCallbackPage)은
  신규/기존 사용자를 구분하지 않고 항상 SCR003(GitHub 분석)으로 보낸다. 저장된 프로필을 재조회하는
  GET이 없어 SCR004는 매번 빈 폼으로 뜨고, TutorialProgress를 저장해도(POST /tutorial/progress) 읽는
  API를 프론트가 호출하지 않아 BR03 분기가 로그인할 때마다 처음부터 다시 실행된다 — 이미 튜토리얼을
  마친 첫 기여자도 재로그인하면 튜토리얼을 또 보게 된다. 이 사이트맵엔 "재방문 시 랜딩 지점"(홈/
  대시보드) 자체가 없다는 구조적 공백이 있다. [설계제안] 콜백에서 온보딩 완료 여부로 분기해 기존
  사용자는 SCR006(추천)으로 직행시킬 것 — 요구사항정의서 REQ-003 참고.
