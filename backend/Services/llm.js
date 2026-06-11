import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateMongoQuery(prompt) {
    const systemPrompt = `
You are an expert Car Finder AI that extracts intent and generates MongoDB queries.

You must analyze the user request and return ONLY a valid JSON object in this format:

{
  "intent": "brand_search | car_details | recommendations | price_filter | mileage_filter",
  "query": { MongoDB query object }
}

INTENT DEFINITIONS:

1. brand_search → user is searching cars by brand (e.g., Toyota, BMW)
2. car_details → user asks about a specific car model or variant
3. recommendations → user wants best cars based on preferences
4. price_filter → user filters by price range
5. mileage_filter → user filters by mileage/fuel efficiency

DATABASE SCHEMA:
- make (String)
- model (String)
- variant (String)
- safetyRating (Number)
- price (Number)
- mileage (Number)
- reviewscore (Number)
- fueltype (String)
- bodytype (String)

RULES:
- Use regex ($regex, $options: "i") for strings
- Use $gte, $lte for numeric filters
- If multiple filters exist, combine them in query object
- Always return valid JSON only
- No markdown, no explanation, no text outside JSON
`;

    const chatCompletion = await groq.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
        ],
        model: "openai/gpt-oss-20b",
        temperature: 0,
    });

    try {
        const jsonResponse = chatCompletion.choices[0]?.message?.content || "{}";
        return JSON.parse(jsonResponse);
    } catch (error) {
        console.error("Error parsing LLM response:", error);
        return {};
    }
}
