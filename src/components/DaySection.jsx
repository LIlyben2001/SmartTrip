import { Card, CardContent } from "./ui/card";

export default function DaySection({ index = 0, location = "", bullets = [] }) {
  const dayTitle = `Day ${index + 1}${location ? ` — ${location}` : ""}`;

  return (
    <Card className="overflow-hidden">
      {/* Gray strip header */}
      <div className="bg-gray-100 px-4 py-2 border-b">
        <h4 className="text-base font-semibold">{dayTitle}</h4>
      </div>
      {/* Indented content */}
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
