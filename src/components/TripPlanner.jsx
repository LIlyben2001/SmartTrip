"use client"

// src/components/TripPlanner.jsx
import { useRef, useState, useEffect, Fragment } from "react";
import Itinerary from "./Itinerary";
import BudgetCard from "./BudgetCard";
import { Card, CardContent } from "./ui/card";
import { itineraryTextToHtml, downloadHtml } from "../utils/downloadHtml";
import { generateMockItinerary } from "./generate-itinerary";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

/* ---------- Static fallback (used if JSON not found) ---------- */
const COUNTRY_CITIES_FALLBACK = {
 "United States": ["Alaska", "Boston", "Chicago", "Colorado", "Hilo", "Honolulu", "Kona", "Maui", "Los Angeles", "Miami", "New York", "Portland", "San Francisco", "Seattle", "Texas", "Washington"],
  Canada: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton", "Winnipeg", "Quebec City" ],
  "United Kingdom": ["London", "Edinburgh", "Manchester", "Bath", "York", "Birmingham", "Glasgow", "Liverpool", "Leeds", "Bristo", "Coventry", "Nottingham"],
  France: ["Paris", "Nice", "Lyon", "Marseille", "Bordeaux", "Toulouse", "Nantes", "Montpellier", "Strasbourg", "Bordeaux", "Lille"],
  Italy: ["Rome", "Florence", "Venice", "Milan", "Naples", "Bologna", "Verona", "Siena", "Cinque Terre", "Amalfi Coast"],
  Spain: ["Barcelona", "Madrid", "Seville", "Valencia", "Granada", "Bilbao", "Malaga", "Granada", "Santiago de Compostela", "Alicante", "San Sebastian"],
  Germany: ["Berlin", "Munich", "Hamburg", "Cologne", "Frankfurt", "Dusseldorf", "Stuttgart", "Dresden", "Nuremberg", "Leipzig" ],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Newcastle", "Canberra", "Sunshine Coast", "Central Coast"],
  Japan: ["Tokyo", "Kyoto", "Osaka", "Sapporo", "Hiroshima", "Nara", "Fukuoka", "Kobe", "Nagoya", "Okinawa"],
  China: [
    "Beijing", "Shanghai", "Shenzhen", "Guangzhou", "Xi'an",
    "Hangzhou", "Nanjing", "Suzhou", "Chengdu", "Chongqing",
    "Wuhan", "Tianjin", "Harbin", "Qingdao", "Dalian",
    "Zhangjiajie", "Guilin", "Lhasa", "Kunming"
  ],
  Greece: ["Athens", "Santorini", "Thessaloniki", "Heraklion", "Chania", "Rhodes", "Corfu", "Nafplio", "Delphi", "Kalamata", "Volos"],
  Turkey: ["Istanbul", "Cappadocia", "Antalya", "Ankara", "Izmir", "Bursa", "Konya", "Adana", "Gaziantep"],
};
const COUNTRIES_FALLBACK = Object.keys(COUNTRY_CITIES_FALLBACK).sort();

/* ---------- Helpers ---------- */
const currencyFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
function addDaysISO(isoDate, n) {
  if (!isoDate || !n) return "";
  const d = new Date(isoDate);
  d.setDate(d.getDate() + (Number(n) - 1));
  return d.toISOString().slice(0, 10);
}
function budgetLevelFromAmount(amount) {
  const a = Number(amount || 0);
  if (!a) return "";
  if (a <= 1500) return "Budget";
  if (a <= 4000) return "Mid-range";
  return "Luxury";
}

/* ---------- Form defaults ---------- */
const defaultForm = {
  country: "",
  city: "",
  startDate: "",
  days: "",
  travelers: "",
  style: [],
  budgetLevel: "",
  budgetUSD: 3000,
  pace: "",
  email: "",
};

export default function TripPlanner() {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [itinerary, setItinerary] = useState(null);
  const [emailStatus, setEmailStatus] = useState(""); // ✅ added

  const [countries, setCountries] = useState(COUNTRIES_FALLBACK);
  const [countryCityMap, setCountryCityMap] = useState(COUNTRY_CITIES_FALLBACK);
  const [cities, setCities] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const resultRef = useRef(null);

  /* ---------- Load countries ---------- */
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
    return () => { mounted = false; };
  }, []);

  /* ---------- Load cities ---------- */
  useEffect(() => {
    let mounted = true;
    const updateCitiesFromMap = (map) => {
      const matchKey = Object.keys(map).find(
        (c) => c.toLowerCase() === form.country.toLowerCase()
      );
      const key = matchKey || form.country;
      const list = key ? map[key] || [] : [];
      setCities(list);
      setForm((f) => (list.includes(f.city) ? f : { ...f, city: "" }));
    };

    (async () => {
      if (!form.country) { setCities([]); return; }
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

    return () => { mounted = false; };
  }, [form.country]);

  function onChange(e) {
    const { name, value, options } = e.target;
    setForm((f) => {
      if (name === "country") {
        const map = countryCityMap || COUNTRY_CITIES_FALLBACK;
        const matchKey = Object.keys(map).find(
          (c) => c.toLowerCase() === value.toLowerCase()
        );
        const normalizedCountry = matchKey || value;
        const list = map[normalizedCountry] || [];
        const nextCity = list.includes(f.city) ? f.city : "";
        return { ...f, country: normalizedCountry, city: nextCity };
      }
      if (name === "budgetUSD") {
        const val = value === "" ? "" : Math.max(0, Number(value));
        const derived = budgetLevelFromAmount(val);
        return { ...f, budgetUSD: val, budgetLevel: f.budgetLevel || derived };
      }
      if (name === "style") {
        const selected = Array.from(options).filter(o => o.selected).map(o => o.value);
        return { ...f, style: selected };
      }
      return { ...f, [name]: value };
    });
  }

  async function handleGenerate(e) {
    e?.preventDefault?.();
    setError("");
    setEmailStatus("");

    console.log("🚀 handleGenerate fired with form:", form);

    if (!form.country || !form.city) {
      console.warn("⚠️ Missing country or city", { country: form.country, city: form.city });
      setError("Please select both a country and a city.");
      return;
    }

    setLoading(true);
    try {
      const destination = `${form.city}, ${form.country}`;
      const endDate = addDaysISO(form.startDate, form.days);
      const resolvedBudgetLevel = form.budgetLevel || budgetLevelFromAmount(form.budgetUSD);

      console.log("🔎 Preparing AI request payload:", {
        destination,
        country: form.country,
        city: form.city,
        startDate: form.startDate,
        endDate,
        days: form.days,
        travelers: form.travelers,
        style: form.style,
        budgetLevel: resolvedBudgetLevel,
        budgetUSD: form.budgetUSD,
        pace: form.pace,
      });

      // ✅ Try AI-powered generation first
      let data;
      try {
        console.log("🌐 Sending fetch → /api/generate-itinerary-live");
        const resp = await fetch("/api/generate-itinerary-live", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            destination,
            country: form.country,
            city: form.city,
            startDate: form.startDate || undefined,
            endDate: endDate || undefined,
            days: form.days ? Number(form.days) : undefined,
            travelers: form.travelers ? Number(form.travelers) : undefined,
            style: form.style,
            budgetLevel: resolvedBudgetLevel,
            budgetUSD: form.budgetUSD ? Number(form.budgetUSD) : undefined,
            pace: form.pace || undefined,
          }),
        });

        console.log("🌐 API Response status:", resp.status);

        if (!resp.ok) throw new Error(`AI request failed: ${resp.status}`);
        data = await resp.json();

        console.log("✅ API Data received:", data);
      } catch (aiErr) {
        console.error("❌ AI itinerary failed, falling back to mock:", aiErr);
        data = generateMockItinerary({
          destination,
          startDate: form.startDate,
          endDate,
          days: form.days,
          travelers: form.travelers,
          styles: form.style,
          budgetLevel: resolvedBudgetLevel,
          pace: form.pace,
        });
      }

      console.log("📦 Processed itinerary data (pre-state):", data);

      const days = (data?.days || []).map((d, i) => ({
        title: d.title || `Day ${i + 1}`,
        location: d.location || destination,
        bullets: Array.isArray(d.items) ? d.items : d.bullets || [],
      }));

      const budget = data?.budget && data.budget.rows ? data.budget : null;

      const titleBits = [
        destination || "Your Trip",
        form.days ? `${form.days} days` : "",
        Array.isArray(form.style) ? form.style.join(", ") : form.style,
        resolvedBudgetLevel,
        form.pace,
        form.budgetUSD ? `~${currencyFmt.format(form.budgetUSD)}` : "",
      ].filter(Boolean);

      const newItinerary = {
        tripTitle: data?.title || titleBits.join(" — "),
        days,
        budget,
        travelers: form.travelers ? Number(form.travelers) : null,
        daysCount: days.length,
        budgetTier: resolvedBudgetLevel || null,
        budgetUSD: form.budgetUSD ? Number(form.budgetUSD) : null,
      };

      console.log("✅ Final itinerary object (pre-setState):", newItinerary);

      setItinerary(newItinerary);

      // ✅ Send email if provided
      if (form.email) {
        console.log("📧 Sending itinerary email to:", form.email);
        const html = itineraryTextToHtml({
          tripTitle: newItinerary.tripTitle,
          days: newItinerary.days,
          budgetRows: newItinerary.budget?.rows || [],
        });

        try {
          const resp = await fetch("/api/send-itinerary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: form.email,
              subject: "Your SmartTrip Itinerary",
              html,
            }),
          });
          if (resp.ok) {
            const data = await resp.json();
            console.log("✅ Email sent successfully:", data);
            setEmailStatus("✅ Itinerary sent to your email!");
          } else {
            console.error("❌ Failed to send itinerary via email. Status:", resp.status);
            setEmailStatus("❌ Failed to send itinerary via email.");
          }
        } catch (err) {
          console.error("❌ Error during email send fetch:", err);
          setEmailStatus("❌ Error sending itinerary email.");
        }
      }

    } catch (err) {
      console.error("❌ Top-level error in handleGenerate:", err);
      setError(`Sorry—couldn't generate the itinerary. ${err.message || "Please try again."}`);
      setItinerary(null);
    } finally {
      setLoading(false);
    }
  }

  function handleDownloadHtml() {
    if (!itinerary) return;
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

  // Slider bounds
  const BUDGET_MIN = 500;
  const BUDGET_MAX = 20000;
  const BUDGET_STEP = 100;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-6">
      <Card className="shadow-md">
        <div className="px-6 pt-6 text-center">
          <h2 className="text-3xl font-semibold">Plan Your Trip</h2>
        </div>

        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleGenerate} autoComplete="off" className="grid grid-cols-12 gap-4">

            {/* Country - Fixed dropdown */}
            <div className="col-span-12 md:col-span-6">
              <Listbox 
                value={form.country} 
                onChange={(value) => setForm(f => {
                  const map = countryCityMap || COUNTRY_CITIES_FALLBACK;
                  const matchKey = Object.keys(map).find(
                    (c) => c.toLowerCase() === value.toLowerCase()
                  );
                  const normalizedCountry = matchKey || value;
                  const list = map[normalizedCountry] || [];
                  const nextCity = list.includes(f.city) ? f.city : "";
                  return { ...f, country: normalizedCountry, city: nextCity };
                })}
                disabled={loadingCountries}
              >
                <div className="relative">
                  <Listbox.Button className="w-full rounded-lg border p-3 flex justify-between text-left">
                    <span className={form.country ? "text-black" : "text-gray-500"}>
                      {form.country || "Select or type a country"}
                    </span>
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                  </Listbox.Button>
                  <Transition as={Fragment}>
                    <Listbox.Options className="absolute z-20 mt-1 w-full rounded-lg bg-white shadow-lg max-h-60 overflow-auto border">
                      {countries.map((country) => (
                        <Listbox.Option 
                          key={country} 
                          value={country} 
                          className={({ active }) =>
                            `cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                              active ? 'bg-orange-100' : ''
                            }`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span className={selected ? "font-medium" : "font-normal"}>
                                {country}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                  <CheckIcon className="h-5 w-5 text-orange-600" />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>

            {/* City - Fixed dropdown */}
            <div className="col-span-12 md:col-span-6">
              <Listbox 
                value={form.city} 
                onChange={(value) => setForm(f => ({ ...f, city: value }))}
                disabled={!form.country || loadingCities}
              >
                <div className="relative">
                  <Listbox.Button className="w-full rounded-lg border p-3 flex justify-between text-left">
                    <span className={form.city ? "text-black" : "text-gray-500"}>
                      {form.city || (!form.country ? "Select Country First" : "Type or pick a city")}
                    </span>
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                  </Listbox.Button>
                  <Transition as={Fragment}>
                    <Listbox.Options className="absolute z-20 mt-1 w-full rounded-lg bg-white shadow-lg max-h-60 overflow-auto border">
                      {cities.map((city) => (
                        <Listbox.Option 
                          key={city} 
                          value={city} 
                          className={({ active }) =>
                            `cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                              active ? 'bg-orange-100' : ''
                            }`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span className={selected ? "font-medium" : "font-normal"}>
                                {city}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                  <CheckIcon className="h-5 w-5 text-orange-600" />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>

            {/* Start Date */}
            <div className="col-span-12 md:col-span-6">
              <input type="date" name="startDate" value={form.startDate} onChange={onChange} className="w-full rounded-lg border p-3" />
            </div>

            {/* Days */}
            <div className="col-span-12 md:col-span-6">
              <input name="days" value={form.days} onChange={onChange} inputMode="numeric" placeholder="Number of Days" className="w-full rounded-lg border p-3" />
            </div>

            {/* Travel Style (multi-select w/ checkboxes) */}
            <div className="col-span-12 md:col-span-6">
              <Listbox value={form.style} onChange={(selected) => setForm((f) => ({ ...f, style: selected }))} multiple>
                {({ open }) => (
                  <div className="relative">
                    <Listbox.Button className="w-full rounded-lg border p-3 flex justify-between">
                      <span>{form.style.length > 0 ? form.style.join(", ") : "Select Travel Style(s)"}</span>
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                    </Listbox.Button>
                    <Transition as={Fragment}>
                      <Listbox.Options className="absolute z-10 mt-1 w-full rounded-lg bg-white shadow-lg max-h-60 overflow-auto border">
                        {["Foodies", "Culture", "Beach", "Nature", "National Parks", "Luxury", "Budget", "Family"].map((style) => (
                          <Listbox.Option key={style} value={style} className="cursor-pointer select-none relative py-2 pl-10 pr-4">
                            {({ selected }) => (
                              <>
                                <span className={selected ? "font-medium" : "font-normal"}>{style}</span>
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                  {selected ? (
                                    <div className="h-4 w-4 flex items-center justify-center rounded border bg-orange-500 text-white">
                                      <CheckIcon className="h-3 w-3" />
                                    </div>
                                  ) : (
                                    <div className="h-4 w-4 border rounded bg-white" />
                                  )}
                                </span>
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                )}
              </Listbox>
            </div>

            {/* Travelers */}
            <div className="col-span-12 md:col-span-6">
              <input name="travelers" value={form.travelers} onChange={onChange} inputMode="numeric" placeholder="Number of Travelers" className="w-full rounded-lg border p-3" />
            </div>

            {/* Budget (left) */}
            <div className="col-span-12 md:col-span-6">
              <label>Total Budget: <span>{currencyFmt.format(form.budgetUSD || 0)}</span></label>
              <input type="range" name="budgetUSD" min={BUDGET_MIN} max={BUDGET_MAX} step={BUDGET_STEP} value={Number(form.budgetUSD || 0)} onChange={onChange} className="w-full" />
              <input type="number" name="budgetUSD" value={form.budgetUSD} onChange={onChange} className="w-full rounded-lg border p-3 mt-2" />
            </div>

            {/* Right: Trip Pace + Email */}
            <div className="col-span-12 md:col-span-6 space-y-4">
              <select name="pace" value={form.pace} onChange={onChange} className="w-full rounded-lg border p-3">
                <option value="" disabled hidden>Trip Pace</option>
                <option>Relaxed</option>
                <option>Balanced</option>
                <option>Fast</option>
              </select>
              <input type="email" name="email" value={form.email} onChange={onChange} placeholder="Email (optional)" className="w-full rounded-lg border p-3" />
            </div>

            {/* CTA */}
            <div className="col-span-12">
              <button type="submit" disabled={loading} className="w-full px-5 py-3 bg-orange-600 text-white rounded-lg">
                {loading ? "Generating..." : "Generate My Trip"}
              </button>
            </div>
          </form>
          {error && <p className="mt-3 text-red-600 text-center">{error}</p>}
          {emailStatus && <p className="mt-3 text-center text-sm">{emailStatus}</p>}
        </CardContent>
      </Card>

      <div ref={resultRef} />

      {itinerary && (
        <>
          <Itinerary tripTitle={itinerary.tripTitle} days={itinerary.days} />
          {itinerary.budget?.rows?.length ? <BudgetCard budget={itinerary.budget} travelers={itinerary.travelers} daysCount={itinerary.daysCount} budgetTier={itinerary.budgetTier} budgetUSD={itinerary.budgetUSD} /> : null}
          <button onClick={handleDownloadHtml} className="mt-2 px-4 py-2 bg-gray-800 text-white rounded-lg">Download HTML</button>
        </>
      )}
    </div>
  );
}
