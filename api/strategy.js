export default async function handler(req, res) {
  try {
    const upstream = await fetch('https://script.google.com/macros/s/AKfycbxJgIrVvY4pwPXCjxAF-mlbwgGnjwoD9yCO6ovUqrD60du55B3F1QiJs0U98c3vwMqRLw/exec');
    const text = await upstream.text();

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).send(text);
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: String(err.message || err)
    });
  }
}
