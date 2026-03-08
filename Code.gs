// ========== 설정 ==========
var CONFIG = {
  ROWS: 15,
  COLS: 32
};

// ========== 웹 앱 진입점 ==========
function doGet(e) {
  try {
    var page = (e && e.parameter && e.parameter.page) || 'main';
    var template = page === 'admin' ? 'Admin' : 'Sidebar';
    var title = page === 'admin' ? '좌석 배치 - 관리자' : '좌석 배치 시스템';

    return HtmlService.createTemplateFromFile(template)
      .evaluate()
      .setTitle(title)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  } catch (err) {
    return HtmlService.createHtmlOutput('<h1>오류: ' + err.message + '</h1>');
  }
}

// Admin 페이지 테스트
function testAdmin() {
  try {
    var output = doGet({parameter: {page: 'admin'}});
    Logger.log('Admin 성공! 길이: ' + output.getContent().length);
    Logger.log(output.getContent().substring(0, 500));
  } catch (e) {
    Logger.log('Admin 오류: ' + e.message);
    Logger.log(e.stack);
  }
}

// HTML 파일 포함 (CSS/JS 모듈화)
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// 웹앱 URL 반환
function getScriptUrl() {
  return ScriptApp.getService().getUrl();
}

// ========== 클래스 목록 ==========
function getClassesByGrade(grade) {
  var list = [];
  for (var n = 1; n <= 11; n++) list.push(grade + '-' + n);
  return list;
}

function getClassData() {
  return {
    grade5: getClassesByGrade(5),
    grade6: getClassesByGrade(6),
    choir: [
      { name: 'Soprano', code: 'S' },
      { name: 'Alto', code: 'A' },
      { name: 'Tenor', code: 'T' },
      { name: 'Bass', code: 'B' }
    ]
  };
}

// ========== 레이아웃 설정 ==========
// layer: 'original' (원본) 또는 'moved' (이동)

function getLayout(layer) {
  try {
    var key = layer === 'moved' ? 'LAYOUT_MOVED' : 'LAYOUT_ORIGINAL';
    var data = PropertiesService.getScriptProperties().getProperty(key);
    return data ? JSON.parse(data) : getEmptyLayout();
  } catch (e) {
    return getEmptyLayout();
  }
}

function saveLayout(layer, config) {
  try {
    var key = layer === 'moved' ? 'LAYOUT_MOVED' : 'LAYOUT_ORIGINAL';
    PropertiesService.getScriptProperties().setProperty(key, JSON.stringify(config));
    updateVersion();
    return (layer === 'moved' ? '이동' : '원본') + ' 레이아웃 저장 완료';
  } catch (e) {
    return '저장 실패: ' + e.message;
  }
}

function getEmptyLayout() {
  return {
    rows: CONFIG.ROWS,
    aisles: [],
    pillars: []
  };
}

// ========== 이동 자리 반 배치 ==========

function getMovedSeats() {
  try {
    var data = PropertiesService.getScriptProperties().getProperty('SEAT_MOVED');
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

function saveMovedSeats(data) {
  try {
    PropertiesService.getScriptProperties().setProperty('SEAT_MOVED', JSON.stringify(data));
    updateVersion();
    return '좌석 배치 저장 완료';
  } catch (e) {
    return '저장 실패: ' + e.message;
  }
}

// ========== 버전 관리 (실시간 동기화) ==========

function getServerVersion() {
  return PropertiesService.getScriptProperties().getProperty('DATA_VERSION') || '0';
}

function updateVersion() {
  PropertiesService.getScriptProperties().setProperty('DATA_VERSION', Date.now().toString());
}

// ========== 초기화 ==========

function resetMovedSeats() {
  PropertiesService.getScriptProperties().deleteProperty('SEAT_MOVED');
  updateVersion();
  return '좌석 배치 초기화 완료';
}

function resetLayout(layer) {
  var key = layer === 'moved' ? 'LAYOUT_MOVED' : 'LAYOUT_ORIGINAL';
  PropertiesService.getScriptProperties().deleteProperty(key);
  updateVersion();
  return (layer === 'moved' ? '이동' : '원본') + ' 레이아웃 초기화 완료';
}

function resetAll() {
  var props = PropertiesService.getScriptProperties();
  props.deleteProperty('LAYOUT_ORIGINAL');
  props.deleteProperty('LAYOUT_MOVED');
  props.deleteProperty('SEAT_MOVED');
  updateVersion();
  return '전체 초기화 완료';
}

// ========== 테스트 ==========
function testDoGet() {
  try {
    var output = doGet({parameter: {}});
    Logger.log('성공! 길이: ' + output.getContent().length);
    Logger.log(output.getContent().substring(0, 500));
  } catch (e) {
    Logger.log('오류: ' + e.message);
    Logger.log(e.stack);
  }
}
