// src/utils/downloadHtml.js
function mdInline(s = "") {
  // basic markdown -> HTML for inline emphasis
  return s
    .replace(/&/g, "&amp;")           // escape first
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function sectionToHtml(section) {
  const lines = section.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (!lines.length) return "";

  // First line is often "Day X: Title"
  let heading = lines[0].replace(/^\*\*?|\*\*?$/g, ""); // strip surrounding ** if present
  const bodyLines = lines.slice(1);

  // Group bullet-like lines into <ul>, keep paragraphs otherwise
  const chunks = [];
  let currentList = [];

  const flushList = () => {
    if (currentList.length) {
      chunks.push(
        `<ul class="list">${currentList.map(item => `<li>${mdInline(item)}</li>`).join("")}</ul>`
      );
      currentList = [];
    }
  };

  for (let raw of bodyLines) {
    // “Local Tip:” callout
    if (/^(\*\s*)?local tip\s*:/i.test(raw)) {
      flushList();
      const tip = raw.replace(/^\*\s*/,'').replace(/^local tip\s*:/i, "").trim();
      chunks.push(
        `<div class="tip"><strong>Local Tip:</strong> ${mdInline(tip)}</div>`
      );
      continue;
    }

    // bullets: "-", "•", "* " at start
    if (/^(-|\u2022|\*)\s+/.test(raw)) {
      currentList.push(raw.replace(/^(-|\u2022|\*)\s+/, ""));
    } else {
      flushList();
      chunks.push(`<p>${mdInline(raw)}</p>`);
    }
  }
  flushList();

  return `
    <section class="day">
      <h2>${mdInline(heading)}</h2>
      ${chunks.join("\n")}
    </section>
  `;
}

export function itineraryTextToHtml(itineraryText, title = "SmartTrip Itinerary") {
  if (!itineraryText) itineraryText = "";

  // Split into sections by “Day X:”
  const parts = itineraryText
    .split(/\n(?=Day\s+\d+\s*:)/g)
    .map(s => s.trim())
    .filter(Boolean);

  const body = parts.length
    ? parts.map(sectionToHtml).join("\n")
    : `<p>${mdInline(itineraryText).replace(/\n/g, "<br/>")}</p>`;

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<title>${title}</title>
<style>
  :root{
    --text:#111827;      /* gray-900 */
    --muted:#6b7280;     /* gray-500 */
    --primary:#0284c7;   /* sky-700 */
    --border:#e5e7eb;

