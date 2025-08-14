// src/components/TripPlanner.jsx
import { useRef, useState, useEffect } from "react";
import Itinerary from "./Itinerary";
import BudgetCard from "./BudgetCard";
import { Card, CardContent } from "./ui/card";
import { itineraryTextToHtml, downloadHtml } from "../utils/downloadHtml";

/* -------------------- i18n -------------------- */
const LANG_LABEL = {
  en: "English",
  zh: "中文",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  ja: "日本語",
};
const tMap = {
  en: {
    planYourTrip: "Plan Your Trip",
    selectCountry: "Select Country",
    selectCity: "Select City",
    selectCountryFirst: "Select Country First",
    loadingCountries: "Loading countries...",
    loadingCities: "Loading cities...",
    date: "mm/dd/yyyy",
    days: "Number of Days",
    style: "Travel Style",
    travelers: "Number of Travelers",
    budgetLabel: "Total Budget",
    tripPace: "Trip Pace",
    relaxed: "Relaxed",
    balanced: "Balanced",
    fast: "Fast",
    generate: "Generate My Trip",
    previewTitle: "Sample Itinerary Preview",
    previewLine:
      "Your {days}-day {style} Adventure in {city} with a budget of {budget} includes iconic sites, neighborhood dining, and a local experience!",
    tier: "Estimated tier",
    step: "Step",
    rangeSep: "–",
    mock: "Mock",
    live: "Live AI",
    currencyNote: "Enter total budget in USD",
    email: "Email (optional)",
    errorMissingLocation: "Please select both a country and a city.",
  },
  zh: {
    planYourTrip: "规划你的行程",
    selectCountry: "选择国家",
    selectCity: "选择城市",
    selectCountryFirst: "请先选择国家",
    loadingCountries: "正在加载国家…",
    loadingCities: "正在加载城市…",
    date: "年-月-日",
    days: "旅行天数",
    style: "旅行风格",
    travelers: "出行人数",
    budgetLabel: "总预算",
    tripPace: "行程节奏",
    relaxed: "休闲",
    balanced: "适中",
    fast: "紧凑",
    generate: "生成我的行程",
    previewTitle: "示例行程预览",
    previewLine:
      "你的{days}天{style}之旅（目的地：{city}，预算：{budget}）包含地标景点、社区美食与本地体验！",
    tier: "预算档位",
    step: "步进",
    rangeSep: "—",
    mock: "模拟",
    live: "实时 AI",
    currencyNote: "请输入总预算（美元）",
    email: "邮箱（可选）",
    errorMissingLocation: "请同时选择国家和城市。",
  },
  es: {
    planYourTrip: "Planifica tu viaje",
    selectCountry: "Selecciona un país",
    selectCity: "Selecciona una ciudad",
    selectCountryFirst: "Selecciona primero un país",
    loadingCountries: "Cargando países…",
    loadingCities: "Cargando ciudades…",
    date: "dd/mm/aaaa",
    days: "Número de días",
    style: "Estilo de viaje",
    travelers: "Número de viajeros",
    budgetLabel: "Presupuesto total",
    tripPace: "Ritmo del viaje",
    relaxed: "Relajado",
    balanced: "Equilibrado",
    fast: "Rápido",
    generate: "Generar mi viaje",
    previewTitle: "Vista previa del itinerario",
    previewLine:
      "Tu aventura de {days} días de {style} en {city} con un presupuesto de {budget} incluye sitios icónicos, gastronomía local y experiencias auténticas.",
    tier: "Nivel estimado",
    step: "Paso",
    rangeSep: "–",
    mock: "Simulado",
    live: "IA en vivo",
    currencyNote: "Introduce el presupuesto total en USD",
    email: "Correo (opcional)",
    errorMissingLocation: "Selecciona un país y una ciudad.",
  },
  fr: {
    planYourTrip: "Planifiez votre voyage",
    selectCountry: "Sélectionnez un pays",
    selectCity: "Sélectionnez une ville",
    selectCountryFirst: "Sélectionnez d'abord un pays",
    loadingCountries: "Chargement des pays…",
    loadingCities: "Chargement des villes…",
    date: "jj/mm/aaaa",
    days: "Nombre de jours",
    style: "Style de voyage",
    travelers: "Nombre de voyageurs",
    budgetLabel: "Budget total",
    tripPace: "Rythme du voyage",
    relaxed: "Détendu",
    balanced: "Équilibré",
    fast: "Rapide",
    generate: "Générer mon voyage",
    previewTitle: "Aperçu d’itinéraire",
    previewLine:
      "Votre aventure {style} de {days} jours à {city} avec un budget de {budget} inclut des sites emblématiques, une cuisine locale et des expériences authentiques.",
    tier: "Niveau estimé",
    step: "Pas",
    rangeSep: "–",
    mock: "Simulé",
    live: "IA en direct",
    currencyNote: "Saisissez le budget total en USD",
    email: "E-mail (facultatif)",
    errorMissingLocation: "Veuillez sélectionner un pays et une ville.",
  },
  de: {
    planYourTrip: "Reise planen",
    selectCountry: "Land auswählen",
    selectCity: "Stadt auswählen",
    selectCountryFirst: "Bitte zuerst ein Land auswählen",
    loadingCountries: "Länder werden geladen…",
    loadingCities: "Städte werden geladen…",
    date: "TT/MM/JJJJ",
    days: "Anzahl der Tage",
    style: "Reisestil",
    travelers: "Anzahl Reisende",
    budgetLabel: "Gesamtbudget",
    tripPace: "Reisetempo",
    relaxed: "Entspannt",
    balanced: "Ausgewogen",
    fast: "Schnell",
    generate: "Reise erstellen",
    previewTitle: "Reisevorschau",
    previewLine:
      "Dein {days}-tägiges {style}-Abenteuer in {city} mit einem Budget von {budget} umfasst Highlights, lokale Küche und authentische Erlebnisse.",
    tier: "Geschätzte Stufe",
    step: "Schritt",
    rangeSep: "–",
    mock: "Mock",
    live: "Live-KI",
    currencyNote: "Gesamtbudget in USD eingeben",
    email: "E-Mail (optional)",
    errorMissingLocation: "Bitte Land und Stadt auswählen.",
  },
  ja: {
    planYourTrip: "旅程を計画する",
    selectCountry: "国を選択",
    selectCity: "都市を選択",
    selectCountryFirst: "先に国を選択してください",
    loadingCountries: "国を読み込み中…",
    loadingCities: "都市を読み込み中…",
    date: "yyyy/mm/dd",
    days: "日数",
    style: "旅行スタイル",
    travelers: "人数",
    budgetLabel: "合計予算",
    tripPace: "旅のペース",
    relaxed: "ゆったり",
    balanced: "バランス",
    fast: "駆け足",
    generate: "旅程を作成",
    previewTitle: "旅程サンプル",
    previewLine:
      "{city}での{days}日間の{style}旅行（予算：{budget}）は、名所、ローカルグルメ、体験型アクティビティを含みます。",
    tier: "推定クラス",
    step: "刻み",
    rangeSep: "～",
    mock: "モック",
    live: "ライブAI",
    currencyNote: "合計予算（USD）を入力",
    email: "メール（任意）",
    errorMissingLocation: "国と都市を選択してください。",
  },
};
const t = (lang, key) => (tMap[lang]?.[key] ?? tMap.en[key] ?? key);

/* ---------- URL toggle: ?live=1 -> OpenAI; otherwise mock ---------- */
function resolveUseLiveFromURL() {
  if (typeof window === "undefined") return false;
  const qs = new URLSearchParams(window.location.search);
  const v = qs.get("live");
  if (v === "1" || v === "true") return true;
  if (v === "0" || v === "false") return false;
  return false; // default mock
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
  Greece: ["Athens", "Santorini", "Thessaloniki"],
  Turkey: ["Istanbul", "Cappadocia", "Antalya"],
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
  style: "",
  budgetLevel: "", // derived from budgetUSD if empty
  budgetUSD: 3000, // numeric budget slider
  pace: "",
  email: "",
};

export default function TripPlanner({ selectedLanguage = "en" }) {
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

  // Live/Mock toggle via URL
  const [useLive] = useState(resolveUseLiveFromURL());

  const resultRef = useRef(null);

  // keep <html lang="…"> in sync for a11y/SEO
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", selectedLanguage);
    }
  }, [selectedLanguage]);

  const ModeBadge = () => (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
      ${useLive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}
      title={useLive ? t(selectedLanguage, "live") : t(selectedLanguage, "mock")}
    >
      {useLive ? t(selectedLanguage, "live") : t(selectedLanguage, "mock")}
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
      if (name === "budgetUSD") {
        const val = value === "" ? "" : Math.max(0, Number(value));
        const derived = budgetLevelFromAmount(val);
        return { ...f, budgetUSD: val, budgetLevel: f.budgetLevel || derived };
      }
      return { ...f, [name]: value };
    });
  }

  async function handleGenerate(e) {
    e?.preventDefault?.();
    setError("");

    if (!form.country || !form.city) {
      setError(t(selectedLanguage, "errorMissingLocation"));
      return;
    }

    setLoading(true);
    try {
      const destination = `${form.city}, ${form.country}`;
      const endDate = addDaysISO(form.startDate, form.days);
      const resolvedBudgetLevel = form.budgetLevel || budgetLevelFromAmount(form.budgetUSD);

      // Language name to instruct the model explicitly
      const langName = LANG_LABEL[selectedLanguage] || "English";

      const payload = {
        destination,
        country: form.country,
        city: form.city,
        startDate: form.startDate || undefined,
        endDate: endDate || undefined,
        days: form.days ? Number(form.days) : undefined,
        travelers: form.travelers ? Number(form.travelers) : undefined,
        style: form.style || undefined,
        budgetLevel: resolvedBudgetLevel || undefined,
        budgetUSD: form.budgetUSD ? Number(form.budgetUSD) : undefined,
        pace: form.pace || undefined,
        email: form.email || undefined,
        // 👇 ensure the backend responds in the user-selected language
        language: selectedLanguage,
        languageName: langName,
        // Some backends use a freeform instruction:
        instruction: `Respond in ${langName} for all text and headings.`,
      };

      const liveEndpoint = "/api/generate-itinerary-live";
      const mockEndpoint = "/api/generate-itinerary";
      const primary = useLive ? liveEndpoint : mockEndpoint;

      let res = await fetch(primary, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // fallback to mock if live errors
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

      const budget = data?.budget && data.budget.rows ? data.budget : null;

      const titleBits = [
        destination || "Your Trip",
        form.days ? `${form.days} days` : "",
        form.style,
        resolvedBudgetLevel,
        form.pace,
        form.budgetUSD ? `~${currencyFmt.format(form.budgetUSD)}` : "",
      ].filter(Boolean);

      setItinerary({
        tripTitle: data?.title || titleBits.join(" — "),
        days,
        budget,
        travelers: form.travelers ? Number(form.travelers) : null, // for per-person toggle
        daysCount: days.length,
        budgetTier: resolvedBudgetLevel || null,
        budgetUSD: form.budgetUSD ? Number(form.budgetUSD) : null,
      });

      setForm({ ...defaultForm }); // clear inputs
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

  const fmtRange = `${currencyFmt.format(BUDGET_MIN)} ${t(selectedLanguage, "rangeSep")} ${currencyFmt.format(
    BUDGET_MAX
  )} • ${t(selectedLanguage, "step")} ${currencyFmt.format(BUDGET_STEP)}`;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-6">
      <Card className="shadow-md">
        <div className="px-6 pt-6 text-center">
          <h2 className="text-3xl font-semibold inline-flex items-center gap-2 justify-center">
            {t(selectedLanguage, "planYourTrip")} <ModeBadge />
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
                  {loadingCountries ? t(selectedLanguage, "loadingCountries") : t(selectedLanguage, "selectCountry")}
                </option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
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
                  {!form.country
                    ? t(selectedLanguage, "selectCountryFirst")
                    : loadingCities
                    ? t(selectedLanguage, "loadingCities")
                    : t(selectedLanguage, "selectCity")}
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
                placeholder={t(selectedLanguage, "date")}
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
                placeholder={t(selectedLanguage, "days")}
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
                  {t(selectedLanguage, "style")}
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
                placeholder={t(selectedLanguage, "travelers")}
              />
            </div>

            {/* Budget (Slider + Number input) */}
            <div className="col-span-12 md:col-span-6">
              <label htmlFor="budgetUSD" className="block text-sm font-medium text-gray-700 mb-1">
                {t(selectedLanguage, "budgetLabel")}:{" "}
                <span className="font-semibold">{currencyFmt.format(form.budgetUSD || 0)}</span>
              </label>
              <input
                id="budgetUSD"
                type="range"
                name="budgetUSD"
                min={BUDGET_MIN}
                max={BUDGET_MAX}
                step={BUDGET_STEP}
                value={Number(form.budgetUSD || 0)}
                onChange={onChange}
                className="w-full"
              />
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  name="budgetUSD"
                  min={BUDGET_MIN}
                  max={BUDGET_MAX}
                  step={BUDGET_STEP}
                  value={form.budgetUSD}
                  onChange={onChange}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={t(selectedLanguage, "currencyNote")}
                />
              </div>
              <div className="mt-1 text-xs text-gray-500">{fmtRange}</div>
              <div className="mt-1 text-xs text-gray-600">
                {t(selectedLanguage, "tier")}:{" "}
                <span className="font-medium">{budgetLevelFromAmount(form.budgetUSD) || "—"}</span>
              </div>
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
                  {t(selectedLanguage, "tripPace")}
                </option>
                <option>{t(selectedLanguage, "relaxed")}</option>
                <option>{t(selectedLanguage, "balanced")}</option>
                <option>{t(selectedLanguage, "fast")}</option>
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
                placeholder={t(selectedLanguage, "email")}
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
                {loading ? "…" : t(selectedLanguage, "generate")}
              </button>
            </div>

            {/* Sample Itinerary Preview */}
            <div className="col-span-12">
              <div className="bg-gray-100 text-center rounded-lg p-4 mt-2">
                <h3 className="font-semibold mb-1">{t(selectedLanguage, "previewTitle")}</h3>
                <p className="text-gray-700">
                  {t(selectedLanguage, "previewLine")
                    .replace("{days}", form.days || 5)
                    .replace("{style}", form.style || "Cultural")
                    .replace("{city}", form.city || "Beijing")
                    .replace("{budget}", currencyFmt.format(form.budgetUSD || 3000))}
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
          <Itinerary tripTitle={itinerary.tripTitle} days={itinerary.days} />

          {itinerary.budget?.rows?.length ? (
            <div className="mt-4">
              <BudgetCard
                budget={itinerary.budget}
                travelers={itinerary.travelers}
                daysCount={itinerary.daysCount}
                budgetTier={itinerary.budgetTier}
                budgetUSD={itinerary.budgetUSD}
              />
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
