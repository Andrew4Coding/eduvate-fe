import { useRef, useState } from "react";

const useSpeakText = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [error, setError] = useState<string>("");
    const lastSpeakTime = useRef<number>(0);

    const speak = (text: string) => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) {
            setError("Speech synthesis not supported in this browser.");
            return;
        }

        const synth = window.speechSynthesis;
        const now = Date.now();

        // Optional: debounce kalau perlu jeda antar speak
        if (now - lastSpeakTime.current < 500) return;
        lastSpeakTime.current = now;

        // Cancel suara yang sedang aktif
        if (synth.speaking || synth.pending) {
            synth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "id-ID";
        utterance.rate = 1;
        utterance.pitch = 1;

        setIsSpeaking(true);
        setError(""); // clear error

        utterance.onend = () => {
            setIsSpeaking(false);
        };

        utterance.onerror = (event) => {
            console.error("Speech synthesis error:", event);
            setError(`Speech synthesis error: ${event.error}`);
            setIsSpeaking(false);
        };

        synth.speak(utterance);
    };

    return { isSpeaking, error, speak };
};

export default useSpeakText;
