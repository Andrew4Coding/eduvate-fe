export async function getResponseFromAI(prompt: string, context?: string): Promise<string> {
    // Now send the transcribed text to a chat completion API to get a response
    const chatResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "Nama kamu adalah Edu, sebuah asisten aplikasi belajar bagi orang tunanetra berbahasa indonesia, gunakan bahasa yang fun dan menyemangati, jelaskan setiap penjalasan secara singkat padat namun jelas, dan gunakan bahasa yang mudah dimengerti" },
                ...(context ? [{ role: "assistant", content: context }] : []),
                { role: "user", content: prompt },
            ],
            max_tokens: 500,
        }),
    });

    if (!chatResponse.ok) {
        const errorData = await chatResponse.json();
        console.error("Chat API error:", errorData);
        throw new Error("Failed to generate response");
    }

    const chatData = await chatResponse.json();
    const responseText = chatData.choices[0].message.content;
    return responseText;
}