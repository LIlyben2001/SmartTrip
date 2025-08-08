// /api/generate-itinerary.js
// Vercel serverless (Node)
// Requires env var: OPENAI_API_KEY

const MODEL = "gpt-4o-mini"; // fast & cheap; switch to gpt-4o if you want

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      destination = "Your Destination",
      startDate,
      endDate,
      days,
      travelers = 2,
      style = "",
      budgetLevel = "",
      pace = "",
      email,
    } = req.body || {};

    const n = deriveNumDays({ startDate, endDate, days }) || 5;

    // Build a rock-solid prompt that demands strict JSON (NO prose)
    const system = `
You are an assistant that outputs ONLY strict JSON, no code fences, no prose.
Return an object: {
  "title": string, // e.g. "Hong Kong Trip — 5 days • Foodies • Mid-range • Balanced"
  "days": [
    {
      "title": string,     // "Day 1" (no ranges; one day per object)
      "location": string,  // city/region
      "items": [           // 3–5 bullets, each should START with "Morning:", "Afternoon:", or "Evening:"
        "Morning: …",
        "Afternoon: …",
        "Evening: …"
      ]
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
- The "days" array MUST have exactly ${n} entries, one per day, titled "Day 1", "Day 2", … "Day ${n}".
- Each day must have 3–5 items, labeled Morning/Afternoon/Evening (repeat periods if needed).
- Budgets are USD per entire trip (not per day) and should be integers.
- DO NOT include any text outside the JSON.
`;

    const user = JSON.stringify({
      destination,
      startDate,
      endDate,
      days: n,
      travelers,
      style,
      budgetLevel,
      pace,
      email,
    });

    const ai = await callOpenAIJson(system, user);

    // Try to parse AI JSON. If it fails, fall back.
    let data = safeJsonParse(ai);

    // Normalize to guarantee your UI shape
    data = normalizeOutput(data, { destination, n, style, budgetLevel, pace });

    return res.status(200).json({
      title: data.title,
      days: data.days,
      budget: data.budget,
      travelers,
      startDate: startDate || null,
      endDate: endDate || null,
    });
  } catch (err) {
    console.error("API error:", err);
    // Fallback stub so your UI still renders
    const fallback = fallbackPayload();
    return res.status(200).json(fallback);
  }
}

/* ---------------- helpers ---------------- */

function deriveNumDays({ startDate, endDate, days }) {
  const n = Number(days);
  if (n && n > 0) return n;
  if (startDate && endDate) {
    const sd = new Date(startDate);
    const ed = new Date(endDate);
    if (!isNaN(sd) && !isNaN(ed)) {
      const diff = Math.round((ed - sd) / 86400000) + 1; // inclusive
      if (diff > 0) return diff;
    }
  }
  return null;
}

async function callOpenAIJson(system, user) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.5,
      response_format: { type: "json_object" }, // ask for valid JSON
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`OpenAI ${resp.status}: ${t}`);
  }

  const json = await resp.json();
  const content = json?.choices?.[0]?.message?.content ?? "";
  return content;
}

function safeJsonParse(s) {
  try {
    // strip accidental code fences
    const clean = String(s).replace(/^```json\s*/i, "").replace(/```$/i, "");
    return JSON.parse(clean);
  } catch {
    return null;
  }
}

function normalizeOutput(data, { destination, n, style, budgetLevel, pace }) {
  // Base skeleton
  const out = {
    title: buildTitle(destination, n, style, budgetLevel, pace),
    days: [],
    budget: {
      rows: [
        { category: "Accommodation", budget: 200, mid: 300, luxury: 500 },
        { category: "Food",          budget: 150, mid: 250, luxury: 400 },
        { category: "Transportation",budget:  50, mid: 100, luxury: 200 },
        { category: "Activities",    budget: 100, mid: 200, luxury: 300 },
        { category: "Souvenirs",     budget:  50, mid: 100, luxury: 200 },
      ],
    },
  };

  if (data && typeof data === "object") {
    if (typeof data.title === "string" && data.title.trim()) {
      out.title = data.title.trim();
    }
    if (data.budget?.rows && Array.isArray(data.budget.rows)) {
      out.budget.rows = clampBudgetRows(data.budget.rows);
    }
    if (Array.isArray(data.days)) {
      out.days = data.days
        .slice(0, n)
        .map((d, i) => normalizeDay(d, i, destination));
    }
  }

  // Ensure exactly n days; pad with placeholders if needed
  if (out.days.length < n) {
    for (let i = out.days.length; i < n; i++) {
      out.days.push(placeholderDay(i, destination));
    }
  }
  // Fix titles to strict "Day X"
  out.days = out.days.map((d, i) => ({
    ...d,
    title: `Day ${i + 1}`,
  }));

  // Ensure every bullet starts with Morning/Afternoon/Evening
  out.days = out.days.map(forceTimeOfDayLabels);

  return out;
}

function buildTitle(destination, n, style, budgetLevel, pace) {
  const parts = [`${destination} Trip`, `${n} days`];
  if (style) parts.push(style);
  if (budgetLevel) parts.push(budgetLevel);
  if (pace) parts.push(pace);
  return parts.filter(Boolean).join(" — ");
}

function clampBudgetRows(rows) {
  const wanted = ["Accommodation", "Food", "Transportation", "Activities", "Souvenirs"];
  const map = {};
  for (const r of rows) {
    const cat = String(r.category || "").trim();
    if (!cat) continue;
    const key = wanted.find((w) => w.toLowerCase() === cat.toLowerCase());
    if (!key) continue;
    map[key] = {
      category: key,
      budget: toInt(r.budget, 0),
      mid: toInt(r.mid, 0),
      luxury: toInt(r.luxury, 0),
    };
  }
  // return in the desired order, filling defaults if missing
  return wanted.map((key) => map[key] || { category: key, budget: 0, mid: 0, luxury: 0 });
}

function normalizeDay(d, i, destination) {
  const location = (d?.location || destination || "").toString();
  const items = Array.isArray(d?.items) ? d.items : Array.isArray(d?.bullets) ? d.bullets : [];
  const sanitized = items
    .map((s) => String(s).trim())
    .filter(Boolean);
  return {
    title: `Day ${i + 1}`,
    location,
    items: sanitized.length
      ? sanitized
      : ["Morning: City orientation walk", "Afternoon: Local market visit", "Evening: Neighborhood dinner"],
  };
}

function placeholderDay(i, destination) {
  return {
    title: `Day ${i + 1}`,
    location: destination,
    items: [
      "Morning: Landmark visit",
      "Afternoon: Museum or park",
      "Evening: Dinner in a local neighborhood",
    ],
  };
}

function forceTimeOfDayLabels(day) {
  const labelRegex = /^(Morning|Afternoon|Evening)\s*:/i;
  const parts = ["Morning", "Afternoon", "Evening"];
  const items = day.items?.slice?.() || [];
  if (items.length === 0) {
    day.items = ["Morning: Activity", "Afternoon: Activity", "Evening: Activity"];
    return day;
  }
  const fixed = [];
  for (let i = 0; i < items.length; i++) {
    const val = String(items[i]);
    if (labelRegex.test(val)) {
      fixed.push(val);
    } else {
      const label = parts[Math.min(i, parts.length - 1)];
      fixed.push(`${label}: ${val}`);
    }
  }
  day.items = fixed;
  return day;
}

function toInt(x, def = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? Math.round(n) : def;
}

function fallbackPayload() {
  return {
    title: "Sample Trip — 5 days",
    days: Array.from({ length: 5 }).map((_, i) => ({
      title: `Day ${i + 1}`,
      location: "Sample City",
      items: [
        "Morning: Top landmark visit",
        "Afternoon: Local market & cafe",
        "Evening: Neighborhood walk & dinner",
      ],
    })),
    budget: {
      rows: [
        { category: "Accommodation", budget: 200, mid: 300, luxury: 500 },
        { category: "Food",          budget: 150, mid: 250, luxury: 400 },
        { category: "Transportation",budget:  50, mid: 100, luxury: 200 },
        { category: "Activities",    budget: 100, mid: 200, luxury: 300 },
        { category: "Souvenirs",     budget:  50, mid: 100, luxury: 200 },
      ],
    },
  };
}
