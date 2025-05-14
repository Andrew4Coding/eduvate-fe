import { useRef, useState, useEffect } from "react";

interface SpeechState {
    isSpeaking: boolean;
    error: string;
    text: string;
    spokenText: string; // Text that has been spoken so far
    progress: number; // Progress percentage (0-100)
}

export interface UseSpeakTextType {
    isSpeaking: boolean;
    error: string;
    text: string;
    spokenText: string; // Text that has been spoken so far
    progress: number; // Progress percentage (0-100)
    speak: (text: string) => void;
    stopSpeaking: () => void;
}

const useSpeakText = () => {
    const [state, setState] = useState<SpeechState>({
        isSpeaking: false,
        error: "",
        text: "",
        spokenText: "",
        progress: 0
    });

    const lastSpeakTime = useRef<number>(0);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const charIndexRef = useRef<number>(0);
    const fullTextRef = useRef<string>("");

    // Clean up function to clear any active intervals
    const clearSpeechInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // Clean up on unmount
    useEffect(() => {
        return () => {
            clearSpeechInterval();
            if (typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const speak = (text: string) => {
        if (!text) {
            setState(prev => ({ ...prev, error: "Text is empty." }));
            return;
        }

        // Store the full text for reference
        fullTextRef.current = text;
        charIndexRef.current = 0;

        // Split text into chunks of 50 words
        const words = text.split(" ");
        const chunks: any[] = [];
        for (let i = 0; i < words.length; i += 50) {
            chunks.push(words.slice(i, i + 50).join(" "));
        }

        // Update state with the new text
        setState(prev => ({
            ...prev,
            text,
            spokenText: "",
            progress: 0,
            error: ""
        }));

        const now = Date.now();

        // Optional: debounce if needed between speaks
        if (now - lastSpeakTime.current < 500) return;
        lastSpeakTime.current = now;

        // Cancel any active speech
        if (synth.speaking || synth.pending) {
            synth.cancel();
            clearSpeechInterval();
        }

        const speakChunk = (chunkIndex: number) => {
            if (chunkIndex >= chunks.length) {
                // All chunks have been spoken
                setState(prev => ({
                    ...prev,
                    isSpeaking: false,
                    spokenText: fullTextRef.current, // Show full text at the end
                    progress: 100
                }));
                clearSpeechInterval();
                return;
            }

            const chunk = chunks[chunkIndex];
            const utterance = new SpeechSynthesisUtterance(chunk);
            utterance.lang = "id-ID";
            utterance.rate = 1.1; // Slightly faster for a more lively tone
            utterance.pitch = 1.1; // Higher pitch for a friendlier and funnier sound
            utteranceRef.current = utterance;

            // Set up event handlers
            utterance.onstart = () => {
                setState(prev => ({ ...prev, isSpeaking: true }));

                // Set up an interval to simulate progressive text display
                clearSpeechInterval();

                // Estimate speaking time based on text length and rate
                const totalChars = chunk.length;
                const estimatedDuration = (totalChars / 15) * 1000; // ~15 chars per second
                const updateInterval = 50; // Update every 50ms for smooth animation
                const charsPerInterval = totalChars / (estimatedDuration / updateInterval);

                intervalRef.current = setInterval(() => {
                    charIndexRef.current = Math.min(charIndexRef.current + charsPerInterval, totalChars);
                    const progress = ((chunkIndex * 50 + charIndexRef.current) / words.length) * 100;
                    const currentText = fullTextRef.current.substring(0, Math.floor(chunkIndex * 50 + charIndexRef.current));

                    setState(prev => ({
                        ...prev,
                        spokenText: currentText,
                        progress
                    }));

                    if (charIndexRef.current >= totalChars) {
                        clearSpeechInterval();
                    }
                }, updateInterval);
            };

            utterance.onend = () => {
                // Speak the next chunk
                speakChunk(chunkIndex + 1);
            };

            utterance.onerror = (event) => {
                // If event error is not interrupted
                if (event.error === "interrupted") {
                    return;
                }
                setState(prev => ({
                    ...prev,
                    error: `Speech synthesis error: ${event.error}`,
                    isSpeaking: false
                }));
                clearSpeechInterval();
            };

            synth.speak(utterance);
        };

        // Start speaking the first chunk
        speakChunk(0);
    };

    const stopSpeaking = () => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            clearSpeechInterval();
            setState(prev => ({
                ...prev,
                isSpeaking: false,
                progress: 100,
                spokenText: fullTextRef.current // Show full text when stopped
            }));
        }
    };

    return {
        ...state,
        speak,
        stopSpeaking
    } as UseSpeakTextType;
};

export default useSpeakText;
