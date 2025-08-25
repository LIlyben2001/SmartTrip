// src/api/generate-itinerary-live.js
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
      style = "",
      budgetLevel = "",
      pace = "",
      email,
      country,
      city,
    } = req.body || {};

    const resolvedDestination =
      city && country ? `${city}, ${country}` : destination || "Your Destination";

    const resolvedStyle = Array.isArray(style) ? style.join(" + ") : style || "";

    // derive # of days if not provided (from dates)
    let n = Number(days) || 0;
    if (!n && startDate && endDate) {
      const sd = new Date(startDate),
        ed = new Date(endDate);
      if (!isNaN(sd) && !isNaN(ed))
        n = Math.max(1, Math.round((ed - sd) / 86400000) + 1);
    }
    if (!n) n = 5;

    // Build structured system + user prompt
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
- Keep day titles descriptive.
- Always set "location" to "City, Country".
- Numbers in budget are daily totals in USD (integers).
- Do not include currency symbols.
- Output must be valid JSON only.
Content guidelines:
- Include REAL, well-known attractions, landmarks, museums, markets, neighborhoods, restaurants, and cultural highlights for the chosen city and country.
- Each day should feature 3–6 realistic activities in "Morning / Afternoon / Evening" format.
- Prefer famous highlights but also mix in some local flavor (markets, food streets, parks, neighborhoods).
- Adjust activities based on the selected travel style(s).
- If multiple styles are selected, blend them across days (e.g. Foodies + Culture → food tours, local markets, plus museums and galleries).
- Make it practical for travelers, not generic placeholders.`; // 👈 added blending rules

    const user = {
      destination: resolvedDestination,
      country: country || null,
      city: city || null,
      startDate: startDate || null,
      endDate: endDate || null,
      days: n,
      travelers: travelers ? Number(travelers) : null,
      style: resolvedStyle,
      budgetLevel,
      pace,
      email: email || null,
      note: "Focus on iconic highlights + local flavor. Keep bullets concise.",
    };

    // --- Call OpenAI ---
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
     body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: sys },
        { role: "user", content: JSON.stringify(user) }
      ],
      temperature: 0.7,
      max_tokens: 1200
    }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`OpenAI error ${resp.status}: ${text}`);
    }

    const data = await resp.json();

    // --- Existing logic ---
    let rawText =
      data.output_text ||
      (Array.isArray(data.output)
        ? data.output.map((x) => x.content?.[0]?.text || "").join("\n")
        : "");

    // --- NEW fallback for OpenAI chat responses ---
    if (!rawText && data.choices?.length) {
      rawText = data.choices[0].message?.content || "";
    }

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

    // Post-process: ensure correct number of days
    const safeDays = Array.isArray(out.days) ? out.days.slice(0, n) : [];
    while (safeDays.length < n) {
      const i = safeDays.length + 1;
      safeDays.push({
        title: `Day ${i}: Highlights in ${resolvedDestination}`,
        location: resolvedDestination,
        items: [
          "Morning: Iconic landmark visit",
          "Afternoon: Local market & museum",
          "Evening: Neighborhood stroll & dinner",
        ],
      });
    }

    const titleParts = [
      `${resolvedDestination} Trip`,
      `${n} days`,
      resolvedStyle || null,
      budgetLevel || null,
      pace || null,
    ].filter(Boolean);
    const finalTitle =
      out.title && String(out.title).trim()
        ? out.title
        : titleParts.join(" — ");

    const budget =
      out.budget && Array.isArray(out.budget.rows) && out.budget.rows.length
        ? out.budget
        : {
            rows: [
              { category: "Accommodation", budget: 200, mid: 300, luxury: 500 },
              { category: "Food", budget: 150, mid: 250, luxury: 400 },
              { category: "Transportation", budget: 50, mid: 100, luxury: 200 },
              { category: "Activities", budget: 100, mid: 200, luxury: 300 },
              { category: "Souvenirs", budget: 50, mid: 100, luxury: 200 },
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
