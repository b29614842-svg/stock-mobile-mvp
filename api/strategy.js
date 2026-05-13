const { google } = require('googleapis');

module.exports = async function handler(req, res) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        project_id: process.env.GOOGLE_PROJECT_ID,
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const headerRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'strategy_view!1:1',
    });

    const dataRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'strategy_view!3:9999',
    });

    const headers = (headerRes.data.values && headerRes.data.values[0]) || [];
    const values = dataRes.data.values || [];

    const rows = values
      .filter(row => row.some(cell => String(cell || '').trim() !== ''))
      .map(row => {
        const obj = {};
        headers.forEach((h, i) => {
          obj[String(h || '').trim()] = row[i] ?? '';
        });
        return obj;
      });

    return res.status(200).json({
      ok: true,
      updatedAt: new Date().toISOString(),
      count: rows.length,
      rows,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: String(error.message || error),
    });
  }
};
