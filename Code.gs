function doGet() {
  try {
    var html = HtmlService.createTemplateFromFile('Sidebar');
    html.data = {
      grade5: getClassesByGrade(5),
      grade6: getClassesByGrade(6),
      choir: ['Sop', 'Alt', 'Ten', 'Bas']
    };
    return html.evaluate()
      .setTitle('좌석 배치 시스템')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  } catch (e) {
    return HtmlService.createHtmlOutput("<h1>서버 연결 오류: " + e.message + "</h1>");
  }
}

function getClassesByGrade(grade) {
  var list = [];
  for (var n = 1; n <= 11; n++) { list.push(grade + "-" + n); }
  return list;
}

function getCurrentSeatData() {
  try {
    var props = PropertiesService.getScriptProperties();
    var cachedData = props.getProperty('SEAT_LAYOUT');
    return cachedData ? JSON.parse(cachedData) : {};
  } catch (e) { return {}; }
}

function saveAllSeatData(payload) {
  try {
    var props = PropertiesService.getScriptProperties();
    var now = new Date().getTime().toString(); 
    props.setProperty('SEAT_LAYOUT', JSON.stringify(payload));
    props.setProperty('DATA_VERSION', now);
    return "저장 완료!";
  } catch (e) { return "저장 실패: " + e.message; }
}

function getServerVersion() {
  try {
    return PropertiesService.getScriptProperties().getProperty('DATA_VERSION') || "0";
  } catch (e) { return "0"; }
}

function resetAll() {
  var props = PropertiesService.getScriptProperties();
  props.deleteProperty('SEAT_LAYOUT');
  props.setProperty('DATA_VERSION', new Date().getTime().toString());
  return "초기화 완료";
}