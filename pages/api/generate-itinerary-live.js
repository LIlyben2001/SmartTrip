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
<<<<<<< HEAD:pages/api/generate-itinerary-live.js
    const {
=======
    let {
>>>>>>> 1074d6a388cc5c4669705f34610de80ef887fd54:api/generate-itinerary-live.js
      destination = "",
      startDate,
      endDate,
      days,
      travelers,
<<<<<<< HEAD:pages/api/generate-itinerary-live.js
      style = "",
=======
      styles = [],
>>>>>>> 1074d6a388cc5c4669705f34610de80ef887fd54:api/generate-itinerary-live.js
      budgetLevel = "",
      pace = "",
      email,
      country,
      city,
    } = req.body || {};

<<<<<<< HEAD:pages/api/generate-itinerary-live.js
=======
    // Ensure styles is always an array
    if (!Array.isArray(styles)) styles = styles ? [styles] : [];

>>>>>>> 1074d6a388cc5c4669705f34610de80ef887fd54:api/generate-itinerary-live.js
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
<<<<<<< HEAD:pages/api/generate-itinerary-live.js
  "title": string,              // e.g., "Paris Trip — 5 days — Culture — Mid-range — Balanced"
  "days": [                     // length exactly = n days
    {
      "title": string,          // e.g., "Day 1: Historic Core in Paris"
      "location": string,       // city, country
      "items": string[]         // 3–6 concise bullets, morning/afternoon/evening style
=======
  "title": string,
  "days": [
    {
      "title": string,
      "location": string,
      "items": string[]
>>>>>>> 1074d6a388cc5c4669705f34610de80ef887fd54:api/generate-itinerary-live.js
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
<<<<<<< HEAD:pages/api/generate-itinerary-live.js
- Keep day titles descriptive (e.g., "Day 2: Neighborhoods & Markets in Tokyo").
- Always set "location" to "City, Country".
- Numbers in budget are daily totals in USD (integers).
- Do not include currency symbols in numbers (we format on the client).
=======
- Days length must equal ${n}.
- Keep day titles descriptive (e.g., "Day 2: Neighborhoods & Markets in Tokyo").
- Always set "location" to "City, Country".
- Numbers in budget are daily totals in USD (integers, no symbols).
>>>>>>> 1074d6a388cc5c4669705f34610de80ef887fd54:api/generate-itinerary-live.js
- Output must be valid JSON only.`;

    const user = {
      destination: resolvedDestination,
      country: country || null,
      city: city || null,
      startDate: startDate || null,
      endDate: endDate || null,
      days: n,
      travelers: travelers ? Number(travelers) : null,
<<<<<<< HEAD:pages/api/generate-itinerary-live.js
      style,
=======
      styles, // already ensured array
>>>>>>> 1074d6a388cc5c4669705f34610de80ef887fd54:api/generate-itinerary-live.js
      budgetLevel,
      pace,
      email: email || null,
      note: "Focus on iconic highlights + local flavor. Keep bullets concise."
    };

<<<<<<< HEAD:pages/api/generate-itinerary-live.js
    // --- Call OpenAI (Responses API via fetch; avoids extra deps) ---
=======
    // --- Call OpenAI ---
>>>>>>> 1074d6a388cc5c4669705f34610de80ef887fd54:api/generate-itinerary-live.js
    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
<<<<<<< HEAD:pages/api/generate-itinerary-live.js
        model: "gpt-4o-mini",         // cost-effective & good quality
=======
        model: "gpt-4o-mini",
>>>>>>> 1074d6a388cc5c4669705f34610de80ef887fd54:api/generate-itinerary-live.js
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

<<<<<<< HEAD:pages/api/generate-itinerary-live.js
    // Responses API returns output in 'output_text' or in structured content; normalize:
=======
>>>>>>> 1074d6a388cc5c4669705f34610de80ef887fd54:api/generate-itinerary-live.js
    const rawText =
      data.output_text ||
      (Array.isArray(data.output) ? data.output.map(x => x.content?.[0]?.text || "").join("\n") : "");

    let out;
    try {
      out = JSON.parse(rawText);
    } catch {
<<<<<<< HEAD:pages/api/generate-itinerary-live.js
      // Try to salvage JSON if model added backticks or prose
=======
>>>>>>> 1074d6a388cc5c4669705f34610de80ef887fd54:api/generate-itinerary-live.js
      const cleaned = rawText
        .replace(/^```json\s*/i, "")
        .replace(/```$/i, "")
        .trim();
      out = JSON.parse(cleaned);
    }

<<<<<<< HEAD:pages/api/generate-itinerary-live.js
    // Post-process: ensure day count and build a nice title if missing
=======
    // Days safety
>>>>>>> 1074d6a388cc5c4669705f34610de80ef887fd54:api/generate-itinerary-live.js
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
<<<<<<< HEAD:pages/api/generate-itinerary-live.js
      style || null,
      budgetLevel || null,
      pace || null,
    ].filter(Boolean);
=======
      styles.join(", "),
      budgetLevel || null,
      pace || null,
    ].filter(Boolean);

>>>>>>> 1074d6a388cc5c4669705f34610de80ef887fd54:api/generate-itinerary-live.js
    const finalTitle = out.title && String(out.title).trim()
      ? out.title
      : titleParts.join(" — ");

<<<<<<< HEAD:pages/api/generate-itinerary-live.js
    // Budget sanity
=======
    // Budget fallback
>>>>>>> 1074d6a388cc5c4669705f34610de80ef887fd54:api/generate-itinerary-live.js
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
