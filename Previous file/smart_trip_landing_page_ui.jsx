// Landing Page & App UI Prototype for SmartTrip
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="bg-[#F9F9F9] text-[#333333] min-h-screen">
      <header className="flex justify-between items-center p-6 max-w-6xl mx-auto">
        <div className="text-2xl font-bold text-[#1F2F46]">SmartTrip</div>
        <nav className="space-x-6">
          <a href="#features" className="text-[#1F2F46] font-medium">Features</a>
          <a href="#demo" className="text-[#1F2F46] font-medium">Demo</a>
          <a href="#signup" className="text-[#FF6B35] font-semibold">Get Started</a>
        </nav>
      </header>

      <section className="text-center py-24 px-4 bg-white">
        <h1 className="text-4xl font-bold text-[#1F2F46]">Plan Smarter. Travel Better.</h1>
        <p className="mt-4 text-lg text-[#333] max-w-xl mx-auto">Your AI-powered travel assistant for China and beyond — build itineraries, estimate time and budget, and simplify complex travel planning.</p>
        <div className="mt-6">
          <Button className="bg-[#FF6B35] text-white px-6 py-3 rounded-full text-lg">Start Planning</Button>
        </div>
      </section>

      <section id="features" className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#1F2F46] mb-12">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "AI Trip Builder", desc: "Build multi-city trips with smart time & cost estimates." },
            { title: "Real-Time Budget", desc: "Know how much your trip will cost as you plan." },
            { title: "Ticketing Alerts", desc: "Get notified of places that need advance booking or permits." },
            { title: "Custom Itineraries", desc: "Save, share or download your personalized trip plan." },
            { title: "Offline Access", desc: "Export your itinerary as PDF for travel use." },
            { title: "China Ready", desc: "Handles real-name bookings, permits & local transit." },
          ].map((f, i) => (
            <Card key={i} className="shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#1F2F46]">{f.title}</h3>
                <p className="text-[#333333] mt-2">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="signup" className="bg-[#3EC1D3] py-16 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Beta List</h2>
        <p className="mb-6">Be the first to access the app and get travel-ready perks.</p>
        <form className="flex flex-col md:flex-row justify-center gap-4 max-w-xl mx-auto">
          <Input placeholder="Enter your email" className="text-black px-4 py-2 rounded-full" />
          <Button className="bg-[#FF6B35] px-6 py-2 rounded-full text-white">Notify Me</Button>
        </form>
      </section>

      <footer className="bg-[#1F2F46] text-white text-center p-6">
        © 2025 SmartTrip. All rights reserved.
      </footer>
    </div>
  );
}
