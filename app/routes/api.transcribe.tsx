import type { ActionFunction } from "react-router";

export const action: ActionFunction = async ({ request }) => { 
    try {
        const formData = await request.formData()
        const audioFile = formData.get("audio") as File

        if (!audioFile) {
            return new Response(JSON.stringify({ error: "No audio file provided" }), { status: 400, headers: { "Content-Type": "application/json" } })
        }

        // Create a FormData object to send to your Whisper API
        const whisperFormData = new FormData()
        whisperFormData.append("file", audioFile)
        whisperFormData.append("model", "whisper-1")

        // Send to OpenAI Whisper API (you'll need to replace with your actual endpoint)
        const whisperResponse = await fetch("https://api.openai.com/v1/audio/transcriptions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: whisperFormData,
        })

        if (!whisperResponse.ok) {
            const errorData = await whisperResponse.json()
            console.error("Whisper API error:", errorData)
            throw new Error("Failed to transcribe audio")
        }

        const transcriptionData = await whisperResponse.json()
        const transcribedText = transcriptionData.text

        console.log("Transcribed text:", transcribedText);
        
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
                    { role: "user", content: transcribedText },
                ],
                max_tokens: 500,
            }),
        })

        if (!chatResponse.ok) {
            const errorData = await chatResponse.json()
            console.error("Chat API error:", errorData)
            throw new Error("Failed to generate response")
        }

        const chatData = await chatResponse.json()
        const responseText = chatData.choices[0].message.content

        // Return both the transcribed text and the response
        return new Response(JSON.stringify({
            transcription: transcribedText,
            text: responseText,
        }), { status: 200, headers: { "Content-Type": "application/json" } })
    } catch (error) {
        console.error("Error processing request:", error)

        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } })
    }
}