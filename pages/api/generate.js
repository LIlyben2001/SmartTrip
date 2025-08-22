export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { destination, days, style, budget, travelers } = req.body;
  const prompt = `
You're a smart travel assistant. Generate a ${days}-day travel itinerary for ${travelers} traveler(s) going to ${destination}, with a travel style of "${style}" and a budget of "${budget}". Include daily activities, major landmarks, cultural experiences, and local dining recommendations. Respond only with the itinerary.
  `;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}\`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const aiText = data.choices?.[0]?.message?.content;
    res.status(200).json({ itinerary: aiText || "No itinerary generated." });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong." });
  }
}
