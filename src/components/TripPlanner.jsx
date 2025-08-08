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
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setItinerary(data.result || "No itinerary generated.");
    } catch (err) {
      console.error(err);
      setItinerary("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="planner" className="py-20 px-4 bg-white max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-primary mb-10">Plan Your Trip</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <h3 className="text-lg font-semibold text-primary mb-2">Sample Itinerary Preview</h3>
          <p className="text-text">
            Your 5-day Cultural Adventure in Beijing includes the Great Wall, Forbidden City, hutong dining, and a local cooking class!
          </p>
        </div>
      )}

      {itinerary && (
        <div className="bg-white mt-8 p-6 rounded shadow border">
          <h3 className="text-xl font-bold text-primary mb-4">Your AI-Generated Itinerary</h3>

          {itinerary
            // handle "Day" with or without surrounding ** and extra spaces
            .split(/\n(?=\*{0,2}\s*Day\s+\d+\s*:)/g)
            .map((section, index) => {
              const titleMatch = section.match(/^\*{0,2}\s*Day\s+\d+\s*:/);
              const raw = titleMatch ? titleMatch[0] : `Day ${index + 1}:`;
              const title = raw.replace(/^\*{0,2}\s*/, ""); // strip leading ** if present
              return (
                <CollapsibleDaySection
                  key={index}
                  title={title}
                  content={section}
                  defaultOpen={true}
                />
              );
            })}

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
              title="Copy itinerary to clipboard"
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

const CollapsibleDaySection = ({ title, content, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-4 border rounded">
      <button
        className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 font-semibold"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </button>
      {isOpen && (
        <div className="p-4 whitespace-pre-line text-text">
          {content}
        </div>
      )}
    </div>
  );
};
