import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import TripPlanner from './components/TripPlanner';

export default function LandingPage() {
  return (
    <div className="bg-[#F9F9F9] text-[#333333] min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-center p-6 max-w-6xl mx-auto gap-4">
        <div className="text-2xl font-bold text-[#1F2F46]">SmartTrip</div>
        <nav className="flex flex-wrap justify-center gap-4">
          <a href="#features" className="text-[#1F2F46] font-medium">Features</a>
          <a href="#demo" className="text-[#1F2F46] font-medium">Demo</a>
          <a href="#signup" className="text-[#FF6B35] font-semibold">Get Started</a>
        </nav>
      </header>

      {/*HERO SECTION */}
      <section className="text-center py-8 px-4 bg-white">
        <img src="/logo.png" alt="SmartTrip Logo" className="mx-auto mb-6 h-20 w-auto" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          Plan. Pack. Explore.
        </h1>
        <p className="mt-4 text-lg md:text-xl text-text font-medium max-w-2xl mx-auto">
          Plan Smarter, Travel Better. Your AI-powered travel assistant for China and beyond — build itineraries, estimate time and budget, and simplify complex travel planning.
        </p>
        <div className="mt-4">
          <a
            href="#planner"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-6 py-3 rounded-full transition"
          >
            Plan My Trip Now
          </a>
        </div>
      </section>
      <TripPlanner />

      {/* FEATURE SECTION */}
      <section id= "features" className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-12">Core Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: '🧠', title: "AI Trip Builder", desc: "Build multi-city trips with smart time & cost estimates." },
            { icon: '💰', title: "Real-Time Budget", desc: "Know how much your trip will cost as you plan." },
            { icon: '🎟️', title: "Ticketing Alerts", desc: "Get notified of places that need advance booking or permits." },
            { icon: '📋', title: "Custom Itineraries", desc: "Save, share or download your personalized trip plan." },
            { icon: '📶', title: "Offline Access", desc: "Export your itinerary as PDF for travel use." },
            { icon: '🇨🇳', title: "China Ready", desc: "Handles real-name bookings, permits & local transit." },
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

      <footer className="bg-[#1f2a44] text-white py-10 text-center">
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
