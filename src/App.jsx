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
  <TripPlanner />
   
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
          href="#trip-form"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-6 py-3 rounded-full transition"
        >
          Plan My Trip Now
        </a>
        </div>
      </section>

      <section id="planner" className="py-20 px-4 bg-white max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-8">Plan Your Trip</h2>
       import { useState } from "react";

function TripPlanner() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [numDays, setNumDays] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [budget, setBudget] = useState("");
  const [numTravelers, setNumTravelers] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setItinerary("");

    const prompt = `Create a ${travelStyle} itinerary for ${numTravelers} people visiting ${destination} starting on ${startDate} for ${numDays} days. Budget: ${budget}.`;

    try {
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setItinerary(data.result || "No itinerary generated.");
    } catch (error) {
      setItinerary("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Destination (e.g., Beijing)" value={destination} onChange={(e) => setDestination(e.target.value)} className="border border-gray-300 px-4 py-2 rounded" />
        <input type="date" placeholder="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border border-gray-300 px-4 py-2 rounded" />
        <input type="number" min="1" placeholder="Number of Days" value={numDays} onChange={(e) => setNumDays(e.target.value)} className="border border-gray-300 px-4 py-2 rounded" />
        <select value={travelStyle} onChange={(e) => setTravelStyle(e.target.value)} className="border border-gray-300 px-4 py-2 rounded">
          <option value="">Travel Style</option>
          <option>Cultural</option>
          <option>Adventure</option>
          <option>Relaxed</option>
          <option>Luxury</option>
          <option>Foodies</option>
        </select>
        <select value={budget} onChange={(e) => setBudget(e.target.value)} className="border border-gray-300 px-4 py-2 rounded">
          <option value="">Budget Range</option>
          <option>Under $1,000</option>
          <option>$1,000–$2,000</option>
          <option>Over $2,000</option>
        </select>
        <input type="number" min="1" placeholder="Number of Travelers" value={numTravelers} onChange={(e) => setNumTravelers(e.target.value)} className="border border-gray-300 px-4 py-2 rounded" />
        <input type="email" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-gray-300 px-4 py-2 rounded" />
        <button type="submit" className="bg-accent hover:bg-hover text-white font-semibold px-6 py-2 rounded col-span-full">
          {loading ? "Generating..." : "Generate My Trip"}
        </button>
      </form>

   {!itinerary && (
  <div className="bg-gray-100 rounded-md p-4 mt-6 text-center">
    <h3 className="text-lg font-semibold text-primary mb-2">Sample Itinerary Preview</h3>
    <p className="text-text">
      Your 5-day Cultural Adventure in Beijing includes the Great Wall, Forbidden City, hutong dining, and a local cooking class!
    </p>
  </div>
)}
    </div>
  );
}
export default TripPlanner;
      </section>

      <section id="features" className="py-20 px-4 max-w-6xl mx-auto">
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
