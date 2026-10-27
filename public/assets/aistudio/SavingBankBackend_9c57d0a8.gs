/**
 * Saving Bank Module - Backend
 * Sheet: "Saving_Banks"
 * Columns: A: Bank Name | B: Currency (INR / AED) | C: Account Type | D: Balance | E: Logo URL | F: Last Modified
 * (All function names start with "SavingBank"/"sb" so they never clash with other .gs files)
 */

var SB_SHEET_NAME_ = 'Saving_Banks';

function sbGetSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SB_SHEET_NAME_);
  if (!sheet) {
    sheet = ss.insertSheet(SB_SHEET_NAME_);
    sheet.appendRow(['Bank Name', 'Currency', 'Account Type', 'Balance', 'Logo URL', 'Last Modified']);
    var seed = [
      ['Federal Bank',   'INR', 'Savings Account',      3000, '', ''],
      ['Union Bank',     'INR', 'Savings Account',      0,    '', ''],
      ['Karnataka Bank', 'INR', 'Savings Account',      0,    '', ''],
      ['ADCB Bank',      'AED', 'Current Account',      0,    '', ''],
      ['Botim Bank',     'AED', 'Digital Pay Wallet',   20,   '', ''],
      ['Pot',            'AED', 'Savings Pot / Locker', 0,    '', ''],
      ['Wallet',         'AED', 'Cash / Digital Wallet',100,  '', '']
    ];
    sheet.getRange(2, 1, seed.length, 6).setValues(seed);
  }
  return sheet;
}

function sbNum_(v) {
  var n = Number(String(v == null ? '' : v).replace(/,/g, ''));
  return isNaN(n) ? 0 : n;
}

function getSavingBankData() {
  try {
    var sheet = sbGetSheet_();
    var lastRow = sheet.getLastRow();
    var banks = [];
    if (lastRow >= 2) {
      var rows = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        if (!r[0] || String(r[0]).trim() === '') continue;
        var cur = String(r[1] || 'INR').toUpperCase().trim();
        banks.push({
          rowIndex: i + 2,
          name: String(r[0]),
          currency: (cur === 'AED') ? 'AED' : 'INR',
          type: String(r[2] || ''),
          balance: sbNum_(r[3]),
          logoUrl: String(r[4] || '')
        });
      }
    }
    return { banks: banks };
  } catch (e) {
    throw new Error('Saving Bank fetch error: ' + e.message);
  }
}

// item = { rowIndex?, name, currency, type, balance, logoUrl? }
function saveSavingBankItem(item) {
  var sheet = sbGetSheet_();
  var nowStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  var cur = String(item.currency || 'INR').toUpperCase() === 'AED' ? 'AED' : 'INR';
  var rowIndex = parseInt(item.rowIndex, 10);

  if (!isNaN(rowIndex) && rowIndex > 1) {
    sheet.getRange(rowIndex, 1, 1, 4).setValues([[item.name, cur, item.type || '', sbNum_(item.balance)]]);
    if (item.logoUrl) sheet.getRange(rowIndex, 5).setValue(item.logoUrl);
    sheet.getRange(rowIndex, 6).setValue(nowStr);
  } else {
    sheet.appendRow([item.name, cur, item.type || '', sbNum_(item.balance), item.logoUrl || '', nowStr]);
  }
  return getSavingBankData();
}

function deleteSavingBankItem(rowIndex) {
  var sheet = sbGetSheet_();
  var r = parseInt(rowIndex, 10);
  if (!isNaN(r) && r > 1 && r <= sheet.getLastRow()) sheet.deleteRow(r);
  return getSavingBankData();
}

// Logo upload (image is stored in the same Drive folder as the spreadsheet)
function uploadSavingBankLogo(base64Data, contentType, fileName) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var parents = DriveApp.getFileById(ss.getId()).getParents();
    var folder = parents.hasNext() ? parents.next() : DriveApp.getRootFolder();

    var bytes = Utilities.base64Decode(String(base64Data).split(',')[1]);
    var blob = Utilities.newBlob(bytes, contentType || 'image/png', fileName || 'bank_logo.png');
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return { success: true, logoUrl: 'https://lh3.googleusercontent.com/d/' + file.getId() };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
