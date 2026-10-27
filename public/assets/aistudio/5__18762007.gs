// ==========================================
// 5% CLUB BACKEND LOGIC (5%.gs)
// Sheet columns:
// A Asset | B Inv. Amount | C Entry Date | D Exit Date | E Holding Days
// F Exit in % | G P&L Amount (gross) | H Broker Charges | I Net P&L
// Exit Date empty  => trade is OPEN
// Exit Date filled => trade is EXITED
// ==========================================

var FPC_SHEET = "5% Club";
var FPC_HEADERS = ["Asset Name", "Inv. Amount", "Entry Date", "Exit Date", "Holding Days", "Exit in %", "P&L Amount", "Broker Charges", "Net P&L"];

function getFPCSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(FPC_SHEET);
  if (!sheet) sheet = ss.insertSheet(FPC_SHEET);
  // Create / upgrade header row (adds Broker Charges + Net P&L to old sheets)
  var head = sheet.getRange(1, 1, 1, FPC_HEADERS.length);
  var cur = head.getValues()[0];
  for (var c = 0; c < FPC_HEADERS.length; c++) {
    if (!cur[c]) sheet.getRange(1, c + 1).setValue(FPC_HEADERS[c]);
  }
  return sheet;
}

function fpcYMD_(v) {
  if (!v) return "";
  var d = (Object.prototype.toString.call(v) === "[object Date]") ? v : new Date(v);
  if (isNaN(d.getTime())) return "";
  return Utilities.formatDate(d, Session.getScriptTimeZone(), "yyyy-MM-dd");
}

function fpcToDate_(ymd) {
  if (!ymd) return "";
  var p = String(ymd).split("-");
  return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
}

function fpcRound_(n) {
  return Math.round(n * 100) / 100;
}

function get5PercentClubData() {
  var sheet = getFPCSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return { trades: [] };

  var data = sheet.getRange(2, 1, lastRow - 1, 9).getValues();
  var trades = [];
  var today = new Date();
  today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    if (!row[0]) continue;

    var entryYMD = fpcYMD_(row[2]);
    var exitYMD = fpcYMD_(row[3]);
    var isExited = exitYMD !== "";

    var investment = Number(row[1]) || 0;
    var exitPct = isExited ? (Number(row[5]) || 0) : 0;
    var charges = Number(row[7]) || 0;
    var gross = isExited ? fpcRound_(investment * exitPct / 100) : 0;
    var net = isExited ? fpcRound_(gross - charges) : 0;

    // Holding days: entry -> exit (or entry -> today for open trades)
    var holdingDays = 0;
    if (entryYMD) {
      var end = isExited ? fpcToDate_(exitYMD) : today;
      holdingDays = Math.max(0, Math.round((end - fpcToDate_(entryYMD)) / 86400000));
    }

    trades.push({
      rowIndex: i + 2,
      asset: row[0],
      investment: investment,
      entryDate: entryYMD,
      exitDate: exitYMD,
      exitMonth: exitYMD ? exitYMD.substring(5, 7) : "",
      isExited: isExited,
      holdingDays: holdingDays,
      exitPct: exitPct,
      brokerCharges: charges,
      grossPnl: gross,
      netPnl: net,
      pnlAmount: net
    });
  }
  return { trades: trades };
}

/**
 * Add new trade OR update existing one (also used for Exit).
 * trade = { rowIndex?, asset, investment, entryDate, exitDate?, exitPct?, brokerCharges? }
 * - No rowIndex          => new row (entry only, exit fields optional)
 * - rowIndex present     => update that row (edit / exit)
 */
function save5PercentClubTrade(trade) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = getFPCSheet_();
    var row = trade.rowIndex ? Number(trade.rowIndex) : sheet.getLastRow() + 1;
    if (row < 2) row = 2;

    if (trade.rowIndex) {
      if (row > sheet.getLastRow() || !sheet.getRange(row, 1).getValue()) {
        throw new Error("Trade row not found. Please refresh and try again.");
      }
    }

    var hasExit = !!trade.exitDate;

    var values = [[
      String(trade.asset || "").trim(),
      Number(trade.investment) || 0,
      fpcToDate_(trade.entryDate),
      hasExit ? fpcToDate_(trade.exitDate) : "",
      '=IF(AND(ISNUMBER(C' + row + '),ISNUMBER(D' + row + ')),D' + row + '-C' + row + ',"")',
      hasExit ? (Number(trade.exitPct) || 0) : "",
      '=IF(F' + row + '="","",B' + row + '*F' + row + '/100)',
      hasExit ? (Number(trade.brokerCharges) || 0) : "",
      '=IF(F' + row + '="","",G' + row + '-N(H' + row + '))'
    ]];

    var range = sheet.getRange(row, 1, 1, 9);
    range.setValues(values);
    sheet.getRange(row, 3, 1, 2).setNumberFormat("yyyy-mm-dd");
  } finally {
    lock.releaseLock();
  }
  return get5PercentClubData();
}

function delete5PercentClubTrade(rowIndex) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = getFPCSheet_();
    var row = Number(rowIndex);
    if (row < 2 || row > sheet.getLastRow()) {
      throw new Error("Trade row not found. Please refresh and try again.");
    }
    sheet.deleteRow(row);
  } finally {
    lock.releaseLock();
  }
  return get5PercentClubData();
}
