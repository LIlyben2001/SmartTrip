import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="bg-background text-text min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-center p-6 max-w-6xl mx-auto gap-4">
        <div className="text-2xl font-bold text-primary">SmartTrip</div>
        <nav className="flex flex-wrap justify-center gap-4">
          <a href="#features" className="text-primary font-medium">Features</a>
          <a href="#demo" className="text-primary font-medium">Demo</a>
          <a href="#signup" className="text-accent font-semibold">Get Started</a>
        </nav>
      </header>

      <section className="text-center py-24 px-4 bg-white">
        <img src="/logo.png" alt="SmartTrip Logo" className="mx-auto mb-6 h-20 w-auto" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          Plan. Pack. Explore.
        </h1>
        <p className="mt-4 text-lg md:text-xl text-text font-medium max-w-2xl mx-auto">
          Plan Smarter, Travel Better. Your AI-powered travel assistant for China and beyond — build itineraries, estimate time and budget, and simplify complex travel planning.
        </p>
        <div className="mt-6">
          <Button className="text-lg px-6 py-3 rounded-full">Plan My Trip Now</Button>
        </div>
      </section>

      <section id="planner" className="py-20 px-4 bg-white max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-8">Plan Your Trip</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Destination (e.g., Beijing)" className="border border-gray-300 px-4 py-2 rounded" />
          <input type="date" placeholder="Start Date" className="border border-gray-300 px-4 py-2 rounded" />
          <input type="number" min="1" placeholder="Number of Days" className="border border-gray-300 px-4 py-2 rounded" />
          <select className="border border-gray-300 px-4 py-2 rounded">
            <option>Travel Style</option>
            <option>Cultural</option>
            <option>Adventure</option>
            <option>Relaxed</option>
            <option>Luxury</option>
            <option>Foodies</option>
          </select>
          <select className="border border-gray-300 px-4 py-2 rounded">
            <option>Budget Range</option>
            <option>Under $1,000</option>
            <option>$1,000–$2,000</option>
            <option>Over $2,000</option>
          </select>
          <input type="number" min="1" placeholder="Number of Travelers" className="border border-gray-300 px-4 py-2 rounded" />
          <input type="email" placeholder="Email (optional)" className="border border-gray-300 px-4 py-2 rounded" />
          <button type="submit" className="bg-accent hover:bg-hover text-white font-semibold px-6 py-2 rounded col-span-full">Generate My Trip</button>
        </form>
        <div className="mt-10 bg-background border border-gray-200 rounded p-6 text-center text-text">
          <h3 className="text-xl font-semibold text-primary mb-2">Sample Itinerary Preview</h3>
          <p>Your 5-day Cultural Adventure in Beijing includes the Great Wall, Forbidden City, hutong dining, and a local cooking class!</p>
        </div>
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

      <section id="signup" className="bg-primary py-16 text-white text-center px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Beta List</h2>
        <p className="mb-6 text-base md:text-lg">Be the first to access the app and get travel-ready perks.</p>
        <form className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto">
          <Input placeholder="Enter your email" className="text-black px-4 py-2 rounded-full" />
          <Button className="px-6 py-2 rounded-full">Notify Me</Button>
        </form>
      </section>

  <footer style={{ backgroundColor: '#fef3c7', borderTop: '1px solid #fde68a' }} className="py-6 mt-16">
  <div className="max-w-6xl mx-auto px-4 text-center text-sm" style={{ color: '#b45309' }}>
    © {new Date().getFullYear()} SmartTrip. All rights reserved.
  </div>
</footer>
        </div>
  );
}
