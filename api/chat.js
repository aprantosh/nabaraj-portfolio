export default async function handler(req, res) {
  try {
    const { message } = req.body;

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
      ? "You are Nabaraj's AI speaking to a recruiter. Focus on architecture, leadership and business impact."
      : "You are Nabaraj's AI assistant. Be professional and helpful.";

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          stream: true,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ]
        })
      }
    );

    res.setHeader("Content-Type", "text/plain");

    for await (const chunk of response.body) {
      res.write(chunk);
    }

    res.end();

  } catch (error) {
    res.status(500).json({ error: "Streaming error" });
  }
}
