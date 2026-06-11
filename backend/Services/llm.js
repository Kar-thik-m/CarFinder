import Groq from "groq-sdk";
import dotenv from "dotenv";
import { Prompt } from "./Prompt.js";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateMongoQuery(prompt) {
  const systemPrompt = Prompt;

  const chatCompletion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    temperature: 0,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
  });

  const raw = chatCompletion.choices[0]?.message?.content || "";

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("RAW LLM OUTPUT:", raw);

    // fallback extractor (safety net)
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e) { }
    }

    return {
      intent: "invalid",
      query: {},
    };
  }
}