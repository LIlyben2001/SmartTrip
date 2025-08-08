// src/components/TripPlanner.jsx
import { useRef, useState, useEffect } from "react";
import Itinerary from "./Itinerary";
import { Card, CardContent } from "./ui/card";
import { itineraryTextToHtml, downloadHtml } from "../utils/downloadHtml";

// --- Form defaults (no auto-selected Travel Style) ---
const defaultForm = {
  destination: "",
  startDate: "",
  days: "",
  travelers: "",
  style: "",        // user must choose
  budgetLevel: "",
  pace: "",
  email: "",
};

// helper: compute endDate from startDate + days
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
  const [itinerary, setItinerary] = useState(null); // { tripTitle, days, budgetRows }
  const resultRef = useRef(null);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleGenerate(e) {
    e?.preventDefault?.();
    console.log("[TripPlanner] submit clicked", form);
    setError("");
    setLoading(true);

    try {
      const endDate = addDaysISO(form.startDate, form.days);

      const payload = {
        destination: form.destination,
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

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Request failed: ${res.status} ${txt}`);
      }

      const data = await res.json();

      // Normalize -> Itinerary shape
      const days = (data?.days || []).map((d, i) => ({
        title: d.title || `Day ${i + 1}`,
        location: d.location || d.city || form.destination || "",
        bullets: Array.isArray(d.items) ? d.items : (d.bullets || []),
      }));

      const budgetRows =
        data?.budget?.rows && Array.isArray(data.budget.rows)
          ? data.budget.rows
          : undefined;

      setItinerary({
        tripTitle:
          data?.title ||
          `${form.destination || "Your Trip"}${
            form.days ? ` — ${form.days} days` : ""
          }${form.style ? ` • ${form.style}` : ""}${
            form.budgetLevel ? ` • ${form.budgetLevel}` : ""
          }${form.pace ? ` • ${form.pace}` : ""}`,
        days,
        budgetRows,
      });
    } catch (err) {
      console.error("[TripPlanner] generate error:", err);
      setError(
        `Sorry—couldn’t generate the itinerary. ${
          err?.message || "Please try again."
        }`
      );
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

  // Smooth scroll to results when itinerary updates
  useEffect(() => {
    if (itinerary && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [itinerary]);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-6">
      <Card className="shadow-md">
        <div className="px-6 pt-6 text-center">
          <h2 className="text-3xl font-semibold">Plan Yo
