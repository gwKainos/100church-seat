# 100church-seat
100주년 소년부 좌석 배치도

## 주요 기능
- **관리자 페이지**: 원본/이동 자리 각각의 통로/기둥 설정 (11 x 32 그리드)
- **메인 페이지**: 원본 자리 / 이동 자리 2개 레이어 관리
  - 원본 자리: 고정 레이아웃 (읽기 전용)
  - 이동 자리: 별도 레이아웃 + 반별 좌석 배치

## 파일 구조

```
├── Code.gs        # 백엔드 API
├── Styles.html    # 공통 CSS
├── Utils.html     # 공통 JavaScript
├── Sidebar.html   # 메인 페이지
├── Admin.html     # 관리자 페이지
└── README.md      # 문서
```

## 페이지 접근

| 페이지 | URL | 설명 |
|--------|-----|------|
| 메인 | `웹앱URL` | 좌석 배치 (원본/이동 자리) |
| 관리자 | `웹앱URL?page=admin` | 원본/이동 레이아웃 설정 |

## 데이터 구조

### PropertiesService 키

| 키 | 용도 | 예시 |
|----|------|------|
| `LAYOUT_ORIGINAL` | 원본 자리 레이아웃 | `{"rows":11,"aisles":[5,10],"pillars":[[5,10]]}` |
| `LAYOUT_MOVED` | 이동 자리 레이아웃 | `{"rows":11,"aisles":[5,10],"pillars":[]}` |
| `SEAT_MOVED` | 이동 자리 반 배치 | `{"1_5":"5-1","2_6":"6-2"}` |
| `DATA_VERSION` | 버전 (실시간 동기화) | `1709876543210` |

### 레이아웃 설정 형식
```javascript
{
  "rows": 11,           // 행 수
  "aisles": [5, 10],    // 통로 열 번호 (1-indexed)
  "pillars": [[5,10]]   // 기둥 위치 [행, 열] (1-indexed)
}
```

### 좌석 키 형식
- `"행_열"` 형식 (예: `"1_5"` = 1행 5열)
- 1-indexed (1부터 시작)

## API 목록

### 레이아웃
- `getLayout(layer)` - 레이아웃 조회 (layer: 'original' | 'moved')
- `saveLayout(layer, config)` - 레이아웃 저장
- `resetLayout(layer)` - 레이아웃 초기화

### 이동 자리 배치
- `getMovedSeats()` - 반 배치 조회
- `saveMovedSeats(data)` - 반 배치 저장
- `resetMovedSeats()` - 반 배치 초기화

### 유틸리티
- `getServerVersion()` - 데이터 버전 조회 (동기화용)
- `getClassData()` - 반 목록 조회
- `include(filename)` - HTML 파일 포함
- `resetAll()` - 전체 초기화

## 기술 스택
- Google Apps Script
- PropertiesService (데이터 저장)
- HTML Service (웹 앱)
