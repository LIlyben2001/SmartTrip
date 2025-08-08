// src/components/DaySection.jsx
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export default function DaySection({ title, location, bullets = [], defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const titleClass = "text-lg font-bold"; // keep consistent with BudgetCard / Day headers

  return (
    <Card>
      <CardHeader onClick={() => setOpen(!open)} className="cursor-pointer select-none">
        <CardTitle className={titleClass}>
          {title}{location ? ` — ${location}` : ""}
        </CardTitle>
      </CardHeader>

      {open && (
        <CardContent className="space-y-2">
          <ul className="list-disc pl-6 space-y-1">
            {bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </CardContent>
      )}
    </Card>
  );
}
