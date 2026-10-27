// ==========================================
// GRAPHIC ZONE - JOBS + CUSTOMER DATABASE
// Version 4 (With Invoice Support)
// ==========================================

var GZ_JOB_HEADERS = ['Date','Job No','Customer Name','Phone','Place','Item','Qty','Rate (₹)','Total Amount (₹)','Advance Paid (₹)','Balance Due (₹)','Print Cost (₹)','Other Cost (₹)','Estimated Profit (₹)','Status','Remarks'];
var GZ_CUSTOMER_HEADERS = ['Customer Name','Place','Mobile Number','Total Orders','Total Business (₹)','Total Paid (₹)','Balance Due (₹)','Last Order Date'];
var GZ_ACTIVE_STATUSES = ['Design Pending','Printing','Ready for Delivery','Delivered'];

function getGraphicZoneData(){
  var ss=SpreadsheetApp.getActiveSpreadsheet();
  var sheet=getGzJobSheet_(ss);
  var jobs=readGzJobs_(sheet);
  var customers=buildGzCustomers_(jobs);
  writeGzCustomers_(ss,customers);
  return {jobs:jobs,customers:customers,summary:buildGzSummary_(jobs)};
}

function saveGraphicZoneJobFromUI(p){
  var lock=LockService.getScriptLock();
  lock.waitLock(30000);
  try{
    var ss=SpreadsheetApp.getActiveSpreadsheet();
    var sheet=getGzJobSheet_(ss);
    var row=parseInt(p.rowIndex,10);
    var isEdit=!isNaN(row)&&row>1&&row<=sheet.getLastRow();
    var jobNo=String(p.jobNo||'').trim();

    // New jobs always receive the next G-number based on the highest number saved.
    // The script lock prevents two simultaneous saves from receiving the same number.
    if(!isEdit){
      var last=sheet.getLastRow(),maxNo=0;
      if(last>=2){
        var existing=sheet.getRange(2,2,last-1,1).getDisplayValues();
        for(var i=0;i<existing.length;i++){
          var match=String(existing[i][0]||'').trim().match(/^G\s*(\d+)$/i);
          if(match)maxNo=Math.max(maxNo,Number(match[1])||0);
        }
      }
      jobNo='G'+(maxNo+1);
    }

    var qty=Number(p.qty)||0, rate=Number(p.rate)||0, paid=Number(p.paid)||0;
    var total=qty*rate;
    var balance=Math.max(0,total-paid);
    var printCost=Number(p.printCost)||0, otherCost=Number(p.otherCost)||0;
    var profit=paid-printCost-otherCost;
    var status=p.status||'Design Pending';
    if(status==='Cancelled') status='Cancel';
    var values=[[p.date||'',jobNo,p.customerName||'',p.phone||'',p.place||'',p.item||'',qty,rate,total,paid,balance,printCost,otherCost,profit,status,p.remarks||'']];
    if(isEdit) sheet.getRange(row,1,1,GZ_JOB_HEADERS.length).setValues(values);
    else sheet.getRange(sheet.getLastRow()+1,1,1,GZ_JOB_HEADERS.length).setValues(values);
    formatGzJobSheet_(sheet);
    return getGraphicZoneData();
  } finally {
    lock.releaseLock();
  }
}

function markGraphicZoneDelivered(rowIndex){
  var sheet=getGzJobSheet_(SpreadsheetApp.getActiveSpreadsheet());
  var row=parseInt(rowIndex,10);
  if(!isNaN(row)&&row>1&&row<=sheet.getLastRow()) sheet.getRange(row,15).setValue('Delivered');
  return getGraphicZoneData();
}

function cancelGraphicZoneJob(rowIndex){
  var sheet=getGzJobSheet_(SpreadsheetApp.getActiveSpreadsheet());
  var row=parseInt(rowIndex,10);
  if(!isNaN(row)&&row>1&&row<=sheet.getLastRow()) sheet.getRange(row,15).setValue('Cancel');
  return getGraphicZoneData();
}

function getGzJobSheet_(ss){
  var sh=ss.getSheetByName('Graphic_Zone');
  if(!sh){
    sh=ss.insertSheet('Graphic_Zone');
    sh.getRange(1,1,1,GZ_JOB_HEADERS.length).setValues([GZ_JOB_HEADERS]);
  }
  var current=sh.getRange(1,1,1,GZ_JOB_HEADERS.length).getValues()[0];
  var mismatch=false;
  for(var i=0;i<GZ_JOB_HEADERS.length;i++){if(String(current[i]||'')!==GZ_JOB_HEADERS[i]){mismatch=true;break;}}
  if(mismatch) sh.getRange(1,1,1,GZ_JOB_HEADERS.length).setValues([GZ_JOB_HEADERS]);
  formatGzJobSheet_(sh);
  return sh;
}

function formatGzJobSheet_(sh){
  sh.setFrozenRows(1);
  sh.getRange(1,1,1,GZ_JOB_HEADERS.length).setFontWeight('bold').setBackground('#e8eef7').setFontColor('#172033');
  if(sh.getMaxRows()>1){
    sh.getRange(2,1,sh.getMaxRows()-1,1).setNumberFormat('yyyy-mm-dd');
    sh.getRange(2,7,sh.getMaxRows()-1,8).setNumberFormat('#,##0.00');
  }
}

function readGzJobs_(sh){
  var last=sh.getLastRow();
  if(last<2)return [];
  var rows=sh.getRange(2,1,last-1,GZ_JOB_HEADERS.length).getValues();
  var out=[];
  for(var i=0;i<rows.length;i++){
    var r=rows[i];
    if(!r[1]&&!r[2])continue;
    out.push({
      rowIndex:i+2,date:formatGzDate_(r[0]),jobNo:String(r[1]||''),customerName:String(r[2]||''),
      phone:String(r[3]||''),place:String(r[4]||''),item:String(r[5]||''),qty:Number(r[6])||0,
      rate:Number(r[7])||0,totalAmount:Number(r[8])||0,paid:Number(r[9])||0,balanceDue:Number(r[10])||0,
      printCost:Number(r[11])||0,otherCost:Number(r[12])||0,estimatedProfit:Number(r[13])||0,
      status:String(r[14]||'Design Pending'),remarks:String(r[15]||'')
    });
  }
  return out;
}

function formatGzDate_(v){
  if(!v)return '';
  if(Object.prototype.toString.call(v)==='[object Date]'&&!isNaN(v))return Utilities.formatDate(v,Session.getScriptTimeZone(),'yyyy-MM-dd');
  var s=String(v);
  if(/^\d{4}-\d{2}-\d{2}/.test(s))return s.substring(0,10);
  var d=new Date(v);
  return isNaN(d)?s:Utilities.formatDate(d,Session.getScriptTimeZone(),'yyyy-MM-dd');
}

function isGzCancelled_(j){
  var s=String(j.status||'').toLowerCase();
  return s==='cancel'||s==='cancelled';
}
function isGzDelivered_(j){return String(j.status||'').toLowerCase()==='delivered';}
function isGzActive_(j){return !isGzCancelled_(j);}

function buildGzSummary_(jobs){
  var s={totalBusiness:0,totalOrders:0,pendingJobs:0,balanceDue:0,estimatedProfit:0,deliveredJobs:0,cancelledJobs:0};
  jobs.forEach(function(j){
    if(isGzCancelled_(j)){s.cancelledJobs++;return;}
    s.totalOrders++;
    s.totalBusiness+=Number(j.totalAmount)||0;
    s.balanceDue+=Number(j.balanceDue)||0;
    s.estimatedProfit+=Number(j.estimatedProfit)||0;
    if(isGzDelivered_(j))s.deliveredJobs++;
    else s.pendingJobs++;
  });
  return s;
}

function buildGzCustomers_(jobs){
  var map={};
  jobs.forEach(function(j){
    var name=String(j.customerName||'').trim();
    if(!name)return;
    var key=name.toLowerCase();
    if(!map[key])map[key]={name:name,place:j.place||'',phone:j.phone||'',totalOrders:0,totalBusiness:0,totalPaid:0,balanceDue:0,lastOrderDate:''};
    var c=map[key];
    if(isGzCancelled_(j)){
      if(j.place)c.place=j.place;
      if(j.phone)c.phone=j.phone;
      return;
    }
    c.totalOrders++;
    c.totalBusiness+=Number(j.totalAmount)||0;
    c.totalPaid+=Number(j.paid)||0;
    c.balanceDue+=Number(j.balanceDue)||0;
    if(j.place)c.place=j.place;
    if(j.phone)c.phone=j.phone;
    if(!c.lastOrderDate||j.date>c.lastOrderDate)c.lastOrderDate=j.date;
  });
  return Object.keys(map).map(function(k){return map[k]}).sort(function(a,b){return a.name.localeCompare(b.name)});
}

function writeGzCustomers_(ss,customers){
  var sh=ss.getSheetByName('Graphic_Customers');
  if(!sh)sh=ss.insertSheet('Graphic_Customers');
  sh.clearContents();
  sh.getRange(1,1,1,GZ_CUSTOMER_HEADERS.length).setValues([GZ_CUSTOMER_HEADERS]);
  if(customers.length){
    var rows=customers.map(function(c){return [c.name,c.place,c.phone,c.totalOrders,c.totalBusiness,c.totalPaid,c.balanceDue,c.lastOrderDate]});
    sh.getRange(2,1,rows.length,GZ_CUSTOMER_HEADERS.length).setValues(rows);
  }
  sh.setFrozenRows(1);
  sh.getRange(1,1,1,GZ_CUSTOMER_HEADERS.length).setFontWeight('bold').setBackground('#dbeafe');
}