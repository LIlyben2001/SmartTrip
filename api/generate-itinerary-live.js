// /api/generate-itinerary-live.js
// Live AI-powered itinerary generator WITH language control.
// This is a drop-in replacement that preserves your existing logic and
// post-processing, adding: language enforcement + a shape-preserving translate pass.

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
      budgetUSD,            // optional, not required
      pace = "",
      email,
      country,
      city,

      // NEW: language settings coming from the client
      language = "en",      // e.g. 'en', 'zh', 'es', 'fr', 'de', 'ja'
      languageName = "English", // human-friendly label used in prompts
      instruction = "",     // optional extra instruction from client
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

    // ---------- Prompt (now language-aware) ----------
    const sys = [
      "You are SmartTrip, a precise travel-planning assistant.",
      `ALL TEXT in your output MUST be written in ${languageName}.`,
      "Return STRICT JSON only, with NO surrounding prose or code fences.",
      "JSON schema:",
      `{
        "title": string,              // e.g., "Paris Trip — 5 days — Culture — Mid-range — Balanced"
        "days": [
          {
            "title": string,          // e.g., "Day 1: Historic Core in Paris" (translate 'Day' too if needed)
            "location": string,       // City, Country
            "items": string[]         // 3–6 concise bullets, morning/afternoon/evening style
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
      }`,
      "Rules:",
      "- Keep day titles descriptive (e.g., “Day 2: Neighborhoods & Markets in Tokyo” — translate 'Day' label to the target language).",
      '- Always set "location" to "City, Country".',
      "- Numbers in budget are daily totals in USD (integers).",
      "- Do not include currency symbols in numbers.",
      "- Output must be VALID JSON and ONLY JSON.",
    ].join("\n");

    const user = {
      destination: resolvedDestination,
      country: country || null,
      city: city || null,
      startDate: startDate || null,
      endDate: endDate || null,
      days: n,
      travelers: travelers ? Number(travelers) : null,
      style,
      budgetLevel,
      budgetUSD: budgetUSD ? Number(budgetUSD) : null,
      pace,
      email: email || null,
      note:
        (instruction ? `${instruction} ` : "") +
        "Focus on iconic highlights + local flavor. Keep bullets concise."
    };

    // --- Call OpenAI (Responses API via fetch; avoids extra deps) ---
    const draftResp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.6,
        max_output_tokens: 1400,
        input: [
          { role: "system", content: sys },
          { role: "user",   content: JSON.stringify(user) }
        ]
      }),
    });

    if (!draftResp.ok) {
      const text = await draftResp.text();
      throw new Error(`OpenAI error ${draftResp.status}: ${text}`);
    }

    const draftData = await draftResp.json();

    // Responses API returns output in 'output_text' or in structured content; normalize:
    const rawText =
      draftData.output_text ||
      (Array.isArray(draftData.output) ? draftData.output.map(x => x.content?.[0]?.text || "").join("\n") : "");

    let out = tryParseJson(rawText);

    // ---------- Safety translate pass ----------
    // If the selected language isn't English, we run a second pass that *only*
    // translates string fields while preserving JSON shape & numeric values.
    if (language && language.toLowerCase() !== "en") {
      const translatorSystem = [
        `You are a precise translator. Translate ALL text fields to ${languageName}.`,
        "Keep the JSON structure and numeric values IDENTICAL.",
        "Output ONLY JSON.",
      ].join(" ");

      const translateResp = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.2,
          max_output_tokens: 1400,
          input: [
            { role: "system", content: translatorSystem },
            { role: "user",   content: JSON.stringify(out) }
          ]
        }),
      });

      if (translateResp.ok) {
        const tData = await translateResp.json();
        const tText =
          tData.output_text ||
          (Array.isArray(tData.output) ? tData.output.map(x => x.content?.[0]?.text || "").join("\n") : "");
        const translated = tryParseJson(tText);
        if (translated && typeof translated === "object") out = translated;
      }
    }

    // ---------- Post-process: ensure day count, title, budget (same as your original) ----------
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
      style || null,
      budgetLevel || null,
      pace || null,
    ].filter(Boolean);
    const finalTitle = out.title && String(out.title).trim()
      ? out.title
      : titleParts.join(" — ");

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
      language,
      languageName,
    });
  } catch (err) {
    console.error("AI API error:", err);
    return res.status(500).json({ error: "Failed to generate itinerary." });
  }
}

function tryParseJson(text) {
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    // Try to salvage JSON if model added backticks or prose
    const cleaned = String(text)
      .replace(/^```json\s*/i, "")
      .replace(/```$/i, "")
      .trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      return {};
    }
  }
}

