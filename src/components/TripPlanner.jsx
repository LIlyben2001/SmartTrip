// src/App.jsx
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import TripPlanner from "./components/TripPlanner";
import { useI18n } from "./i18n";

/** Compact language switcher that lists all supported languages
 *  using their native names from DICTS._meta.nativeName
 */
function LanguageSwitcher() {
  const { lang, setLang, DICTS, SUPPORTED } = useI18n();
  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      className="border rounded px-2 py-1"
      aria-label="Language"
      title="Language"
    >
      {SUPPORTED.map((code) => (
        <option key={code} value={code}>
          {DICTS[code]._meta?.nativeName || code}
        </option>
      ))}
    </select>
  );
}

export default function LandingPage() {
  const { t } = useI18n();

  // Smooth scroll for in-page anchor links (e.g., #planner, #features, #signup)
  useEffect(() => {
    const handleClick = (e) => {
      const a = e.target.closest("a[href^='#']");
      if (!a) return;
      const id = a.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth" });
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="bg-[#F9F9F9] text-[#333333] min-h-screen">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center p-6 max-w-6xl mx-auto gap-4">
        <div className="text-2xl font-bold text-[#1F2F46]">{t("appTitle")}</div>
        <nav className="flex flex-wrap items-center gap-4">
          <a href="#features" className="text-[#1F2F46] font-medium">
            {t("navFeatures")}
          </a>
          <a href="#planner" className="text-[#1F2F46] font-medium">
            {t("navDemo")}
          </a>
          <a href="#signup" className="text-[#FF6B35] font-semibold">
            {t("navGetStarted")}
          </a>
          <LanguageSwitcher />
        </nav>
      </header>

      {/* HERO */}
      <section className="text-center py-8 px-4 bg-white">
        <img src="/logo.png" alt="SmartTrip Logo" className="mx-auto mb-6 h-20 w-auto" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          {t("heroTitle")}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-text font-medium max-w-2xl mx-auto">
          {t("heroSubtitle")}
        </p>
        <div className="mt-4">
          <a
            href="#planner"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-6 py-3 rounded-full transition"
          >
            {/* You can localize this too by adding a key to DICTS, if you want */}
            Plan My Trip Now
          </a>
        </div>
      </section>

      {/* Trip Planner anchor target */}
      <div id="planner">
        <TripPlanner />
      </div>

      {/* Features (left in English for now, easy to translate later) */}
      <section id="features" className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-12">
          Core Features — Coming Soon
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: "🧠", title: "AI Trip Builder", desc: "Build multi-city trips with smart time & cost estimates." },
            { icon: "💰", title: "Real-Time Budget", desc: "Know how much your trip will cost as you plan." },
            { icon: "🎟️", title: "Ticketing Alerts", desc: "Get notified of places that need advance booking or permits." },
            { icon: "📋", title: "Custom Itineraries", desc: "Save, share or download your personalized trip plan." },
            { icon: "📶", title: "Offline Access", desc: "Export your itinerary as PDF for travel use." },
            { icon: "🌏", title: "China + Global Ready", desc: "Handles local bookings, permits & worldwide planning." },
          ].map((f, i) => (
            <Card key={i} className="shadow-md text-center">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="text-xl font-semibold text-primary">{f.title}</h3>
                <p className="text-text mt-2">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer / Signup */}
      <footer className="bg-[#1f2a44] text-white py-10 text-center" id="signup">
        <h2 className="text-lg font-bold mb-2">Join Our Beta List</h2>
        <p className="mb-4">Be the first to access the app and get travel-ready perks.</p>
        <div className="flex justify-center gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded-full border border-gray-300 text-black"
          />
          <button className="bg-[#f97316] hover:bg-[#ea580c] text-white px-4 py-2 rounded-full">
            Notify Me
          </button>
        </div>
        <p className="text-xs text-white mt-6">© 2025 SmartTrip. All rights reserved.</p>
      </footer>
    </div>
  );
}
