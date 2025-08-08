// Turns the itinerary object into a simple HTML string and downloads it.

export function itineraryTextToHtml({ tripTitle, days = [], budgetRows = [] }) {
  const escape = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const dayHtml = days
    .map(
      (d, i) => `
      <section style="margin-bottom:16px;">
        <h3 style="margin:0 0 8px;font-size:18px;">${escape(d.title || `Day ${i+1}`)}${d.location ? " — " + escape(d.location) : ""}</h3>
        <ul style="margin:0 0 8px 20px;">
          ${(d.bullets || []).map(b => `<li>${escape(b)}</li>`).join("")}
        </ul>
      </section>`
    )
    .join("");

  const budgetHtml = budgetRows.length
    ? `
    <section>
      <h3 style="margin:16px 0 8px;font-size:18px;">Budget — Trip Overview</h3>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="text-align:left;border-bottom:1px solid #ddd;padding:6px;">Category</th>
            <th style="text-align:left;border-bottom:1px solid #ddd;padding:6px;">Budget (2–3★)</th>
            <th style="text-align:left;border-bottom:1px solid #ddd;padding:6px;">Mid-range (3★)</th>
            <th style="text-align:left;border-bottom:1px solid #ddd;padding:6px;">Luxury (4–5★)</th>
          </tr>
        </thead>
        <tbody>
          ${budgetRows
            .map(
              (r) => `
            <tr>
              <td style="border-bottom:1px solid #eee;padding:6px;">${escape(r.category)}</td>
              <td style="border-bottom:1px solid #eee;padding:6px;">${escape(r.budget)}</td>
              <td style="border-bottom:1px solid #eee;padding:6px;">${escape(r.mid)}</td>
              <td style="border-bottom:1px solid #eee;padding:6px;">${escape(r.luxury)}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </section>`
    : "";

  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${escape(tripTitle || "Itinerary")}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; padding: 24px; line-height: 1.5; }
        h2 { margin: 0 0 12px; font-size: 22px; }
      </style>
    </head>
    <body>
      <h2>${escape(tripTitle || "Itinerary")}</h2>
      ${dayHtml}
      ${budgetHtml}
    </body>
  </html>`;
}

export function downloadHtml(htmlString, filename = "itinerary.html") {
  const blob = new Blob([htmlString], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
