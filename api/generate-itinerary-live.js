// /api/generate-itinerary-live.js
// Live AI-powered itinerary generator (keeps your mock file untouched)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
  }

  try {
    const {
      destination = "",
      startDate,
      endDate,
      days,
      travelers,
      styles = [],   // <--- plural now
      budgetLevel = "",
      pace = "",
      email,
      country,
      city,
    } = req.body || {};

    const resolvedDestination =
      (city && country) ? `${city}, ${country}` :
      destination || "Your Destination";

    // derive # of days if not provided (from dates)
    let n = Number(days) || 0;
    if (!n && startDate && endDate) {
      const sd = new Date(startDate), ed = new Date(endDate);
      if (!isNaN(sd) && !isNaN(ed)) n = Math.max(1, Math.round((ed - sd) / 86400000) + 1);
    }
    if (!n) n = 5;

    // Build a strong, structured prompt
    const sys = `You are SmartTrip, a precise travel-planning assistant.
Return STRICT JSON only, no extra commentary. 
JSON schema:
{
  "title": string,
  "days": [
    {
      "title": string,
      "location": string,
      "items": string[]
    }
  ],
  "budget": {
    "rows": [
      { "category": "Accommodation", "budget": number, "mid": number, "luxury": number },
      { "category": "Food",          "budget": number, "mid": number, "luxury": number },
      { "category": "Transportation","budget": number, "mid": number, "luxury": number },
      { "category": "Activities",    "budget": number, "mid": number, "luxury": number },
      { "category": "Souvenirs",     "budget": number, "mid": number, "luxury": number }
    ]
  }
}
Rules:
- Days length must equal ${n}.
- Keep day titles descriptive (e.g., "Day 2: Neighborhoods & Markets in Tokyo").
- Always set "location" to "City, Country".
- Numbers in budget are daily totals in USD (integers, no symbols).
- Output must be valid JSON only.`;

    const user = {
      destination: resolvedDestination,
      country: country || null,
      city: city || null,
      startDate: startDate || null,
      endDate: endDate || null,
      days: n,
      travelers: travelers ? Number(travelers) : null,
      styles: Array.isArray(styles) ? styles : [styles].filter(Boolean), // ensure array
      budgetLevel,
      pace,
      email: email || null,
      note: "Focus on iconic highlights + local flavor. Keep bullets concise."
    };

    // --- Call OpenAI ---
    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_output_tokens: 1200,
        input: [
          { role: "system", content: sys },
          { role: "user",   content: JSON.stringify(user) }
        ]
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`OpenAI error ${resp.status}: ${text}`);
    }

    const data = await resp.json();

    const rawText =
      data.output_text ||
      (Array.isArray(data.output) ? data.output.map(x => x.content?.[0]?.text || "").join("\n") : "");

    let out;
    try {
      out = JSON.parse(rawText);
    } catch {
      const cleaned = rawText
        .replace(/^```json\s*/i, "")
        .replace(/```$/i, "")
        .trim();
      out = JSON.parse(cleaned);
    }

    // Days safety
    const safeDays = Array.isArray(out.days) ? out.days.slice(0, n) : [];
    while (safeDays.length < n) {
      const i = safeDays.length + 1;
      safeDays.push({
        title: `Day ${i}: Highlights in ${resolvedDestination}`,
        location: resolvedDestination,
        items: [
          "Morning: Iconic landmark visit",
          "Afternoon: Local market & museum",
          "Evening: Neighborhood stroll & dinner"
        ],
      });
    }

    const titleParts = [
      `${resolvedDestination} Trip`,
      `${n} days`,
      (Array.isArray(styles) ? styles.join(", ") : styles) || null,
      budgetLevel || null,
      pace || null,
    ].filter(Boolean);

    const finalTitle = out.title && String(out.title).trim()
      ? out.title
      : titleParts.join(" — ");

    // Budget fallback
    const budget = out.budget && Array.isArray(out.budget.rows) && out.budget.rows.length
      ? out.budget
      : {
          rows: [
            { category: "Accommodation", budget: 200, mid: 300, luxury: 500 },
            { category: "Food",          budget: 150, mid: 250, luxury: 400 },
            { category: "Transportation",budget:  50, mid: 100, luxury: 200 },
            { category: "Activities",    budget: 100, mid: 200, luxury: 300 },
            { category: "Souvenirs",     budget:  50, mid: 100, luxury: 200 },
          ],
        };

    return res.status(200).json({
      title: finalTitle,
      days: safeDays,
      budget,
      travelers: travelers ? Number(travelers) : null,
      startDate: startDate || null,
      endDate: endDate || null,
      source: "openai",
    });
  } catch (err) {
    console.error("AI API error:", err);
    return res.status(500).json({ error: "Failed to generate itinerary." });
  }
}
