// src/components/generate-itinerary.js
export function generateMockItinerary({
  destination = "Your Destination",
  startDate,
  endDate,
  days,
  travelers,
  styles = [],
  budgetLevel = "",
  pace = "",
}) {
  // derive number of days
  let n = Number(days) || 5;

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
      { category: "Food", budget: 150, mid: 250, luxury: 400 },
      { category: "Transportation", budget: 50, mid: 100, luxury: 200 },
      { category: "Activities", budget: 100, mid: 200, luxury: 300 },
      { category: "Souvenirs", budget: 50, mid: 100, luxury: 200 },
    ],
  };

  const tripTitle = [
    `${destination} Trip`,
    `${n} days`,
    styles.join(", "),
    budgetLevel,
    pace,
  ].filter(Boolean).join(" — ");

  return {
    title: tripTitle,
    days: dayList,
    budget,
    travelers: Number(travelers) || null,
    startDate: startDate || null,
    endDate: endDate || null,
    source: "mock",
  };
}

