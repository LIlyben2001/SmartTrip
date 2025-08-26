// src/components/BudgetCard.jsx
import { useMemo, useState, useEffect, Fragment } from "react"; // 👈 NEW: added useEffect + Fragment
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
      maximumFractionDigits: code === "JPY" ? 0 : 0,
    }).format(amount);
  } catch {
    return `${CURRENCY_LABELS[code] || code} ${Math.round(amount).toLocaleString()}`;
  }
}

/** Default nightly rates in USD per room per night */
const DEFAULT_NIGHTLY_USD = {
  budget: 80,
  mid: 150,
  luxury: 300,
};

function deriveNightlyUSD(budgetTier, budgetUSD) {
  let rates = { ...DEFAULT_NIGHTLY_USD };

  if (typeof budgetTier === "string") {
    const t = budgetTier.toLowerCase();
    if (t.includes("lux")) {
      rates = { budget: 120, mid: 220, luxury: 380 };
    } else if (t.includes("mid")) {
      rates = { budget: 90, mid: 160, luxury: 300 };
    } else if (t.includes("budget")) {
      rates = { budget: 70, mid: 130, luxury: 260 };
    }
  }

  const total = Number(budgetUSD || 0);
  if (total > 0) {
    let scale = 1;
    if (total <= 1500) scale = 0.9;
    else if (total >= 8000) scale = 1.1;
    rates = {
      budget: Math.round(rates.budget * scale),
      mid: Math.round(rates.mid * scale),
      luxury: Math.round(rates.luxury * scale),
    };
  }

  return rates;
}

function isAccommodation(label = "") {
  const s = String(label).toLowerCase();
  return /(accom|hotel|lodg|stay)/i.test(s);
}

function normalizeRows(rows = []) {
  return rows
    .map((r) => {
      const category = r.category || r.label || r.name || "";
      return category
        ? {
            category,
            budget: Number(r.budget ?? 0),
            mid: Number(r.mid ?? 0),
            luxury: Number(r.luxury ?? 0),
            subcategories: r.subcategories || [],
          }
        : null;
    })
    .filter(Boolean);
}

export default function BudgetCard({
  budget,
  travelers,
  daysCount,
  budgetTier,
  budgetUSD,
}) {
  const rows = budget?.rows || [];
  const [currency, setCurrency] = useState("USD");
  const [perPerson, setPerPerson] = useState(false);

  const [rates, setRates] = useState(RATES);

  useEffect(() => {
    async function fetchRates() {
      try {
        console.log("🌍 Fetching live exchange rates...");
        const res = await fetch("/api/exchange-rate");
        if (!res.ok) throw new Error("Failed to fetch rates");
        const data = await res.json();
        console.log("✅ Live rates received:", data);
        if (data?.rates) {
          setRates({ ...RATES, ...data.rates });
        }
      } catch (err) {
        console.warn("⚠️ Using static fallback rates:", err.message);
      }
    }
    fetchRates();
  }, []);

  const factor = rates[currency] ?? 1;
  const people = Math.max(1, Number(travelers || 1));
  const divisor = perPerson ? people : 1;

  const nights = Math.max(1, Math.max(1, Number(daysCount || 1)) - 1);
  const rooms = Math.max(1, Math.ceil(Math.max(1, Number(travelers || 2)) / 2));
  const nightlyUSD = deriveNightlyUSD(budgetTier, budgetUSD);

  const processedUSD = useMemo(() => {
    const norm = normalizeRows(rows);
    const out = norm.map((r) => ({ ...r, __note: "" }));

    let idx = out.findIndex((r) => isAccommodation(r.category));
    const accomTotals = {
      budget: nightlyUSD.budget * nights * rooms,
      mid: nightlyUSD.mid * nights * rooms,
      luxury: nightlyUSD.luxury * nights * rooms,
    };

    const noteUSD = `${nights} night${nights !== 1 ? "s" : ""} × ${rooms} room${
      rooms !== 1 ? "s" : ""
    }`;

    if (idx >= 0) {
      out[idx].budget = accomTotals.budget;
      out[idx].mid = accomTotals.mid;
      out[idx].luxury = accomTotals.luxury;
      out[idx].__note = noteUSD;
    } else {
      out.unshift({
        category: "Accommodation",
        budget: accomTotals.budget,
        mid: accomTotals.mid,
        luxury: accomTotals.luxury,
        __note: noteUSD,
        subcategories: [],
      });
    }

    return out;
  }, [rows, nightlyUSD, nights, rooms]);

  const convertedRows = useMemo(() => {
    return processedUSD.map((r) => {
      // 👇 NEW: aggregate Transportation parent totals from subcategories
      if (r.category === "Transportation" && r.subcategories?.length > 0) {
        const totals = r.subcategories.reduce(
          (acc, s) => ({
            budget: acc.budget + s.budget,
            mid: acc.mid + s.mid,
            luxury: acc.luxury + s.luxury,
          }),
          { budget: 0, mid: 0, luxury: 0 }
        );
        return {
          ...r,
          budget: (totals.budget * factor) / divisor,
          mid: (totals.mid * factor) / divisor,
          luxury: (totals.luxury * factor) / divisor,
          __note: r.__note,
          subcategories: r.subcategories.map((s) => ({
            ...s,
            budget: (s.budget * factor) / divisor,
            mid: (s.mid * factor) / divisor,
            luxury: (s.luxury * factor) / divisor,
          })),
        };
      }

      return {
        category: r.category,
        budget: (r.budget * factor) / divisor,
        mid: (r.mid * factor) / divisor,
        luxury: (r.luxury * factor) / divisor,
        __note: r.__note,
        subcategories: (r.subcategories || []).map((s) => ({
          ...s,
          budget: (s.budget * factor) / divisor,
          mid: (s.mid * factor) / divisor,
          luxury: (s.luxury * factor) / divisor,
        })),
      };
    });
  }, [processedUSD, factor, divisor]);

  // 👇 NEW: only sum parent categories (ignore subcategories for grand total)
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

  const nightlyNoteForCurrency = () => {
    const b = nightlyUSD.budget * factor;
    const m = nightlyUSD.mid * factor;
    const l = nightlyUSD.luxury * factor;
    return `Nightly: ${fmt(b, currency)} / ${fmt(m, currency)} / ${fmt(
      l,
      currency
    )} (Budget / Mid / Luxury)`;
  };

  return (
    <Card className="shadow-md">
      <div className="px-6 pt-6 pb-2 border-b border-gray-200 bg-gray-50 flex items-center justify-between gap-3 flex-wrap">
        <h3 className="text-lg font-bold text-gray-800">Estimated Trip Budget</h3>

        <div className="flex items-center gap-4 flex-wrap">
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
                <span className="text-gray-500">
                  {" "}
                  (÷ {Math.max(1, Number(travelers))})
                </span>
              ) : (
                <span className="text-gray-400"> (set travelers above)</span>
              )}
            </span>
          </label>

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
        {/* 👇 NEW concise disclaimer */}
        <p className="text-xs text-gray-500 mb-4 italic">
          * Estimates are <strong>per day for the total group</strong>. Use the “Per Person” checkbox above to view daily costs per traveler. Figures are in USD, converted to your currency using real-time exchange rates.
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border text-left whitespace-nowrap">
                  Category
                </th>
                <th className="px-4 py-2 border text-right whitespace-nowrap">
                  Budget (2–3★)
                </th>
                <th className="px-4 py-2 border text-right whitespace-nowrap">
                  Mid-range (3★)
                </th>
                <th className="px-4 py-2 border text-right whitespace-nowrap">
                  Luxury (4–5★)
                </th>
              </tr>
            </thead>
            <tbody>
              {convertedRows.map((row) => (
                <Fragment key={row.category}>
                  <tr className="align-top font-semibold bg-gray-50">
                    <td className="px-4 py-2 border">
                      {row.category}
                      {isAccommodation(row.category) && (
                        <div className="text-xs text-gray-500 mt-1">
                          {processedUSD.find((r) =>
                            isAccommodation(r.category)
                          )?.__note}
                          {" • "}
                          {nightlyNoteForCurrency()}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 border text-right">
                      {fmt(row.budget, currency)}
                    </td>
                    <td className="px-4 py-2 border text-right">
                      {fmt(row.mid, currency)}
                    </td>
                    <td className="px-4 py-2 border text-right">
                      {fmt(row.luxury, currency)}
                    </td>
                  </tr>

                  {row.subcategories &&
                    row.subcategories.length > 0 &&
                    row.subcategories.map((sub) => (
                      <tr key={sub.category} className="align-top bg-gray-50">
                        <td className="px-8 py-2 border text-gray-600">
                          ↳ {sub.category}
                        </td>
                        <td className="px-4 py-2 border text-right">
                          {fmt(sub.budget, currency)}
                        </td>
                        <td className="px-4 py-2 border text-right">
                          {fmt(sub.mid, currency)}
                        </td>
                        <td className="px-4 py-2 border text-right">
                          {fmt(sub.luxury, currency)}
                        </td>
                      </tr>
                    ))}
                </Fragment>
              ))}
              <tr className="font-bold bg-orange-100 text-lg border-t-2 border-orange-400">
                <td className="px-4 py-2 border">
                  Total{perPerson && travelers > 0 ? " (per person)" : ""}
                </td>
                <td className="px-4 py-2 border text-right">
                  {fmt(totals.budget, currency)}
                </td>
                <td className="px-4 py-2 border text-right">
                  {fmt(totals.mid, currency)}
                </td>
                <td className="px-4 py-2 border text-right">
                  {fmt(totals.luxury, currency)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-gray-400 mt-3">
          Rates used (USD→{currency}): {CURRENCY_LABELS[currency] || currency} ×{" "}
          {rates[currency]}. Live values fetched from API when available.
        </p>
      </CardContent>
    </Card>
  );
}
