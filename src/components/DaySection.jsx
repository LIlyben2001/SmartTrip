// src/components/DaySection.jsx
// Self-styled card: gray header + indented content
function buildDisplayTitle(index, rawTitle, location) {
  const i = index + 1;
  if (typeof rawTitle === "string" && rawTitle.trim()) {
    const m = rawTitle.match(/^ *Day\s*\d+\s*[:—-]?\s*(.*)$/i);
    if (m) {
      const suffix = (m[1] || "").trim();
      return suffix ? `Day ${i}: ${suffix}` : `Day ${i}`;
    }
    return `Day ${i}: ${rawTitle.trim()}`;
  }
  return location ? `Day ${i} — ${location}` : `Day ${i}`;
}

export default function DaySection({ index = 0, title = "", location = "", bullets = [] }) {
  const displayTitle = buildDisplayTitle(index, title, location);
  const items = Array.isArray(bullets) ? bullets : [];

  return (
    <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white">
      {/* Header strip */}
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
        <h4 className="text-base font-semibold">{displayTitle}</h4>
      </div>

      {/* Indented content */}
      <div className="px-4 py-4 pl-6">
        <ul className="list-disc space-y-1">
          {items.map((b, i) => (
            <li key={i} className="leading-relaxed">{b}</li>
          ))}
        </ul>
      </div>
    </div>
  );
