import React, { useState } from "react";
import { downloadTextFile } from "../utils/downloadText";
import { itineraryTextToHtml, downloadHtml } from "../utils/downloadHtml";

const TripPlanner = () => {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [numDays, setNumDays] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [budget, setBudget] = useState("");
  const [numTravelers, setNumTravelers] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setItinerary("");

    const prompt = `
Create a detailed day-by-day ${travelStyle} itinerary for ${numTravelers} people visiting ${destination} starting on ${startDate} for ${numDays} days.
Budget: ${budget}. Include daily highlights, cultural or food experiences, and local tips.
Use headings like "Day 1: ..." (no extra prose before Day 1).

At the end, include a "Budget Breakdown" section and a final "Pricing Assumptions" section.

For the Budget Breakdown, output a markdown table with columns:
Category | Budget (2–3★) | Mid-range (3★) | Luxury (4–5★)
Follow with a Total row for each column. Use realistic per-trip estimates.

For each accommodation assumption, specify the quality level (e.g., 3-star city-center), room occupancy (e.g., double), and number of nights.
In "Pricing Assumptions", state hotel class assumption, room occupancy, dining level, and ground transport basis in 2–5 short lines.

Keep formatting clean and skimmable.
`;

    try {
      const res = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setItinerary(data.result || "No itinerary generated.");
    } catch (err) {
      console.error(err);
      setItinerary("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- tiny markdown table renderer for the Budget card ---
  const mdTableToHtml = (text = "") => {
    const lines = text.split(/\r?\n/);
    const firstPipe = lines.findIndex((l) => /\|/.test(l));
    if (firstPipe === -1) return "";
    let end = firstPipe;
    while (end + 1 < lines.length && /\|/.test(lines[end + 1])) end++;
    const block = lines.slice(firstPipe, end + 1);
    if (block.length < 2) return "";

    const toCells = (row) =>
      row.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());

    const header = toCells(block[0]);
    const bodyRows = block
      .slice(1)
      .filter(
        (r) =>
          !/^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(r)
      );
    const rows = bodyRows.map(toCells);

    const thead = `<thead><tr>${header
      .map((h) => `<th>${h}</th>`)
      .join("")}</tr></thead>`;
    const tbody = `<tbody>${rows
      .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
      .join("")}</tbody>`;
    return `<table class="md">${thead}${tbody}</table>`;
  };

  // --- formatting helpers for section bodies ---
  const normalizeBody = (raw = "") => {
    // 1) convert markdown headings like "# X", "## X", "### Morning:" -> bullets
    let t = raw.replace(/^\s*#{1,6}\s*(.+)$/gm, "• $1");

    // 2) collapse 3+ newlines -> 2
    t = t.replace(/\n{3,}/g, "\n\n");

    // 3) trim stray spaces on lines
    t = t.replace(/[ \t]+$/gm, "");

    return t.trim();
  };

  // Parse for UI: separate budget text + day sections
  const parseForUI = (txt) => {
    if (!txt) return { days: [], budgetText: "" };

    // Extract Budget block (from its header to end or until "Assumptions")
    const budgetHeader = txt.match(/^\s*Budget(?:\s+Breakdown|\s+Estimate)?\s*:?\s*$/im);
    let budgetText = "";
    let daysText = txt;
    if (budgetHeader) {
      const from = budgetHeader.index;
      const after = txt.slice(from + budgetHeader[0].length);
      const split = after.split(/\n(?=(Pricing\s+Assumptions|Assumptions)\s*:?\s*$)/i)[0];
      budgetText = (budgetHeader[0] + split).trim();
      daysText = txt.slice(0, from).trim();
    }

    // Support: "Day 1:" / "**Day 1:**" / "# Day 1:" / "### Day 1: ..."
    const headingRe =
      /^\s*(?:#{1,3}\s*)?(?:\*{0,2}\s*)?Day\s+(\d+)\s*:\s*(.*)$/gm;

    const matches = [...daysText.matchAll(headingRe)];

    // Fallback: show whole text in one block
    if (matches.length === 0) {
      return {
        days: [
          {
            key: "all",
            dayNo: null,
            subtitle: "",
            body: normalizeBody(daysText),
          },
        ],
        budgetText,
      };
    }

    const sections = [];
    for (let i = 0; i < matches.length; i++) {
      const m = matches[i];
      const next = matches[i + 1];

      const dayNo = parseInt(m[1], 10);
      const subtitle = (m[2] || "").trim(); // text after the colon

      const start = m.index + m[0].length;
      const end = next ? next.index : daysText.length;
      let body = daysText.slice(start, end).trim();
      if (!body) continue;

      // If the body begins with another "Day X:" line, drop that duplicate
      body = body.replace(
        /^\s*(?:#{1,3}\s*)?(?:\*{0,2}\s*)?Day\s+\d+\s*:\s*.*/,
        ""
      ).trim();

      sections.push({ dayNo, subtitle, body: normalizeBody(body) });
    }

    // Deduplicate by day number (keep the longer content)
    const deduped = sections.reduce((acc, cur) => {
      const idx = acc.findIndex((x) => x.dayNo === cur.dayNo);
      if (idx === -1) return acc.concat(cur);
      if (cur.body.length > acc[idx].body.length) acc[idx] = cur;
      return acc;
    }, []);

    // We’re moving the visible "Day N" label into the body (not header),
    // so the header can be simple and the body starts with a bold label.
    return {
      days: deduped.map((s) => ({
        key: s.dayNo,
        dayNo: s.dayNo,
        subtitle: s.subtitle,
        body: s.body,
      })),
      budgetText,
    };
  };

  const { days, budgetText } = parseForUI(itinerary);

  return (
    <section id="planner" className="py-20 px-4 bg-white max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-primary mb-10">
        Plan Your Trip
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          placeholder="Destination (e.g., Beijing)"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Number of Days"
          value={numDays}
          onChange={(e) => setNumDays(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded"
        />
        <select
          value={travelStyle}
          onChange={(e) => setTravelStyle(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded"
        >
          <option value="">Travel Style</option>
          <option>Cultural</option>
          <option>Adventure</option>
          <option>Relaxed</option>
          <option>Luxury</option>
          <option>Foodies</option>
        </select>
        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded"
        >
          <option value="">Budget Range</option>
          <option>Under $1,000</option>
          <option>$1,000–$2,000</option>
          <option>Over $2,000</option>
        </select>
        <input
          type="number"
          placeholder="Number of Travelers"
          value={numTravelers}
          onChange={(e) => setNumTravelers(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded"
        />
        <input
          type="email"
          placeholder="Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded md:col-span-2"
        />
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded col-span-full"
        >
          {loading ? "Generating..." : "Generate My Trip"}
        </button>
      </form>

      {!itinerary && (
        <div className="bg-gray-100 rounded-md p-4 mt-6 text-center">
          <h3 className="text-lg font-semibold text-primary mb-2">
            Sample Itinerary Preview
          </h3>
          <p className="text-text">
            Your 5-day Cultural Adventure in Beijing includes the Great Wall,
            Forbidden City, hutong dining, and a local cooking class!
          </p>
        </div>
      )}

      {itinerary && (
        <div className="bg-white mt-8 p-6 rounded shadow border">
          <h3 className="text-xl font-bold text-primary mb-4">
            Your AI-Generated Itinerary
          </h3>

          {/* Day sections (Day label moved into the BODY) */}
          {days.map((sec, idx) => (
            <div key={sec.key ?? idx} className="mb-4 border rounded">
              {/* header is neutral (no Day label to avoid duplication) */}
          <div className="px-4 py-2 bg-gray-100 font-semibold text-gray-800">
              Day {sec.dayNo ?? idx + 1}
              {sec.subtitle ? `: ${sec.subtitle}` : ""}
            </div>
            
            <div className="p-4 text-text whitespace-pre-line">
              {sec.body}
            </div>
            </div>
          ))}

          {/* Budget card */}
          {budgetText && (
            <div className="mt-6 border rounded">
              <div className="px-4 py-2 bg-gray-100 font-bold text-gray-800">
                Budget Breakdown
              </div>
              <div className="p-4 text-text">
                {/\|/.test(budgetText) ? (
                  <div
                    className="overflow-auto"
                    dangerouslySetInnerHTML={{ __html: mdTableToHtml(budgetText) }}
                  />
                ) : (
                  <pre className="whitespace-pre-wrap">{budgetText}</pre>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                const html = itineraryTextToHtml(itinerary, "SmartTrip Itinerary");
                downloadHtml("SmartTrip_Itinerary.html", html);
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded"
              title="Pretty export with headings, budget table & assumptions"
            >
              Download Pretty HTML
            </button>

            <button
              onClick={() => downloadTextFile("SmartTrip_Itinerary.txt", itinerary)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded"
            >
              Download .TXT
            </button>

            <button
              onClick={() => navigator.clipboard.writeText(itinerary)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold px-6 py-2 rounded"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default TripPlanner;
