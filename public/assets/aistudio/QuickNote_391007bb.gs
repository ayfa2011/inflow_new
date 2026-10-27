// Quick Note Backend Logic - Matched with Sheet Layout (A: Date / Time, B: Note Content, C: Last Modified)

function getQuickNoteData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Quick_Notes') || ss.getSheetByName('QuickNotes');
  
  // Sheet ಇಲ್ಲದಿದ್ದರೆ ಹೊಸದಾಗಿ ರಚಿಸುವುದು
  if (!sheet) {
    sheet = ss.insertSheet('Quick_Notes');
    sheet.appendRow(['Date / Time', 'Note Content', 'Last Modified']);
  }
  
  var rows = sheet.getDataRange().getValues();
  var notesList = [];
  
  // Row 2 ರಿಂದ Data ಓದುವುದು (Header ಬಿಟ್ಟು)
  for (var r = 1; r < rows.length; r++) {
    var dateTimeVal = rows[r][0];
    var content = rows[r][1];
    var lastModified = rows[r][2];
    
    // ಖಾಲಿ ಇಲ್ಲದ Rows ಮಾತ್ರ ಸಂಗ್ರಹಿಸುವುದು
    if ((content && content.toString().trim() !== "") || (dateTimeVal && dateTimeVal.toString().trim() !== "")) {
      notesList.push({
        rowIndex: r + 1,
        dateTimeStr: dateTimeVal ? dateTimeVal.toString() : "",
        content: content ? content.toString() : "",
        lastModified: lastModified ? lastModified.toString() : ""
      });
    }
  }
  
  return notesList;
}

// ಹೊಸ Note Card ಸೇರಿಸುವುದು
function createNewQuickNote() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Quick_Notes') || ss.getSheetByName('QuickNotes');
  
  if (!sheet) {
    sheet = ss.insertSheet('Quick_Notes');
    sheet.appendRow(['Date / Time', 'Note Content', 'Last Modified']);
  }
  
  var nowStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  
  // Column A: Date/Time, Column B: Content (Empty initially), Column C: Last Modified
  sheet.appendRow([nowStr, "", nowStr]);
  
  return getQuickNoteData();
}

// Auto Save - Column B ಗೆ Note Content ಮೌಲ್ಯವನ್ನು ಬರೆಯುವುದು
function updateQuickNoteContent(rowIndex, content) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Quick_Notes') || ss.getSheetByName('QuickNotes');
  if (!sheet) return getQuickNoteData();
  
  var nowStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  
  // Column B (2) -> Note Content update
  sheet.getRange(rowIndex, 2).setValue(content);
  // Column C (3) -> Last Modified update
  sheet.getRange(rowIndex, 3).setValue(nowStr);
  
  return { status: "success" };
}

// Quick Note Delete ಮಾಡುವುದು
function deleteQuickNote(rowIndex) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Quick_Notes') || ss.getSheetByName('QuickNotes');
  if (!sheet) return getQuickNoteData();
  
  sheet.deleteRow(rowIndex);
  
  return getQuickNoteData();
}