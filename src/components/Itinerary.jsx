// src/components/Itinerary.jsx
import DaySection from "./DaySection";
import BudgetCard from "./BudgetCard";

export default function Itinerary({ tripTitle, days = [], budgetRows }) {
  if (!days?.length) return null;

  return (
    <div>
      {tripTitle ? <h2 className="text-xl font-bold mb-3">{tripTitle}</h2> : null}

      <div className="space-y-3">
        {days.map((day, idx) => (
          <DaySection
            key={idx}
            title={day.title || `Day ${idx + 1}`}
            location={day.location}
            bullets={day.bullets || []}
            defaultOpen={idx === 0}
          />
        ))}
      </div>

      {budgetRows?.length ? (
        <BudgetCard title="Budget — Trip Overview" rows={budgetRows} />
      ) : null}
    </div>
  );
}
