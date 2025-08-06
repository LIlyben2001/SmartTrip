// api/generateItinerary.js

export async function POST(request) {
  try {
    const { destination, startDate, days, style, budget, travelers, email } = await request.json();

    const prompt = `
You are a travel planner. Based on the following details, create a detailed 5-day itinerary with local attractions, food suggestions, and travel tips.

Destination: ${destination}
Start Date: ${startDate}
Duration: ${days} days
Travel Style: ${style}
Budget: ${budget}
Travelers: ${travelers}
Email: ${email || 'Not provided'}

Make it fun, helpful, and clearly formatted day by day.
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    return new Response(JSON.stringify({ itinerary: data.choices[0].message.content }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate itinerary." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
