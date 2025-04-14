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
                { role: "system", content: "You are a helpful assistant." },
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

export async function parseAudioIntoTextWithAI(audioFile: File): Promise<string> {
    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("model", "whisper-1");
    
    const whisperResponse = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: formData,
    })

    if (!whisperResponse.ok) {
        const errorData = await whisperResponse.json()
        console.error("Whisper API error:", errorData)
        throw new Error("Failed to transcribe audio")
    }

    const transcriptionData = await whisperResponse.json()
    const transcribedText = transcriptionData.text

    return transcribedText
}