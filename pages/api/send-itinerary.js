// /pages/api/send-itinerary.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, subject, html } = req.body || {};
  if (!to || !html) {
    return res.status(400).json({ error: "Missing 'to' or 'html' in body" });
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing RESEND_API_KEY" });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SmartTrip <no-reply@yourdomain.com>", // must match your verified domain in Resend
        to,
        subject: subject || "Your SmartTrip Itinerary",
        html,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Resend API error: ${text}`);
    }

    const data = await response.json();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
