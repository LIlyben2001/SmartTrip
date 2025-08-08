// /api/generate-itinerary.js
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
    } = req.body || {};

    // --- derive number of days ---
    const parseISO = (s) => (s ? new Date(s) : null);
    const sd = parseISO(startDate);
    const ed = parseISO(endDate);

    let n = Number(days) || 0;
    if (!n && sd && ed && !isNaN(sd) && !isNaN(ed)) {
      const ms = ed.getTime() - sd.getTime();
      // inclusive range (e.g., 2025-08-01 to 2025-08-05 = 5 days)
      n = Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)) + 1);
    }
    if (!n) n = 5; // final fallback

    // --- build day list for UI (title = "Day X", location = destination) ---
    const dayList = Array.from({ length: n }).map((_, i) => ({
      title: `Day ${i + 1}`,
      location: destination,
      // These bullets auto-group in DaySection by Morning/Afternoon/Evening:
      items: [
        "Morning: Top landmark visit",
        "Afternoon: Local market & cafe",
        "Evening: Neighborhood walk & dinner",
      ],
    }));

    // --- budget table (static example; replace with your math later) ---
    const budget = {
      rows: [
        { category: "Accommodation", budget: 200, mid: 300, luxury: 500 },
        { category: "Food",          budget: 150, mid: 250, luxury: 400 },
        { category: "Transportation",budget:  50, mid: 100, luxury: 200 },
        { category: "Activities",    budget: 100, mid: 200, luxury: 300 },
        { category: "Souvenirs",     budget:  50, mid: 100, luxury: 200 },
      ],
    };

    // --- trip title (shown above itinerary) ---
    const titleParts = [`${destination} Trip`, `${n} days`];
    if (style)       titleParts.push(style);
    if (budgetLevel) titleParts.push(budgetLevel);
    if (pace)        titleParts.push(pace);

    const tripTitle = titleParts
      .filter(Boolean)
      .join(" — ")
      .replace(" — ", " — ") // keep en-dash look if you prefer

    return res.status(200).json({
      title: tripTitle,
      days: dayList,
      budget,
      travelers,
      startDate: startDate || null,
      endDate: endDate || null,
    });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
