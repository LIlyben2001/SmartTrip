// src/components/TripPlanner.jsx
import { useState } from "react";
import Itinerary from "./Itinerary";
import { Card, CardContent } from "./ui/card";
import { itineraryTextToHtml, downloadHtml } from "../utils/downloadHtml";

const defaultForm = {
  destination: "",
  startDate: "",
  days: "",
  travelers: "",
  style: "",
  budgetLevel: "",
  pace: "",
  email: "",
};

function addDaysISO(isoDate, n) {
  if (!isoDate || !n) return "";
  const d = new Date(isoDate);
  d.setDate(d.getDate() + (Number(n) - 1));
  return d.toISOString().slice(0, 10);
}

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
      const endDate = addDaysISO(form.startDate, form.days);

      const payload = {
        destination: form.destination,
        startDate: form.startDate,
        endDate,
        days: Number(form.days || 0),
        travelers: Number(form.travelers || 0),
        style: form.style || undefined,
        budgetLevel: form.budgetLevel || undefined,
        pace: form.pace || undefined,
        email: form.email || undefined,
      };

      const res = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-6">
      <Card className="shadow-md">
        <div className="px-6 pt-6 text-center">
          <h2 className="text-3xl font-semibold">Plan Your Trip</h2>
        </div>

        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleGenerate} className="grid grid-cols-12 gap-4">
            {/* Row 1 */}
            <div className="col-span-12 md:col-span-6">
              <input
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                name="destination"
                value={form.destination}
                onChange={onChange}
                placeholder="Destination (e.g., Beijing)"
                required
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <input
                type="date"
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                name="startDate"
                value={form.startDate}
                onChange={onChange}
                placeholder="mm/dd/yyyy"
              />
            </div>

            {/* Row 2 */}
            <div className="col-span-12 md:col-span-6">
              <input
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                name="days"
                value={form.days}
                onChange={onChange}
                placeholder="Number of Days"
                inputMode="numeric"
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <select
                className="w-full rounded-lg border border-gray-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                name="style"
                value={form.style}
                onChange={onChange}
              >
                <option value="" disabled hidden>
                  Travel Style
                </option>
                <option>Foodies</option>
                <option>Culture</option>
                <option>Nature</option>
                <option>Luxury</option>
                <option>Budget</option>
                <option>Family</option>
              </select>
            </div>

            {/* Row 3 */}
            <div className="col-span-12 md:col-span-6">
              <select
                className="w-full rounded-lg border border-gray-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                name="budgetLevel"
                value={form.budgetLevel}
                onChange={onChange}
              >
                <option value="" disabled hidden>
                  Budget Range
                </option>
                <option>Budget</option>
                <option>Mid-range</option>
                <option>Luxury</option>
              </select>
            </div>
            <div className="col-span-12 md:col-span-6">
              <input
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                name="travelers"
                value={form.travelers}
                onChange={onChange}
                placeholder="Number of Travelers"
                inputMode="numeric"
              />
            </div>

            {/* Row 4 */}
            <div className="col-span-12 md:col-span-6">
              <select
                className="w-full rounded-lg border border-gray-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                name="pace"
                value={form.pace}
                onChange={onChange}
              >
                <option value="" disabled hidden>
                  Trip Pace
                </option>
                <option>Relaxed</option>
                <option>Balanced</option>
                <option>Fast</option>
              </select>
            </div>
            <div className="col-span-12 md:col-span-6">
              <input
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="Email (optional)"
                type="email"
              />
            </div>

            {/* CTA */}
            <div className="col-span-12">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-5 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
              >
                {loading ? "Generating..." : "Generate My Trip"}
              </button>
            </div>

            {/* Sample Itinerary Preview */}
            <div className="col-span-12">
              <div className="bg-gray-100 text-center rounded-lg p-4 mt-2">
                <h3 className="font-semibold mb-1">Sample Itinerary Preview</h3>
                <p className="text-gray-700">
                  Your 5-day Cultural Adventure in Beijing includes the Great Wall, Forbidden City,
                  hutong dining, and a local cooking class!
                </p>
              </div>
            </div>
          </form>

          {error && <p className="mt-3 text-red-600 text-center">{error}</p>}
        </CardContent>
      </Card>

      {itinerary && (
        <>
          <Itinerary
            tripTitle={itinerary.tripTitle}
            days={itinerary.days}
            budgetRows={itinerary.budgetRows}
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleDownloadHtml}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg"
            >
              Download HTML
            </button>
          </div>
        </>
      )}
    </div>
  );
}
