// Habit Tracker Backend Logic
var HABIT_SHEET_NAME = 'Habits';
var HABIT_HEADERS = ['Habit Title', 'Date Created', 'LogsJSON'];

function getHabitSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(HABIT_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(HABIT_SHEET_NAME);
    sheet.appendRow(HABIT_HEADERS);
  } else if (sheet.getRange(1, 3).getValue() !== 'LogsJSON') {
    sheet.getRange(1, 3).setValue('LogsJSON'); // old header (SUN..SAT) fix
  }
  return sheet;
}

function parseHabitLogs_(cellValue) {
  try {
    if (cellValue && typeof cellValue === 'string' && cellValue.charAt(0) === '{') {
      return JSON.parse(cellValue);
    }
  } catch (e) {}
  return {};
}

function getHabitTrackerData() {
  var sheet = getHabitSheet_();
  var rows = sheet.getDataRange().getValues();
  var tz = Session.getScriptTimeZone();
  var today = new Date();
  var dayNamesShort = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  var daysHeader = [];
  for (var i = 6; i >= 0; i--) {
    var d = new Date(today.getTime() - (i * 24 * 60 * 60 * 1000));
    daysHeader.push({
      dateStr: Utilities.formatDate(d, tz, 'yyyy-MM-dd'),
      dayName: dayNamesShort[d.getDay()],
      isToday: (i === 0)
    });
  }

  var habitsList = [];
  for (var r = 1; r < rows.length; r++) {
    var title = rows[r][0];
    if (title && title.toString().trim() !== '') {
      habitsList.push({
        rowIndex: r + 1,
        title: title.toString(),
        logs: parseHabitLogs_(rows[r][2])
      });
    }
  }
  return { daysHeader: daysHeader, habits: habitsList };
}

function addNewHabit(habitTitle) {
  if (!habitTitle || habitTitle.toString().trim() === '') return getHabitTrackerData();
  var sheet = getHabitSheet_();
  sheet.appendRow([habitTitle.toString().trim(), new Date().toISOString(), '{}']);
  return getHabitTrackerData();
}

function toggleHabitStatus(rowIndex, dateStr, currentStatus) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getHabitSheet_();
    var nextStatus = '';
    if (!currentStatus) nextStatus = '✅';
    else if (currentStatus === '✅') nextStatus = '❌';

    var cell = sheet.getRange(rowIndex, 3);
    var logs = parseHabitLogs_(cell.getValue());
    if (nextStatus === '') delete logs[dateStr];
    else logs[dateStr] = nextStatus;
    cell.setValue(JSON.stringify(logs));
  } finally {
    lock.releaseLock();
  }
  return getHabitTrackerData();
}
