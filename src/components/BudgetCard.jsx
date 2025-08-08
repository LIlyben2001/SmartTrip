import { Card, CardContent } from "./ui/card";

const titleClass = "text-lg font-bold";

const currency = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n)
    : n;

export default function BudgetCard({
  title = "Budget — Trip Overview",
  rows = [
    { category: "Accommodation", budget: 200, mid: 300, luxury: 500 },
    { category: "Food",          budget: 150, mid: 250, luxury: 400 },
    { category: "Transportation",budget:  50, mid: 100, luxury: 200 },
    { category: "Activities",    budget: 100, mid: 200, luxury: 300 },
    { category: "Souvenirs",     budget:  50, mid: 100, luxury: 200 },
  ],
}) {
  const totals = rows.reduce(
    (acc, r) => ({
      budget: acc.budget + (r.budget || 0),
      mid:    acc.mid    + (r.mid    || 0),
      luxury: acc.luxury + (r.luxury || 0),
    }),
    { budget: 0, mid: 0, luxury: 0 }
  );

  const tableClass = "w-full table-fixed border-separate border-spacing-0 text-sm";
  const thClass    = "text-left font-semibold border-b px-3 py-2";
  const tdClass    = "border-b px-3 py-2 align-top";
  const totalRow   = "font-bold";

  return (
    <Card className="mt-4">
      <div className="px-4 pt-4">
        <h3 className={titleClass}>{title}</h3>
      </div>
      <CardContent>
        <div style={{ overflowX: "auto" }}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass} style={{width: "34%"}}>Category</th>
                <th className={thClass} style={{width: "22%"}}>Budget (2–3★)</th>
                <th className={thClass} style={{width: "22%"}}>Mid-range (3★)</th>
                <th className={thClass} style={{width: "22%"}}>Luxury (4–5★)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.category}>
                  <td className={tdClass}>{r.category}</td>
                  <td className={tdClass}>{currency(r.budget)}</td>
                  <td className={tdClass}>{currency(r.mid)}</td>
                  <td className={tdClass}>{currency(r.luxury)}</td>
                </tr>
              ))}
              <tr className={totalRow}>
                <td className={tdClass}>Total</td>
                <td className={tdClass}>{currency(totals.budget)}</td>
                <td className={tdClass}>{currency(totals.mid)}</td>
                <td className={tdClass}>{currency(totals.luxury)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
