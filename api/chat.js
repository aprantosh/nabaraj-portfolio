export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
  {
    role: "system",
    content: `
You are Nabaraj Kandel's AI assistant.

About Nabaraj:
- Senior Software Engineer with 7+ years experience
- Specializes in Java, Spring Boot, Kafka, Microservices
- Experience at Wells Fargo, Visa, Ondas Networks
- Cloud expertise: AWS, OpenShift, Docker, Kubernetes
- Focused on enterprise backend systems, OAuth2 security, CI/CD
- Open to Senior and Staff Software Engineer roles

When recruiters ask questions:
- Answer professionally
- Highlight impact and architecture experience
- Be confident but concise

When casual visitors ask questions:
- Be friendly and helpful
`
  },
  {
    role: "user",
    content: message
  }
]

      })
    });

    const data = await response.json();

    res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error connecting to AI" });
  }
}
