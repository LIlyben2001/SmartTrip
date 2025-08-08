import { useState } from "react";
import Itinerary from "./Itinerary";
import { Card, CardContent } from "./ui/card";
import { itineraryTextToHtml, downloadHtml } from "../utils/downloadHtml";

const defaultForm = {
  origin: "",
  destination: "",
  startDate: "",
  endDate: "",
  travelers: 2,
  style: "Foodies",
  pace: "Balanced",
  budgetLevel: "Mid-range",
};

export default function TripPlanner() {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [itinerary, setItinerary] = useState(null);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleGenerate(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();

      const days = (data?.days || []).map((d, i) => ({
        title: d.title || `Day ${i + 1}`,
        location: d.location || d.city || "",
        bullets: Array.isArray(d.items) ? d.items : (d.bullets || []),
      }));

      const budgetRows =
        data?.budget?.rows && Array.isArray(data.budget.rows)
          ? data.budget.rows
          : undefined;

      setItinerary({
        tripTitle: data?.title || `${form.destination} Trip`,
        days,
        budgetRows,
      });
    } catch (err) {
      console.error(err);
      setError("Sorry—couldn’t generate the itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleDownloadHtml() {
    if (!itinerary) return;
    const html = itineraryTextToHtml(itinerary);
    downloadHtml(html, `${itinerary.tripTitle || "Itinerary"}.html`);
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="px-4 pt-4">
          <h2 className="text-lg font-bold">Plan Your Trip</h2>
        </div>
        <CardContent>
          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Origin</label>
              <input className="w-full border rounded p-2" name="origin" value={form.origin} onChange={onChange} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Destination</label>
              <input className="w-full border rounded p-2" name="destination" value={form.destination} onChange={onChange} required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input type="date" className="w-full border rounded p-2" name="startDate" value={form.startDate} onChange={onChange} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input type="date" className="w-full border rounded p-2" name="endDate" value={form.endDate} onChange={onChange} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Travelers</label>
              <input type="number" min={1} className="w-full border rounded p-2" name="travelers" value={form.travelers} onChange={onChange} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Travel Style</label>
              <select className="w-full border rounded p-2" name="style" value={form.style} onChange={onChange}>
                <option>Foodies</option><option>Culture</option><option>Nature</option>
                <option>Luxury</option><option>Budget</option><option>Family</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Trip Pace</label>
              <select className="w-full border rounded p-2" name="pace" value={form.pace} onChange={onChange}>
                <option>Relaxed</option><option>Balanced</option><option>Fast</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Budget Level</label>
              <select className="w-full border rounded p-2" name="budgetLevel" value={form.budgetLevel} onChange={onChange}>
                <option>Budget</option><option>Mid-range</option><option>Luxury</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
                {loading ? "Generating..." : "Generate Itinerary"}
              </button>
            </div>
          </form>
          {error && <p className="mt-2 text-red-600">{error}</p>}
        </CardContent>
      </Card>

      {itinerary && (
        <>
          <Itinerary tripTitle={itinerary.tripTitle} days={itinerary.days} budgetRows={itinerary.budgetRows} />
          <div className="flex gap-2">
            <button onClick={handleDownloadHtml} className="px-4 py-2 bg-gray-800 text-white rounded">
              Download HTML
            </button>
          </div>
        </>
      )}
    </div>
  );
}
