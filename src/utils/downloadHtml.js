// /src/utils/downloadHtml.js
// Builds a clean HTML string for download and avoids duplicate location in day titles.

export function itineraryTextToHtml({ tripTitle = "", days = [], budgetRows = [] }) {
  const escape = (s) =>
    String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const currency = (n) =>
    typeof n === "number"
      ? new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(n)
      : escape(n);

  const buildDisplayTitle = (index, rawTitle, location) => {
    const i = index + 1;
    const t = (rawTitle || "").trim();
    if (t) {
      const m = t.match(/^ *Day\s*\d+\s*[:—-]?\s*(.*)$/i);
      const suffix = m ? (m[1] || "").trim() : t;
      return suffix ? `Day ${i}: ${suffix}` : `Day ${i}`;
    }
    return location ? `Day ${i} — ${location}` : `Day ${i}`;
  };

  const daySections = (Array.isArray(days) ? days : []).map((d, idx) => {
    const title = buildDisplayTitle(idx, d?.title, d?.location);
    const items = Array.isArray(d?.items) ? d.items : Array.isArray(d?.bullets) ? d.bullets : [];
    const lis = items.map((line) => `<li>${escape(line)}</li>`).join("");

    return `
      <section class="day">
        <h3 class="day-title">${escape(title)}</h3>
        <ul class="bullets">
          ${lis}
        </ul>
      </section>
    `;
  });

  const rows = Array.isArray(budgetRows) ? budgetRows : [];
  const totals = rows.reduce(
    (acc, r) => ({
      budget: acc.budget + (r.budget || 0),
      mid: acc.mid + (r.mid || 0),
      luxury: acc.luxury + (r.luxury || 0),
    }),
    { budget: 0, mid: 0, luxury: 0 }
  );

  const budgetSection = rows.length
    ? `
    <section class="budget">
      <h3>Estimated Trip Budget</h3>
      <p class="disclaimer">
        * These amounts are rough estimates based on typical costs for budget, mid-range,
        and luxury travel. Prices are not in real-time and may vary depending on the season,
        destination, and booking choices.
      </p>
      <table class="budget-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Budget (2–3★)</th>
            <th>Mid-range (3★)</th>
            <th>Luxury (4–5★)</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (r) => `
            <tr>
              <td>${escape(r.category)}</td>
              <td>${currency(r.budget)}</td>
              <td>${currency(r.mid)}</td>
              <td>${currency(r.luxury)}</td>
            </tr>`
            )
            .join("")}
          <tr class="total">
            <td>Total</td>
            <td>${currency(totals.budget)}</td>
            <td>${currency(totals.mid)}</td>
            <td>${currency(totals.luxury)}</td>
          </tr>
        </tbody>
      </table>
    </section>
  `
    : "";

  return `
<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${escape(tripTitle || "Itinerary")}</title>
<style>
  body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; line-height: 1.5; color: #111; margin: 32px; }
  h1 { font-size: 28px; margin: 0 0 18px; }
  h2 { font-size: 20px; margin: 24px 0 12px; }
  .day { margin: 18px 0 24px; }
  .day-title { font-size: 18px; margin: 0 0 8px; padding: 8px 12px; background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 8px; }
  .bullets { margin: 8px 0 0 22px; }
  .bullets li { margin: 4px 0; }
  .budget { margin-top: 28px; }
  .budget .disclaimer { font-size: 12px; color: #6b7280; font-style: italic; margin: 6px 0 10px; }
  .budget-table { border-collapse: collapse; width: 100%; }
  .budget-table th, .budget-table td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #e5e7eb; }
  .budget-table .total td { font-weight: 700; }
</style>
</head>
<body>
  <h1>${escape(tripTitle || "Your Trip")}</h1>
  <h2>Your AI-Generated Itinerary</h2>
  ${daySections.join("")}
  ${budgetSection}
</body>
</html>
  `.trim();
}

export function downloadHtml(htmlString, filename = "itinerary.html") {
  const blob = new Blob([htmlString], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.replace(/[\\/:*?"<>|]+/g, "_");
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
