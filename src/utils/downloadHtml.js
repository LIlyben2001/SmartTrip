// src/utils/downloadHtml.js

// --- helpers -------------------------------------------------
function mdInline(s = "") {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

// Parse "key: $123" style lines into rows; returns {rows:[{k,vNum,vRaw}], totalNum?, rawHtml?}
function parseBudget(text = "") {
  // drop heading line if present
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (!lines.length) return null;

  const first = lines[0];
  const rest =
    /^(budget(\s+breakdown|\s+estimate)?\s*:?)$/i.test(first) ? lines.slice(1) : lines;

  const rows = [];
  let foundTotal = null;

  for (const raw of rest) {
    // Accept bullets like "- Hotels: $900", "* Food: $300", or "Hotels - $900"
    const m =
      raw.match(/^[\-\*•]?\s*([^:–—]+?)\s*[:–—-]\s*\$?\s*([\d,]+(?:\.\d{1,2})?)\b/i) ||
      raw.match(/^[\-\*•]?\s*\$?\s*([\d,]+(?:\.\d{1,2})?)\b\s*[-–—]\s*(.+)$/i);

    if (m) {
      // normalize captures (name first, then amount)
      let k, amt;
      if (m.length === 3 && /:|–|—|-/.test(raw)) {
        k = m[1].trim();
        amt = m[2].replace(/,/g, "");
      } else {
        k = (m[2] || "Item").trim();
        amt = m[1].replace(/,/g, "");
      }
      const vNum = Number(amt);
      const vRaw = isNaN(vNum) ? mdInline(raw) : `$${vNum.toLocaleString()}`;

      if (/^total\b/i.test(k)) {
        foundTotal = isNaN(vNum) ? null : vNum;
      } else {
        rows.push({ k, vNum: isNaN(vNum) ? null : vNum, vRaw });
      }
      continue;
    }

    // If a line doesn't match key: value, keep it as raw
    rows.push({ k: mdInline(raw), vNum: null, vRaw: "" });
  }

  // Compute total if not found and we have numeric rows
  const sum = rows.every(r => r.vNum !== null) ? rows.reduce((a, r) => a + r.vNum, 0) : null;
  const totalNum = foundTotal ?? sum;

  return { rows, totalNum };
}

function sectionToHtml(section) {
  const lines = section.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (!lines.length) return "";

  const heading = lines[0].replace(/^\*\*?|\*\*?$/g, "");
  const bodyLines = lines.slice(1);

  const chunks = [];
  let list = [];
  const flush = () => {
    if (!list.length) return;
    chunks.push(`<ul class="list">${list.map(li => `<li>${mdInline(li)}</li>`).join("")}</ul>`);
    list = [];
  };

  for (const raw of bodyLines) {
    if (/^(\*\s*)?local tip\s*:/i.test(raw)) {
      flush();
      const tip = raw.replace(/^\*\s*/,'').replace(/^local tip\s*:/i, "").trim();
      chunks.push(`<div class="tip"><strong>Local Tip:</strong> ${mdInline(tip)}</div>`);
      continue;
    }
    if (/^(-|\u2022|\*)\s+/.test(raw)) {
      list.push(raw.replace(/^(-|\u2022|\*)\s+/, ""));
    } else {
      flush();
      chunks.push(`<p>${mdInline(raw)}</p>`);
    }
  }
  flush();

  return `<section class="day">
    <h2>${mdInline(heading)}</h2>
    ${chunks.join("\n")}
  </section>`;
}

// --- main ----------------------------------------------------
export function itineraryTextToHtml(itineraryText = "", title = "SmartTrip Itinerary") {
  // 1) Split out Budget section (kept after itinerary)
  const budgetRegex = /^\s*(budget(?:\s+breakdown|\s+estimate)?\s*:?)\s*$/im;
  let budgetText = "";
  let itineraryOnly = itineraryText;

  const match = itineraryText.match(budgetRegex);
  if (match) {
    const idx = match.index;
    budgetText = itineraryText.slice(idx).trim();
    itineraryOnly = itineraryText.slice(0, idx).trim();
  }

  // 2) Build day sections
  const parts = itineraryOnly
    .split(/\n(?=Day\s+\d+\s*:)/g)
    .map(s => s.trim())
    .filter(Boolean);

  const daysHtml = parts.length
    ? parts.map(sectionToHtml).join("\n")
    : `<p>${mdInline(itineraryOnly).replace(/\n/g, "<br/>")}</p>`;

  // 3) Build budget HTML (if present)
  let budgetHtml = "";
  if (budgetText) {
    const parsed = parseBudget(budgetText);
    if (parsed && parsed.rows.length) {
      const rowsHtml = parsed.rows
        .map(r => r.vNum === null
          ? `<tr><td colspan="2">${r.k}</td></tr>`
          : `<tr><td>${mdInline(r.k)}</td><td class="num">$${r.vNum.toLocaleString()}</td></tr>`
        )
        .join("");

      const totalHtml = parsed.totalNum != null
        ? `<tr class="total"><td>Total</td><td class="num">$${parsed.totalNum.toLocaleString()}</td></tr>`
        : "";

      budgetHtml = `
      <section class="budget">
        <h2>💰 Budget Breakdown</h2>
        <table>
          <tbody>
            ${rowsHtml}
            ${totalHtml}
          </tbody>
        </table>
      </section>`;
    } else {
      // fallback: show raw text
      budgetHtml = `
      <section class="budget">
        <h2>💰 Budget Breakdown</h2>
        <p>${mdInline(budgetText).replace(/\n/g, "<br/>")}</p>
      </section>`;
    }
  }

  // 4) Wrap with pretty styles
  const html = String.raw`<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${mdInline(title)}</title>
  <style>
    :root{
      --text:#111827; --muted:#6b7280; --primary:#0284c7; --border:#e5e7eb;
      --bg:#ffffff; --tip:#f0f9ff; --tip-border:#bae6fd;
    }
    @page { size: A4; margin: 18mm; }
    @media print {
      .day{break-inside:avoid-page; page-break-inside:avoid; margin-bottom:12mm;}
      .day + .day{page-break-before:auto;}
      .budget{break-inside:avoid-page; page-break-inside:avoid;}
    }
    *{box-sizing:border-box}
    body{margin:0; background:var(--bg); color:var(--text);
         font:14px/1.6 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial;}
    .wrap{max-width:860px; margin:28px auto; background:#fff; border:1px solid var(--border);
          border-radius:14px; padding:28px 32px;}
    h1{margin:0 0 4px; font-size:28px; color:var(--primary);}
    .meta{color:var(--muted); margin-bottom:16px}
    h2{font-size:18px; margin:18px 0 8px;}
    p{margin:0 0 10px}
    .list{margin:0 0 12px 1.1em}
    .list li{margin:4px 0}
    .divider{height:1px; background:var(--border); margin:12px 0 16px}
    .tip{background:var(--tip); border:1px solid var(--tip-border); padding:10px 12px;
         border-radius:8px; margin:8px 0 12px}
    .budget{margin-top:20px; padding:16px; border:1px solid var(--border); border-radius:10px; background:#fafafa;}
    .budget table{width:100%; border-collapse:collapse;}
    .budget td{padding:8px 6px; border-bottom:1px solid var(--border);}
    .budget td.num{text-align:right; white-space:nowrap;}
    .budget tr.total td{font-weight:700; color:var(--primary);}
    .footer{color:var(--muted); font-size:12px; margin-top:16px}
  </style>
</head>
<body>
  <div class="wrap">
    <h1>${mdInline(title)}</h1>
    <div class="meta">Generated by SmartTrip</div>
    <div class="divider"></div>
    ${daysHtml}
    ${budgetHtml}
    <div class="footer">Open in a browser to print to PDF, or open in Word and Save as PDF/DOCX.</div>
  </div>
</body>
</html>`;

  return html;
}

export function downloadHtml(filename, htmlString) {
  const blob = new Blob([htmlString], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".html") ? filename : `${filename}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
