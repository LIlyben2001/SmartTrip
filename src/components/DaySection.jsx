import { useState } from "react";
import { Card, CardContent } from "./ui/card";

export default function DaySection({ title, location, bullets = [], defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const titleClass = "text-lg font-bold";

  return (
    <Card>
      <div onClick={() => setOpen(!open)} className="cursor-pointer select-none px-4 pt-4">
        <h3 className={titleClass}>{title}{location ? ` — ${location}` : ""}</h3>
      </div>
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
