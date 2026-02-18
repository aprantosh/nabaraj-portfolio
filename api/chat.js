export default async function handler(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const recruiterKeywords = [
      "interview",
      "hiring",
      "recruiter",
      "salary",
      "role",
      "position",
      "team",
      "leadership"
    ];

    const isRecruiter = recruiterKeywords.some(keyword =>
      message.toLowerCase().includes(keyword)
    );

    const systemPrompt = isRecruiter
      ? "You are Nabaraj's AI speaking to a recruiter. Focus on architecture, leadership, scalability, and business impact."
      : "You are Nabaraj's AI assistant. Be professional, concise, and helpful.";

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await response.json();

    if (!data.choices) {
      console.error(data);
      return res.status(500).json({ error: "Invalid AI response" });
    }

    res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
