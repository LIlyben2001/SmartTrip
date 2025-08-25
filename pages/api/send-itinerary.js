// /pages/api/send-itinerary.js
async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  // Debug GET
  if (req.method === "GET") {
    const apiKey = process.env.RESEND_API_KEY || "";
    return res.status(200).json({
      ok: true,
      method: "GET",
      hasKey: !!apiKey,
      keyPrefix: apiKey ? apiKey.slice(0, 6) + "..." : null, // 👈 added
      from: process.env.EMAIL_FROM || null,
    });
  }

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed. Use POST." });
    }

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
    const from = process.env.EMAIL_FROM || "SmartTrip <onboarding@resend.dev>";
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

    console.log("send-itinerary hit", { 
      hasKey: !!apiKey, 
      keyPrefix: apiKey ? apiKey.slice(0, 6) + "..." : null, // 👈 added
      from 
    });

    const resend = new Resend(apiKey);

    let resp;
    try {
      resp = await resend.emails.send({
        from,
        to,
        subject: subject || "Your SmartTrip Itinerary",
        html,
        text: html
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
          .replace(/<\/(p|div|li|h[1-6]|br|tr)>/gi, "\n")
          .replace(/<li>/gi, "• ")
          .replace(/<[^>]+>/g, "")
          .replace(/\n{3,}/g, "\n\n")
          .trim(),
        reply_to: replyTo || undefined,
      });
    } catch (err) {
      console.error("Resend API call threw error:", err);
      return res.status(500).json({ error: err?.message || "Resend API call failed" });
    }

    // 🔎 Added logging so you can see what Resend returns
    console.log("Resend response:", JSON.stringify(resp, null, 2));

    if (resp?.error) {
      return res.status(500).json({
        error: resp.error?.message || "Email send failed (Resend error).",
        details: resp.error,
        keyPrefix: apiKey ? apiKey.slice(0, 6) + "..." : null, // 👈 also return key prefix in error
      });
    }

    return res.status(200).json({ ok: true, id: resp?.data?.id || null });
  } catch (err) {
    console.error("send-itinerary unhandled error:", err);
    return res.status(500).json({ 
      error: err?.message || "Unhandled error",
      keyPrefix: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.slice(0, 6) + "..." : null // 👈 added
    });
  }
}

// Export for Vercel
export default handler;
