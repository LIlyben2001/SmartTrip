// src/components/BudgetCard.jsx
import { Card, CardContent } from "./ui/card";

const currency = (n) =>
  typeof n === "number" && !Number.isNaN(n)
    ? new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(n)
    : "-";

export default function BudgetCard({ budget }) {
  const rows = budget?.rows || [];
  if (!rows.length) return null;

  const totals = rows.reduce(
    (acc, r) => ({
      budget: acc.budget + (Number(r.budget) || 0),
      mid: acc.mid + (Number(r.mid) || 0),
      luxury: acc.luxury + (Number(r.luxury) || 0),
    }),
    { budget: 0, mid: 0, luxury: 0 }
  );

  return (
    <Card className="shadow-md">
      {/* Header */}
      <div className="px-6 pt-6 pb-2 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-bold text-gray-800">Estimated Trip Budget</h3>
      </div>

      <CardContent className="p-6">
        {/* Disclaimer */}
        <p className="text-xs text-gray-500 mb-4 italic">
          * These amounts are rough estimates based on typical costs for budget, mid-range, and luxury
          travel. Prices are not in real-time and may vary depending on the season, destination, and
          booking choices.
        </p>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border text-left">Category</th>
                <th className="px-4 py-2 border text-right">Budget (2–3★)</th>
                <th className="px-4 py-2 border text-right">Mid-range (3★)</th>
                <th className="px-4 py-2 border text-right">Luxury (4–5★)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.category}>
                  <td className="px-4 py-2 border font-medium">{row.category}</td>
                  <td className="px-4 py-2 border text-right">{currency(row.budget)}</td>
                  <td className="px-4 py-2 border text-right">{currency(row.mid)}</td>
                  <td className="px-4 py-2 border text-right">{currency(row.luxury)}</td>
                </tr>
              ))}
              {/* Totals row */}
              <tr className="font-bold bg-gray-50">
                <td className="px-4 py-2 border">Total</td>
                <td className="px-4 py-2 border text-right">{currency(totals.budget)}</td>
                <td className="px-4 py-2 border text-right">{currency(totals.mid)}</td>
                <td className="px-4 py-2 border text-right">{currency(totals.luxury)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
