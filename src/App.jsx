
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
    <main className="p-8 max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-2 text-blue-800">SmartTrip</h1>
      <p className="mb-8 text-gray-700">
        Plan Smarter, Travel Better. Your AI-powered travel assistant for China and beyond — build itineraries, estimate time and budget, and simplify complex travel planning.
      </p>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 text-left">
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
          <option value="">Select Budget Range</option>
          <option value="Under $1,000">Under $1,000</option>
          <option value="$1,000–$2,000">$1,000–$2,000</option>
          <option value="Over $2,000">Over $2,000</option>
        </select>
        <input name="travelers" onChange={handleChange} placeholder="Number of Travelers" type="number" className="border p-2 rounded" />
        <input name="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" type="email" className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? "Generating..." : "Generate My Trip"}
        </button>
      </form>
      {itinerary && (
        <div className="mt-8 text-left border rounded p-4 bg-gray-100 whitespace-pre-line">
          <h2 className="font-semibold mb-2 text-blue-700">Your Itinerary</h2>
          {itinerary}
        </div>
      )}
    </main>
  );
}

export default App;
