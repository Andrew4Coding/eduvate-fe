import type { ActionFunction } from "react-router";
import * as build from 'virtual:react-router/server-build';
import { getResponseFromAI } from "~/lib/gpt";

export const action: ActionFunction = async ({ request }) => {
    try {
        const formData = await request.formData()
        const audioFile = formData.get("audio") as File
        const innerHtml = formData.get("pageContent") as string

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

        const navigatePrompt = `
            Kamu adalah asisten AI yang menerjemahkan hasil transkrip suara manusia menjadi perintah untuk antarmuka web berbasis command.

            Ada dua jenis perintah utama:
            1. Navigasi halaman → ditulis dengan format:
            EXEC_COMMAND
            navigate
            /<route>

            2. Klik tombol → ditulis dengan format:
            EXEC_COMMAND
            click
            <buttonId>

            Berikut routing system dari aplikasi ini:
            ${Object.keys(build.routes).map((route) => route.replaceAll('_page.', '').replaceAll('.', '/').replaceAll('_index', '').replaceAll('routes', '').replaceAll('root', ''))}

            berikut ini adalah konten dari page saat ini :
            ${innerHtml}

            Penting:
            - Jika ucapan pengguna hanya basa-basi, salam, atau tidak mengandung perintah yang jelas, maka **jangan buat perintah**.
            - Jika pengguna hanya bertanya, mengobrol, atau tidak mengarahkan aksi, cukup jawab dengan ramah (misalnya: "Tentu! Apa yang bisa saya bantu?").
            - Jika navigasi atau aksi yang diinginkan mirip dengan yang sudah ada, gunakan yang sudah ada.
            - Jika perintah berupa navigasi, jangan basa basi dan langsung tulis perintahnya.

            ### Contoh-contoh:

            **Transkrip:**
            navigasi ke halaman course

            **Output (Plain Text, No Markdown):**
            EXEC_COMMAND
            navigate
            /course

            **Transkrip:**
            tolong klik tombol buat kursus
            **Output (Plain Text, No Markdown):**
            EXEC_COMMAND
            click
            create-course
            `
        
        console.log("Transcribed Text:", transcribedText);
        

        const responseText = await getResponseFromAI(transcribedText, navigatePrompt)

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