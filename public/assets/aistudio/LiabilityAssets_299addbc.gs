// Backend logic for Liability_Assets Sheet
// Sheet Columns: 
// Liquid Assets -> Col A: Asset Type, Col B: Name, Col C: Amount
// Liabilities   -> Col E: Asset Type, Col F: Name, Col G: Amount

function getLiabilityAssetsData() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Liability_Assets');
    
    if (!sheet) {
      sheet = ss.insertSheet('Liability_Assets');
      sheet.getRange("A1:C1").setValues([['Asset Type', 'Name', 'Amount']]);
      sheet.getRange("E1:G1").setValues([['Asset Type', 'Name', 'Amount']]);
      return { assets: [], liabilities: [], totalAssets: 0, totalLiabilities: 0, netWorth: 0 };
    }
    
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return { assets: [], liabilities: [], totalAssets: 0, totalLiabilities: 0, netWorth: 0 };
    }
    
    var data = sheet.getRange(2, 1, lastRow - 1, 7).getValues();
    var assets = [];
    var liabilities = [];
    var totalAssets = 0;
    var totalLiabilities = 0;
    
    for (var i = 0; i < data.length; i++) {
      var rowIndex = i + 2;
      
      // Liquid Assets (Cols A, B, C)
      var assetName = data[i][1];
      var assetAmt = parseFloat(data[i][2]);
      if (assetName && assetName.toString().trim() !== "" && !isNaN(assetAmt)) {
        assets.push({ rowIndex: rowIndex, name: assetName.toString(), amount: assetAmt });
        totalAssets += assetAmt;
      }
      
      // Liabilities (Cols E, F, G)
      var liabName = data[i][5];
      var liabAmt = parseFloat(data[i][6]);
      if (liabName && liabName.toString().trim() !== "" && !isNaN(liabAmt)) {
        liabilities.push({ rowIndex: rowIndex, name: liabName.toString(), amount: liabAmt });
        totalLiabilities += liabAmt;
      }
    }
    
    return {
      assets: assets,
      liabilities: liabilities,
      totalAssets: totalAssets,
      totalLiabilities: totalLiabilities,
      netWorth: totalAssets - totalLiabilities
    };
  } catch (e) {
    throw new Error("Data fetch error: " + e.message);
  }
}

// Add or Update Entry
function saveOrUpdateLiabilityAsset(type, rowIndex, name, amount) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Liability_Assets');
  if (!sheet) return getLiabilityAssetsData();
  
  var amtVal = parseFloat(amount) || 0;
  
  if (type === 'ASSET') {
    if (rowIndex && parseInt(rowIndex) > 1) {
      sheet.getRange(rowIndex, 1, 1, 3).setValues([['Liquid Asset', name, amtVal]]);
    } else {
      var nextRow = getNextAvailableRow(sheet, 1, 3);
      sheet.getRange(nextRow, 1, 1, 3).setValues([['Liquid Asset', name, amtVal]]);
    }
  } else if (type === 'LIABILITY') {
    if (rowIndex && parseInt(rowIndex) > 1) {
      sheet.getRange(rowIndex, 5, 1, 3).setValues([['Liability', name, amtVal]]);
    } else {
      var nextRow = getNextAvailableRow(sheet, 5, 7);
      sheet.getRange(nextRow, 5, 1, 3).setValues([['Liability', name, amtVal]]);
    }
  }
  
  return getLiabilityAssetsData();
}

// Delete Entry
function deleteLiabilityAsset(type, rowIndex) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Liability_Assets');
  if (!sheet) return getLiabilityAssetsData();
  
  if (type === 'ASSET') {
    sheet.getRange(rowIndex, 1, 1, 3).clearContent();
  } else if (type === 'LIABILITY') {
    sheet.getRange(rowIndex, 5, 1, 3).clearContent();
  }
  
  return getLiabilityAssetsData();
}

function getNextAvailableRow(sheet, startCol, endCol) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return 2;
  var values = sheet.getRange(2, startCol, lastRow, endCol - startCol + 1).getValues();
  for (var r = 0; r < values.length; r++) {
    if (!values[r][0] && !values[r][1] && !values[r][2]) {
      return r + 2;
    }
  }
  return lastRow + 1;
}