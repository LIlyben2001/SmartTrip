// src/components/BudgetCard.jsx
// Self-styled card (no dependency on ui/card exports that may not exist)

const currency = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(n)
    : n;

export default function BudgetCard({
  title = "Estimated Budget",
  rows = [
    { category: "Accommodation", budget: 200, mid: 300, luxury: 500 },
    { category: "Food",          budget: 150, mid: 250, luxury: 400 },
    { category: "Transportation",budget:  50, mid: 100, luxury: 200 },
    { category: "Activities",    budget: 100, mid: 200, luxury: 300 },
    { category: "Souvenirs",     budget:  50, mid: 100, luxury: 200 },
  ],
}) {
  if (!Array.isArray(rows) || rows.length === 0) return null;

  const totals = rows.reduce(
    (acc, r) => ({
      budget: acc.budget + (r.budget || 0),
      mid:    acc.mid    + (r.mid    || 0),
      luxury: acc.luxury + (r.luxury || 0),
    }),
    { budget: 0, mid: 0, luxury: 0 }
  );

  return (
    <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white">
      {/* Header */}
      <div className="px-4 pt-4">
        <h3 className="text-lg font-bold">{title}</h3>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="text-left font-semibold border-b px-3 py-2" style={{width: "34%"}}>Category</th>
                <th className="text-left font-semibold border-b px-3 py-2" style={{width: "22%"}}>Budget (2–3★)</th>
                <th className="text-left font-semibold border-b px-3 py-2" style={{width: "22%"}}>Mid-range (3★)</th>
                <th className="text-left font-semibold border-b px-3 py-2" style={{width: "22%"}}>Luxury (4–5★)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.category}>
                  <td className="border-b px-3 py-2">{r.category}</td>
                  <td className="border-b px-3 py-2">{currency(r.budget)}</td>
                  <td className="border-b px-3 py-2">{currency(r.mid)}</td>
                  <td className="border-b px-3 py-2">{currency(r.luxury)}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="border-b px-3 py-2">Total</td>
                <td className="border-b px-3 py-2">{currency(totals.budget)}</td>
                <td className="border-b px-3 py-2">{currency(totals.mid)}</td>
                <td className="border-b px-3 py-2">{currency(totals.luxury)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-500 mt-4 italic">
          *Prices shown are estimates based on average costs for the destination.
          Actual costs may vary depending on travel dates, accommodation, and local market conditions.
        </p>
      </div>
    </div>
  );
}
