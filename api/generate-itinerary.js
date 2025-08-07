// /api/generate-itinerary.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt in request body" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Missing OpenAI API key" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",  // safer default model name
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI response error:", data);
      return res.status(500).json({ error: "OpenAI API error", details: data });
    }

    if (!data.choices || !data.choices[0]?.message?.content) {
      return res.status(500).json({ error: "No valid response from AI" });
    }

    res.status(200).json({ result: data.choices[0].message.content });
  } catch (error) {
    console.error("AI generation failed:", error);
    res.status(500).json({
      error: "AI generation failed",
      details: error.message,
    });
  }
}
