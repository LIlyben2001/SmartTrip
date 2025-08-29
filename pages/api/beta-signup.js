// /pages/api/beta-signup.js
async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

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
        error: "Missing RESEND_API_KEY env variable.",
      });
    }

    const { email } = req.body || {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Valid email is required." });
    }

    console.log("Beta signup for:", email);

    const resend = new Resend(apiKey);

    // 1. Send confirmation email to user
    const userSubject = "Welcome to SmartTrip Beta!";
    const userHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #ea580c;">Welcome to SmartTrip Beta!</h2>
        <p>Thanks for your interest in SmartTrip. You'll be the first to know about new features and updates.</p>
        <p>In the meantime, feel free to try the current version at: <a href="https://smart-trip-six.vercel.app" style="color: #ea580c;">SmartTrip</a></p>
        <p>Best regards,<br>The SmartTrip Team</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          You're receiving this because you signed up for SmartTrip beta updates. 
        </p>
      </div>
    `;

    const userResp = await resend.emails.send({
      from,
      to: email,
      subject: userSubject,
      html: userHtml,
    });

    if (userResp?.error) {
      console.error("Failed to send user email:", userResp.error);
      return res.status(500).json({
        error: "Failed to send confirmation email.",
        details: userResp.error,
      });
    }

    // 2. Send notification email to yourself
    const adminEmail = "Lilyben2001@yahoo.com"; // Replace with your actual email
    const adminSubject = "New SmartTrip Beta Signup";
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h3>New SmartTrip Beta Signup</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Signed up:</strong> ${new Date().toISOString()}</p>
        <p><strong>User Agent:</strong> ${req.headers['user-agent'] || 'Unknown'}</p>
      </div>
    `;

    const adminResp = await resend.emails.send({
      from,
      to: adminEmail,
      subject: adminSubject,
      html: adminHtml,
    });

    if (adminResp?.error) {
      console.error("Failed to send admin notification:", adminResp.error);
      // Don't fail the request if admin email fails
    }

    console.log("Beta signup successful for:", email);
    
    return res.status(200).json({ 
      success: true, 
      message: "Thanks for signing up! Check your email for confirmation." 
    });

  } catch (err) {
    console.error("Beta signup error:", err);
    return res.status(500).json({ 
      error: "Failed to process signup. Please try again.",
      details: err?.message 
    });
  }
}

export default handler;
