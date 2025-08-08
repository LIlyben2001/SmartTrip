// src/components/Itinerary.jsx
import DaySection from "./DaySection";
import BudgetCard from "./BudgetCard";

const DEFAULT_BUDGET_ROWS = [
  { category: "Accommodation", budget: 200, mid: 300, luxury: 500 },
  { category: "Food",          budget: 150, mid: 250, luxury: 400 },
  { category: "Transportation",budget:  50, mid: 100, luxury: 200 },
  { category: "Activities",    budget: 100, mid: 200, luxury: 300 },
  { category: "Souvenirs",     budget:  50, mid: 100, luxury: 200 },
];

export default function Itinerary({ tripTitle, days = [], budgetRows }) {
  if (!days?.length) return null;

  const rows = Array.isArray(budgetRows) && budgetRows.length
    ? budgetRows
    : DEFAULT_BUDGET_ROWS;

  return (
    <div className="max-w-4xl mx-auto px-2 md:px-0">
      {tripTitle && <h2 className="text-2xl font-semibold mb-3">{tripTitle}</h2>}
      <h3 className="text-xl font-semibold mb-3">Your AI-Generated Itinerary</h3>

      <div className="space-y-4">
        {days.map((day, idx) => (
          <DaySection
            key={idx}
            index={idx}
            title={day.title}                        // keep descriptive titles
            location={day.location}
            bullets={day.bullets ?? day.items ?? []} // support either key
          />
        ))}
      </div>

      <div className="mt-4">
        <BudgetCard title="Budget — Trip Overview" rows={rows} />
      </div>
    </div>
  );
}
