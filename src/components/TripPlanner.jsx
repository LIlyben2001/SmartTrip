// src/components/TripPlanner.jsx
import { useRef, useState, useEffect } from "react";
import Itinerary from "./Itinerary";
import { Card, CardContent } from "./ui/card";
import { itineraryTextToHtml, downloadHtml } from "../utils/downloadHtml";

// --- Country -> Cities map (extend anytime) ---
const COUNTRY_CITIES = {
  "United States": ["New York", "Los Angeles", "San Francisco", "Chicago", "Miami"],
  China: ["Beijing", "Shanghai", "Shenzhen", "Guangzhou", "Xi'an"],
  Japan: ["Tokyo", "Kyoto", "Osaka", "Sapporo", "Hiroshima"],
  "United Kingdom": ["London", "Edinburgh", "Manchester", "Bath", "York"],
  France: ["Paris", "Nice", "Lyon", "Marseille", "Bordeaux"],
  Italy: ["Rome", "Florence", "Venice", "Milan", "Naples"],
  Spain: ["Barcelona", "Madrid", "Seville", "Valencia", "Granada"],
  Canada: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
  Singapore: ["Singapore"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi"],
};

const COUNTRIES = Object.keys(COUNTRY_CITIES).sort();

const defaultForm = {
  country: "",
  city: "",
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
  const resultRef = useRef(null);

  const citiesForCountry = form.country ? COUNTRY_CITIES[form.country] || [] : [];

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => {
      // If country changes, clear city if it isn't valid for the new country
      if (name === "country") {
        const nextCities = COUNTRY_CITIES[value] || [];
        const nextCity = nextCities.includes(f.city) ? f.city : "";
        return { ...f, country: value, city: nextCity };
      }
      return { ...f, [name]: value };
    });
  }

  async function handleGenerate(e) {
    e?.preventDefault?.();
    setError("");
    // simple front-end validation
    if (!form.country || !form.city) {
      setError("Please select both a country and a city.");
      return;
    }
    setLoading(true);

    try {
      const destination = `${form.city}, ${form.country}`;
      const endDate = addDaysISO(form.startDate, form.days);

      const payload = {
        destination,                     // <- city, country combined for your API
        country: form.country,
        city: form.city,
        startDate: form.startDate || undefined,
        endDate: endDate || undefined,
        days: form.days ? Number(form.days) : undefined,
        travelers: form.travelers ? Number(form.travelers) : undefined,
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
        location: d.location || destination,
        bullets: Array.isArray(d.items) ? d.items : (d.bullets || []),
      }));

      const budgetRows =
        data?.budget?.rows && Array.isArray(data.budget.rows)
          ? data.budget.rows
          : undefined;

      setItinerary({
        tripTitle:
          data?.title ||
          [
            destination || "Your Trip",
            form.days ? `${form.days} days` : "",
            form.style,
            form.budgetLevel,
            form.pace,
          ]
            .filter(Boolean)
            .join(" — "),
        days,
        budgetRows,
      });

      // Clear the form so fields don't “remember”
      setForm({ ...defaultForm });
    } catch (err) {
      console.error(err);
      setError(`Sorry—couldn’t generate the itinerary. ${err.message || "Please try again."}`);
      setItinerary(null);
    } finally {
      setLoading(false);
    }
  }

  function handleDownloadHtml() {
    if (!itinerary) return;
    const html = itineraryTextToHtml(itinerary);
    downloadHtml(html, `${itinerary.tripTitle || "Itinerary"}.html`);
  }

  useEffect(() => {
    if (itinerary && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [itinerary]);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-6">
      <Card className="shadow-md">
        <div className="px-6 pt-6 text-center">
          <h2 className="text-3xl font-semibold">Plan Your Trip</h2>
        </div>

        <CardContent className="p-6 md:p-8">
          <form
            onSubmit={handleGenerate}
            autoComplete="off"
            className="grid grid-cols-12 gap-4"
          >
            {/* Country */}
            <div className="col-span-12 md:col-span-6">
              <select
                name="country"
                value={form.country}
                onChange={onChange}
                autoComplete="off"
                className="w-full rounded-lg border border-gray-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="" disabled hidden>
                  Select Country
                </option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* City/Destination (disabled until country chosen) */}
            <div className="col-span-12 md:col-span-6">
              <select
                name="city"
                value={form.city}
                onChange={onChange}
                autoComplete="off"
                disabled={!form.country}
                className={`w-full rounded-lg border border-gray-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${!form.country ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <option value="" disabled hidden>
                  {form.country ? "Select City" : "Select Country First"}
                </option>
                {citiesForCountry.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div className="col-span-12 md:col-span-6">
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={onChange}
                autoComplete="off"
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="mm/dd/yyyy"
              />
            </div>

            {/* Days */}
            <div className="col-span-12 md:col-span-6">
              <input
                name="days"
                value={form.days}
                onChange={onChange}
                inputMode="numeric"
                autoComplete="off"
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Number of Days"
              />
            </div>

            {/* Style */}
            <div className="col-span-12 md:col-span-6">
              <select
                name="style"
                value={form.style}
                onChange={onChange}
                autoComplete="off"
                className="w-full rounded-lg border border-gray-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="" disabled hidden>Travel Style</option>
                <option>Foodies</option>
                <option>Culture</option>
                <option>Nature</option>
                <option>Luxury</option>
                <option>Budget</option>
                <option>Family</option>
              </select>
            </div>

            {/* Travelers */}
            <div className="col-span-12 md:col-span-6">
              <input
                name="travelers"
                value={form.travelers}
                onChange={onChange}
                inputMode="numeric"
                autoComplete="off"
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Number of Travelers"
              />
            </div>

            {/* Budget Range */}
            <div className="col-span-12 md:col-span-6">
              <select
                name="budgetLevel"
                value={form.budgetLevel}
                onChange={onChange}
                autoComplete="off"
                className="w-full rounded-lg border border-gray-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="" disabled hidden>Budget Range</option>
                <option>Budget</option>
                <option>Mid-range</option>
                <option>Luxury</option>
              </select>
            </div>

            {/* Trip Pace */}
            <div className="col-span-12 md:col-span-6">
              <select
                name="pace"
                value={form.pace}
                onChange={onChange}
                autoComplete="off"
                className="w-full rounded-lg border border-gray-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="" disabled hidden>Trip Pace</option>
                <option>Relaxed</option>
                <option>Balanced</option>
                <option>Fast</option>
              </select>
            </div>

            {/* Email (optional) */}
            <div className="col-span-12 md:col-span-6">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="none"
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Email (optional)"
              />
            </div>

            {/* CTA */}
            <div className="col-span-12">
              <button
                type="submit"
                onClick={handleGenerate}
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
                  Your 5-day Cultural Adventure in {form.city || "Beijing"} includes iconic sites,
                  neighborhood dining, and a local experience!
                </p>
              </div>
            </div>
          </form>

          {error && <p className="mt-3 text-red-600 text-center">{error}</p>}
        </CardContent>
      </Card>

      <div ref={resultRef} />

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
