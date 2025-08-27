"use client";

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet"; // 👈 NEW
import { Card, CardContent } from "./components/ui/card";
import TripPlanner from "./components/TripPlanner";
import Hero from "./components/Hero";

export default function App() {
  // Smooth scroll
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

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const scrollToPlanner = (e) => {
    e.preventDefault();
    const target = document.getElementById("planner");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Newsletter form state
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
    } catch (err) {
      setSubMsg("Sorry, something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-[#F9F9F9] text-[#333333] min-h-screen">
      {/* 👇 NEW: Social Sharing Tags */}
      <Helmet>
        <title>SmartTrip – Plan Smarter, Travel Better</title>
        <meta property="og:title" content="SmartTrip – Plan Smarter, Travel Better" />
        <meta
          property="og:description"
          content="AI-powered itineraries with real-time budgeting and smarter trip planning."
        />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta property="og:type" content="website" />

        {/* Twitter card support */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SmartTrip – Plan Smarter, Travel Better" />
        <meta
          name="twitter:description"
          content="AI-powered itineraries with real-time budgeting and smarter trip planning."
        />
        <meta name="twitter:image" content="/og-image.jpg" />
      </Helmet>

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center p-6 max-w-6xl mx-auto gap-4">
        <a
          href="#top"
          onClick={scrollToTop}
          className="flex items-center gap-2 group"
          aria-label="Go to top"
        >
          <img src="/logo.png" alt="SmartTrip Logo" className="h-8 w-auto" />
          <span className="text-2xl font-bold text-black group-hover:opacity-90">
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

      {/* ✅ ... keep the rest of your existing code exactly the same ... */}

      {/* Footer */}
      <footer className="bg-[#1f2a44] text-white py-10 text-center" id="signup">
        {/* ... unchanged footer code ... */}
      </footer>
    </div>
  );
}
