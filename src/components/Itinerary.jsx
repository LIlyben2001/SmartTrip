// /api/generate-itinerary.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const {
      destination = "",
      startDate,
      endDate,
      days,
      travelers = "",
      style = "",
      budgetLevel = "",
      pace = "",
    } = req.body || {};

    // derive # of days
    let n = Number(days) || 0;
    if (!n && startDate && endDate) {
      const sd = new Date(startDate), ed = new Date(endDate);
      if (!isNaN(sd) && !isNaN(ed)) n = Math.max(1, Math.round((ed - sd) / 86400000) + 1);
    }
    if (!n) n = 5;

    // descriptive mock titles
    const themes = [
      "Arrival & Orientation",
      "Historic Core",
      "Museums & Culture",
      "Nature & Views",
      "Food Crawl",
      "Neighborhoods",
      "Day Trip",
      "Hidden Gems",
      "Waterfront & Markets",
      "Farewell Day",
    ];

    const dayList = Array.from({ length: n }).map((_, i) => ({
      title: `Day ${i + 1}: ${themes[i % themes.length]} in ${destination}`,
      location: destination,
      items: [
        "Morning: Visit top landmark",
        "Afternoon: Explore local market",
        "Evening: Enjoy traditional dinner",
      ],
    }));

    const budget = {
      rows: [
        { category: "Accommodation", budget: 200, mid: 300, luxury: 500 },
        { category: "Food",          budget: 150, mid: 250, luxury: 400 },
        { category: "Transportation",budget:  50, mid: 100, luxury: 200 },
        { category: "Activities",    budget: 100, mid: 200, luxury: 300 },
        { category: "Souvenirs",     budget:  50, mid: 100, luxury: 200 },
      ],
    };

    const tripTitle = [
      `${destination} Trip`,
      `${n} days`,
      style,
      budgetLevel,
      pace,
    ].filter(Boolean).join(" — ");

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
