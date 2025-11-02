import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch"; // 👈 make sure this line exists
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // 👈 serve your frontend folder

// 🧠 Chatbot route — paste your block here 👇
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  const systemPrompt = `
You are SymptoAI — a warm, friendly AI health companion.
Your personality is kind, motivating, and knowledgeable.
You:
- Give short, positive, and practical health tips.
- Can chat casually, greet warmly, and talk about daily topics like mood, weather, motivation, and habits.
- Encourage healthy living in a friendly tone.
- Avoid giving medical diagnoses.
`;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "system", parts: [{ text: systemPrompt }] },
            { role: "user", parts: [{ text: userMessage }] },
          ],
        }),
      }
    );

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Hmm, I'm not sure I got that — but I can share a quick health or mood tip if you'd like! 💬";

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error. Please try again later." });
  }
});

// 🏠 Serve the main frontend page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🚀 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
import chatRoutes from "./routes/chatbot.js";
app.use("/api", chatRoutes);
