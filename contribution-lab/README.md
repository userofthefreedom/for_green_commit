# Contribution Lab

Contribution Lab은 오픈소스 기여가 처음인 개발자가 작은 변경부터 Pull Request까지 연습할 수 있는 공간입니다.

이 폴더의 예제는 실제 Green Commit 운영 서비스와 연결되지 않으며, 교육 및 Pull Request 상태 추적 테스트 목적으로만 사용합니다.

## 시작하기

처음 기여한다면 다음 순서로 진행해 주세요.

1. `good first issue` 또는 `beginner` 라벨이 붙은 Issue를 선택합니다.
2. Issue에 작업 참여 의사를 댓글로 남깁니다.
3. 저장소를 Fork합니다.
4. Issue에서 지정한 Branch를 만듭니다.
5. 지정된 파일만 수정합니다.
6. 안내된 테스트를 실행합니다.
7. Commit하고 Pull Request를 생성합니다.

전체 기여 절차는 [`../CONTRIBUTING.md`](../CONTRIBUTING.md)를 참고하세요.

## 폴더 구조

```text
contribution-lab/
├── README.md
├── contributors.json
├── docs/
│   └── glossary.md
├── javascript/
│   ├── string-utils.js
│   └── string-utils.test.js
└── python/
    ├── text_utils.py
    └── test_text_utils.py
```

## 기여 가능한 작업

### 기여자 목록

`contributors.json`에 공개 가능한 GitHub 사용자명과 기여 유형을 추가합니다.

실명, 이메일, 전화번호 등 개인정보는 작성하지 마세요.

### 용어 설명

`docs/glossary.md`에 GitHub와 오픈소스 관련 용어를 초보자가 이해하기 쉬운 표현으로 추가합니다.

### JavaScript

`javascript/string-utils.js`에 간단한 문자열 함수를 추가하거나 테스트를 개선합니다.

### Python

`python/text_utils.py`에 간단한 문자열 함수를 추가하거나 테스트를 개선합니다.

## 테스트 실행

### JSON 문법 확인

저장소 루트에서 실행합니다.

```bash
python -m json.tool contribution-lab/contributors.json
```

JSON 내용이 오류 없이 출력되면 정상입니다.

### JavaScript 테스트

저장소 루트에서 실행합니다.

```bash
node contribution-lab/javascript/string-utils.test.js
```

정상 결과:

```text
JavaScript tests passed.
```

### Python 테스트

다음과 같이 실행합니다.

```bash
cd contribution-lab/python
python -m unittest test_text_utils.py
cd ../..
```

정상 결과에는 `OK`가 표시됩니다.

## Pull Request 테스트 시나리오

일부 Issue는 Green Commit의 Pull Request 상태 추적 기능을 검증하기 위해 사용합니다.

Issue에 따라 Pull Request가 다음과 같이 처리될 수 있습니다.

* 검토 후 Merge
* Merge하지 않고 Close
* 일정 기간 Open 상태 유지
* Close 후 Reopen
* Draft 상태 유지
* 수정 요청 후 추가 Commit

테스트 방식은 Issue 본문에 미리 표시합니다.

테스트 목적으로 Close되는 것은 기여가 잘못됐거나 실패했다는 의미가 아닙니다.

## 주의사항

다음 정보는 이 폴더에 추가하지 마세요.

* 실제 API Key
* OAuth Client Secret
* Access Token
* 비밀번호
* 이메일과 전화번호
* 비공개 저장소 정보
* 회사 또는 조직의 내부정보
* 다른 프로젝트에서 무단 복사한 코드나 문서

질문하거나 실수해도 괜찮습니다. 첫 오픈소스 기여를 환영합니다!
