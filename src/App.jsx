
import React from "react";

function App() {
  return (
    <div className="font-sans text-gray-800">
      <header className="text-center py-6">
        <img src="/logo.png" alt="SmartTrip Logo" className="mx-auto w-20 mb-4" />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Plan. Pack. Explore.</h1>
        <p className="text-md text-gray-600 max-w-xl mx-auto">
          Plan Smarter. Travel Better. Your AI-powered travel assistant for China and beyond —
          build itineraries, estimate time and budget, and simplify complex travel planning.
        </p>
        <button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600">
          Plan My Trip Now
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-6">
        <section className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Plan Your Trip</h2>
          <form className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Destination (e.g. Beijing)" className="border rounded p-2" />
            <input type="text" placeholder="mm/dd/yyyy" className="border rounded p-2" />
            <select className="border rounded p-2">
              <option>Number of Days</option>
            </select>
            <select className="border rounded p-2">
              <option>Travel Style</option>
              <option>Foodies</option>
            </select>
            <select className="border rounded p-2">
              <option>Budget Range</option>
            </select>
            <input type="email" placeholder="Email (optional)" className="border rounded p-2" />
          </form>
          <button className="mt-4 w-full bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600">
            Generate My Trip
          </button>
        </section>

        <section className="text-center mb-12">
          <p className="text-gray-700">
            <strong>Sample Itinerary Preview</strong><br />
            Your 5-day Cultural Adventure in Beijing includes the Great Wall, Forbidden City, hutong dining, and a local cooking class!
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-4">Core Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-4 rounded shadow"><strong>🧠 AI Trip Builder</strong><br />Build multi-city trips with smart time & cost estimates.</div>
            <div className="bg-white p-4 rounded shadow"><strong>💰 Real-Time Budget</strong><br />Know how much your trip will cost as you plan.</div>
            <div className="bg-white p-4 rounded shadow"><strong>🎟️ Ticketing Alerts</strong><br />Get notified of places that need advance booking or permits.</div>
            <div className="bg-white p-4 rounded shadow"><strong>🗂️ Custom Itineraries</strong><br />Save, share or download your personalized trip plan.</div>
            <div className="bg-white p-4 rounded shadow"><strong>📥 Offline Access</strong><br />Export your itinerary as PDF for travel use.</div>
            <div className="bg-white p-4 rounded shadow"><strong>🇨🇳 China Ready</strong><br />Handles real-name bookings, permits & local transit.</div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-10 text-center">
        <h2 className="text-xl font-semibold mb-2">Join Our Beta List</h2>
        <p className="text-sm mb-4">Be the first to access the app and get travel-ready perks.</p>
        <form className="flex justify-center gap-2 mb-4">
          <input type="email" placeholder="Enter your email" className="p-2 rounded text-black" />
          <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded">Notify Me</button>
        </form>
        <p className="text-xs">© 2025 SmartTrip. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
