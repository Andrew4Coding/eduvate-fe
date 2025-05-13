export default class AudioPlayer {
    audio: HTMLAudioElement | null = null;

    playAudio(path: string) {
        this.audio?.pause();
        this.audio = new Audio(path);
        this.audio.play().catch((error) => {
            console.error('Error playing audio:', error);
        });
    }

    stopAudio() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.audio = null;
        }
    }
}