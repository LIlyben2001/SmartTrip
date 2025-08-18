import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import TripPlanner from "./components/TripPlanner";
import Hero from "./components/Hero";

export default function LandingPage() {
  // Smooth scroll handler for anchor links
  useEffect(() => {
    const handleClick = (e) => {
      const a = e.target.closest("a[href^='#']");
      if (!a) return;
      const id = a.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Helpers
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const scrollToPlanner = (e) => {
    e.preventDefault();
    const target = document.getElementById("planner");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Subscribe state
  const [submitting, setSubmitting] = useState(false);
  const [subEmail, setSubEmail] = useState("");
  const [subMsg, setSubMsg] = useState("");

  async function handleSubscribe(e) {
    e.preventDefault();
    setSubMsg("");
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subEmail);
    if (!valid) {
      setSubMsg("Please enter a valid email.");
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subEmail }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSubMsg("You're on the list! Check your inbox for a confirmation.");
      setSubEmail("");
    } catch {
      setSubMsg("Sorry, something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-[#F9F9F9] text-[#333333] min-h-screen">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center p-6 max-w-6xl mx-auto gap-4">
        <a
          href="#top"
          onClick={scrollToTop}
          className="flex items-center gap-2 group"
          aria-label="Go to top"
        >
          <img src="/logo.png" alt="SmartTrip Logo" className="h-8 w-auto" />
          <span className="text-2xl font-bold text-white group-hover:opacity-90">
            SmartTrip
          </span>
        </a>

        <nav className="flex flex-wrap justify-center gap-4">
          <a href="#features" className="text-[#1F2F46] font-medium">Features</a>
          <a href="#planner" className="text-[#1F2F46] font-medium">Demo</a>
          <a href="#faq" className="text-[#1F2F46] font-medium">FAQ</a>
          <a
            href="#planner"
            onClick={scrollToPlanner}
            className="text-[#FF6B35] font-semibold"
          >
            Get Started
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <Hero />

      {/* Trip Planner */}
      <div id="planner">
        <TripPlanner />
      </div>

      {/* Features */}
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
                <div className="text-4xl mb-3" aria-hidden="true">{f.icon}</div>
                <h3 className="text-xl font-semibold text-primary">{f.title}</h3>
                <p className="text-text mt-2">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          <details className="group rounded-lg border bg-white p-5 open:shadow-md">
            <summary className="flex cursor-pointer list-none items-center justify-between">
              <span className="text-lg font-semibold text-[#1F2F46]">
                What is SmartTrip?
              </span>
              <span className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full border text-[#1F2F46] transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-[#333333]">
              SmartTrip is an AI-powered travel planning tool that helps you create personalized
              itineraries, estimate budgets, and discover hidden gems for destinations worldwide.
            </p>
          </details>

          <details className="group rounded-lg border bg-white p-5 open:shadow-md">
            <summary className="flex cursor-pointer list-none items-center justify-between">
              <span className="text-lg font-semibold text-[#1F2F46]">
                Is SmartTrip free to use?
              </span>
              <span className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full border text-[#1F2F46] transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-[#333333]">
              Yes, SmartTrip offers a free beta experience. Some advanced features may become
              part of premium plans in the future.
            </p>
          </details>

          <details className="group rounded-lg border bg-white p-5 open:shadow-md">
            <summary className="flex cursor-pointer list-none items-center justify-between">
              <span className="text-lg font-semibold text-[#1F2F46]">
                Can SmartTrip plan trips outside of China?
              </span>
              <span className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full border text-[#1F2F46] transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-[#333333]">
              Absolutely. SmartTrip is designed for both China and international destinations.
            </p>
          </details>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1f2a44] text-white py-10 text-center" id="signup">
        <h2 className="text-lg font-bold mb-2">Join Our Beta List</h2>
        <p className="mb-4">Be the first to access the app and get travel-ready perks.</p>

        <form onSubmit={handleSubscribe} className="flex justify-center gap-2">
          <input
            type="email"
            value={subEmail}
            onChange={(e) => setSubEmail(e.target.value)}
            placeholder="Enter your email"
            className="px-4 py-2 rounded-full border border-gray-300 text-black"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#f97316] hover:bg-[#ea580c] text-white px-4 py-2 rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Sending..." : "Notify Me"}
          </button>
        </form>

        <p className="text-xs text-white mt-2 opacity-80">
          Occasional product updates only. Unsubscribe anytime.
        </p>
        {subMsg && <p className="text-xs text-white mt-2">{subMsg}</p>}

        <p className="text-xs text-white mt-6">
          © {new Date().getFullYear()} SmartTrip. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
