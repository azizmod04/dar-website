/**
 * DAR — Netlify Form → Google Sheets
 *
 * 1. أنشئ Google Sheet جديد
 * 2. افتح Extensions → Apps Script
 * 3. الصق هذا الكود
 * 4. غير اسم الـ sheet إن احتجت (افتراضي: Sheet1)
 * 5. انشر: Deploy → New Deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. انسخ الرابط اللي يظهر
 * 7. حطه في Netlify: Site → Forms → Form notifications → Add notification → Webhook
 */

const SHEET_NAME = 'Sheet1';

function doPost(e) {
  try {
    const data = e.parameter;
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const headers = sheet.getDataRange().getValues()[0];

    // Auto-create headers on first run
    if (!headers.length || headers.join('') === '') {
      const cols = ['Timestamp', 'Name', 'Email', 'City', 'Company', 'Spaces', 'Interests', 'Preferences'];
      sheet.appendRow(cols);
      headers.length = 0;
      headers.push(...cols);
    }

    const row = [];
    const map = {
      timestamp: new Date(),
      name: data.name || '',
      email: data.email || '',
      city: data.city || '',
      company: data.company || '',
      spaces: data.spaces || '',
      interests: data.interests || '',
      preferences: data.pref || ''
    };

    headers.forEach(h => {
      const key = h.toLowerCase().trim();
      row.push(map[key] !== undefined ? map[key] : '');
    });

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// اختبره من المتصفح: ?name=test&email=test@test.com&city=riyadh
function doGet(e) {
  return doPost(e);
}
