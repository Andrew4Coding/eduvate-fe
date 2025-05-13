export class TTS {
    audio: HTMLAudioElement | null = null;
    isSpeaking: boolean = false;

    constructor() {
        // Initialize any properties if needed
    }

    async speak(text: string) {
        if (this.isSpeaking) {
            console.warn("TTS is already speaking.");
            return;
        }

        this.isSpeaking = true;

        try {
            const response = await fetch("/api/tts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("TTS API error:", errorData);
                throw new Error("Failed to generate speech");
            }

            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);

            // Play the audio
            this.audio = new Audio(audioUrl);
            this.audio.onended = () => {
                this.isSpeaking = false; // Reset state when audio ends
            };
            this.audio.play();
        } catch (error) {
            console.error(error);
            this.isSpeaking = false; // Reset state on error
        }
    }

    async stopSpeak() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0; // Reset to the beginning
            this.audio = null; // Clear the reference
        }
        this.isSpeaking = false; // Reset state
    }

    async pauseSpeak() {
        if (this.audio) {
            this.audio.pause();
        }
    }

    async continueSpeak() {
        if (this.audio) {
            this.audio.play();
        }
    }
}