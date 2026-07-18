/**
 * SCR012 질문 Coach 데이터 — docs/green-commit-prototype-v3.html의 `ISSUES` 객체를
 * 그대로(문구 1글자도 안 바꾸고) 옮겼다. v3의 `G(file)`/`A1(file,blocks,note)` 제너레이터도
 * 함께 이관해 단일 파일·2단계 이슈(dfns/mdl/fcc/exc/zod)의 대안 데이터를 v3와 동일하게 생성한다.
 *
 * 이슈 UUID → 트리 매칭 전략: 실제 백엔드 이슈는 UUID(meta.issueId)로 식별되지만, 이 7개
 * Q&A 트리는 v3에서 하드코딩된 문자열 키(typo/tooltip/dfns/mdl/fcc/exc/zod)로 만들어졌고
 * 백엔드-트리를 연결하는 매핑 테이블은 없다. 다만 `V11__seed_repositories.sql`이 이 7개 v3
 * 이슈의 제목을 그대로 시드 데이터로 재사용했으므로, `meta.issueTitle` 문자열을 그대로
 * 대조(TITLE_TO_KEY)해 트리를 고른다 — 이 프로토타입 범위에서 항상 정확히 맞아떨어지는
 * 가장 단순한 매칭이다. 매치가 없으면 `typo`로 폴백해 화면이 절대 깨지지 않게 한다.
 */

export interface CoachSearchOption {
  t: string
  ok: boolean
  fb: string
}

export interface CoachSearchResult {
  path: string
  line: number
  pv: string
  ok: boolean
  fb: string
}

export interface CoachSearch {
  anchor: string
  q: string
  opts: CoachSearchOption[]
  hints: string[]
  query: string
  results: CoachSearchResult[]
  pickAnchor: string
  pickQ: string
  pickHints: string[]
}

export interface CoachBlock {
  lb: string
  code: string
  ok: boolean
  why: string
}

export interface CoachFile {
  path: string
  note: string
  code: string
  blocks?: CoachBlock[]
}

export interface CoachStep {
  k: string
  anchor: string
  q: string
  opts: string[]
  ans: number
  fb: string
  whyQ?: string
  whyOpts?: string[]
  whyAns?: number
  whyFb?: string
  hints: string[]
}

export interface CoachApproach {
  id: string
  name: string
  desc: string
  effort: string
  tradeoff: string
  files: CoachFile[]
  steps: CoachStep[]
}

export interface CoachIssue {
  key: string
  repoKey: string
  title: string
  no: string
  fit: number
  labels: string[]
  coachN: number
  easy: string
  brief: { prob: string; expect: string; done: string }
  search: CoachSearch
  approaches: CoachApproach[]
}

// v3 function G(file) — 단일 파일·2단계 이슈(dfns/mdl/fcc/exc/zod)가 공유하는 표준 질문 2개.
function G(file: string): CoachStep[] {
  const f = file.split('/').pop() as string
  return [
    {
      k: '영향 범위',
      anchor: '이 변경이 다른 파일·기능에 번지는지 생각해보세요.',
      q: '이 수정의 영향 범위는 어디까지일까요?',
      opts: ['거의 없음 — ' + f + ' 안에서 끝나는 국소적 변경', '전체 빌드가 깨질 수 있음', '서버에 저장된 데이터가 바뀜'],
      ans: 0,
      fb: '맞아요. 영향 범위가 좁다는 걸 스스로 확인하면 자신 있게 고칠 수 있어요.',
      whyQ: '왜 그렇게 판단했나요? 근거를 골라보세요.',
      whyOpts: ['다른 코드가 이 파일을 import·참조하지 않아서', '파일이 작아서', '문서 종류라 원래 안 깨져서'],
      whyAns: 0,
      whyFb:
        '훌륭해요 — <b>“누가 이 파일을 가져다 쓰는가”</b>를 근거로 든 게 정확해요. 파일 크기나 종류가 아니라 <b>참조 관계</b>가 영향 범위를 결정해요.',
      hints: [
        '이 파일을 다른 파일이 import하거나 참조하나요? 그게 영향 범위를 정해요.',
        '파일이 크냐 작냐는 영향 범위와 아무 상관이 없어요.',
        '“이 파일을 지우면 무엇이 깨질까?”를 상상해보면 답이 보여요.',
      ],
    },
    {
      k: '검증',
      anchor: '이슈의 “완료 기준”을 다시 읽어보세요.',
      q: '수정이 맞다는 걸 어떻게 확인할까요?',
      opts: ['직접 렌더·미리보기로 확인하고 빌드·린트를 통과시킨다', '커밋하면 끝', '확인하지 않는다'],
      ans: 0,
      fb: '완료 기준을 체크리스트로 바꿔 하나씩 대조하는 방식이 좋아요.',
      whyQ: '왜 그렇게 판단했나요? 근거를 골라보세요.',
      whyOpts: ['이슈의 “완료 기준”에 렌더·빌드 확인이 적혀 있어서', '원래 다들 그렇게 해서', '확인이 많을수록 좋아서'],
      whyAns: 0,
      whyFb: '좋아요 — <b>이슈 본문을 근거로 든 것</b>이 핵심이에요. 관행이나 느낌이 아니라 <b>적혀 있는 사실</b>에서 출발했어요.',
      hints: [
        '이슈의 “완료 기준” 항목을 그대로 체크리스트로 옮겨보세요.',
        '“고쳤다”와 “고친 게 맞다고 확인했다”는 완전히 달라요.',
        '리뷰어가 이 PR에서 무엇을 확인할지 상상해보세요.',
      ],
    },
  ]
}

// v3 function A1(file,blocks,note) — 단일 파일 이슈용 대안 1개 생성. blocks 중 ok:true가 정답 블록.
function A1(file: string, blocks: CoachBlock[], note?: string): CoachApproach[] {
  const tgt = blocks.filter((b) => b.ok)[0]
  return [
    {
      id: 'a',
      name: '기본 접근 · 한 파일 수정',
      desc: note || '이 파일 한 곳만 고치면 되는 단순한 작업이에요.',
      effort: '쉬움',
      tradeoff: '가장 단순하고 정석 (권장)',
      files: [{ path: file, note: '여기서 수정', code: tgt.code, blocks }],
      steps: G(file),
    },
  ]
}

export const ISSUES: Record<string, CoachIssue> = {
  typo: {
    key: 'typo',
    repoKey: 'teammates',
    title: 'Typo in instructor help page',
    no: '#12603',
    fit: 94,
    labels: ['good first issue', 'docs'],
    coachN: 2,
    easy: '강사 도움말 화면에 오타(Sessios→Sessions)가 있어요. 한 글자만 고치면 되는, 첫 기여로 딱 좋은 이슈예요.',
    brief: { prob: '도움말 문구에 오타(Sessios→Sessions)', expect: '올바른 문구로 표시', done: '오타 수정 · 프론트 빌드 통과' },
    search: {
      anchor: '이슈 본문에 틀린 문자열(Sessios)이 그대로 적혀 있어요.',
      q: '이 오타가 어느 파일에 있는지 찾으려면, 레포 전체에서 무엇을 검색해야 할까요?',
      opts: [
        {
          t: '“Sessios” — 이슈에 적힌 오타 문자열 그대로',
          ok: true,
          fb: '정확해요. 오타처럼 <b>드물게 등장하는 문자열</b>로 검색하면 결과가 몇 개로 딱 좁혀져요. 실무 개발자도 트리를 뒤지지 않고 이걸 제일 먼저 해요.',
        },
        {
          t: '“help” — 화면 이름',
          ok: false,
          fb: '너무 흔해요. TEAMMATES에서 “help”는 파일명·주석·변수명까지 수백 곳에 걸려요. <b>검색어는 흔할수록 쓸모없어져요</b> — 결과가 200개면 안 찾은 것과 같아요.',
        },
        {
          t: '“component” — 파일 종류',
          ok: false,
          fb: 'Angular 프로젝트라 거의 <b>모든</b> 파일 이름에 “component”가 들어가요. 이건 오타가 아니라 <b>기술 스택</b>을 검색한 셈이라, 이슈와 아무 관련이 없어요.',
        },
      ],
      hints: [
        '이슈 본문에 적힌 “틀린 그 글자”를 그대로 써보세요.',
        '검색은 가장 <b>드물게</b> 등장하는 문자열로 하는 게 요령이에요.',
        '결과가 수백 개 나오는 검색어는 좋은 검색어가 아니에요.',
      ],
      query: 'Sessios',
      results: [
        {
          path: 'src/web/app/pages-help/help.component.html',
          line: 42,
          pv: '<p><b>Sessios</b> will be visible to students</p>',
          ok: true,
          fb: '맞아요! 이유가 중요해요 — 이 파일은 <b>화면을 그리는 템플릿(.html)</b>이고, 경로의 <code>pages-help/</code>가 이슈에 적힌 “instructor help page”와 정확히 일치해요. 사용자가 눈으로 보는 문구는 여기서 나와요.',
        },
        {
          path: 'src/test/java/teammates/e2e/cases/HelpPageE2ETest.java',
          line: 88,
          pv: 'assertTrue(page.contains("<b>Sessios</b> will be visible"));',
          ok: false,
          fb: '날카로운 선택이지만 <b>순서가 반대</b>예요. 이건 테스트 코드고, 오타가 “그대로 있는지”를 검증하고 있어요. 원본을 고치면 이 테스트가 깨지니 <b>따라서 같이 고쳐야</b> 하는 건 맞아요. 하지만 시작점은 언제나 <b>진짜 화면을 그리는 소스</b>예요 — 테스트부터 고치면 화면의 오타는 그대로 남아요.',
        },
        {
          path: 'docs/instructor-help-guide.md',
          line: 12,
          pv: 'The <b>Sessios</b> panel shows all feedback sessions.',
          ok: false,
          fb: '같은 오타가 맞지만 <b>여긴 개발자용 문서</b>예요. 이슈 제목은 “Typo in instructor help <b>page</b>” — 앱 화면을 지목했죠. 문서 오타는 별개 이슈로 올리는 게 맞아요. <b>이슈가 요청한 범위를 넘지 않는 것</b>도 실력이에요.',
        },
      ],
      pickAnchor: '이슈 제목을 다시 보세요 — “Typo in instructor help <b>page</b>”.',
      pickQ: '검색 결과 3곳 모두에 오타가 있어요. 이번 이슈에서 <b>고칠 시작점</b>은 어디일까요?',
      pickHints: [
        '세 결과의 경로를 비교해보세요 — <code>src/web</code>(앱 화면) · <code>src/test</code>(테스트) · <code>docs</code>(문서).',
        '이슈가 지목한 건 “화면”이에요. 사용자가 눈으로 보는 문구는 어디서 나올까요?',
        '테스트와 문서는 소스를 “따라오는 것”이지 시작점이 아니에요.',
      ],
    },
    approaches: [
      {
        id: 'a',
        name: '템플릿 텍스트 직접 수정',
        desc: '화면에 보이는 문구라 템플릿 한 곳만 고치면 돼요.',
        effort: '아주 쉬움',
        tradeoff: '가장 단순하고 정석 (권장)',
        files: [
          {
            path: 'src/web/app/pages-help/help.component.html',
            note: '42행 Sessios → Sessions',
            code: '<p>Sessions will be visible to students</p>',
            blocks: [
              {
                lb: '12행 · 페이지 제목',
                code: '<h1>Help for Instructors</h1>',
                ok: false,
                why: '제목엔 오타가 없어요. 검색 결과가 알려준 줄 번호는 42였는데 여긴 12행이에요 — <b>검색이 준 정보를 쓰지 않았어요</b>.',
              },
              {
                lb: '42행 · 안내 문단',
                code: '<p>Sessios will be visible to students</p>',
                ok: true,
                why: '맞아요. 검색 결과의 줄 번호(42)와 미리보기가 정확히 이 줄을 가리켰죠. <b>어디를 고칠지 “판단”한 게 아니라 검색이 알려준 걸 “확인”한 거예요</b> — 실무도 똑같아요.',
              },
              {
                lb: '58행 · 문의 버튼',
                code: '<button>Contact support</button>',
                ok: false,
                why: '버튼엔 오타가 없고 이슈와 무관해요. 검색 결과는 42행을 가리켰어요.',
              },
            ],
          },
        ],
        steps: [
          {
            k: '영향 범위',
            anchor: '이 파일은 도움말 화면 하나만 그려요.',
            q: '한 글자 고치는 이 수정의 영향 범위는 어디까지일까요?',
            opts: [
              '도움말 화면의 이 문구 하나 — 다만 오타를 검증하던 테스트는 같이 고쳐야 함',
              '백엔드 API가 바뀜',
              '모든 화면의 문구가 바뀜',
            ],
            ans: 0,
            fb: '정확해요. 아까 검색에서 본 <code>HelpPageE2ETest.java</code>를 기억한 게 핵심이에요.',
            whyQ: '왜 테스트도 함께 봐야 할까요?',
            whyOpts: ['검색 결과에서 그 테스트가 오타 문자열을 그대로 검증하고 있었으니까', '테스트는 항상 고쳐야 하니까', '빌드가 느려지니까'],
            whyAns: 0,
            whyFb:
              '훌륭해요 — <b>아까 검색으로 본 사실을 근거로 든 것</b>이 정확해요. 탐색 단계에서 얻은 정보가 여기서 이렇게 쓰여요. 이게 “검색은 파일 찾기용”이 아닌 이유예요.',
            hints: [
              '검색 결과 3개 중 소스 말고 또 “Sessios”를 품고 있던 곳이 있었죠?',
              '원본 문구를 고치면, 그 문구가 그대로 있는지 확인하던 테스트는 어떻게 될까요?',
              '영향 범위는 “이 문자열을 누가 알고 있나”로 정해져요.',
            ],
          },
          {
            k: '검증',
            anchor: '완료 기준: 문구 정상 표시 + 프론트 빌드 통과.',
            q: '수정이 맞다는 걸 어떻게 확인할까요?',
            opts: ['로컬에서 도움말 페이지를 열어 문구를 눈으로 확인 + 빌드·테스트 통과', '커밋하면 끝', '서버만 재시작'],
            ans: 0,
            fb: '완료 기준과 하나씩 대조하는 방식이 좋아요.',
            whyQ: '왜 그렇게 판단했나요? 근거를 골라보세요.',
            whyOpts: ['이슈의 “완료 기준”에 문구 표시와 빌드 통과가 적혀 있어서', '오타는 원래 눈으로 보면 되니까', '테스트가 있으면 안 봐도 되니까'],
            whyAns: 0,
            whyFb: '좋아요 — <b>이슈에 적힌 완료 기준을 그대로 근거로 든 것</b>이 핵심이에요. 추측이 아니라 사실에서 출발했어요.',
            hints: [
              '이슈의 “완료 기준” 항목을 그대로 체크리스트로 옮겨보세요.',
              '한 글자짜리 수정도 “빌드가 통과하는지”는 확인해야 해요.',
              '테스트도 고쳤다면, 그 테스트가 이제 통과하는지도 봐야겠죠.',
            ],
          },
        ],
      },
    ],
  },

  tooltip: {
    key: 'tooltip',
    repoKey: 'teammates',
    title: 'Add tooltip to feedback session table header',
    no: '#12588',
    fit: 81,
    labels: ['good first issue', 'frontend'],
    coachN: 4,
    easy: '표 헤더 용어가 어려워 사용자가 헷갈려요. 마우스를 올리면 설명이 뜨는 툴팁을 붙이는 기능인데, 방법이 여러 가지예요.',
    brief: { prob: '헤더 용어가 처음 보는 사용자에게 불명확', expect: '헤더에 호버 시 설명 툴팁 표시', done: '툴팁 표시 · 접근성(aria) · 기존 테스트 통과' },
    search: {
      anchor: '이슈 본문: 표 헤더 “Response Rate”의 뜻을 몰라 사용자가 표를 오해해요.',
      q: '툴팁을 붙일 표 헤더가 어느 파일에 있는지 찾으려면, 무엇을 검색할까요?',
      opts: [
        {
          t: '“Response Rate” — 화면에 보이는 헤더 텍스트 그대로',
          ok: true,
          fb: '정확해요. <b>화면에 보이는 글자는 템플릿에 문자열 그대로 있는 경우가 대부분</b>이라, 가장 빠르고 정확한 진입점이에요.',
        },
        {
          t: '“tooltip” — 만들려는 기능 이름',
          ok: false,
          fb: '거꾸로예요. 툴팁은 <b>아직 없어서</b> 이슈가 된 거니까 검색해도 그 표엔 안 나와요. 다만 이 검색이 <b>완전히 쓸모없진 않아요</b> — 잠시 뒤 “공용 툴팁이 이미 있나?”를 확인할 때 정확히 이 검색을 쓰게 돼요. 지금은 <b>순서가 이를</b> 뿐이에요.',
        },
        {
          t: '“table” — 표를 다루는 이슈니까',
          ok: false,
          fb: '너무 넓어요. 웹 프로젝트에서 “table”은 CSS·HTML·백엔드 어디에나 나와요. <b>이 표</b>를 콕 집어낼 단서(헤더 텍스트)가 이슈 본문에 이미 있는데 안 쓴 셈이에요.',
        },
      ],
      hints: [
        '화면에 <b>보이는 그 글자</b>를 그대로 검색해보세요.',
        '아직 없는 것(툴팁)을 검색하면 안 나와요. 이미 있는 걸 찾아야죠.',
        '이슈 본문에 이미 단서가 되는 문자열이 적혀 있어요.',
      ],
      query: 'Response Rate',
      results: [
        {
          path: 'src/web/app/components/sessions-table/sessions-table.component.html',
          line: 24,
          pv: '<th><b>Response Rate</b></th>',
          ok: true,
          fb: '맞아요! <code>&lt;th&gt;</code>는 표의 <b>헤더 셀</b> 태그라, 이슈가 말한 “table header”가 문자 그대로 여기 있죠. 게다가 경로가 <code>components/</code> 아래예요 — <b>이 표를 쓰는 모든 화면이 이 파일 하나를 공유</b>한다는 뜻이라, 여기만 고치면 전부 반영돼요.',
        },
        {
          path: 'src/web/app/pages-instructor/instructor-home-page.component.html',
          line: 60,
          pv: '<app-sessions-table [sessions]="sessions"></app-sessions-table>',
          ok: false,
          fb: '여긴 표를 <b>가져다 쓰는 쪽</b>(호출부)이에요. “Response Rate”라는 글자는 여기 없고 표 컴포넌트를 부르기만 하죠. 여기 툴팁을 붙이면 <b>이 화면에서만</b> 적용되고 같은 표를 쓰는 다른 화면엔 안 붙어요. <b>공통 부품 안에서 고쳐야 전부 반영돼요.</b>',
        },
        {
          path: 'src/web/app/types/api-output.ts',
          line: 120,
          pv: 'responseRate: number; // <b>Response Rate</b> from API',
          ok: false,
          fb: '여긴 서버에서 오는 <b>데이터의 모양(타입)</b>을 정의한 곳이에요. 숫자를 담는 그릇이지 화면에 글자를 그리는 곳이 아니죠. 이슈는 “<b>보여주는 방식</b>”의 문제지 데이터 문제가 아니에요 — <b>데이터와 표현을 구분</b>하는 게 이 선택의 핵심이에요.',
        },
      ],
      pickAnchor: '경로의 <code>components/</code> · <code>pages-instructor/</code> · <code>types/</code>가 각각 무슨 역할인지 왼쪽 트리에서 확인해보세요.',
      pickQ: '검색 결과 3곳에 “Response Rate”가 나와요. 툴팁을 붙일 <b>진입점</b>은 어디일까요?',
      pickHints: [
        '툴팁은 <b>헤더 셀 자체</b>에 붙어야 해요. 헤더 셀 태그(<code>&lt;th&gt;</code>)가 있는 곳은 어디죠?',
        '“이 표를 쓰는 화면이 여러 개라면?”을 생각해보세요. 어디를 고쳐야 전부 반영될까요?',
        '데이터를 정의한 곳과 화면을 그리는 곳은 달라요.',
      ],
    },
    approaches: [
      {
        id: 'a',
        name: '대안 A · title 속성만 추가',
        desc: '<th>에 title="설명"만 붙이는 가장 빠른 방법.',
        effort: '아주 쉬움',
        tradeoff: '빠르지만 키보드 접근성·스타일에 한계',
        files: [
          {
            path: 'src/web/app/components/sessions-table/sessions-table.component.html',
            note: '<th>에 title 추가',
            code: '<th title="응답률: 제출/전체 비율">Response Rate</th>',
            blocks: [
              {
                lb: '18행 · 표를 여는 태그',
                code: '<table class="sessions-table">',
                ok: false,
                why: '표 전체를 여는 껍데기예요. 여기 툴팁을 붙이면 <b>표 아무 데나 올려도</b> 설명이 떠요 — 이슈는 “헤더 용어”가 어렵다고 했지, 표 전체가 어렵다고 하지 않았어요.',
              },
              {
                lb: '24행 · 헤더 셀 <th>',
                code: '<th>Response Rate</th>',
                ok: true,
                why: '맞아요. 검색이 알려준 24행이고, <code>&lt;th&gt;</code>가 바로 이슈가 말한 “table header”예요. 툴팁은 <b>어려운 용어가 있는 그 자리</b>에 붙어야 사용자가 찾아요.',
              },
              {
                lb: '31행 · 본문 셀 <td>',
                code: '<td>{{ session.responseRate }}%</td>',
                ok: false,
                why: '여긴 값(숫자)을 그리는 본문 셀이에요. “85%”라는 숫자는 어렵지 않아요 — <b>어려운 건 그 숫자가 뭘 뜻하는지 알려주는 헤더</b>죠.',
              },
            ],
          },
        ],
        steps: [
          {
            k: '문제 이해',
            anchor: '이슈 본문: “용어를 몰라 표를 오해함”.',
            q: '이 이슈가 해결하려는 사용자 문제는 무엇일까요?',
            opts: ['헤더 용어의 뜻을 몰라 표를 잘못 읽음', '표가 느림', '정렬이 안 됨'],
            ans: 0,
            fb: '“UI”가 아니라 “이해”의 문제로 잡은 게 정확해요.',
            whyQ: '왜 그렇게 판단했나요? 근거를 골라보세요.',
            whyOpts: ['이슈 본문이 “용어를 몰라 오해한다”고 직접 말해서', '표는 원래 어려우니까', '툴팁 이슈는 다 그러니까'],
            whyAns: 0,
            whyFb: '좋아요 — <b>이슈 본문의 문장을 근거로 든 것</b>이 핵심이에요. 문제를 스스로 상상하지 않고 <b>적힌 대로 읽었어요</b>.',
            hints: [
              '이슈 본문에 사용자가 무엇 때문에 힘들다고 적혀 있나요?',
              '속도·정렬 얘기가 이슈에 나오나요? 안 나온다면 그건 상상이에요.',
              '“무엇을 고칠까” 전에 “무슨 문제인가”를 이슈에서 그대로 찾아보세요.',
            ],
          },
          {
            k: '한계 인식',
            anchor: 'title 속성은 마우스를 올려야만 떠요.',
            q: '이 방식(title)으로 충분한지 어떻게 검증할까요?',
            opts: ['호버로 뜨는지 확인하고, 키보드에선 안 뜬다는 한계를 PR에 적는다', '눈으로 뜨는 것만 확인', '확인 안 함'],
            ans: 0,
            fb: '한계까지 적어두면 리뷰어와 대화가 쉬워져요.',
            whyQ: '한계를 굳이 PR에 적는 게 왜 좋을까요?',
            whyOpts: ['리뷰어가 트레이드오프를 알고 판단할 수 있어서', '솔직해 보이려고', '분량을 채우려고'],
            whyAns: 0,
            whyFb:
              '훌륭해요 — <b>“내가 뭘 못 했는지 아는 것”</b>이 실력이에요. 완료 기준에 접근성(aria)이 있는데 title로는 못 채운다는 걸 알면, 리뷰어가 “대안 B로 가자”고 바로 말해줄 수 있죠.',
            hints: [
              '이슈의 완료 기준에 “접근성(aria)”이 적혀 있어요. title이 그걸 채울까요?',
              '키보드만 쓰는 사용자는 마우스를 올릴 수 없어요.',
              '모르는 걸 숨긴 PR과 한계를 밝힌 PR 중 리뷰어는 어느 쪽이 편할까요?',
            ],
          },
        ],
      },
      {
        id: 'b',
        name: '대안 B · 공용 Tooltip 컴포넌트 사용',
        desc: '이미 있는 공용 툴팁을 재사용해 접근성까지 챙기는 방법. (권장)',
        effort: '보통',
        tradeoff: '재사용·접근성 좋음 · 파일 2~3곳 수정 (권장)',
        files: [
          {
            path: 'src/web/app/components/sessions-table/sessions-table.component.html',
            note: '헤더를 <app-tooltip>으로 감싸기',
            code: '<th><app-tooltip text="응답률: 제출/전체 비율">Response Rate</app-tooltip></th>',
            blocks: [
              {
                lb: '18행 · 표를 여는 태그',
                code: '<table class="sessions-table">',
                ok: false,
                why: '표 전체를 감싸면 표 아무 데나 올려도 설명이 떠요. 이슈는 <b>헤더 용어</b>를 지목했어요.',
              },
              {
                lb: '24행 · 헤더 셀 <th>',
                code: '<th>Response Rate</th>',
                ok: true,
                why: '맞아요. 검색이 알려준 24행이고, 어려운 용어가 바로 여기 있어요. 이 <code>&lt;th&gt;</code> 안을 <code>&lt;app-tooltip&gt;</code>으로 감싸면 돼요.',
              },
              {
                lb: '31행 · 본문 셀 <td>',
                code: '<td>{{ session.responseRate }}%</td>',
                ok: false,
                why: '값을 그리는 셀이에요. 어려운 건 값이 아니라 그 값의 이름(헤더)이에요.',
              },
            ],
          },
          { path: 'src/web/app/components/sessions-table/sessions-table.component.ts', note: 'TooltipModule import 확인', code: 'imports: [ ..., TooltipModule ]' },
          {
            path: 'src/web/app/shared/tooltip/tooltip.component.ts',
            note: '기존 공용 컴포넌트 (수정 불필요 · 사용법만 확인)',
            code: '@Component({selector:"app-tooltip"}) ... // 이미 존재',
          },
        ],
        steps: [
          {
            k: '문제 이해',
            anchor: '이슈 본문: “용어를 몰라 표를 오해함”.',
            q: '이 이슈가 해결하려는 사용자 문제는 무엇일까요?',
            opts: ['헤더 용어의 뜻을 몰라 표를 잘못 읽음', '표가 느림', '정렬이 안 됨'],
            ans: 0,
            fb: '“UI”가 아니라 “이해”의 문제로 잡은 게 정확해요.',
            whyQ: '왜 그렇게 판단했나요? 근거를 골라보세요.',
            whyOpts: ['이슈 본문이 “용어를 몰라 오해한다”고 직접 말해서', '표는 원래 어려우니까', '툴팁 이슈는 다 그러니까'],
            whyAns: 0,
            whyFb: '좋아요 — <b>이슈 본문의 문장을 근거로 든 것</b>이 핵심이에요. 문제를 상상하지 않고 적힌 대로 읽었어요.',
            hints: [
              '이슈 본문에 사용자가 무엇 때문에 힘들다고 적혀 있나요?',
              '속도·정렬 얘기가 이슈에 나오나요?',
              '“무엇을 고칠까” 전에 “무슨 문제인가”를 이슈에서 찾으세요.',
            ],
          },
          {
            k: '코드 탐색',
            anchor: '아까 “tooltip” 검색이 여기서 쓰여요. 왼쪽 트리의 shared/ 폴더도 펼쳐보세요.',
            q: '툴팁을 새로 만들기 전에 무엇부터 확인할까요?',
            opts: ['shared/에 공용 Tooltip이 이미 있는지 “tooltip”으로 검색', '바로 새로 만든다', '백엔드부터 본다'],
            ans: 0,
            fb: '기존 컴포넌트 재사용을 먼저 확인한 건 실무 감각이에요.',
            whyQ: '왜 새로 만들기 전에 검색부터 할까요?',
            whyOpts: ['이미 있는 걸 또 만들면 리뷰에서 거절당하고, 있는 건 이미 검증돼 있어서', '검색이 재밌어서', '새로 만들 줄 몰라서'],
            whyAns: 0,
            whyFb:
              '정확해요 — 아까 <b>“tooltip 검색은 순서가 이르다”</b>고 했던 그 검색이 <b>지금</b> 딱 맞는 순간이에요. 같은 검색어도 <b>언제 쓰느냐</b>에 따라 쓸모가 달라져요. 이게 탐색의 감각이에요.',
            hints: [
              '이 레포는 큰 프로젝트예요. 툴팁 같은 흔한 UI가 없을 리가 있을까요?',
              '왼쪽 트리에서 shared/ 폴더를 펼쳐보세요.',
              '아까 “tooltip”을 검색하려 했던 거, 지금이 그때예요.',
            ],
          },
          {
            k: '영향·접근성',
            anchor: '이 프로젝트의 완료 기준엔 접근성(aria)이 있어요.',
            q: '공용 컴포넌트를 쓰면 무엇이 좋아지나요?',
            opts: ['키보드·스크린리더 접근성이 이미 구현돼 있어 공짜로 따라옴', '아무 차이 없음', '색만 바뀜'],
            ans: 0,
            fb: '접근성을 재사용으로 해결한 관점이 훌륭해요.',
            whyQ: '왜 공용 컴포넌트엔 접근성이 이미 들어 있을까요?',
            whyOpts: ['여러 화면이 함께 쓰는 부품이라, 한 번 제대로 만들어두고 모두가 혜택을 봐서', '우연히', 'Angular가 자동으로 넣어줘서'],
            whyAns: 0,
            whyFb:
              '좋아요 — <b>공용 부품의 존재 이유</b>를 정확히 짚었어요. 대안 A(title)로는 못 채우던 완료 기준이 여기선 저절로 채워지죠. 이게 대안 B가 권장인 이유예요.',
            hints: [
              '대안 A에서 “키보드에선 안 뜬다”는 한계를 봤죠. 그건 어떻게 해결될까요?',
              '공용 컴포넌트는 여러 사람이 오래 다듬은 결과물이에요.',
              '완료 기준의 “접근성(aria)”을 누가 채워주나요?',
            ],
          },
          {
            k: '검증',
            anchor: '완료 기준: 툴팁 표시 · 접근성(aria) · 기존 테스트 통과.',
            q: '수정이 맞다는 걸 어떻게 검증할까요?',
            opts: ['마우스 호버와 키보드 탭 둘 다 확인 + 컴포넌트 테스트 통과', '눈으로만', '빌드 없이 커밋'],
            ans: 0,
            fb: '기능·접근성·테스트를 함께 확인하는 게 좋아요.',
            whyQ: '왜 키보드까지 확인해야 할까요?',
            whyOpts: ['완료 기준에 접근성이 있고, 그게 대안 B를 고른 이유라서', '키보드가 더 빨라서', '마우스가 없을까 봐'],
            whyAns: 0,
            whyFb:
              '훌륭해요 — <b>“내가 이 대안을 고른 이유를 그대로 검증한다”</b>는 연결이 정확해요. 접근성 때문에 B를 골랐으면, 접근성이 되는지 확인해야 말이 되죠.',
            hints: [
              '완료 기준 3개를 그대로 체크리스트로 옮겨보세요.',
              '대안 B를 고른 이유가 뭐였죠? 그게 됐는지 봐야겠죠.',
              '“기존 테스트 통과”도 완료 기준에 있어요.',
            ],
          },
        ],
      },
      {
        id: 'c',
        name: '대안 C · 새 aria 디렉티브 작성',
        desc: '재사용 디렉티브를 새로 만들어 어디서나 쓰게. 이 이슈엔 다소 과함.',
        effort: '어려움',
        tradeoff: '확장성 최고지만 범위가 커져 리뷰가 오래 걸릴 수 있어요',
        files: [
          { path: 'src/web/app/shared/a11y/tooltip.directive.ts', note: '새 디렉티브 작성 (새 파일)', code: '@Directive({selector:"[appTooltip]"}) export class TooltipDirective { ... }' },
          {
            path: 'src/web/app/components/sessions-table/sessions-table.component.html',
            note: '디렉티브 적용',
            code: '<th appTooltip="응답률: 제출/전체 비율">Response Rate</th>',
            blocks: [
              { lb: '18행 · 표를 여는 태그', code: '<table class="sessions-table">', ok: false, why: '표 전체가 아니라 헤더 셀에 붙어야 해요.' },
              {
                lb: '24행 · 헤더 셀 <th>',
                code: '<th>Response Rate</th>',
                ok: true,
                why: '맞아요. 어느 대안을 고르든 <b>고칠 자리는 같은 24행</b>이에요 — 달라지는 건 “무엇으로 고치냐”죠. 이게 검색으로 진입점을 먼저 찾은 게 유용한 이유예요.',
              },
              { lb: '31행 · 본문 셀 <td>', code: '<td>{{ session.responseRate }}%</td>', ok: false, why: '값을 그리는 셀이라 이슈와 무관해요.' },
            ],
          },
        ],
        steps: [
          {
            k: '범위 판단',
            anchor: '이슈 크기와 이 대안의 크기를 견줘보세요.',
            q: '이 대안은 이 이슈에 적절한 크기일까요?',
            opts: ['과할 수 있음 — 이미 공용 컴포넌트가 있는데 새로 만드는 셈', '무조건 이게 최고', '상관없음'],
            ans: 0,
            fb: '“이슈 크기에 맞는 해법”을 고른 판단이 성숙해요.',
            whyQ: '왜 과하다고 판단했나요? 근거를 골라보세요.',
            whyOpts: ['shared/에 이미 Tooltip이 있어서 — 같은 걸 또 만드는 셈이라', '새 파일 만들기가 어려워서', '디렉티브가 나빠서'],
            whyAns: 0,
            whyFb:
              '정확해요 — <b>“기존에 뭐가 있는지”를 근거로 든 것</b>이 핵심이에요. 디렉티브가 나쁜 기술이라서가 아니라, <b>이 레포 이 이슈엔</b> 이미 더 나은 길이 있어서 과한 거예요. 기술의 좋고 나쁨이 아니라 <b>맥락</b>이 판단 기준이에요.',
            hints: [
              '대안 B에서 확인한 것 — shared/에 뭐가 이미 있었죠?',
              '“좋은 기술”과 “이 이슈에 맞는 기술”은 달라요.',
              '메인테이너 입장에서 300줄짜리 PR과 3줄짜리 PR 중 뭘 먼저 볼까요?',
            ],
          },
          {
            k: '검증',
            anchor: '큰 변경일수록 리뷰 부담이 커져요.',
            q: '그래도 이 대안을 고른다면 무엇을 조심할까요?',
            opts: ['범위가 커지니 테스트·문서를 더 챙기고 PR을 작게 쪼갠다', '아무것도', '그냥 올린다'],
            ans: 0,
            fb: '큰 변경일수록 작게 쪼개는 감각이 좋아요.',
            whyQ: '왜 크게 만들수록 더 챙겨야 할까요?',
            whyOpts: ['리뷰어가 확인할 게 많아지고, 새로 만든 건 검증된 적이 없어서', '규칙이라서', '시간이 남아서'],
            whyAns: 0,
            whyFb:
              '좋아요 — <b>새로 만든 코드엔 아무 보증이 없다</b>는 걸 짚었어요. 공용 컴포넌트는 이미 여러 화면에서 검증됐지만, 내가 오늘 만든 디렉티브는 아무도 안 써봤죠. <b>그 차이를 메우는 게 테스트·문서예요.</b>',
            hints: [
              '이 대안은 새 파일을 만들어요. 그 파일을 누가 검증했나요?',
              '리뷰어가 300줄을 읽는 것과 3줄을 읽는 것의 차이를 생각해보세요.',
              '첫 기여에서 PR이 크면 어떤 일이 벌어질까요?',
            ],
          },
        ],
      },
    ],
  },

  dfns: {
    key: 'dfns',
    repoKey: 'datefns',
    title: 'Add usage example to format() docs',
    no: '#3502',
    fit: 80,
    labels: ['good first issue', 'docs'],
    coachN: 2,
    easy: 'format() 함수 문서에 실사용 예제가 없어요. 예제 코드 한 덩이를 추가하면 되는 문서 기여예요.',
    brief: { prob: 'format() 문서에 예제 부족', expect: '실사용 예제 추가', done: '예제 추가 · 렌더 확인' },
    search: {
      anchor: '이슈는 “format() 함수의 문서”를 지목했어요. 문서와 구현은 다른 곳에 있어요.',
      q: '예제를 추가할 곳을 찾으려면 무엇을 검색할까요?',
      opts: [
        {
          t: '“format”으로 검색하되 docs/ 폴더로 범위를 좁힌다',
          ok: true,
          fb: '좋아요. “format”은 이 레포에서 너무 흔하지만, <b>폴더로 범위를 좁히면</b> 쓸 만한 검색어가 돼요. 검색어를 바꾸는 것 말고 <b>범위를 줄이는 것</b>도 검색 기술이에요.',
        },
        { t: '“example”로 검색', ok: false, fb: '예제는 <b>아직 없어서</b> 이슈가 된 거예요. 없는 걸 검색하면 못 찾죠. 게다가 다른 문서의 예제들이 잔뜩 걸려서 더 헷갈려요.' },
        { t: '“date”로 검색', ok: false, fb: 'date-fns는 <b>날짜 라이브러리</b>예요. “date”는 거의 모든 파일에 나와요 — 검색어가 레포 주제와 같으면 아무것도 못 좁혀요.' },
      ],
      hints: [
        '검색어가 흔할 땐, 검색어를 바꾸는 것보다 <b>폴더로 범위를 좁히는 게</b> 빨라요.',
        '이슈가 “문서”를 지목했어요. 문서는 어느 폴더에 있죠?',
        '아직 없는 것(예제)을 검색하면 안 나와요.',
      ],
      query: 'format  (in docs/)',
      results: [
        {
          path: 'docs/<b>format</b>.md',
          line: 1,
          pv: '# <b>format</b>(date, formatStr)',
          ok: true,
          fb: '맞아요. 이슈가 지목한 <b>format() 함수의 사용 설명 문서</b>예요. 경로가 <code>docs/</code>로 시작하는 게 결정적 단서죠.',
        },
        {
          path: 'src/<b>format</b>/index.ts',
          line: 14,
          pv: 'export function <b>format</b>(date, formatStr) {',
          ok: false,
          fb: '여긴 <b>실제 구현 코드</b>예요. 이슈는 “문서에 예제를 추가”해달라고 했지 동작을 바꿔달라고 하지 않았어요. <b>다만 읽을 가치는 커요</b> — 정확한 예제를 쓰려면 함수가 뭘 받는지 여기서 확인해야 하죠. <b>고칠 곳과 읽을 곳은 달라요.</b>',
        },
        { path: 'docs/parse.md', line: 30, pv: 'See also <b>format</b>() for the reverse.', ok: false, fb: '문서는 맞지만 <b>다른 함수(parse)의 문서</b>예요. format을 언급만 하고 있죠. 이슈는 format의 문서를 지목했어요.' },
      ],
      pickAnchor: '경로의 첫 폴더를 보세요 — <code>docs/</code>(설명) vs <code>src/</code>(구현).',
      pickQ: '검색 결과 중 예제를 추가할 곳은 어디일까요?',
      pickHints: ['<code>docs/</code>와 <code>src/</code>는 역할이 완전히 달라요.', '이슈 제목에 “docs”가 들어 있어요.', 'format의 문서인지, 다른 함수의 문서인지 파일명을 보세요.'],
    },
    approaches: A1(
      'docs/format.md',
      [
        { lb: '1행 · 문서 제목', code: '# format(date, formatStr)', ok: false, why: '제목이에요. 예제를 제목에 넣진 않죠.' },
        {
          lb: '8행 · 파라미터 설명 표',
          code: '| date | Date | 변환할 날짜 |',
          ok: false,
          why: '파라미터를 설명하는 표예요. 이슈는 <b>사용 예제</b>가 없다고 했지 파라미터 설명이 부족하다고 하지 않았어요.',
        },
        {
          lb: '24행 · Examples 섹션 (비어 있음)',
          code: '## Examples\n\n(아직 예제가 없음)',
          ok: true,
          why: '맞아요. <b>자리는 이미 있는데 내용이 비어 있어요</b> — 이슈가 말한 그대로죠. 다른 문서(parse.md)의 Examples 섹션을 흉내내면 형식도 맞출 수 있어요.',
        },
      ],
      '문서 한 곳에 예제를 추가하면 돼요.',
    ),
  },

  mdl: {
    key: 'mdl',
    repoKey: 'mdlint',
    title: 'Clarify MD013 rule description',
    no: '#4821',
    fit: 74,
    labels: ['docs'],
    coachN: 2,
    easy: 'MD013(줄 길이) 규칙 설명이 모호해요. 문서 문구를 더 명확하게 다듬는 기여예요.',
    brief: { prob: 'MD013 설명이 모호', expect: '명확한 설명으로 수정', done: '문구 수정 · 링크 확인' },
    search: {
      anchor: '이슈가 규칙 ID(MD013)를 정확히 지목했어요. 이런 ID는 검색에 아주 유리해요.',
      q: 'MD013 규칙 설명이 어디 있는지 찾으려면 무엇을 검색할까요?',
      opts: [
        {
          t: '“MD013” — 이슈가 지목한 규칙 ID 그대로',
          ok: true,
          fb: '정확해요. <b>ID·에러코드·고유명사는 최고의 검색어</b>예요 — 다른 뜻으로 쓰일 일이 없어서 결과가 정확히 관련된 것만 나와요. 이슈에 이런 게 적혀 있으면 그냥 쓰면 돼요.',
        },
        {
          t: '“line length” — 규칙이 하는 일',
          ok: false,
          fb: '뜻으로 검색하면 표현이 조금만 달라도 놓쳐요 — “line length”, “line-length”, “maximum length”… 코드가 어떤 표현을 썼는지 모르잖아요. <b>ID가 있는데 뜻으로 검색할 이유가 없어요.</b>',
        },
        { t: '“rules” — 규칙 문서니까', ok: false, fb: 'markdownlint는 <b>규칙 검사 도구 그 자체</b>예요. “rules”는 거의 모든 파일에 나와요 — 레포 주제와 같은 단어는 검색어로 못 써요.' },
      ],
      hints: ['이슈 제목에 이미 좋은 검색어가 들어 있어요.', 'ID나 에러코드처럼 <b>고유한 문자열</b>이 최고의 검색어예요.', '뜻으로 검색하면 코드가 쓴 표현과 안 맞을 수 있어요.'],
      query: 'MD013',
      results: [
        {
          path: 'doc/Rules.md',
          line: 210,
          pv: '## <b>MD013</b> - Line length',
          ok: true,
          fb: '맞아요. 경로가 <code>doc/</code>이고 파일명이 <code>Rules.md</code> — <b>규칙을 설명하는 문서</b>죠. 이슈는 “설명이 모호하다”고 했으니 설명이 있는 곳을 고쳐야 해요.',
        },
        {
          path: 'lib/md013.js',
          line: 3,
          pv: 'module.exports = { names: ["<b>MD013</b>", "line-length"],',
          ok: false,
          fb: '여긴 규칙의 <b>실제 검사 로직</b>이에요. 이슈는 “설명 문구가 모호하다”지 “검사가 틀렸다”가 아니에요. <b>문서 이슈에 코드를 고치면</b> 리뷰어가 “왜 동작을 바꿨죠?”라고 물어요 — 범위를 넘은 거죠.',
        },
        {
          path: 'test/rules.test.js',
          line: 88,
          pv: 'test("<b>MD013</b> flags long lines", () => {',
          ok: false,
          fb: '테스트예요. 문구를 다듬는 것뿐이니 동작이 안 바뀌고, 그래서 이 테스트도 안 건드려도 돼요. <b>“고칠 게 없다”를 확인한 것도 의미 있는 확인이에요.</b>',
        },
      ],
      pickAnchor: '경로를 보세요 — <code>doc/</code>(설명) · <code>lib/</code>(동작) · <code>test/</code>(검증).',
      pickQ: '검색 결과 중 “설명이 모호하다”는 이슈를 고칠 곳은 어디일까요?',
      pickHints: ['<code>doc/</code>와 <code>lib/</code>는 역할이 정반대예요 — 설명 vs 동작.', '이슈가 “설명”을 문제 삼았어요. 동작이 아니라요.', '문서 이슈에서 코드를 고치면 범위를 넘은 거예요.'],
    },
    approaches: A1(
      'doc/Rules.md',
      [
        { lb: '200행 · MD012 설명', code: '## MD012 - Multiple consecutive blank lines', ok: false, why: '바로 앞 규칙이에요. 번호가 하나 다르죠 — 검색 결과는 210행을 가리켰어요.' },
        {
          lb: '210행 · MD013 설명',
          code: '## MD013 - Line length\n\nThis rule is triggered when there are lines\nthat are longer than the configured length.',
          ok: true,
          why: '맞아요. 검색이 알려준 210행이고, 이슈가 “모호하다”고 한 그 설명이에요. 기본값이 몇인지, 어떤 줄이 예외인지 안 적혀 있죠 — 그게 모호한 지점이에요.',
        },
        { lb: '230행 · MD014 설명', code: '## MD014 - Dollar signs used before commands', ok: false, why: '다음 규칙이에요. 이슈와 무관해요.' },
      ],
      '규칙 문서 한 곳의 문구만 다듬으면 돼요.',
    ),
  },

  fcc: {
    key: 'fcc',
    repoKey: 'fcc',
    title: 'Translate lesson intro to Korean',
    no: '#55210',
    fit: 76,
    labels: ['docs', '번역'],
    coachN: 2,
    easy: '영어 강의 소개글을 한국어로 번역하는 기여예요. 영어 문장을 자연스러운 한국어로 옮기면 돼요.',
    brief: { prob: '한국어 번역 부재', expect: '자연스러운 한국어 번역', done: '번역 · 용어 일관성' },
    search: {
      anchor: '이 이슈는 파일을 고치는 게 아니라 <b>새로 만드는</b> 이슈예요. 그래도 원문을 먼저 찾아야 해요.',
      q: '번역을 시작하려면 무엇부터 찾아야 할까요?',
      opts: [
        {
          t: '원문 파일(intro.english.md)을 찾아 korean/ 폴더의 구조와 견준다',
          ok: true,
          fb: '정확해요. 번역 이슈의 진입점은 <b>원문</b>이에요. freeCodeCamp는 <code>english/</code>와 <code>korean/</code>이 <b>같은 경로·같은 파일명</b>을 쓰기 때문에, 원문 위치를 알면 새 파일을 어디에 둘지도 자동으로 정해져요.',
        },
        {
          t: '“한국어”로 검색',
          ok: false,
          fb: '번역이 <b>아직 없어서</b> 이슈가 된 거예요. 없는 걸 검색하면 안 나오죠. 새로 만드는 이슈에선 <b>“만들 것”이 아니라 “본뜰 것”을 검색</b>해야 해요.',
        },
        {
          t: '“translate”로 검색',
          ok: false,
          fb: '기여 가이드 문서만 잔뜩 나와요. <b>완전히 헛수고는 아니에요</b> — 번역 규칙 문서는 읽을 가치가 있죠. 하지만 그건 “어떻게 번역하나”지 “무엇을 번역하나”가 아니에요.',
        },
      ],
      hints: ['새로 만드는 이슈에선 <b>비슷한 기존 파일</b>을 찾아 본뜨는 게 정석이에요.', '아직 없는 한국어 번역을 검색해봐야 안 나와요.', '원문이 어디 있는지 알면, 번역본을 어디 둘지도 알 수 있어요.'],
      query: 'intro.english.md',
      results: [
        {
          path: 'curriculum/challenges/english/<b>intro.english.md</b>',
          line: 1,
          pv: '---\nid: 5d822fd413a79914d39e99cd\ntitle: Introduction to Basic HTML\n---',
          ok: true,
          fb: '맞아요. 이게 <b>번역할 원문</b>이에요. 경로를 잘 보세요 — <code>challenges/<b>english</b>/</code>. 번역본은 <code>challenges/<b>korean</b>/intro.korean.md</code>에 <b>똑같은 구조로</b> 만들면 돼요. <b>기존 파일의 경로 규칙이 새 파일의 위치를 알려줬어요.</b>',
        },
        {
          path: 'docs/how-to-translate.md',
          line: 5,
          pv: 'Copy the <b>intro.english.md</b> file into the target language folder.',
          ok: false,
          fb: '이건 <b>번역 방법 안내 문서</b>예요 — 고칠 곳은 아니지만 <b>꼭 읽어야 할 곳</b>이죠. 실제로 이 문서가 “원문을 언어 폴더로 복사하라”고 알려주고 있어요. <b>큰 프로젝트엔 이런 가이드가 거의 항상 있어요.</b> 찾아 읽는 습관이 실력이에요.',
        },
        {
          path: 'curriculum/challenges/korean/',
          line: 0,
          pv: '(빈 폴더 — 아직 번역 없음)',
          ok: false,
          fb: '번역본이 <b>들어갈 자리</b>가 맞아요. 하지만 지금은 비어 있어서 여기서 시작할 수가 없어요 — <b>원문을 먼저 읽어야</b> 번역하죠. 목적지는 알지만 출발점이 아니에요.',
        },
      ],
      pickAnchor: '경로에서 <code>english/</code>와 <code>korean/</code>이 어떻게 짝을 이루는지 보세요.',
      pickQ: '번역을 시작할 <b>출발점</b>은 어디일까요?',
      pickHints: ['번역하려면 무엇부터 읽어야 하나요?', '목적지(korean/)와 출발점(원문)은 달라요.', '가이드 문서는 “어떻게”를 알려주지 “무엇을”은 아니에요.'],
    },
    approaches: A1(
      'curriculum/challenges/korean/intro.korean.md',
      [
        {
          lb: '1–2행 · frontmatter의 id',
          code: '---\nid: 5d822fd413a79914d39e99cd',
          ok: false,
          why: '⚠️ 여긴 <b>절대 건드리면 안 돼요</b>. 이 id는 시스템이 원문과 번역본을 짝지을 때 쓰는 값이라, 바꾸거나 번역하면 <b>강의가 통째로 깨져요</b>. 번역 기여에서 가장 흔한 실수예요.',
        },
        {
          lb: '3행 · frontmatter의 title',
          code: 'title: Introduction to Basic HTML',
          ok: true,
          why: '맞아요. 이건 <b>화면에 보이는 제목</b>이라 번역 대상이에요. 같은 frontmatter 안에 있어도 <code>id</code>는 시스템용, <code>title</code>은 사용자용 — <b>“보이는 것만 번역한다”</b>가 기준이에요. 본문도 물론 번역하고요.',
        },
        {
          lb: '10행 · 코드 예제 블록',
          code: '```html\n<h1>Hello World</h1>\n```',
          ok: false,
          why: '<b>코드는 번역하지 않아요.</b> <code>&lt;h1&gt;</code>을 한국어로 바꾸면 동작하지 않죠. 코드 블록 밖의 설명만 번역해요.',
        },
      ],
      '원문을 본떠 한국어 파일을 새로 만들면 돼요.',
    ),
  },

  exc: {
    key: 'exc',
    repoKey: 'excalidraw',
    title: 'Add aria-label to toolbar button',
    no: '#7841',
    fit: 70,
    labels: ['frontend', 'a11y'],
    coachN: 2,
    easy: '툴바 버튼에 스크린리더용 설명(aria-label)이 빠졌어요. 접근성 라벨을 추가하는 작은 프론트 기여예요.',
    brief: { prob: '버튼에 aria-label 없음', expect: '접근성 라벨 추가', done: 'aria-label · 테스트 통과' },
    search: {
      anchor: '같은 레포의 다른 버튼들은 이미 aria-label이 있을지도 몰라요.',
      q: '이 접근성 라벨을 어떻게 추가할지 알아내려면, 무엇을 검색할까요?',
      opts: [
        {
          t: '“aria-label” — 다른 버튼은 이미 어떻게 하고 있는지 확인',
          ok: true,
          fb: '훌륭해요. 이건 <b>고칠 곳을 찾는 검색이 아니라 “본보기”를 찾는 검색</b>이에요. 오픈소스 기여의 핵심 기술이죠 — <b>이 레포가 이미 하고 있는 방식을 찾아 똑같이 따라 하면</b>, 리뷰어가 지적할 게 없어요.',
        },
        { t: '“button” — 버튼 이슈니까', ok: false, fb: 'React 프로젝트에서 “button”은 수백 곳에 나와요. 게다가 <b>어느 버튼</b>인지 못 좁히죠. 이슈는 툴바 버튼을 지목했어요.' },
        {
          t: '“accessibility” — 접근성 이슈니까',
          ok: false,
          fb: '문서와 이슈 템플릿만 나와요. 코드는 <code>accessibility</code>라는 단어 대신 <code>aria-*</code> 속성을 써요 — <b>개념어가 아니라 코드에 실제로 적히는 문자열</b>로 검색해야 해요.',
        },
      ],
      hints: [
        '오픈소스에선 “새로 발명”보다 <b>“이미 하는 방식 따라 하기”</b>가 정답일 때가 많아요.',
        '코드에 실제로 적히는 문자열은 “accessibility”가 아니라 무엇일까요?',
        '같은 레포의 다른 버튼들은 이 문제를 어떻게 풀었을까요?',
      ],
      query: 'aria-label',
      results: [
        {
          path: 'src/components/ToolButton.tsx',
          line: 22,
          pv: '<button className="ToolButton" onClick={onChange}>',
          ok: true,
          fb: '맞아요 — 그리고 <b>여기엔 aria-label이 없죠</b>. 검색 결과에 “있어야 할 게 없는 곳”으로 나타난 거예요. 파일명 <code>ToolButton</code>이 이슈의 “toolbar button”과 정확히 맞고요.',
        },
        {
          path: 'src/components/Toolbar.tsx',
          line: 40,
          pv: '<button <b>aria-label</b>="Zoom in" onClick={zoomIn}>',
          ok: false,
          fb: '여긴 <b>이미 제대로 돼 있어요</b> — 고칠 필요가 없죠. 하지만 이게 이 검색의 <b>진짜 수확</b>이에요: 이 레포가 aria-label을 <b>어떤 형식으로 쓰는지</b> 보여주는 본보기잖아요. 내 코드도 이 모양을 그대로 따라 쓰면 돼요. <b>“고칠 곳”은 아니지만 “배울 곳”이에요.</b>',
        },
        {
          path: 'src/locales/en.json',
          line: 12,
          pv: '"toolBar.rectangle": "Rectangle"',
          ok: false,
          fb: '문구를 모아둔 <b>번역 파일</b>이에요. 라벨 <i>글자</i>는 결국 여기서 오지만, <code>aria-label</code> 속성을 <b>버튼에 붙이는</b> 일은 컴포넌트에서 해요. <b>“문구를 어디 저장하나”와 “속성을 어디에 붙이나”는 다른 질문이에요.</b>',
        },
      ],
      pickAnchor: '검색 결과 중 <b>aria-label이 없는</b> 곳을 찾아보세요.',
      pickQ: '검색 결과 중 aria-label을 <b>추가해야 할</b> 곳은 어디일까요?',
      pickHints: [
        '이슈는 “aria-label이 빠졌다”고 했어요. 결과 중 없는 곳은 어디죠?',
        '이미 aria-label이 있는 곳은 고칠 필요가 없어요 — 대신 본보기가 되죠.',
        '파일명이 이슈의 “toolbar button”과 가장 가까운 건 어느 쪽인가요?',
      ],
    },
    approaches: A1(
      'src/components/ToolButton.tsx',
      [
        {
          lb: '14행 · props 타입 정의',
          code: 'type Props = {\n  icon: ReactNode;\n  onChange: () => void;\n};',
          ok: false,
          why: '라벨을 <b>prop으로 받도록</b> 만든다면 여기도 함께 보게 될 곳이에요 — 완전히 무관하진 않죠. 하지만 <code>aria-label</code>이 실제로 <b>붙는 자리</b>는 여기가 아니에요. 타입은 “무엇을 받을지”를 적는 곳이지 “화면에 뭘 그릴지”를 적는 곳이 아니에요.',
        },
        {
          lb: '22행 · button 태그',
          code: '<button className="ToolButton" onClick={onChange}>\n  {icon}\n</button>',
          ok: true,
          why: '맞아요. 검색이 알려준 22행이고, <code>aria-label</code>은 <b>HTML 속성</b>이라 태그에 직접 붙어요. 아까 본 <code>Toolbar.tsx:40</code>의 모양(<code>&lt;button aria-label="…"&gt;</code>)을 그대로 흉내내면 돼요.',
        },
        { lb: '30행 · export', code: 'export default ToolButton;', ok: false, why: '파일을 밖에서 쓸 수 있게 내보내는 줄이에요. 화면과 무관해요.' },
      ],
      '컴포넌트 한 곳에 접근성 속성을 추가하면 돼요.',
    ),
  },

  zod: {
    key: 'zod',
    repoKey: 'zod',
    title: 'Add example for z.union() in README',
    no: '#3120',
    fit: 72,
    labels: ['docs', 'types'],
    coachN: 2,
    easy: 'z.union() 사용 예제가 문서에 없어요. 예제 하나 추가하는 문서 기여예요.',
    brief: { prob: 'z.union() 예제 없음', expect: '예제 추가', done: '예제 추가 · 렌더 확인' },
    search: {
      anchor: 'z.union()은 이미 동작해요 — 문서에 예제만 없는 거예요.',
      q: 'z.union() 예제를 넣을 곳을 찾으려면 무엇을 검색할까요?',
      opts: [
        {
          t: '“z.union” — 구현은 어디 있고 문서엔 있는지 한 번에 확인',
          ok: true,
          fb: '좋아요. 이 검색은 <b>두 가지를 한 번에</b> 알려줘요 — 문서에 정말 없는지(이슈가 맞는지), 그리고 구현이 어디 있는지(예제를 쓰려면 읽어야 하니까). <b>이슈가 사실인지 확인하는 것</b>부터가 기여의 시작이에요.',
        },
        { t: '“example”로 검색', ok: false, fb: 'zod의 README는 <b>예제로 가득한 문서</b>예요. “example”은 수십 곳에 걸리지만, 정작 <b>z.union의</b> 예제가 없다는 사실은 못 알려줘요.' },
        {
          t: '“README”로 검색',
          ok: false,
          fb: '파일 <b>이름</b>을 검색한 거예요. 검색은 파일 <b>내용</b>을 뒤지는 도구예요 — README를 열고 싶으면 그냥 열면 되죠. <b>찾을 게 정해졌으면 검색이 아니라 이동이에요.</b>',
        },
      ],
      hints: ['이슈가 “예제가 없다”고 했어요. 정말 없는지부터 확인해볼 수 있어요.', '기능 이름 자체를 검색하면 구현·문서·테스트가 한 번에 보여요.', '예제를 쓰려면 그 기능이 어떻게 동작하는지 알아야겠죠.'],
      query: 'z.union',
      results: [
        {
          path: 'README.md',
          line: 412,
          pv: '### z.object()\n  ...\n### z.enum()      ← 이 사이에 <b>z.union</b> 섹션이 없음',
          ok: true,
          fb: '맞아요 — 그리고 <b>이슈가 사실이었다는 걸 직접 확인한 셈</b>이에요. z.object()와 z.enum() 사이, 딱 여기가 z.union 섹션이 들어갈 자리죠. <b>주변 섹션들의 형식을 그대로 흉내내면</b> 문서 톤도 자연스럽게 맞아요.',
        },
        {
          path: 'src/types.ts',
          line: 840,
          pv: 'export class Zod<b>Union</b> extends ZodType {',
          ok: false,
          fb: '<b>구현 코드</b>예요. 이슈는 문서를 요청했지 동작 변경이 아니에요. <b>하지만 반드시 읽어야 할 곳이에요</b> — 여기서 union이 뭘 받고 뭘 뱉는지 봐야 <b>틀리지 않은 예제</b>를 쓸 수 있죠. 문서 기여라고 코드를 안 읽으면 잘못된 예제를 쓰게 돼요.',
        },
        {
          path: 'src/__tests__/union.test.ts',
          line: 5,
          pv: 'test("<b>union</b> accepts either type", () => {',
          ok: false,
          fb: '테스트예요 — 고칠 곳은 아니지만 <b>숨은 보물이에요</b>. 테스트는 사실상 <b>동작하는 사용 예제의 모음</b>이거든요. 이미 검증된 코드라 여기 있는 걸 참고해 예제를 쓰면 <b>확실히 맞는 예제</b>가 나와요. 문서 기여자가 테스트를 먼저 읽는 이유예요.',
        },
      ],
      pickAnchor: '이슈는 “문서에 예제 추가”예요. 문서 파일은 어느 것일까요?',
      pickQ: '검색 결과 중 예제를 <b>추가할</b> 곳은 어디일까요?',
      pickHints: ['셋 중 사용자가 읽는 <b>문서</b>는 어느 것인가요?', '구현과 테스트는 “읽을 곳”이지 “고칠 곳”이 아니에요.', '이슈 제목에 “in README”가 적혀 있어요.'],
    },
    approaches: A1(
      'README.md',
      [
        { lb: '400행 · z.string() 섹션', code: '### z.string()\n```ts\nz.string().min(5)\n```', ok: false, why: '다른 기능의 섹션이에요. 예제 <b>형식</b>은 여기서 본떠오면 좋지만, z.union 예제를 여기 넣으면 안 되죠.' },
        {
          lb: '412행 · z.object()와 z.enum() 사이',
          code: '### z.object()\n...\n\n### z.enum()',
          ok: true,
          why: '맞아요. 검색이 알려준 412행이고, <b>비어 있는 그 자리</b>예요. 게다가 zod 문서는 기능들을 <b>비슷한 것끼리 묶어</b> 배치해요 — union은 object·enum과 같은 “타입 조합” 무리라 이 자리가 자연스러워요. <b>문서에도 구조가 있어요.</b>',
        },
        { lb: '500행 · 설치 안내', code: '## Installation\n```sh\nnpm install zod\n```', ok: false, why: '설치 안내예요. 기능 예제가 들어갈 곳이 아니에요.' },
      ],
      'README 한 곳에 예제 섹션을 추가하면 돼요.',
    ),
  },
}

/** v3 BLOCK_HINTS — Phase 3 '어디를 고칠까' 블록 선택 단계의 공용 힌트(모든 이슈 공통). */
export const BLOCK_HINTS = [
  '검색 결과가 알려준 <b>줄 번호</b>를 떠올려보세요 — 블록 라벨에도 행 번호가 적혀 있어요.',
  '이건 “판단”이 아니라 “확인”이에요. 검색이 이미 답을 줬으니 견주기만 하면 돼요.',
  '이슈가 지목한 것과 각 블록이 하는 일을 하나씩 대조해보세요.',
]

/** v3 QPRAISE — '🙋 질문하기'로 자유 질문을 남길 때마다 순환 노출되는 칭찬 문구. */
export const QPRAISE = [
  '좋은 질문이에요! 모르는 걸 <b>질문으로 바꾸는 것</b>이 실력의 핵심이에요. 정답을 받기 전에 질문을 먼저 만든 건, 고득점 학습자들의 공통 패턴이에요.',
  '훌륭해요. <b>스스로 궁금증을 언어로 꺼내는 것</b>이 메타인지예요 — AI가 대신 못 해주는 사고죠.',
  '이 질문, 그냥 넘어갔으면 못 배웠을 거예요. <b>질문을 만든 것 자체가 오늘의 성장</b>이에요.',
  '좋은 질문은 좋은 PR로 이어져요. 확신 없는 부분을 질문으로 남기면 리뷰어도 편해해요.',
]

// V11__seed_repositories.sql에 그대로 재사용된 v3 이슈 제목 → ISSUES 키.
const TITLE_TO_KEY: Record<string, string> = {
  'Typo in instructor help page': 'typo',
  'Add tooltip to feedback session table header': 'tooltip',
  'Add usage example to format() docs': 'dfns',
  'Clarify MD013 rule description': 'mdl',
  'Translate lesson intro to Korean': 'fcc',
  'Add aria-label to toolbar button': 'exc',
  'Add example for z.union() in README': 'zod',
}

/** meta.issueTitle을 시드 데이터 제목과 대조해 코치 트리를 고른다. 매치 없으면 typo로 폴백. */
export function resolveCoachIssue(issueTitle: string | undefined | null): CoachIssue {
  const key = (issueTitle && TITLE_TO_KEY[issueTitle]) || 'typo'
  return ISSUES[key]
}
