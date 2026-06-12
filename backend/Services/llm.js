import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export async function extractUserIntent(userInput) {
  const completion =
    await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      temperature: 0,

      response_format: {
        type: "json_object"
      },

      messages: [
        {
          role: "system",
          content: `
Extract user intent.

Return JSON only.

{
 "intent":"",
 "brand":null,
 "specificCar":null,
 "cars":[],
 "budget":null,
 "familySize":null,
 "usage":null,
 "fuelType":null,
 "bodyType":null,
 "priorities":[]
}

Possible intents:

recommend
brand_search
car_details
compare
`
        },
        {
          role: "user",
          content: userInput
        }
      ]
    });

  return JSON.parse(
    completion.choices[0].message.content
  );
}