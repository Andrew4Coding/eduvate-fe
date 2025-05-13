import type { LoaderFunctionArgs } from "react-router";

export async function action({ request }: LoaderFunctionArgs) {
    const body = await request.json();
    const text = body.text as string;

    const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/3AwU3nHsI4YWeBJbz6yn?output_format=mp3_44100_128", {
        method: "POST",
        headers: {
            'Xi-Api-Key': process.env.LABS_API_KEY as string,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: text,
            model_id: "eleven_multilingual_v2"
        })
    })

    // Return the audio URL as a JSON response
    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
        status: 200,
        headers: {
            "Content-Type": "audio/mpeg",
            "Content-Disposition": "inline; filename=\"tts.mp3\"",
            "Cache-Control": "no-cache"
        }
    });

}