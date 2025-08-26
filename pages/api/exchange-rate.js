// /pages/api/exchange-rates.js
export default async function handler(req, res) {
  try {
    const apiKey = process.env.OPENEXCHANGERATES_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing OPENEXCHANGERATES_KEY" });
    }

    const resp = await fetch(
      `https://openexchangerates.org/api/latest.json?app_id=${apiKey}&base=USD`
    );

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`OXR error ${resp.status}: ${text}`);
    }

    const data = await resp.json();
    return res.status(200).json({ rates: data.rates, timestamp: data.timestamp });
  } catch (err) {
    console.error("Exchange rates API error:", err);
    return res.status(500).json({ error: "Failed to fetch exchange rates" });
  }
}
