/**
 * IREAD story wall — intake endpoint
 * ----------------------------------
 * Receives submissions from "Share my story" and appends one row per story.
 *
 * The sheet already exists in your Drive: "IREAD story intake"
 *   https://docs.google.com/spreadsheets/d/1BRmGG5Hw1zMyIxTQZo2UiqyNI2UjoTEoajRALI5oWCA/edit
 *
 * SETUP — about three minutes, no cost, nothing to install
 *
 *  1. Open that sheet.
 *  2. Extensions -> Apps Script.
 *  3. Delete whatever is in the editor and paste this whole file in. Save.
 *  4. Deploy -> New deployment.
 *       Select type (gear icon) -> Web app
 *       Description:    IREAD intake
 *       Execute as:     Me
 *       Who has access: Anyone        <-- must be "Anyone", NOT "Anyone with a Google account"
 *     -> Deploy. Approve the permission prompt (it only writes to your own sheet).
 *  5. Copy the Web app URL. It looks like
 *       https://script.google.com/macros/s/AKfy..../exec
 *  6. Send that URL over. It becomes STORY_INTAKE_URL in Vercel, which is what
 *     news.theluminary.network posts every submission to.
 *
 * If you edit this script later you must Deploy -> Manage deployments -> edit ->
 * Version: New version, or the live endpoint keeps running the old code.
 *
 * Every submission does two things the moment it lands: a row is appended to the
 * sheet, and notifyOwner_ emails the whole story to NOTIFY. Nothing is published
 * automatically — the row is the approval queue.
 */

var HEADERS = ['Received (ET)', 'Name', 'City', 'Story', 'Status', 'Notes'];

function doPost(e) {
  try {
    var d = {};
    if (e && e.postData && e.postData.contents) {
      d = JSON.parse(e.postData.contents);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length)
           .setFontWeight('bold')
           .setBackground('#9B1C1C')
           .setFontColor('#FFFFFF');
      sheet.setFrozenRows(1);
      sheet.setColumnWidth(1, 150);   // received
      sheet.setColumnWidth(2, 170);   // name
      sheet.setColumnWidth(3, 150);   // city
      sheet.setColumnWidth(4, 700);   // story
      sheet.setColumnWidth(5, 110);   // status
      sheet.setColumnWidth(6, 280);   // notes
    }

    var stamp = Utilities.formatDate(
      new Date(), 'America/Indiana/Indianapolis', 'yyyy-MM-dd HH:mm:ss'
    );

    sheet.appendRow([
      stamp,
      String(d.name  || '').slice(0, 200),
      String(d.city  || '').slice(0, 200),
      String(d.story || '').slice(0, 20000),
      'new',
      ''
    ]);

    notifyOwner_(d, sheet);

    var row = sheet.getLastRow();
    sheet.getRange(row, 4).setWrap(true);
    sheet.getRange(row, 1, 1, HEADERS.length).setVerticalAlignment('top');

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json({ ok: true, msg: 'IREAD intake is live.' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Optional: email yourself when stories arrive.
 * Put your address in NOTIFY, save, then run setUpNotifications() once from the
 * editor (Run -> setUpNotifications) and approve the prompt.
 */
var NOTIFY = 'ben@luminary-tech.ai';

function notifyIfNew() {
  if (!NOTIFY) return;
  var props = PropertiesService.getScriptProperties();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var last  = sheet.getLastRow();
  var seen  = Number(props.getProperty('lastSeen') || 1);
  if (last <= seen) return;
  var count = last - seen;
  props.setProperty('lastSeen', String(last));
  MailApp.sendEmail(
    NOTIFY,
    count + (count === 1 ? ' new story' : ' new stories') + ' on the IREAD wall',
    'Review them here:\n' + SpreadsheetApp.getActiveSpreadsheet().getUrl()
  );
}

function setUpNotifications() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'notifyIfNew') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('notifyIfNew').timeBased().everyMinutes(15).create();
  PropertiesService.getScriptProperties()
    .setProperty('lastSeen',
      String(SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].getLastRow()));
}

/**
 * Emails the story the moment it lands, so a submission is seen immediately
 * rather than on the next scheduled poll. Failure here must never block the
 * row from being written, so it is wrapped.
 */
function notifyOwner_(d, sheet) {
  if (!NOTIFY) return;
  try {
    MailApp.sendEmail({
      to: NOTIFY,
      subject: 'New IREAD story for approval'
        + (d.name ? ' — ' + String(d.name).slice(0, 60) : ''),
      body: [
        (d.name || 'Anonymous') + (d.city ? ' — ' + d.city : ''),
        '',
        String(d.story || ''),
        '',
        '— — —',
        'Received: ' + (d.receivedAt || new Date().toISOString()),
        'Source:   ' + (d.source || 'news.theluminary.network'),
        '',
        'Approve or edit in the sheet:',
        SpreadsheetApp.getActiveSpreadsheet().getUrl()
      ].join('\n')
    });
  } catch (err) {
    console.error('notifyOwner_ failed: ' + err);
  }
}
