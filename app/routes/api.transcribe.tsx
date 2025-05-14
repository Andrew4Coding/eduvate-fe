import type { ActionFunction } from "react-router";
import * as build from 'virtual:react-router/server-build';
import { getResponseFromAI } from "~/lib/speech/gpt";

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
            EXECCOMMAND
            navigate
            /<route>

            2. Klik tombol → ditulis dengan format:
            EXECCOMMAND
            click
            <buttonId>

            Berikut routing system dari aplikasi ini:
            ${Object.keys(build.routes).map((route) => route.replaceAll('_page.', '').replaceAll('.', '/').replaceAll('_index', '').replaceAll('_main', '').replaceAll('routes', '').replaceAll('root', ''))}

            Saat ini, kamu berada di halaman:
            ${request.url}

            berikut ini adalah konten dari page saat ini :
            ${innerHtml}

            Penting:
            - Jika ucapan pengguna hanya basa-basi, salam, atau tidak mengandung perintah yang jelas, maka **jangan buat perintah**.
            - Jika pengguna hanya bertanya, mengobrol, atau tidak mengarahkan aksi, cukup jawab dengan ramah (misalnya: "Tentu! Apa yang bisa saya bantu?").
            - Jika navigasi atau aksi yang diinginkan mirip dengan yang sudah ada, gunakan yang sudah ada.
            - Pastikan untuk membaca konten html, terutama id, aria-description, dan label dari elemen yang ada di halaman saat ini.
            - Jika perintah berupa navigasi, jangan basa basi dan langsung tulis perintahnya tanpa paragrag sebelum perintah
            - Pengguna adalah orang buta, jadi jangan gunakan kata-kata seperti "lihat" atau "pergi ke" dalam perintah.
            - Jika pengguna bertanya mengenai apa yang ada di halaman saat ini, jawab dengan singkat padat dan jelas dengan membaca konten html yang diberikan.

            ### Contoh-contoh:

            **Transkrip:**
            navigasi ke halaman course

            **Output (Plain Text, No Markdown):**
            EXECCOMMAND
            navigate
            /course

            **Transkrip:**
            tolong klik tombol buat kursus
            **Output (Plain Text, No Markdown):**
            EXECCOMMAND
            click
            create-course


            Terdapat juga beberapa command spesial, yaitu:
            1. ENROLL:
            Hanya dapat dilakukan jika user saat ini berada di halaman course. Jika user tidak berada di halaman course, navigasi terlebih dahulu
            ke halaman course, baru lakukan enroll. Kode course tidak boleh sudah terdaftar sebelumnya. Kode course tidak harus ada di halaman course saat ini.

            Contoh 1
            (Saat ini user berada di halaman /dashboard/courses)
            Tolong Enroll / daftarkan saya ke course dengan KODE ADA201

            **Output (Plain Text, No Markdown, Tanpa kata-kata apapun sebelum EXECCOMMAND):**
            EXECCOMMAND
            enroll
            ADA201

            Contoh 2
            (Saat in user tidak berada di halaman /dashboard/courses). 
            Tolong Enroll / daftarkan saya ke course dengan KODE ADA201

            **Output (Plain Text, No Markdown, Tanpa kata-kata apapun sebelum EXECCOMMAND):**
            EXECCOMMAND
            navigate
            /dashboard/courses

            EXECCOMMAND
            enroll
            ADA201
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