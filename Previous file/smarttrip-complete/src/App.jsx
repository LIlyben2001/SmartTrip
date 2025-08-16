
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
    <div className="min-h-screen bg-blue-50 text-gray-900">
      <header className="bg-white shadow p-6 text-center">
        <h1 className="text-4xl font-bold text-blue-700">SmartTrip</h1>
        <p className="mt-2 text-gray-600">
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
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            {loading ? "Generating..." : "Generate My Trip"}
          </button>
        </form>
        {itinerary && (
          <div className="mt-8 p-4 bg-white shadow rounded whitespace-pre-line">
            <h2 className="text-xl font-semibold mb-2 text-blue-700">Your Itinerary</h2>
            {itinerary}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
