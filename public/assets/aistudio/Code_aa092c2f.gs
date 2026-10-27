// Web App load madalu mukhya doGet function
function doGet(e) {
  return HtmlService.createTemplateFromFile('Index')
      .evaluate()
      .setTitle('inflow2036 - Dashboard')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// HTML file-galannu serisalu helper function
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ==========================================
// PRE-FETCH / INITIAL APP LOAD DATA
// ==========================================
var INITIAL_LOADERS_ = {
  quickNotes:      'getQuickNotesData',
  runWalk:         'getRunWalkDashboardData',
  planning:        'getPlanningDashboardData',
  bucketList:      'getBucketListData',
  specialDays:     'getSpecialDaysData',
  habits:          'getHabitTrackerData',
  skill:           'getSkillTrackerData',
  diary:           'getDiaryEntries',
  liabilityAssets: 'getLiabilityAssetsData',
  inflow:          'getInflowData',
  graphicZone:     'getGraphicZoneData',
  fivePercentClub: 'getFPCData',
  salary:          'getSalaryCardData',
  savingBank:      'getSavingBankData'
};

// ===== LOGIN PASSWORD (server side - not visible in browser source) =====
var APP_PASSWORD_ = 'shanu2';

function getInitialAppData(pwd) {
  if (String(pwd || '') !== APP_PASSWORD_) return { locked: true };
  var g = (typeof globalThis !== 'undefined') ? globalThis : this;
  var result = { _errors: [] };
  Object.keys(INITIAL_LOADERS_).forEach(function (key) {
    var fnName = INITIAL_LOADERS_[key];
    try {
      if (typeof g[fnName] !== 'function') {
        result[key] = null;
        result._errors.push(key + ': function "' + fnName + '" sigalilla');
        return;
      }
      result[key] = g[fnName]();
    } catch (e) {
      result[key] = null;
      result._errors.push(key + ': ' + e.message);
    }
  });
  return result;
}

// ==========================================
// QUICK NOTES BACKEND LOGIC
// ==========================================

function getQuickNotesData() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Quick_Notes') || ss.getSheetByName('QuickNotes');
    
    if (!sheet) {
      sheet = ss.insertSheet('Quick_Notes');
      sheet.appendRow(['Date / Time', 'Note Content', 'Last Modified']);
      return [];
    }
    
    var rows = sheet.getDataRange().getValues();
    var notesList = [];
    
    for (var r = 1; r < rows.length; r++) {
      var dateTimeVal = rows[r][0];
      var content = rows[r][1];
      var lastModified = rows[r][2];
      
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
  } catch (e) {
    throw new Error("QuickNotes fetch error: " + e.message);
  }
}

function createNewQuickNote() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Quick_Notes') || ss.getSheetByName('QuickNotes');
  
  if (!sheet) {
    sheet = ss.insertSheet('Quick_Notes');
    sheet.appendRow(['Date / Time', 'Note Content', 'Last Modified']);
  }
  
  var nowStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  sheet.appendRow([nowStr, "", nowStr]);
  
  return getQuickNotesData();
}

function updateQuickNoteContent(rowIndex, content) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Quick_Notes') || ss.getSheetByName('QuickNotes');
  if (!sheet) return getQuickNotesData();
  
  var nowStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  sheet.getRange(rowIndex, 2).setValue(content);
  sheet.getRange(rowIndex, 3).setValue(nowStr);
  
  return { status: "success" };
}

function deleteQuickNote(rowIndex) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Quick_Notes') || ss.getSheetByName('QuickNotes');
  if (!sheet) return getQuickNotesData();
  
  sheet.deleteRow(rowIndex);
  return getQuickNotesData();
}

// ==========================================
// RUN / WALK BACKEND LOGIC
// ==========================================

function getRunWalkDashboardData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Run_Walk');
  
  if (!sheet) {
    sheet = ss.insertSheet('Run_Walk');
    sheet.appendRow(['Date', 'Distance', 'Duration', 'Notes']);
  }
  
  var rows = sheet.getDataRange().getValues();
  var dataMap = {};
  
  for (var i = 1; i < rows.length; i++) {
    var dateVal = rows[i][0];
    var distVal = parseFloat(rows[i][1]) || 0;
    if (dateVal) {
      var d = new Date(dateVal);
      var dateStr = Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      dataMap[dateStr] = (dataMap[dateStr] || 0) + distVal;
    }
  }
  
  var today = new Date();
  var history = [];
  var kannadaDays = ['ಆದಿತ್ಯವಾರ', 'ಸೋಮವಾರ', 'ಮಂಗಳವಾರ', 'ಬುಧವಾರ', 'ಗುರುವಾರ', 'ಶುಕ್ರವಾರ', 'ಶನಿವಾರ'];
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  var sum7 = 0;
  for (var j = 0; j < 7; j++) {
    var targetDate = new Date(today.getTime() - (j * 24 * 60 * 60 * 1000));
    var dateStr = Utilities.formatDate(targetDate, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    
    var dayName = kannadaDays[targetDate.getDay()];
    if (j === 0) {
      dayName += ' (ಇವತ್ತು)';
    }
    
    var formattedDate = targetDate.getDate() + ' ' + months[targetDate.getMonth()] + ' · ' + dateStr;
    var dist = dataMap[dateStr] || 0;
    sum7 += dist;
    
    history.push({
      dateStr: dateStr,
      dayName: dayName,
      formattedDate: formattedDate,
      distance: dist
    });
  }
  
  var sum30 = 0;
  for (var k = 0; k < 30; k++) {
    var d30 = new Date(today.getTime() - (k * 24 * 60 * 60 * 1000));
    var ds30 = Utilities.formatDate(d30, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    sum30 += (dataMap[ds30] || 0);
  }
  
  var sum365 = 0;
  for (var l = 0; l < 365; l++) {
    var d365 = new Date(today.getTime() - (l * 24 * 60 * 60 * 1000));
    var ds365 = Utilities.formatDate(d365, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    sum365 += (dataMap[ds365] || 0);
  }
  
  return {
    todayDistance: dataMap[Utilities.formatDate(today, Session.getScriptTimeZone(), 'yyyy-MM-dd')] || 0,
    history: history,
    weeklyAvg: (sum7 / 7).toFixed(1),
    monthlyAvg: (sum30 / 30).toFixed(1),
    yearlyAvg: (sum365 / 365).toFixed(1)
  };
}

function saveOrUpdateRunWalkEntry(dateStr, distance) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Run_Walk');
  if (!sheet) {
    sheet = ss.insertSheet('Run_Walk');
    sheet.appendRow(['Date', 'Distance', 'Duration', 'Notes']);
  }
  
  var rows = sheet.getDataRange().getValues();
  var updated = false;
  var targetDist = parseFloat(distance) || 0;
  
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0]) {
      var d = new Date(rows[i][0]);
      var curDateStr = Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      if (curDateStr === dateStr) {
        sheet.getRange(i + 1, 2).setValue(targetDist);
        updated = true;
        break;
      }
    }
  }
  
  if (!updated) {
    sheet.appendRow([dateStr, targetDist, '', '']);
  }
  
  return getRunWalkDashboardData();
}

// ==========================================
// PLANNING MODULE BACKEND FUNCTIONS
// ==========================================

function getPlanningDashboardData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Planning");
  
  if (!sheet) {
    sheet = ss.insertSheet("Planning");
    sheet.appendRow(["Plan Name", "Income", "Expense", "Item Name / Source", "Amount (₹)", "Date / ID", "Tick"]);
    return { plans: [] };
  }

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return { plans: [] };
  }

  var plansMap = {};

  for (var i = 1; i < data.length; i++) {
    var planName = data[i][0];
    var isIncome = data[i][1];
    var isExpense = data[i][2];
    var itemName = data[i][3];
    var amount = parseFloat(data[i][4]) || 0;
    var itemId = data[i][5] || ('item_' + i);
    var isTicked = (data[i][6] === true || data[i][6] === 'TRUE' || data[i][6] === '✔');

    if (!planName) continue;

    if (!plansMap[planName]) {
      plansMap[planName] = {
        name: planName,
        totalIncome: 0,
        totalExpenses: 0,
        incomes: [],
        expenses: []
      };
    }

    var rowItem = {
      rowIndex: i + 1,
      id: itemId,
      name: itemName,
      amount: amount,
      ticked: isTicked
    };

    if (isIncome && isIncome.toString().trim() !== "") {
      plansMap[planName].totalIncome += amount;
      plansMap[planName].incomes.push(rowItem);
    } else if (isExpense && isExpense.toString().trim() !== "") {
      plansMap[planName].totalExpenses += amount;
      plansMap[planName].expenses.push(rowItem);
    }
  }

  var plansArray = [];
  for (var pName in plansMap) {
    var p = plansMap[pName];
    p.balance = p.totalIncome - p.totalExpenses;
    plansArray.push(p);
  }

  return { plans: plansArray };
}

function togglePlanningItemTick(rowIndex, currentStatus) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Planning");
  if (sheet) {
    sheet.getRange(rowIndex, 7).setValue(!currentStatus);
  }
  return getPlanningDashboardData();
}

function savePlanningEntry(planName, type, itemName, amount, rowIndex) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Planning");
  
  if (!sheet) {
    sheet = ss.insertSheet("Planning");
    sheet.appendRow(["Plan Name", "Income", "Expense", "Item Name / Source", "Amount (₹)", "Date / ID", "Tick"]);
  }

  var parsedRow = parseInt(rowIndex);

  if (parsedRow && parsedRow > 1) {
    sheet.getRange(parsedRow, 4).setValue(itemName);
    sheet.getRange(parsedRow, 5).setValue(parseFloat(amount));
  } else {
    var isInc = (type === 'INCOME') ? "Income" : "";
    var isExp = (type === 'EXPENSE') ? "Expense" : "";
    var itemId = (type === 'INCOME' ? 'inc_' : 'exp_') + new Date().getTime();
    sheet.appendRow([planName, isInc, isExp, itemName, parseFloat(amount), itemId, false]);
  }
  
  return getPlanningDashboardData();
}

function deletePlanningItem(rowIndex) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Planning");
  if (sheet && rowIndex > 1) {
    sheet.deleteRow(rowIndex);
  }
  return getPlanningDashboardData();
}

// ==========================================
// BUCKET LIST MODULE BACKEND FUNCTIONS
// ==========================================

function getBucketListData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Bucket_List");
  
  if (!sheet) {
    sheet = ss.insertSheet("Bucket_List");
    sheet.appendRow(["ID", "Country", "State", "District", "Place Name", "Image URL", "Map Link", "Category", "Rating", "Notes", "Status"]);
    return { items: [] };
  }

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return { items: [] };
  }

  var itemsList = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[4] && row[4].toString().trim() !== "") {
      itemsList.push({
        rowIndex: i + 1,
        id: row[0] || ('b_' + i),
        country: row[1] || '',
        state: row[2] || '',
        district: row[3] || '',
        placeName: row[4] || '',
        imageUrl: row[5] || 'https://via.placeholder.com/400x250?text=No+Image',
        mapLink: row[6] || '',
        category: row[7] || 'General',
        rating: row[8] || '5',
        notes: row[9] || '',
        status: row[10] || 'Pending'
      });
    }
  }

  return { items: itemsList };
}

function uploadImageToDrive(base64Data, fileName) {
  try {
    var folderName = "BucketList_Photos";
    var folders = DriveApp.getFoldersByName(folderName);
    var folder;
    
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }

    var splitData = base64Data.split(",");
    var contentType = splitData[0].match(/:(.*?);/)[1];
    var bytes = Utilities.base64Decode(splitData[1]);
    var blob = Utilities.newBlob(bytes, contentType, fileName);
    
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return "https://lh3.googleusercontent.com/d/" + file.getId();
  } catch (e) {
    throw new Error("Image Upload Error: " + e.message);
  }
}

function saveBucketListItem(itemData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Bucket_List");
  
  if (!sheet) {
    sheet = ss.insertSheet("Bucket_List");
    sheet.appendRow(["ID", "Country", "State", "District", "Place Name", "Image URL", "Map Link", "Category", "Rating", "Notes", "Status"]);
  }

  var parsedRow = parseInt(itemData.rowIndex);

  if (parsedRow && parsedRow > 1) {
    sheet.getRange(parsedRow, 2).setValue(itemData.country);
    sheet.getRange(parsedRow, 3).setValue(itemData.state);
    sheet.getRange(parsedRow, 4).setValue(itemData.district);
    sheet.getRange(parsedRow, 5).setValue(itemData.placeName);
    sheet.getRange(parsedRow, 6).setValue(itemData.imageUrl);
    sheet.getRange(parsedRow, 7).setValue(itemData.mapLink);
    sheet.getRange(parsedRow, 8).setValue(itemData.category);
    sheet.getRange(parsedRow, 9).setValue(itemData.rating);
    sheet.getRange(parsedRow, 10).setValue(itemData.notes);
  } else {
    var newId = 'bck_' + new Date().getTime();
    sheet.appendRow([
      newId,
      itemData.country,
      itemData.state,
      itemData.district,
      itemData.placeName,
      itemData.imageUrl,
      itemData.mapLink,
      itemData.category,
      itemData.rating,
      itemData.notes,
      'Pending'
    ]);
  }
  
  return getBucketListData();
}

function deleteBucketListItem(rowIndex) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Bucket_List");
  if (sheet && rowIndex > 1) {
    sheet.deleteRow(rowIndex);
  }
  return getBucketListData();
}

// ==========================================
// SPECIAL DAYS BACKEND FUNCTIONS
// ==========================================
function getSpecialDaysData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Special_Days');
  
  if (!sheet) {
    sheet = ss.insertSheet('Special_Days');
    sheet.appendRow(['Date', 'Title', 'Category', 'Phone Number', 'Notes', 'Alert Before']);
    return [];
  }
  
  var rows = sheet.getDataRange().getValues();
  var itemsList = [];
  
  for (var i = 1; i < rows.length; i++) {
    var rawDate = rows[i][0];
    var title = rows[i][1];
    
    if (rawDate || title) {
      var formattedDate = '';
      if (rawDate) {
        try {
          var d = new Date(rawDate);
          if (!isNaN(d.getTime())) {
            formattedDate = Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
          } else {
            formattedDate = String(rawDate);
          }
        } catch (e) {
          formattedDate = String(rawDate);
        }
      }
      
      itemsList.push({
        rowIndex: i + 1,
        dateStr: formattedDate,
        title: title || '',
        category: rows[i][2] || 'Birthday',
        phone: rows[i][3] || '',
        notes: rows[i][4] || '',
        alertBefore: rows[i][5] || 3
      });
    }
  }
  return itemsList;
}

function saveSpecialDayToSheet(payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Special_Days');
  
  if (!sheet) {
    sheet = ss.insertSheet('Special_Days');
    sheet.appendRow(['Date', 'Title', 'Category', 'Phone Number', 'Notes', 'Alert Before']);
  }
  
  var rowIndex = parseInt(payload.rowIndex);
  
  if (!isNaN(rowIndex) && rowIndex > 1) {
    sheet.getRange(rowIndex, 1).setValue(payload.dateStr);
    sheet.getRange(rowIndex, 2).setValue(payload.title);
    sheet.getRange(rowIndex, 3).setValue(payload.category);
    sheet.getRange(rowIndex, 4).setValue(payload.phone);
  } else {
    sheet.appendRow([payload.dateStr, payload.title, payload.category, payload.phone, '', 3]);
  }
  
  return getSpecialDaysData();
}

function deleteSpecialDayFromSheet(index) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Special_Days');
  
  if (sheet) {
    var rowIndex = parseInt(index);
    if (!isNaN(rowIndex) && rowIndex > 1) {
      sheet.deleteRow(rowIndex);
    }
  }
  
  return getSpecialDaysData();
}