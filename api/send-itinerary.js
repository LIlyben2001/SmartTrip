// /api/send-itinerary.js
export default async function handler(req, res) {
  // CORS (optional)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed. Use POST." });
    }

    // Dynamic import so a missing package won't crash the function at load time
    let Resend;
    try {
      ({ Resend } = await import("resend"));
    } catch (e) {
      return res.status(500).json({
        error: "Resend SDK not found. Run `npm i resend` in project root.",
        details: String(e?.message || e),
      });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM || "SmartTrip <itinerary@your-domain.com>";
    if (!apiKey) {
      return res.status(500).json({
        error: "Missing RESEND_API_KEY env variable. Add it to .env.local and Vercel env.",
      });
    }

    const { to, subject, html, replyTo } = req.body || {};
    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return res.status(400).json({ error: "Valid 'to' email is required." });
    }
    if (!html || typeof html !== "string" || html.trim().length < 20) {
      return res.status(400).json({ error: "'html' content is required." });
    }

    // Build a plain-text fallback
    const text = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<\/(p|div|li|h[1-6]|br|tr)>/gi, "\n")
      .replace(/<li>/gi, "• ")
      .replace(/<[^>]+>/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    const resend = new Resend(apiKey);
    const resp = await resend.emails.send({
      from,
      to,
      subject: subject || "Your SmartTrip Itinerary",
      html,
      text,
      reply_to: replyTo || undefined,
    });

    if (resp?.error) {
      // Common Resend error: unverified "from" address/domain
      return res.status(500).json({
        error: resp.error?.message || "Email send failed (Resend error).",
      });
    }

    return res.status(200).json({ ok: true, id: resp?.data?.id || null });
  } catch (err) {
    return res.status(500).json({ error: err?.message || "Unhandled error" });
  }
}
