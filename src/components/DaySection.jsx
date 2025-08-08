import { Card, CardContent } from "./ui/card";

export default function DaySection({ title, location, bullets = [] }) {
  // If title already contains "Day", use it, else format manually
  const dayTitle =
    title?.toLowerCase().includes("day")
      ? title
      : `Day ${title || ""}${location ? ` — ${location}` : ""}`;

  return (
    <Card className="overflow-hidden">
      {/* Gray header strip */}
      <div className="bg-gray-100 px-4 py-2 border-b">
        <h4 className="text-base font-semibold">{dayTitle}</h4>
      </div>

      {/* Indented content */}
      <CardContent className="space-y-2 pl-6">
        <ul className="list-disc">
          {bullets.map((b, i) => (
            <li key={i} className="leading-relaxed">
              {b}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
