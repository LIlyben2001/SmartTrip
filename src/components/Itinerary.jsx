import DaySection from "./DaySection";

export default function Itinerary({ tripTitle, days = [], budgetRows }) {
  if (!days?.length) return null;

  return (
    <div className="max-w-4xl mx-auto px-2 md:px-0">
      {tripTitle && (
        <h2 className="text-2xl font-semibold mb-3">{tripTitle}</h2>
      )}

      <h3 className="text-xl font-semibold mb-3">Your AI-Generated Itinerary</h3>

      <div className="space-y-4">
        {days.map((day, idx) => (
          <DaySection
            key={idx}
            title={day.title || `Day ${idx + 1}`}
            location={day.location}
            bullets={day.bullets || []}
          />
        ))}
      </div>

      {/* We’ll still keep Budget as a separate card if/when you want it shown below.
         Just uncomment when ready: */}
      {/* {budgetRows?.length ? (
        <div className="mt-4">
          <BudgetCard title="Budget — Trip Overview" rows={budgetRows} />
        </div>
      ) : null} */}
    </div>
  );
}
