import { Card, CardContent } from "./ui/card";

// Parse bullets like "Morning: Visit X" into grouped sections
function groupBulletsByPeriod(bullets = []) {
  const groups = { Morning: [], Afternoon: [], Evening: [] };
  const other = [];

  bullets.forEach((b) => {
    const m = /^ *(Morning|Afternoon|Evening)\s*:\s*(.*)$/i.exec(b);
    if (m) {
      const key = m[1][0].toUpperCase() + m[1].slice(1).toLowerCase();
      const rest = m[2].trim();
      if (rest) groups[key].push(rest);
    } else {
      other.push(b);
    }
  });

  return { groups, other };
}

export default function DaySection({ title, location, bullets = [] }) {
  const { groups, other } = groupBulletsByPeriod(bullets);

  const hasGrouped =
    (groups.Morning?.length || 0) +
      (groups.Afternoon?.length || 0) +
      (groups.Evening?.length || 0) >
    0;

  return (
    <Card className="overflow-hidden">
      {/* Header strip like your screenshot */}
      <div className="bg-gray-100 px-4 py-2 border-b">
        <h4 className="text-base font-semibold">
          {title}
          {location ? `: ${location}` : ""}
        </h4>
      </div>

      <CardContent className="space-y-3">
        {hasGrouped ? (
          <>
            {groups.Morning?.length > 0 && (
              <div>
                <p className="font-medium">• Morning</p>
                <ul className="list-disc pl-6 mt-1">
                  {groups.Morning.map((item, i) => (
                    <li key={`m-${i}`}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {groups.Afternoon?.length > 0 && (
              <div>
                <p className="font-medium">• Afternoon</p>
                <ul className="list-disc pl-6 mt-1">
                  {groups.Afternoon.map((item, i) => (
                    <li key={`a-${i}`}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {groups.Evening?.length > 0 && (
              <div>
                <p className="font-medium">• Evening</p>
                <ul className="list-disc pl-6 mt-1">
                  {groups.Evening.map((item, i) => (
                    <li key={`e-${i}`}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Any leftover items that didn’t match the pattern */}
            {other.length > 0 && (
              <div>
                <ul className="list-disc pl-6">
                  {other.map((item, i) => (
                    <li key={`o-${i}`}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          // Fallback: simple list (if items aren’t labeled)
          <ul className="list-disc pl-6">
            {bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
