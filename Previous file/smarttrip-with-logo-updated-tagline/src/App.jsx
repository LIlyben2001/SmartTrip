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

      <section id="features" className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-12">Core Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      <footer className="bg-primary text-white text-center p-6 text-sm">
        © 2025 SmartTrip. All rights reserved.
      </footer>
    </div>
  );
}
