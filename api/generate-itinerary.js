// /api/generate-itinerary.js (Vercel serverless function - Node runtime)
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      destination = "Your Destination",
      days = 5,
      travelers = 2,
      style = "",
      budgetLevel = "",
      pace = "",
    } = req.body || {};

    // --- build some mock days so the UI renders ---
    const n = Math.max(1, Number(days) || 5);
    const dayList = Array.from({ length: n }).map((_, i) => ({
      title: `Day ${i + 1}`,
      location: destination,
      items: [
        "Morning: Top landmark visit",
        "Afternoon: Local market & cafe",
        "Evening: Neighborhood walk & dinner",
      ],
    }));

    // --- simple budget table to match your BudgetCard ---
    const budget = {
      rows: [
        { category: "Accommodation", budget: 200, mid: 300, luxury: 500 },
        { category: "Food",          budget: 150, mid: 250, luxury: 400 },
        { category: "Transportation",budget:  50, mid: 100, luxury: 200 },
        { category: "Activities",    budget: 100, mid: 200, luxury: 300 },
        { category: "Souvenirs",     budget:  50, mid: 100, luxury: 200 },
      ],
    };

    return res.status(200).json({
      title: `${destination} Trip — ${n} days${style ? ` • ${style}` : ""}${budgetLevel ? ` • ${budgetLevel}` : ""}${pace ? ` • ${pace}` : ""}`,
      days: dayList,
      budget,
      travelers,
    });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
