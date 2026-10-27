// Diary Module Backend Logic (Sheet Structure: A: Date, B: Title, C: Journal Notes, D: Last Modified)

function getDiaryEntries() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Diary');
    
    if (!sheet) {
      sheet = ss.insertSheet('Diary');
      sheet.appendRow(['Date', 'Title', 'Journal Notes', 'Last Modified']);
      return [];
    }
    
    var rows = sheet.getDataRange().getValues();
    var entries = [];
    
    for (var r = 1; r < rows.length; r++) {
      var rawDate = rows[r][0];
      var title = rows[r][1];
      var notes = rows[r][2];
      var lastMod = rows[r][3];
      
      if ((title && title.toString().trim() !== "") || (notes && notes.toString().trim() !== "")) {
        var formattedDateStr = "";
        var isoDateStr = "";
        
        if (rawDate) {
          var d = new Date(rawDate);
          if (!isNaN(d.getTime())) {
            isoDateStr = Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
            formattedDateStr = Utilities.formatDate(d, Session.getScriptTimeZone(), 'dd | MMM, yyyy, EEEE');
          } else {
            formattedDateStr = rawDate.toString();
          }
        }
        
        entries.push({
          rowIndex: r + 1,
          dateFormatted: formattedDateStr,
          dateIso: isoDateStr,
          title: title ? title.toString() : "",
          notes: notes ? notes.toString() : "",
          lastModified: lastMod ? lastMod.toString() : ""
        });
      }
    }
    return entries;
  } catch (e) {
    throw new Error("Diary fetch error: " + e.message);
  }
}

// Add or Update Diary Entry
function saveOrUpdateDiaryEntry(rowIndex, dateVal, titleVal, notesVal) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Diary');
  if (!sheet) {
    sheet = ss.insertSheet('Diary');
    sheet.appendRow(['Date', 'Title', 'Journal Notes', 'Last Modified']);
  }
  
  var nowStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  
  if (rowIndex && parseInt(rowIndex) > 1) {
    sheet.getRange(rowIndex, 1).setValue(dateVal);
    sheet.getRange(rowIndex, 2).setValue(titleVal);
    sheet.getRange(rowIndex, 3).setValue(notesVal);
    sheet.getRange(rowIndex, 4).setValue(nowStr);
  } else {
    sheet.appendRow([dateVal, titleVal, notesVal, nowStr]);
  }
  
  return getDiaryEntries();
}

// Delete Diary Entry
function deleteDiaryEntry(rowIndex) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Diary');
  if (!sheet) return getDiaryEntries();
  
  sheet.deleteRow(rowIndex);
  return getDiaryEntries();
}