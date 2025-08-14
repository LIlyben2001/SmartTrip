// /api/send-itinerary.js
import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { to, subject, html } = req.body || {};
  if (!to || !html) return res.status(400).json({ error: "Missing 'to' or 'html'" });

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: "SmartTrip <itinerary@your-domain.com>", // set up in Resend
      to,
      subject: subject || "Your SmartTrip Itinerary",
      html,
    });
    if (error) return res.status(500).json({ error: error.message || "Email failed" });
    res.status(200).json({ ok: true, id: data?.id });
  } catch (err) {
    res.status(500).json({ error: err.message || "Email failed" });
  }
}
