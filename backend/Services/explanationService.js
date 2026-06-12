import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

export async function explainCar(
    query,
    car
) {
    const completion =
        await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",

            temperature: 0.4,

            messages: [
                {
                    role: "system",
                    content:
                        "Explain why this car matches the user."
                },
                {
                    role: "user",
                    content: `
User Query:
${query}

Car Data:
${JSON.stringify(car)}
`
                }
            ]
        });

    return completion.choices[0].message.content;
}