---
name: feature-planner
description: "Google Apps Script + Supabase 기반 좌석 배치도 프로젝트를 위한 단계별 기능 계획 생성"
---

# Feature Planner

## Purpose
Google Apps Script + Supabase 기반 프로젝트를 위한 구조화된 단계별 계획 생성:
- 각 단계에서 완전하고 실행 가능한 기능 제공
- 품질 검증 후 다음 단계 진행
- 작업 시작 전 사용자 승인
- 마크다운 체크박스로 진행 상황 추적

## 프로젝트 구조

```
├── Code.gs          # 백엔드 API (Google Apps Script)
├── Index.html       # 출석 체크 페이지
├── Main.html        # 메인 페이지 (반 선택)
├── Stats.html       # 통계 페이지
├── Admin.html       # 관리자 페이지 (학생 관리, 캐시 관리)
├── schema.sql       # Supabase 스키마
└── README.md        # 문서
```

## 기술 스택

### Google Apps Script
- **웹 앱**: `doGet()` 함수로 HTML 서비스 제공
- **백엔드 API**: `google.script.run`으로 클라이언트-서버 통신
- **캐싱**: `CacheService` (6시간 TTL), `PropertiesService` (장기 캐시)
- **배포**: Apps Script 에디터 또는 `clasp`를 통한 배포

### Supabase (선택적)
- **데이터베이스**: PostgreSQL 기반
- **API**: REST API 또는 JavaScript 클라이언트
- **테이블**: `students`, `attendance` (테스트: `test_students`, `test_attendance`)

### 환경 설정
```javascript
const TEST_MODE = true;  // false로 변경 시 운영 테이블 사용
const TABLE_PREFIX = TEST_MODE ? 'test_' : '';
```

## Planning Workflow

### Step 1: Requirements Analysis
1. 관련 파일을 읽어 코드베이스 구조 파악
2. 의존성 및 통합 지점 식별
3. 복잡도와 위험 요소 평가
4. 적절한 범위 결정 (소규모/중규모/대규모)

### Step 2: Phase Breakdown
기능을 3-5개 단계로 분할하여 각 단계가:
- 동작하고 테스트 가능한 기능 제공
- 명확한 성공 기준 보유
- 독립적으로 롤백 가능

**단계 구조**:
- 단계명: 명확한 결과물
- 목표: 이 단계가 제공하는 기능
- 작업:
  1. **백엔드**: Code.gs 함수 구현
  2. **프론트엔드**: HTML/JavaScript UI 구현
  3. **데이터**: Supabase 스키마/쿼리 (해당 시)
  4. **캐시**: 캐시 키 및 무효화 로직
- 품질 검증: 검증 기준
- 의존성: 시작 전 필요한 사항

### Step 3: Plan Document Creation
plan-template.md를 사용하여 생성: `docs/plans/PLAN_<feature-name>.md`

포함 내용:
- 개요 및 목표
- 아키텍처 결정 및 근거
- 완전한 단계별 분할 (체크박스 포함)
- 품질 검증 체크리스트
- 위험 평가 테이블
- 단계별 롤백 전략
- 진행 상황 추적 섹션
- 메모 및 학습 내용

### Step 4: User Approval
**중요**: AskUserQuestion을 사용하여 진행 전 명시적 승인 획득.

질문:
- "이 단계 분할이 프로젝트에 적합한가요?"
- "제안된 접근 방식에 대한 우려사항이 있으신가요?"
- "계획 문서를 생성해도 될까요?"

사용자 확인 후에만 계획 문서 생성.

### Step 5: Document Generation
1. `docs/plans/` 디렉토리가 없으면 생성
2. 모든 체크박스가 미체크 상태인 계획 문서 생성
3. 헤더에 품질 검증에 대한 명확한 지침 추가
4. 사용자에게 계획 위치와 다음 단계 안내

## Quality Gate Standards

각 단계는 다음 단계 진행 전 아래 항목을 검증해야 함:

**코드 검증**:
- [ ] 문법 오류 없음
- [ ] Apps Script 에디터에서 저장 가능
- [ ] clasp push 성공 (로컬 개발 시)

**기능 검증**:
- [ ] 웹 앱에서 기능 동작 확인
- [ ] 기존 기능 회귀 없음
- [ ] 엣지 케이스 테스트 완료

**데이터 검증** (Supabase 사용 시):
- [ ] Supabase 쿼리 정상 동작
- [ ] 데이터 무결성 유지
- [ ] 테스트 테이블에서 먼저 검증

**캐시 검증**:
- [ ] 캐시 키 명명 규칙 준수
- [ ] 적절한 캐시 무효화
- [ ] 캐시 미스 시 정상 동작

**보안 및 성능**:
- [ ] API 키/비밀번호 노출 없음
- [ ] 성능 저하 없음
- [ ] 적절한 에러 처리

**문서화**:
- [ ] 코드 주석 업데이트
- [ ] README.md 반영 (필요 시)
- [ ] 캐싱 정책 업데이트 (캐시 변경 시)

## Progress Tracking Protocol

계획 문서 헤더에 추가:

```markdown
**중요 지침**: 각 단계 완료 후:
1. 완료된 작업 체크박스 체크
2. 품질 검증 항목 모두 확인
3. "Last Updated" 날짜 업데이트
4. Notes 섹션에 학습 내용 기록
5. 모든 검증 통과 후에만 다음 단계 진행

품질 검증을 건너뛰거나 실패한 상태로 진행하지 마세요
```

## Phase Sizing Guidelines

**소규모** (2-3단계):
- 단일 컴포넌트 또는 단순 기능
- 최소한의 의존성
- 명확한 요구사항
- 예: 새 버튼 추가, 간단한 통계 표시

**중규모** (3-4단계):
- 여러 컴포넌트 또는 중간 규모 기능
- 일부 통합 복잡성
- 데이터베이스 변경 또는 API 작업
- 예: 새로운 관리 기능, 검색 기능

**대규모** (4-5단계):
- 여러 영역에 걸친 복잡한 기능
- 상당한 아키텍처 영향
- 여러 통합
- 예: 새로운 모듈 추가, 대규모 UI 개편

## Risk Assessment

식별 및 문서화:
- **기술 위험**: Supabase API 변경, 성능 이슈, 데이터 마이그레이션
- **의존성 위험**: Google Apps Script 업데이트, Supabase 서비스 가용성
- **품질 위험**: 테스트 커버리지 부족, 회귀 가능성

각 위험에 대해:
- 확률: 낮음/중간/높음
- 영향: 낮음/중간/높음
- 완화 전략: 구체적인 조치 단계

## Rollback Strategy

각 단계에서 문제 발생 시 변경 사항을 되돌리는 방법 문서화:
- 어떤 코드 변경을 취소해야 하는지
- 데이터베이스 마이그레이션 롤백 (해당 시)
- 캐시 무효화 필요 사항
- 설정 변경 복원

## Google Apps Script 개발 가이드

### 로컬 개발 (clasp 사용)
```bash
# clasp 설치
npm install -g @google/clasp

# 로그인
clasp login

# 프로젝트 클론
clasp clone <scriptId>

# 코드 푸시
clasp push

# 웹 앱 열기
clasp open --webapp
```

### 디버깅
- `Logger.log()` 또는 `console.log()`로 로그 출력
- Apps Script 에디터의 실행 로그 확인
- `try-catch`로 에러 처리

### 테스트 방법
1. **수동 테스트**: 웹 앱에서 직접 기능 테스트
2. **테스트 모드**: `TEST_MODE = true`로 테스트 테이블 사용
3. **로그 확인**: 실행 로그에서 데이터 흐름 확인
4. **단위 테스트 함수**: 별도 테스트 함수 작성하여 개별 기능 검증

```javascript
// 테스트 함수 예시
function test_getStudents() {
  const result = getStudents(2026, 3, 1);
  Logger.log('Students: ' + JSON.stringify(result));
  // 예상 결과와 비교
}
```

## Supabase 연동 가이드

### API 호출
```javascript
function supabaseRequest(method, table, params) {
  const url = `${SUPABASE_URL}/rest/v1/${TABLE_PREFIX}${table}`;
  const options = {
    method: method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    }
  };
  // ... 구현
}
```

### Supabase 없이 사용
Supabase가 없는 경우 대안:
- **Google Sheets**: 데이터 저장소로 활용
- **PropertiesService**: 소규모 데이터 저장
- **Firebase Realtime Database**: 대안 데이터베이스

## Supporting Files Reference
- [plan-template.md](plan-template.md) - 완전한 계획 문서 템플릿
