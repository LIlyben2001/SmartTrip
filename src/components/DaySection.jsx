import { Card, CardContent } from "./ui/card";

// Build the exact header text we want:
// - If title already has "Day X: ..." keep the suffix and fix the X to index+1
// - Else, if there's any title, render "Day X: {title}"
// - Else, fall back to "Day X — {location}" or "Day X"
function buildDisplayTitle(index, rawTitle, location) {
  const i = index + 1;

  if (typeof rawTitle === "string" && rawTitle.trim()) {
    const m = rawTitle.match(/^ *Day\s*\d+\s*[:—-]?\s*(.*)$/i);
    if (m) {
      const suffix = m[1]?.trim() || "";
      return suffix ? `Day ${i}: ${suffix}` : `Day ${i}`;
    }
    return `Day ${i}: ${rawTitle.trim()}`;
  }

  return location ? `Day ${i} — ${location}` : `Day ${i}`;
}

export default function DaySection({ index = 0, title = "", location = "", bullets = [] }) {
  const displayTitle = buildDisplayTitle(index, title, location);

  return (
    <Card className="overflow-hidden">
      {/* Header strip */}
      <div className="bg-gray-100 px-4 py-2 border-b">
        <h4 className="text-base font-semibold">{displayTitle}</h4>
      </div>

      {/* Indented content */}
      <CardContent className="pl-6 pr-4 py-4">
        <ul className="list-disc space-y-1">
          {(Array.isArray(bullets) ? bullets : []).map((b, i) => (
            <li key={i} className="leading-relaxed">{b}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
