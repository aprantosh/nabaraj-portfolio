export default async function handler(req, res) {
  // Allow requests only from your site domains
  const ALLOWED_ORIGINS = new Set([
    "https://www.nabukan.com",
    "https://nabukan.com"
  ]);

  const origin = req.headers.origin;

  // CORS headers
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight request (browser CORS check)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    // Validate API key
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "Server misconfigured: GROQ_API_KEY missing." });
    }

    const { message } = req.body || {};

    // Validate message
    if (typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Prevent huge prompts
    const userMessage = message.trim().slice(0, 900);

    const systemPrompt = `
You are Nabaraj Kandel's AI assistant on his portfolio website.

About Nabaraj:
- Senior Java Software Engineer with 7+ years of experience
- Specializes in Java, Spring Boot, Kafka, Microservices
- Experience at Wells Fargo, Visa, Ondas Networks
- Cloud/DevOps: AWS, OpenShift, Docker, Kubernetes
- Focus: enterprise backend systems, OAuth2 security, CI/CD, observability
- Open to Senior and Staff Software Engineer roles

Guidelines:
- Recruiters: be professional, confident, concise; emphasize architecture, ownership, and impact.
- Visitors: be friendly and helpful.
- Do NOT invent facts or metrics. If unsure, say so and suggest checking the resume.
- Keep replies under ~120 words unless asked for more detail.
    `.trim();

    const groqResp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        temperature: 0.4,
        max_tokens: 220,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ]
      })
    });

    if (!groqResp.ok) {
      const errText = await groqResp.text().catch(() => "");
      console.error("Groq error:", groqResp.status, errText);
      return res.status(502).json({ error: "AI service error. Please try again." });
    }

    const data = await groqResp.json();

    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Sorry — I couldn’t generate a response. Please try again.";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("chat.js error:", error);
    return res.status(500).json({ error: "Error connecting to AI" });
  }
}
