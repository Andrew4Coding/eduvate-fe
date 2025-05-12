import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Slider } from "~/components/ui/slider"
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, Headphones, StopCircle } from 'lucide-react'
import type { Prisma } from "@prisma/client"
import { useLoaderData } from "react-router"
import useSpeakText from "~/hooks/useSpeakSpeech"
import { Badge } from "~/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { useKeyPress } from "~/hooks/useKeyPress"

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
        const audio = audioRef.current
        if (!audio) return

        if (isHeld) {
            return
        }

        if (isPlaying) {
            speech.stopSpeaking()
        } else {
            console.log("Playing audio");

            console.log("Audio URL:", loaderData.transcripted);
            
            const words = loaderData.transcripted.split(" ");
            const chunkSize = 50;
            const chunks = [];

            for (let i = 0; i < words.length; i += chunkSize) {
                chunks.push(words.slice(i, i + chunkSize).join(" "));
            }

            let currentChunkIndex = 0;

            const speakChunks = () => {
                if (currentChunkIndex < chunks.length) {
                    speech.speak(chunks[currentChunkIndex], () => {
                        currentChunkIndex++;
                        speakChunks();
                    });
                }
            };

            speakChunks();}
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

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "audio" | "speech")} className="mt-6">
                <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
                    <TabsTrigger value="audio">Audio Player</TabsTrigger>
                    <TabsTrigger value="speech">Text-to-Speech</TabsTrigger>
                </TabsList>

                <TabsContent value="audio">
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
                </TabsContent>

                <TabsContent value="speech">
                    <Card className="bg-white border-violet-200 mt-4">
                        <CardHeader className="pb-3 border-b border-violet-100">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-violet-800">Text-to-Speech</CardTitle>
                                {speech.isSpeaking && (
                                    <Badge variant="outline" className="bg-violet-100 text-violet-800">
                                        Speaking...
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <div className="flex justify-center mb-4">
                                <Button
                                    onClick={toggleSpeech}
                                    className={speech.isSpeaking ? "bg-red-500 hover:bg-red-600" : "bg-violet-600 hover:bg-violet-700"}
                                    size="lg"
                                >
                                    {speech.isSpeaking ? (
                                        <>
                                            <StopCircle className="mr-2 h-4 w-4" /> Stop Speaking
                                        </>
                                    ) : (
                                        <>
                                            <Headphones className="mr-2 h-4 w-4" /> Read Aloud
                                        </>
                                    )}
                                </Button>
                            </div>

                            {speech.isSpeaking && (
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-violet-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-violet-600 transition-all duration-300"
                                            style={{ width: `${speech.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {speech.error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                                    {speech.error}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {transcript.length > 0 && (
                <Card className="bg-white border-violet-200 mt-6">
                    <CardHeader className="pb-3 border-b border-violet-100">
                        <CardTitle className="text-violet-800">Transcript</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div ref={transcriptRef} className="max-h-[400px] overflow-y-auto p-4">
                            {transcript.map((segment) => (
                                <div
                                    id={segment.id}
                                    key={segment.id}
                                    className={`transcript-segment ${activeTranscriptId === segment.id ? "active" : ""} ${speech.isSpeaking && speech.spokenText.includes(segment.text) ? "bg-violet-50" : ""
                                        }`}
                                    onClick={() => activeTab === "audio" ? jumpToTranscript(segment.start) : speakSegment(segment)}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-violet-500">{formatTime(segment.start)}</span>
                                        {activeTab === "speech" && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 text-violet-600 hover:text-violet-800 hover:bg-violet-50"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    speakSegment(segment);
                                                }}
                                            >
                                                <Headphones className="h-3 w-3 mr-1" /> Speak
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-gray-800">{segment.text}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
