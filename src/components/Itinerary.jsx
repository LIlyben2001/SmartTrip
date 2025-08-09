// src/components/Itinerary.jsx
// Renders the itinerary days with tidy card titles and indented bullets.

import { Card, CardContent } from "./ui/card";

function buildDisplayTitle(index, rawTitle, location) {
  const i = index + 1;
  const t = (rawTitle || "").trim();
  if (t) {
    // If raw title already includes "Day X:", keep its suffix; otherwise prefix it.
    const m = t.match(/^ *Day\s*\d+\s*[:—-]?\s*(.*)$/i);
    const suffix = m ? (m[1] || "").trim() : t;
    return suffix ? `Day ${i}: ${suffix}` : `Day ${i}`;
  }
  return location ? `Day ${i} — ${location}` : `Day ${i}`;
}

export default function Itinerary({ tripTitle, days = [] }) {
  return (
    <div className="space-y-4">
      {/* Page Title */}
      {tripTitle ? (
        <div className="text-center mb-2">
          <h3 className="text-2xl font-semibold">{tripTitle}</h3>
        </div>
      ) : null}

      {/* Day Cards */}
      {days.map((d, idx) => {
        const title = buildDisplayTitle(idx, d?.title, d?.location);
        const items = Array.isArray(d?.bullets) ? d.bullets : Array.isArray(d?.items) ? d.items : [];
        return (
          <Card key={idx} className="shadow-sm">
            {/* Card header (no CardHeader dependency) */}
            <div className="px-5 pt-4 pb-2 border-b border-gray-200 bg-gray-50">
              <h4 className="text-base md:text-lg font-semibold text-gray-800">{title}</h4>
            </div>
            <CardContent className="p-5">
              <ul className="list-disc pl-6 space-y-1">
                {items.map((line, i) => (
                  <li key={i} className="text-gray-800">
                    {line}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
