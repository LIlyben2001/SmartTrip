<<<<<<< HEAD:pages/api/send-itinerary.js
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
=======
// /api/send-itinerary.js
async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  // Debug GET
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      method: "GET",
      hasKey: !!process.env.RESEND_API_KEY,
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

    console.log("send-itinerary hit", { hasKey: !!apiKey, from });

    const resend = new Resend(apiKey);
    const resp = await resend.emails.send({
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

    if (resp?.error) {
      return res.status(500).json({
        error: resp.error?.message || "Email send failed (Resend error).",
      });
    }

    return res.status(200).json({ ok: true, id: resp?.data?.id || null });
  } catch (err) {
    console.error("send-itinerary unhandled error:", err);
    return res.status(500).json({ error: err?.message || "Unhandled error" });
  }
}

// ✅ This is what Vercel will detect:
module.exports = handler;
>>>>>>> 1074d6a388cc5c4669705f34610de80ef887fd54:api/send-itinerary.js
