export default async function handler(req, res) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are Nabaraj Kandel's professional AI assistant. Answer questions about his experience, tech stack, and projects professionally."
        },
        {
          role: "user",
          content: req.body.message
        }
      ]
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
