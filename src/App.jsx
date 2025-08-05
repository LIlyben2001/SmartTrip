
<header className="flex justify-between items-center px-6 py-4 shadow-md bg-white sticky top-0 z-50">
  <div className="flex items-center space-x-2">
    <img src="/logo.png" alt="SmartTrip Logo" className="w-8 h-8" />
    <span className="text-lg font-bold text-gray-800">SmartTrip</span>
  </div>
  <nav className="space-x-6 text-sm font-medium">
    <a href="#features" className="text-gray-700 hover:text-orange-500">Features</a>
    <a href="#demo" className="text-gray-700 hover:text-orange-500">Demo</a>
    <a href="#get-started" className="text-orange-500 font-semibold hover:text-orange-600">Get Started</a>
  </nav>
</header>

<section className="text-center mt-12 px-6">
  <img src="/logo.png" alt="SmartTrip Logo" className="mx-auto w-20 mb-4" />
  <h1 className="text-4xl font-bold text-gray-800 mb-2">Plan. Pack. Explore.</h1>
  <p className="text-lg text-gray-600 mb-6">
    Plan Smarter. Travel Better. Your AI-powered travel assistant for China and beyond – build itineraries, estimate time and budget, and simplify complex travel planning.
  </p>
  <a href="#trip-planner" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition">
    Plan My Trip Now
  </a>
</section>
import { useState } from "react";

function App() {
  const [form, setForm] = useState({
    destination: "",
    days: "",
    style: "",
    budget: "",
    travelers: "",
  });
  const [email, setEmail] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, email }),
    });
    const data = await res.json();
    setItinerary(data.itinerary);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-orange-50 text-gray-900">
      <header className="bg-white shadow p-6 text-center">
        <img src="/logo.png" alt="SmartTrip Logo" className="mx-auto mb-4 h-20" />
        <h1 className="text-4xl font-bold text-orange-700">SmartTrip</h1>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          Plan Smarter, Travel Better. Your AI-powered travel assistant for China and beyond – build itineraries, estimate time and budget, and simplify complex travel planning.
        </p>
      </header>
      <main className="p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="grid gap-4 bg-white p-6 rounded shadow">
          <input name="destination" onChange={handleChange} placeholder="Destination" className="border p-2 rounded" />
          <input name="days" onChange={handleChange} placeholder="Number of Days" type="number" className="border p-2 rounded" />
          <select name="style" onChange={handleChange} className="border p-2 rounded">
            <option value="">Select Travel Style</option>
            <option value="Cultural">Cultural</option>
            <option value="Adventure">Adventure</option>
            <option value="Relaxed">Relaxed</option>
            <option value="Luxury">Luxury</option>
            <option value="Foodies">Foodies</option>
          </select>
          <select name="budget" onChange={handleChange} className="border p-2 rounded">
            <option value="">Select Budget</option>
            <option value="Under $1,000">Under $1,000</option>
            <option value="$1,000–$2,000">$1,000–$2,000</option>
            <option value="Over $2,000">Over $2,000</option>
          </select>
          <input name="travelers" onChange={handleChange} placeholder="Number of Travelers" type="number" className="border p-2 rounded" />
          <input name="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" type="email" className="border p-2 rounded" />
          <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition">
            {loading ? "Generating..." : "Generate My Trip"}
          </button>
        </form>
        {itinerary && (
          <div className="mt-8 p-4 bg-white shadow rounded whitespace-pre-line">
            <h2 className="text-xl font-semibold mb-2 text-orange-700">Your Itinerary</h2>
            {itinerary}
          </div>
        )}
      
        <section id="features" className="mt-20 px-6">
          <h2 className="text-3xl font-bold text-center text-orange-700 mb-2">What Makes SmartTrip Special?</h2>
          <p className="text-center text-gray-600 mb-8">SmartTrip combines technology with travel expertise to bring you a smarter, simpler planning experience.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="text-3xl mb-2">🧠</div>
              <h3 className="font-semibold text-lg text-gray-800">AI Trip Builder</h3>
              <p className="text-gray-600">Build multi-city trips with smart time & cost estimates.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-semibold text-lg text-gray-800">Real-Time Budget</h3>
              <p className="text-gray-600">Know how much your trip will cost as you plan.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="text-3xl mb-2">🎫</div>
              <h3 className="font-semibold text-lg text-gray-800">Ticketing Alerts</h3>
              <p className="text-gray-600">Get notified of places that need advance booking or permits.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="text-3xl mb-2">📋</div>
              <h3 className="font-semibold text-lg text-gray-800">Custom Itineraries</h3>
              <p className="text-gray-600">Save, share or download your personalized trip plan.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="text-3xl mb-2">📶</div>
              <h3 className="font-semibold text-lg text-gray-800">Offline Access</h3>
              <p className="text-gray-600">Export your itinerary as PDF for travel use.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="text-3xl mb-2">🇨🇳</div>
              <h3 className="font-semibold text-lg text-gray-800">China Ready</h3>
              <p className="text-gray-600">Handles real-name bookings, permits & local transit.</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;

        <footer className="bg-blue-900 text-white py-12 mt-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Join Our Beta List</h2>
            <p className="mb-6">Be the first to access the app and get travel-ready perks.</p>
            <div className="flex justify-center gap-2 mb-6">
              <input
                type="email"
                placeholder="Enter your email"
                className="rounded-full px-4 py-2 text-black w-64 focus:outline-none"
              />
              <button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition">
                Notify Me
              </button>
            </div>
            <p className="text-sm text-gray-300">© 2025 SmartTrip. All rights reserved.</p>
          </div>
        </footer>
