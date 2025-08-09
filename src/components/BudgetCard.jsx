// src/components/BudgetCard.jsx
import { useMemo, useState } from "react";
import { Card, CardContent } from "./ui/card";

// Static, approx conversion rates (USD -> target)
const RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 156,
  CNY: 7.25,
  AUD: 1.50,
  CAD: 1.37,
  HKD: 7.80,
};

const CURRENCY_LABELS = {
  USD: "USD $",
  EUR: "EUR €",
  GBP: "GBP £",
  JPY: "JPY ¥",
  CNY: "CNY ¥",
  AUD: "AUD $",
  CAD: "CAD $",
  HKD: "HKD $",
};

function fmt(amount, code) {
  if (typeof amount !== "number" || Number.isNaN(amount)) return "-";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      maximumFractionDigits: code === "JPY" ? 0 : 0, // keep whole numbers for table
    }).format(amount);
  } catch {
    return `${CURRENCY_LABELS[code] || code} ${Math.round(amount).toLocaleString()}`;
  }
}

export default function BudgetCard({ budget, travelers }) {
  const rows = budget?.rows || [];
  const [currency, setCurrency] = useState("USD");
  const [perPerson, setPerPerson] = useState(false);

  const factor = RATES[currency] ?? 1;
  const divisor = perPerson && travelers > 0 ? travelers : 1;

  // Convert + optionally divide per person
  const convertedRows = useMemo(() => {
    return rows.map((r) => ({
      category: r.category,
      budget: ((Number(r.budget) || 0) * factor) / divisor,
      mid: ((Number(r.mid) || 0) * factor) / divisor,
      luxury: ((Number(r.luxury) || 0) * factor) / divisor,
    }));
  }, [rows, factor, divisor]);

  const totals = useMemo(() => {
    return convertedRows.reduce(
      (acc, r) => ({
        budget: acc.budget + r.budget,
        mid: acc.mid + r.mid,
        luxury: acc.luxury + r.luxury,
      }),
      { budget: 0, mid: 0, luxury: 0 }
    );
  }, [convertedRows]);

  if (!rows.length) return null;

  return (
    <Card className="shadow-md">
      {/* Header with currency + per-person controls */}
      <div className="px-6 pt-6 pb-2 border-b border-gray-200 bg-gray-50 flex items-center justify-between gap-3 flex-wrap">
        <h3 className="text-lg font-bold text-gray-800">Estimated Trip Budget</h3>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Per person toggle */}
          <label className="flex items-center gap-2 text-sm select-none">
            <input
              type="checkbox"
              checked={perPerson}
              onChange={(e) => setPerPerson(e.target.checked)}
              className="h-4 w-4"
            />
            <span>
              Per person
              {travelers > 0 ? (
                <span className="text-gray-500"> (÷ {travelers})</span>
              ) : (
                <span className="text-gray-400"> (set travelers above)</span>
              )}
            </span>
          </label>

          {/* Currency selector */}
          <label className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Currency</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {Object.keys(RATES).map((code) => (
                <option key={code} value={code}>
                  {CURRENCY_LABELS[code] || code}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Disclaimer */}
        <p className="text-xs text-gray-500 mb-4 italic">
          * These amounts are rough estimates based on typical daily costs. Original figures are in USD and
          converted using approximate rates for display only. Actual prices vary by season, destination, and
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
              {convertedRows.map((row) => (
                <tr key={row.category}>
                  <td className="px-4 py-2 border font-medium">{row.category}</td>
                  <td className="px-4 py-2 border text-right">{fmt(row.budget, currency)}</td>
                  <td className="px-4 py-2 border text-right">{fmt(row.mid, currency)}</td>
                  <td className="px-4 py-2 border text-right">{fmt(row.luxury, currency)}</td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-50">
                <td className="px-4 py-2 border">
                  Total{perPerson && travelers > 0 ? " (per person)" : ""}
                </td>
                <td className="px-4 py-2 border text-right">{fmt(totals.budget, currency)}</td>
                <td className="px-4 py-2 border text-right">{fmt(totals.mid, currency)}</td>
                <td className="px-4 py-2 border text-right">{fmt(totals.luxury, currency)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Small rate note */}
        <p className="text-[11px] text-gray-400 mt-3">
          Rates used (USD→{currency}): {CURRENCY_LABELS[currency] || currency} × {RATES[currency]}. You can
          update these later or wire them to a live FX API.
        </p>
      </CardContent>
    </Card>
  );
}
