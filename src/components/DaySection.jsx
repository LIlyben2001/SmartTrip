// src/components/DaySection.jsx
import { Card, CardContent } from "./ui/card";

function buildDisplayTitle(index, rawTitle, location) {
  const i = index + 1;

  if (typeof rawTitle === "string" && rawTitle.trim()) {
    // If title starts with "Day <num>" keep the suffix but fix the number
    const m = rawTitle.match(/^ *Day\s*\d+\s*(:|—|-)?\s*(.*)$/i);
    if (m) {
      const suffix = m[2] ? m[2].trim() : "";
      return suffix ? `Day ${i}: ${suffix}` : `Day ${i}`;
    }
    // If it doesn't include "Day", prefix it
    return `Day ${i}: ${rawTitle.trim()}`;
  }

  // Fallbacks
  if (location) return `Day ${i} — ${location}`;
  return `Day ${i}`;
}

export default function DaySection({ index = 0, title = "", location = "", bullets = [] }) {
  const displayTitle = buildDisplayTitle(index, title, location);

  return (
    <Card className="overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b">
        <h4 className="text-base font-semibold">{displayTitle}</h4>
      </div>
      <CardContent className="pl-6 space-y-2">
        <ul className="list-disc">
          {bullets.map((b, i) => (
            <li key={i} className="leading-relaxed">{b}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
