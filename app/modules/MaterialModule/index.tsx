import type { Prisma } from "@prisma/client"
import { Headphones, Pause, Play, SkipBack, SkipForward, StopCircle, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from "react"
import { useLoaderData } from "react-router"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Slider } from "~/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { useKeyPress } from "~/hooks/useKeyPress"
import useSpeakText from "~/hooks/useSpeakSpeech"
import { audioManager } from "~/lib/speech/audio"

interface TranscriptSegment {
    id: string
    start: number
    end: number
    text: string
}

export default function MaterialViewerModule() {
    const loaderData: Prisma.MaterialGetPayload<{
        include: {
            courseItem: true
        }
    }> = useLoaderData()

    const speech = useSpeakText()

    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(100) // Default duration
    const [volume, setVolume] = useState(0.8)
    const [isMuted, setIsMuted] = useState(false)
    const [activeTranscriptId, setActiveTranscriptId] = useState<string | null>(null)
    const [currentSpeed, setCurrentSpeed] = useState(1)
    const [transcript, setTranscript] = useState<TranscriptSegment[]>([])
    const [activeTab, setActiveTab] = useState<"audio" | "speech">("audio")

    const audioRef = useRef<HTMLAudioElement>(null)
    const transcriptRef = useRef<HTMLDivElement>(null)

    // Handle spacebar for play/pause
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only handle spacebar if not in an input, textarea, or button
            if (
                e.code === "Space" &&
                !(
                    e.target instanceof HTMLInputElement ||
                    e.target instanceof HTMLTextAreaElement ||
                    e.target instanceof HTMLButtonElement
                )
            ) {
                e.preventDefault()
                if (activeTab === "audio") {
                    togglePlayPause()
                } else {
                    toggleSpeech()
                }
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [isPlaying, activeTab, speech.isSpeaking])

    // Update active transcript based on current time
    useEffect(() => {
        const activeSegment = transcript.find((segment) => currentTime >= segment.start && currentTime <= segment.end)

        if (activeSegment) {
            setActiveTranscriptId(activeSegment.id)

            // Auto-scroll to active transcript
            if (transcriptRef.current) {
                const activeElement = document.getElementById(activeSegment.id)
                if (activeElement) {
                    activeElement.scrollIntoView({ behavior: "smooth", block: "center" })
                }
            }
        } else {
            setActiveTranscriptId(null)
        }
    }, [currentTime, transcript])

    // Handle audio time updates
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const updateTime = () => setCurrentTime(audio.currentTime)
        const handleLoadedMetadata = () => setDuration(audio.duration)
        const handleEnded = () => {
            setIsPlaying(false)
        }

        audio.addEventListener("timeupdate", updateTime)
        audio.addEventListener("loadedmetadata", handleLoadedMetadata)
        audio.addEventListener("ended", handleEnded)

        return () => {
            audio.removeEventListener("timeupdate", updateTime)
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
            audio.removeEventListener("ended", handleEnded)
        }
    }, [])

    // Update playback rate when speed changes
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        audio.playbackRate = currentSpeed
    }, [currentSpeed])


    const { isHeld } = useKeyPress();

    useEffect(() => {
        if (isHeld) {
            setIsPlaying(false)
        }
    }, [isHeld])

    const togglePlayPause = () => {
        if (isHeld) {
            return
        }

        audioManager.audio = new Audio(loaderData.fileUrl)

        if (isPlaying) {
            console.log("Pausing");
            
            audioManager.stopAudio()
        } else {
            console.log("Audio URL:", loaderData.fileUrl);

            audioManager.continueAudio()
        }
        setIsPlaying(!isPlaying)
    }

    const toggleSpeech = () => {
        if (speech.isSpeaking) {
            speech.stopSpeaking()
        } else {
            speech.speak(loaderData.transcripted)
        }
    }

    const speakSegment = (segment: TranscriptSegment) => {
        speech.speak(segment.text)
    }

    const handleSeek = (value: number[]) => {
        const audio = audioRef.current
        if (!audio) return

        const newTime = value[0]
        audio.currentTime = newTime
        setCurrentTime(newTime)
    }

    const handleVolumeChange = (value: number[]) => {
        const audio = audioRef.current
        if (!audio) return

        const newVolume = value[0]
        audio.volume = newVolume
        setVolume(newVolume)

        if (newVolume === 0) {
            setIsMuted(true)
        } else if (isMuted) {
            setIsMuted(false)
        }
    }

    const toggleMute = () => {
        const audio = audioRef.current
        if (!audio) return

        if (isMuted) {
            audio.volume = volume
            setIsMuted(false)
        } else {
            audio.volume = 0
            setIsMuted(true)
        }
    }

    const skipForward = () => {
        const audio = audioRef.current
        if (!audio) return

        audio.currentTime = Math.min(audio.currentTime + 10, duration)
    }

    const skipBackward = () => {
        const audio = audioRef.current
        if (!audio) return

        audio.currentTime = Math.max(audio.currentTime - 10, 0)
    }

    const jumpToTranscript = (start: number) => {
        const audio = audioRef.current
        if (!audio) return

        audio.currentTime = start

        if (!isPlaying) {
            audio.play().catch((error) => {
                console.error("Error playing audio:", error)
            })
            setIsPlaying(true)
        }
    }

    const changePlaybackSpeed = () => {
        // Cycle through common playback speeds: 0.5, 0.75, 1, 1.25, 1.5, 2
        const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]
        const currentIndex = speeds.indexOf(currentSpeed)
        const nextIndex = (currentIndex + 1) % speeds.length
        setCurrentSpeed(speeds[nextIndex])
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    }

    return (
        <div className="container p-10">
            <div className="hidden" aria-description="content">
                {loaderData.transcripted}
            </div>
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-violet-800">{loaderData.courseItem.name}</h1>
                <p className="text-violet-600">{loaderData.courseItem.description}</p>
            </div>

            <Card className="bg-white border-violet-200 mt-4">
                <CardHeader className="pb-3 border-b border-violet-100">
                    <CardTitle className="text-violet-800">Audio Player</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    <audio
                        ref={audioRef}
                        src={loaderData.fileUrl}
                        preload="metadata"
                        aria-label={`Audio for ${loaderData.courseItem.name}`}
                    />

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-violet-700">{formatTime(currentTime)}</span>
                            <span className="text-sm text-violet-700">{formatTime(duration)}</span>
                        </div>
                        <Slider
                            value={[currentTime]}
                            max={duration}
                            step={0.1}
                            onValueChange={handleSeek}
                            className="cursor-pointer"
                            aria-label="Audio progress"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleMute}
                                className="text-violet-600 hover:text-violet-800 hover:bg-violet-50"
                            >
                                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                            </Button>
                            <Slider
                                value={[isMuted ? 0 : volume]}
                                max={1}
                                step={0.01}
                                onValueChange={handleVolumeChange}
                                className="w-20 cursor-pointer"
                                aria-label="Volume"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={skipBackward}
                                className="text-violet-600 hover:text-violet-800 hover:bg-violet-50"
                            >
                                <SkipBack className="h-4 w-4" />
                            </Button>
                            <Button size="icon" onClick={togglePlayPause} className="bg-violet-600 hover:bg-violet-700 text-white">
                                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={skipForward}
                                className="text-violet-600 hover:text-violet-800 hover:bg-violet-50"
                            >
                                <SkipForward className="h-4 w-4" />
                            </Button>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={changePlaybackSpeed}
                            className="border-violet-300 text-violet-700 hover:bg-violet-50"
                        >
                            {currentSpeed}x
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <section>
                <Card className="bg-white border-violet-200 mt-4">
                    <CardHeader className="border-b border-violet-100">
                        <CardTitle className="text-violet-800">Transcripted</CardTitle>
                    </CardHeader>
                    <CardContent className=""> 
                        <p className="text-lg/loose text-justify">
                            {loaderData.transcripted}
                        </p>
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}
