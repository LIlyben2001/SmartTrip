// src/components/Hero.jsx
import React from "react";

export default function Hero() {
  return (
    <section
      className="relative text-center px-4"
      style={{
        backgroundImage: "url('/og-image.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay only behind text */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="max-w-6xl mx-auto py-12 md:py-20 relative z-10">
        <img
          src="/logo.png"
          alt="SmartTrip Logo"
          className="mx-auto mb-6 h-20 w-auto drop-shadow"
        />
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Personalized Travel Planner + AI Trip Builder
        </h1>
        <p className="mt-4 text-lg md:text-xl font-medium max-w-2xl mx-auto text-white/90">
          Plan smarter, travel better. Create customized itineraries, get instant budgets,
          and explore hidden gems — for China and worldwide adventures.
        </p>
        <div className="mt-6">
          <a
            href="#planner"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-6 py-3 rounded-full transition"
          >
            Plan My Trip Now
          </a>
        </div>
      </div>

      {/* Fade to background color at bottom */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 md:h-16 bg-gradient-to-b from-transparent to-[#F9F9F9]" />
    </section>
  );
}
