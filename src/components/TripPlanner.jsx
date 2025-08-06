
import { useState } from "react";

export default function TripPlanner() {
  const [destination, setDestination] = useState("");
  const [travelers, setTravelers] = useState("");
  const [style, setStyle] = useState("");
  const [duration, setDuration] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAiResponse("");

    const prompt = `Plan a ${duration}-day trip for ${travelers} traveler(s) to ${destination}.
    Travel style: ${style}.
    Budget: ${budget}.
    Include itinerary, costs, booking suggestions, and travel tips.`;

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setAiResponse(data.result || "No itinerary returned.");
    } catch (error) {
      setAiResponse("There was an error generating your trip.");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <section className="py-12 px-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Plan Your Trip</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input type="text" placeholder="Destination(s)" value={destination} onChange={(e) => setDestination(e.target.value)} className="p-2 border rounded" />
        <input type="number" placeholder="Number of Travelers" value={travelers} onChange={(e) => setTravelers(e.target.value)} className="p-2 border rounded" />
        <input type="text" placeholder="Travel Style (e.g. Foodie, Explorer)" value={style} onChange={(e) => setStyle(e.target.value)} className="p-2 border rounded" />
        <input type="text" placeholder="Trip Length or Dates" value={duration} onChange={(e) => setDuration(e.target.value)} className="p-2 border rounded" />
        <input type="text" placeholder="Budget (USD)" value={budget} onChange={(e) => setBudget(e.target.value)} className="p-2 border rounded" />
        <button type="submit" className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600">
          {loading ? "Planning..." : "Plan My Trip"}
        </button>
      </form>
      {aiResponse && (
        <div className="bg-gray-100 p-4 mt-4 rounded whitespace-pre-wrap">
          {aiResponse}
        </div>
      )}
    </section>
  );
}
