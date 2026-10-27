/**
 * Inflow 2036 Backend Data & Drive Upload Service
 */

function getInflowData() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Inflow_2036") || ss.getSheetByName("Inflow2036");
    
    if (!sheet) return { items: [] };
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return { items: [] };
    
    const items = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[0] && !row[1]) continue;
      
      items.push({
        rowIndex: i + 1,
        id: row[0] || ('INFLOW_' + i),
        category: (row[0] || 'core').toLowerCase(),
        name: row[1] || '',
        type: row[2] || '',
        investedAmount: Number(row[3] || 0),
        currentValue: Number(row[4] || 0),
        sipAmount: Number(row[6] || 0),
        notes: row[7] || '',
        logoUrl: row[9] || '' // Column J for Logo
      });
    }
    
    return { items: items };
  } catch (err) {
    return { error: err.message, items: [] };
  }
}

function saveInflowItem(item) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Inflow_2036") || ss.getSheetByName("Inflow2036");
  
  if (!sheet) {
    sheet = ss.insertSheet("Inflow_2036");
    sheet.appendRow(["Asset Category", "Asset Name", "Code / Type", "Invested (₹)", "Current Value (₹)", "Profit/Loss (₹)", "Monthly SIP (₹)", "Notes", "Last Updated", "Logo URL"]);
  }
  
  const profitLoss = (item.currentValue || 0) - (item.investedAmount || 0);

  if (item.rowIndex) {
    sheet.getRange(item.rowIndex, 1, 1, 8).setValues([[
      item.category || 'core',
      item.name || '',
      item.type || 'Mutual Fund',
      item.investedAmount || 0,
      item.currentValue || 0,
      profitLoss,
      item.sipAmount || 0,
      item.notes || ''
    ]]);
  } else {
    sheet.appendRow([
      item.category || 'core',
      item.name || '',
      item.type || 'Mutual Fund',
      item.investedAmount || 0,
      item.currentValue || 0,
      profitLoss,
      item.sipAmount || 0,
      item.notes || '',
      new Date(),
      ''
    ]);
  }
  
  return getInflowData();
}

/**
 * Upload Stock Logo to Google Drive Folder of current Spreadsheet
 */
function uploadStockLogo(base64Data, contentType, fileName, rowIndex) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const fileId = ss.getId();
    const parentFolders = DriveApp.getFileById(fileId).getParents();
    
    let targetFolder;
    if (parentFolders.hasNext()) {
      targetFolder = parentFolders.next();
    } else {
      targetFolder = DriveApp.getRootFolder();
    }
    
    const decodedData = Utilities.base64Decode(base64Data.split(',')[1]);
    const blob = Utilities.newBlob(decodedData, contentType, fileName);
    const uploadedFile = targetFolder.createFile(blob);
    uploadedFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    const fileUrl = "https://lh3.googleusercontent.com/d/" + uploadedFile.getId();
    
    let sheet = ss.getSheetByName("Inflow_2036") || ss.getSheetByName("Inflow2036");
    if (sheet && rowIndex) {
      sheet.getRange(rowIndex, 10).setValue(fileUrl); // Save URL to Column J
    }
    
    return { success: true, logoUrl: fileUrl };
  } catch (err) {
    return { success: false, error: err.message };
  }
}