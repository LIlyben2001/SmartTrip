// src/api/generate-itinerary-live.js
// Live AI-powered itinerary generator (keeps your mock file untouched)

// 👈 UPDATED: Hybrid baseline datasets (raised accommodation costs for realism)
const CITY_COSTS = {
  "Los Angeles": { food: 70, transport: 25, accommodation: 250 }, // was 180
  "New York": { food: 80, transport: 30, accommodation: 320 },    // was 220
  "Tokyo": { food: 60, transport: 20, accommodation: 200 },       // was 150
  "Paris": { food: 65, transport: 20, accommodation: 280 },       // was 170
  "Bangkok": { food: 25, transport: 10, accommodation: 90 },      // was 60
};

const REGION_DEFAULTS = {
  USA: { food: 60, transport: 25, accommodation: 200 },      // was 150
  Europe: { food: 50, transport: 20, accommodation: 180 },   // was 120
  Asia: { food: 30, transport: 10, accommodation: 120 },     // was 80
};

// 👈 Helper function to scale baseline numbers by tier
function scaleBudget(base, tier) {
  if (tier === "Budget") return Math.round(base * 0.7);
  if (tier === "Mid-range") return Math.round(base * 1.3); // bumped from 1.2
  if (tier === "Luxury") return Math.round(base * 3.0);    // bumped from 2.5
  return base;
}

// 👈 Helper to adjust costs by number of travelers
function adjustForTravelers(value, category, travelers = 1) {
  if (!travelers || travelers < 1) return value;
  if (category === "Food" || category === "Transportation" || category === "Car" || category === "Bus" || category === "Train") {
    return value * travelers;
  }
  if (category === "Accommodation") {
    // scaled up slightly for realism in shared rooms
    if (travelers === 1) return value;
    if (travelers === 2) return Math.round(value * 1.6); // was 1.4
    return Math.round(value * (1 + (travelers - 1) * 0.7)); // was 0.5 per extra
  }
  return Math.round(value * (1 + (travelers - 1) * 0.7));
}

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

    console.log("📩 API Request body:", req.body);

    const resolvedDestination =
      city && country ? `${city}, ${country}` : destination || "Your Destination";

    const resolvedStyle = Array.isArray(style) ? style.join(" + ") : style || "";

    let n = Number(days) || 0;
    if (!n && startDate && endDate) {
      const sd = new Date(startDate),
        ed = new Date(endDate);
      if (!isNaN(sd) && !isNaN(ed))
        n = Math.max(1, Math.round((ed - sd) / 86400000) + 1);
    }
    if (!n) n = 5;

    console.log("📅 Trip length resolved to:", n, "days");

    // 👇 UPDATED SCHEMA for Transportation w/ subcategories
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
      { 
        "category": "Transportation",
        "subcategories": [
          { "category": "Car / Rideshare", "budget": number, "mid": number, "luxury": number },
          { "category": "Bus",             "budget": number, "mid": number, "luxury": number },
          { "category": "Train",           "budget": number, "mid": number, "luxury": number }
        ]
      },
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
- Make it practical for travelers, not generic placeholders.`;

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

    console.log("📝 Prompt user object sent to OpenAI:", user);

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

    console.log("🌐 OpenAI API status:", resp.status);

    if (!resp.ok) {
      const text = await resp.text();
      console.error("❌ OpenAI API Error response:", text);
      throw new Error(`OpenAI error ${resp.status}: ${text}`);
    }

    const data = await resp.json();
    console.log("🌐 OpenAI raw JSON response:", data);

    let rawText =
      data.output_text ||
      (Array.isArray(data.output)
        ? data.output.map((x) => x.content?.[0]?.text || "").join("\n")
        : "");

    if (!rawText && data.choices?.length) {
      rawText = data.choices[0].message?.content || "";
    }

    console.log("🔎 RAW TEXT BEFORE PARSE:", rawText);

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

    console.log("✅ Parsed AI itinerary object:", out);

    const baseCosts =
      (city && CITY_COSTS[city]) ||
      (country && REGION_DEFAULTS[country]) ||
      { food: 40, transport: 15, accommodation: 150 };

    console.log("💰 Base costs selected:", baseCosts);

    const hybridBudget = {
      rows: [
        {
          category: "Accommodation",
          budget: adjustForTravelers(scaleBudget(baseCosts.accommodation, "Budget"), "Accommodation", travelers),
          mid: adjustForTravelers(scaleBudget(baseCosts.accommodation, "Mid-range"), "Accommodation", travelers),
          luxury: adjustForTravelers(scaleBudget(baseCosts.accommodation, "Luxury"), "Accommodation", travelers),
        },
        {
          category: "Food",
          budget: adjustForTravelers(scaleBudget(baseCosts.food, "Budget"), "Food", travelers),
          mid: adjustForTravelers(scaleBudget(baseCosts.food, "Mid-range"), "Food", travelers),
          luxury: adjustForTravelers(scaleBudget(baseCosts.food, "Luxury"), "Food", travelers),
        },
        {
          category: "Transportation",
          subcategories: [
            {
              category: "Car / Rideshare",
              budget: adjustForTravelers(20, "Car", travelers),
              mid: adjustForTravelers(40, "Car", travelers),
              luxury: adjustForTravelers(80, "Car", travelers),
            },
            {
              category: "Bus",
              budget: adjustForTravelers(5, "Bus", travelers),
              mid: adjustForTravelers(10, "Bus", travelers),
              luxury: adjustForTravelers(15, "Bus", travelers),
            },
            {
              category: "Train",
              budget: adjustForTravelers(10, "Train", travelers),
              mid: adjustForTravelers(20, "Train", travelers),
              luxury: adjustForTravelers(40, "Train", travelers),
            },
          ],
        },
        {
          category: "Activities",
          budget: adjustForTravelers(50, "Activities", travelers),
          mid: adjustForTravelers(120, "Activities", travelers),
          luxury: adjustForTravelers(250, "Activities", travelers),
        },
        {
          category: "Souvenirs",
          budget: adjustForTravelers(20, "Souvenirs", travelers),
          mid: adjustForTravelers(60, "Souvenirs", travelers),
          luxury: adjustForTravelers(120, "Souvenirs", travelers),
        },
      ],
    };

    console.log("💰 Final hybrid budget generated:", hybridBudget);

    // 👇 SAFER FALLBACK — only overwrite if AI failed
    let safeDays = [];
    if (Array.isArray(out.days) && out.days.length > 0) {
      safeDays = out.days.slice(0, n);
    } else {
      for (let i = 0; i < n; i++) {
        safeDays.push({
          title: `Day ${i + 1}: Highlights in ${resolvedDestination}`,
          location: resolvedDestination,
          items: [
            "Morning: Iconic landmark visit",
            "Afternoon: Local market & museum",
            "Evening: Neighborhood stroll & dinner",
          ],
        });
      }
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

    const budget = hybridBudget;

    console.log("📤 Sending final API response:", {
      title: finalTitle,
      days: safeDays.length,
      budget,
      travelers,
    });

    return res.status(200).json({
      title: finalTitle,
      days: safeDays,
      budget,
      travelers: travelers ? Number(travelers) : null,
      startDate: startDate || null,
      endDate: endDate || null,
      source: "openai+hybrid",
    });
  } catch (err) {
    console.error("❌ AI API error (top-level):", err);
    return res.status(500).json({ error: "Failed to generate itinerary." });
  }
}
