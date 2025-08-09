// src/components/TripPlanner.jsx
import { useRef, useState, useEffect } from "react";
import Itinerary from "./Itinerary";
import BudgetCard from "./BudgetCard";
import { Card, CardContent } from "./ui/card";
import { itineraryTextToHtml, downloadHtml } from "../utils/downloadHtml";

/* ---------- URL toggle: ?live=1 -> use OpenAI; otherwise mock ---------- */
function resolveUseLiveFromURL() {
  if (typeof window === "undefined") return false;
  const qs = new URLSearchParams(window.location.search);
  const v = qs.get("live");
  if (v === "1" || v === "true") return true;
  if (v === "0" || v === "false") return false;
  return false; // default to mock
}

/* ---------- Static fallback (used if JSON not found) ---------- */
const COUNTRY_CITIES_FALLBACK = {
  "United States": ["New York", "Los Angeles", "San Francisco", "Chicago", "Miami"],
  Canada: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
  "United Kingdom": ["London", "Edinburgh", "Manchester", "Bath", "York"],
  France: ["Paris", "Nice", "Lyon", "Marseille", "Bordeaux"],
  Italy: ["Rome", "Florence", "Venice", "Milan", "Naples"],
  Spain: ["Barcelona", "Madrid", "Seville", "Valencia", "Granada"],
  Germany: ["Berlin", "Munich", "Hamburg"],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
  Japan: ["Tokyo", "Kyoto", "Osaka", "Sapporo", "Hiroshima"],
  China: ["Beijing", "Shanghai", "Shenzhen", "Guangzhou", "Xi'an"],
  Brazil: ["Rio de Janeiro", "São Paulo", "Salvador"],
  // NEW
  Argentina: ["Buenos Aires", "Mendoza", "Bariloche"],
  Greece: ["Athens", "Santorini", "Thessaloniki"],
  Turkey: ["Istanbul", "Cappadocia", "Antalya"],
};
const COUNTRIES_FALLBACK = Object.keys(COUNTRY_CITIES_FALLBACK).sort();

/* ---------- Form defaults ---------- */
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

  // Dynamic lists (with fallback)
  const [countries, setCountries] = useState(COUNTRIES_FALLBACK);
  const [countryCityMap, setCountryCityMap] = useState(COUNTRY_CITIES_FALLBACK);
  const [cities, setCities] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // URL toggle for live vs mock
  const [useLive, setUseLive] = useState(resolveUseLiveFromURL());

  const resultRef = useRef(null);

  // Tiny badge to show mode
  const ModeBadge = () => (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
      ${useLive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}
      title={useLive ? "Using OpenAI live endpoint" : "Using mock endpoint"}
    >
      {useLive ? "Live AI" : "Mock"}
    </span>
  );

  /* ---------- Load countries (dynamic JSON if available) ---------- */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingCountries(true);
        const res = await fetch("/countries.json", { cache: "no-store" });
        if (!res.ok) throw new Error("countries.json not found");
        const data = await res.json();
        if (mounted && Array.isArray(data) && data.length) {
          setCountries(data);
        }
      } catch {
        setCountries(COUNTRIES_FALLBACK);
      } finally {
        if (mounted) setLoadingCountries(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  /* ---------- Load city map or filter cities when country changes ---------- */
  useEffect(() => {
    let mounted = true;

    const updateCitiesFromMap = (map) => {
      const list = form.country ? map[form.country] || [] : [];
      setCities(list);
      // If current city isn't in new list, clear it
      setForm((f) => (list.includes(f.city) ? f : { ...f, city: "" }));
    };

    (async () => {
      if (!form.country) {
        setCities([]);
        return;
      }
      try {
        setLoadingCities(true);
        const res = await fetch("/country-cities.json", { cache: "no-store" });
        if (!res.ok) throw new Error("country-cities.json not found");
        const map = await res.json();
        if (mounted && map && typeof map === "object") {
          setCountryCityMap(map);
          updateCitiesFromMap(map);
          return;
        }
      } catch {
        setCountryCityMap(COUNTRY_CITIES_FALLBACK);
        updateCitiesFromMap(COUNTRY_CITIES_FALLBACK);
      } finally {
        if (mounted) setLoadingCities(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [form.country]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => {
      if (name === "country") {
        const map = countryCityMap || COUNTRY_CITIES_FALLBACK;
        const list = map[value] || [];
        const nextCity = list.includes(f.city) ? f.city : "";
        return { ...f, country: value, city: nextCity };
      }
      return { ...f, [name]: value };
    });
  }

  async function handleGenerate(e) {
    e?.preventDefault?.();
    setError("");

    if (!form.country || !form.city) {
      setError("Please select both a country and a city.");
      return;
    }

    setLoading(true);
    try {
      const destination = `${form.city}, ${form.country}`;
      const endDate = addDaysISO(form.startDate, form.days);

      const payload = {
        destination, // City, Country
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

      const liveEndpoint = "/api/generate-itinerary-live";
      const mockEndpoint = "/api/generate-itinerary";
      const primary = useLive ? liveEndpoint : mockEndpoint;

      // Try primary endpoint (live or mock)
      let res = await fetch(primary, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // If live fails, fall back to mock automatically (so the UI still works)
      if (!res.ok && useLive) {
        try {
          const text = await res.text();
          console.warn("Live failed, falling back to mock. Live response:", text);
        } catch {}
        res = await fetch(mockEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const data = await res.json();

      const days = (data?.days || []).map((d, i) => ({
        title: d.title || `Day ${i + 1}`,
        location: d.location || destination,
        bullets: Array.isArray(d.items) ? d.items : d.bullets || [],
      }));

      // Save full budget object so BudgetCard can render
      const budget = data?.budget && data.budget.rows ? data.budget : null;

      setItinerary({
        tripTitle:
          data?.title ||
          [destination || "Your Trip", form.days ? `${form.days} days` : "", form.style, form.budgetLevel, form.pace]
            .filter(Boolean)
            .join(" — "),
        days,
        budget,
      });

      // Clear form so inputs don't “remember”
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
    // Pass rows into exporter (it expects budgetRows)
    const html = itineraryTextToHtml({
      tripTitle: itinerary.tripTitle,
      days: itinerary.days,
      budgetRows: itinerary.budget?.rows || [],
    });
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
          <h2 className="text-3xl font-semibold inline-flex items-center gap-2 justify-center">
            Plan Your Trip <ModeBadge />
          </h2>
        </div>

        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleGenerate} autoComplete="off" className="grid grid-cols-12 gap-4">
            {/* Country */}
            <div className="col-span-12 md:col-span-6">
              <select
                name="country"
                value={form.country}
                onChange={onChange}
                disabled={loadingCountries}
                autoComplete="off"
                className="w-full rounded-lg border border-gray-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="" disabled hidden>
                  {loadingCountries ? "Loading countries..." : "Select Country"}
                </option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* City (disabled until country chosen) */}
            <div className="col-span-12 md:col-span-6">
              <select
                name="city"
                value={form.city}
                onChange={onChange}
                disabled={!form.country || loadingCities}
                autoComplete="off"
                className={`w-full rounded-lg border border-gray-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  !form.country ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                <option value="" disabled hidden>
                  {!form.country ? "Select Country First" : loadingCities ? "Loading cities..." : "Select City"}
                </option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
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

            {/* Travel Style */}
            <div className="col-span-12 md:col-span-6">
              <select
                name="style"
                value={form.style}
                onChange={onChange}
                autoComplete="off"
                className="w-full rounded-lg border border-gray-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                <option value="" disabled hidden>
                  Budget Range
                </option>
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
                <option value="" disabled hidden>
                  Trip Pace
                </option>
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
                  Your {form.days || 5}-day {form.style || "Cultural"} Adventure in {form.city || "Beijing"} includes iconic
                  sites, neighborhood dining, and a local experience!
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
            /* If your Itinerary also shows Budget, remove the BudgetCard below to avoid duplicates */
          />

          {/* Always render BudgetCard here so it never “disappears” */}
          {itinerary.budget?.rows?.length ? (
            <div className="mt-4">
              <BudgetCard budget={itinerary.budget} />
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2 mt-2">
            <button onClick={handleDownloadHtml} className="px-4 py-2 bg-gray-800 text-white rounded-lg">
              Download HTML
            </button>
          </div>
        </>
      )}
    </div>
  );
}
