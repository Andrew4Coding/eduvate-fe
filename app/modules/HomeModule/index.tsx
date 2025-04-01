"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { Mic, MicOff, Send, Loader2, Settings, StopCircle, Volume2, VolumeX } from "lucide-react"
import { cn } from "~/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"

interface Message {
    id: string
    content: string
    isUser: boolean
    audioUrl?: string
}

interface AudioDevice {
    deviceId: string
    label: string
}

export default function VoiceChatBot() {
    const [messages, setMessages] = useState<Message[]>([])
    const [isRecording, setIsRecording] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [previewAudioUrl, setPreviewAudioUrl] = useState<string | null>(null)
    const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([])
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>("")
    const [audioLevel, setAudioLevel] = useState<number[]>(Array(50).fill(0))
    const [showSettings, setShowSettings] = useState(false)
    const [micPermission, setMicPermission] = useState<boolean | null>(null)
    const [isSpeaking, setIsSpeaking] = useState(false)

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const analyserRef = useRef<AnalyserNode | null>(null)
    const dataArrayRef = useRef<Uint8Array | null>(null)
    const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null)
    const animationFrameRef = useRef<number | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const streamRef = useRef<MediaStream | null>(null)

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // Set up speech synthesis event listeners
    useEffect(() => {
        if ("speechSynthesis" in window) {
            const synth = window.speechSynthesis

            const handleSpeechStart = () => {
                setIsSpeaking(true)
            }

            const handleSpeechEnd = () => {
                setIsSpeaking(false)
            }

            // Add event listeners for speech synthesis
            synth.addEventListener("voiceschanged", () => {
                // This event fires when voices are loaded
            })

            // We'll use our own state tracking since speech events are unreliable across browsers

            return () => {
                // Clean up by canceling any ongoing speech
                synth.cancel()
            }
        }
    }, [])

    // Get available audio devices on component mount
    useEffect(() => {
        const getAudioDevices = async () => {
            try {
                // First request permission
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                streamRef.current = stream
                setMicPermission(true)

                // Then enumerate devices
                const devices = await navigator.mediaDevices.enumerateDevices()
                const audioInputs = devices
                    .filter((device) => device.kind === "audioinput")
                    .map((device) => ({
                        deviceId: device.deviceId,
                        label: device.label || `Microphone ${device.deviceId.slice(0, 5)}...`,
                    }))

                setAudioDevices(audioInputs)

                // Set default device
                if (audioInputs.length > 0) {
                    setSelectedDeviceId(audioInputs[0].deviceId)
                }

                // Setup audio context for visualization
                setupAudioContext(stream)

                // Stop the initial stream since we're not recording yet
                stream.getTracks().forEach((track) => track.stop())
            } catch (error) {
                console.error("Error accessing microphone:", error)
                setMicPermission(false)
            }
        }

        getAudioDevices()

        // Listen for device changes
        navigator.mediaDevices.addEventListener("devicechange", () => {
            getAudioDevices()
        })

        return () => {
            // Clean up
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }

            if (audioContextRef.current) {
                audioContextRef.current.close()
            }

            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop())
            }

            navigator.mediaDevices.removeEventListener("devicechange", () => {
                getAudioDevices()
            })

            // Stop any ongoing speech
            if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel()
            }
        }
    }, [])

    const setupAudioContext = (stream: MediaStream) => {
        // Create audio context
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        audioContextRef.current = audioContext

        // Create analyser node
        const analyser = audioContext.createAnalyser()
        analyser.fftSize = 256
        analyserRef.current = analyser

        // Create buffer for frequency data
        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        dataArrayRef.current = dataArray

        // Connect stream to analyser
        const source = audioContext.createMediaStreamSource(stream)
        source.connect(analyser)
        sourceNodeRef.current = source
    }

    const drawWaveform = () => {
        if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return

        const canvas = canvasRef.current
        const canvasCtx = canvas.getContext("2d")
        if (!canvasCtx) return

        const analyser = analyserRef.current
        const dataArray = dataArrayRef.current

        const width = canvas.width
        const height = canvas.height

        // Get frequency data
        analyser.getByteFrequencyData(dataArray)

        // Calculate average level for visualization
        const average = Array.from(dataArray).reduce((sum, value) => sum + value, 0) / dataArray.length
        const normalizedAverage = average / 255

        // Update audio level state for the bars visualization
        setAudioLevel((prev) => {
            const newLevels = [...prev]
            newLevels.shift()
            newLevels.push(normalizedAverage)
            return newLevels
        })

        // Clear canvas
        canvasCtx.clearRect(0, 0, width, height)

        // Draw waveform
        canvasCtx.fillStyle = "#f3f4f6"
        canvasCtx.fillRect(0, 0, width, height)

        canvasCtx.lineWidth = 2
        canvasCtx.strokeStyle = "#2563eb"
        canvasCtx.beginPath()

        const sliceWidth = width / dataArray.length
        let x = 0

        for (let i = 0; i < dataArray.length; i++) {
            const v = dataArray[i] / 128.0
            const y = (v * height) / 2

            if (i === 0) {
                canvasCtx.moveTo(x, y)
            } else {
                canvasCtx.lineTo(x, y)
            }

            x += sliceWidth
        }

        canvasCtx.lineTo(width, height / 2)
        canvasCtx.stroke()

        // Continue animation
        if (isRecording) {
            animationFrameRef.current = requestAnimationFrame(drawWaveform)
        }
    }

    const startRecording = async () => {
        try {
            // Use selected device if available
            const constraints = {
                audio: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true,
            }

            const stream = await navigator.mediaDevices.getUserMedia(constraints)
            streamRef.current = stream

            // Setup audio context and analyser for visualization
            if (!audioContextRef.current) {
                setupAudioContext(stream)
            } else {
                // If context exists, reconnect with new stream
                if (sourceNodeRef.current) {
                    sourceNodeRef.current.disconnect()
                }
                const source = audioContextRef.current.createMediaStreamSource(stream)
                source.connect(analyserRef.current!)
                sourceNodeRef.current = source
            }

            // Start visualization
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
            animationFrameRef.current = requestAnimationFrame(drawWaveform)

            // Setup media recorder
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            audioChunksRef.current = []

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data)
                }
            }

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
                setAudioBlob(audioBlob)
                const audioUrl = URL.createObjectURL(audioBlob)
                setPreviewAudioUrl(audioUrl)

                // Stop visualization
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current)
                }

                // Stop the stream
                stream.getTracks().forEach((track) => track.stop())
            }

            mediaRecorder.start()
            setIsRecording(true)
        } catch (error) {
            console.error("Error accessing microphone:", error)
            alert("Could not access your microphone. Please check permissions.")
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)

            // Stop visualization
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }

            // Create the audio URL immediately after stopping
            setTimeout(() => {
                if (audioChunksRef.current.length > 0) {
                    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
                    const audioUrl = URL.createObjectURL(audioBlob)
                    setPreviewAudioUrl(audioUrl)
                }
            }, 100)
        }
    }

    const sendAudioToAPI = async () => {
        if (!audioBlob) return

        setIsProcessing(true)

        try {
            // Create a user message with the audio
            const userMessageId = Date.now().toString()
            const audioUrl = URL.createObjectURL(audioBlob)

            setMessages((prev) => [
                ...prev,
                {
                    id: userMessageId,
                    content: "Audio message",
                    isUser: true,
                    audioUrl,
                },
            ])

            // Create form data to send the audio file
            const formData = new FormData()
            formData.append("audio", audioBlob, "recording.wav")

            // Send to your API endpoint
            const response = await fetch("/api/transcribe", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                throw new Error("Failed to transcribe audio")
            }

            const data = await response.json()

            // Add the bot response
            const botMessageId = (Date.now() + 1).toString()
            setMessages((prev) => [
                ...prev,
                {
                    id: botMessageId,
                    content: data.text,
                    isUser: false,
                    audioUrl: data.audioUrl, // If your API returns an audio URL
                },
            ])

            // Play the response audio if available
            if (data.audioUrl) {
                const audio = new Audio(data.audioUrl)
                audio.play()
            } else if (data.text) {
                // Use browser's text-to-speech if no audio URL is provided
                speakText(data.text)
            }
        } catch (error) {
            console.error("Error processing audio:", error)
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    content: "Sorry, there was an error processing your audio.",
                    isUser: false,
                },
            ])
        } finally {
            setIsProcessing(false)
            setAudioBlob(null)
            setPreviewAudioUrl(null)
        }
    }

    const speakText = (text: string) => {
        if ("speechSynthesis" in window) {
            // Cancel any ongoing speech first
            window.speechSynthesis.cancel()

            const utterance = new SpeechSynthesisUtterance(text)
            utterance.lang = "id-ID" // Set the language
            utterance.rate = 1 // Set the speaking rate
            utterance.pitch = 1 // Set the pitch

            // Set speaking state to true when starting
            setIsSpeaking(true)

            // Set up event handlers
            utterance.onend = () => {
                setIsSpeaking(false)
            }

            utterance.onerror = () => {
                setIsSpeaking(false)
            }

            // Start speaking
            window.speechSynthesis.speak(utterance)
        }
    }

    const stopSpeaking = () => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel()
            setIsSpeaking(false)
        }
    }

    const handleDeviceChange = (deviceId: string) => {
        setSelectedDeviceId(deviceId)
    }

    const testMicrophone = async () => {
        try {
            // Stop any existing stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop())
            }

            // Get new stream with selected device
            const constraints = {
                audio: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true,
            }

            const stream = await navigator.mediaDevices.getUserMedia(constraints)
            streamRef.current = stream

            // Setup audio context for visualization
            if (!audioContextRef.current) {
                setupAudioContext(stream)
            } else {
                // If context exists, reconnect with new stream
                if (sourceNodeRef.current) {
                    sourceNodeRef.current.disconnect()
                }
                const source = audioContextRef.current.createMediaStreamSource(stream)
                source.connect(analyserRef.current!)
                sourceNodeRef.current = source
            }

            // Start visualization for 3 seconds
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
            animationFrameRef.current = requestAnimationFrame(drawWaveform)

            // Stop after 3 seconds
            setTimeout(() => {
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current)
                }

                // Stop the stream
                stream.getTracks().forEach((track) => track.stop())
            }, 3000)
        } catch (error) {
            console.error("Error testing microphone:", error)
            alert("Could not access the selected microphone. Please check permissions.")
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 bg-gradient-to-b from-gray-50 to-gray-100">
            <Card className="w-full max-w-2xl h-[90vh] md:h-[80vh] flex flex-col overflow-hidden shadow-xl rounded-xl border-0">
                <div className="p-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground flex justify-between items-center">
                    <h1 className="text-xl font-bold">Voice Chat Bot</h1>
                    <div className="flex items-center gap-2">
                        {isSpeaking && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={stopSpeaking}
                                            className="text-primary-foreground hover:bg-primary-foreground/10"
                                        >
                                            <VolumeX className="h-5 w-5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Stop speaking</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Dialog open={showSettings} onOpenChange={setShowSettings}>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-primary-foreground hover:bg-primary-foreground/10"
                                            >
                                                <Settings className="h-5 w-5" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Microphone Settings</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Select Microphone</label>
                                                    <Select value={selectedDeviceId} onValueChange={handleDeviceChange}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a microphone" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {audioDevices.map((device) => (
                                                                <SelectItem key={device.deviceId} value={device.deviceId}>
                                                                    {device.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Test Microphone</label>
                                                    <div className="h-20 bg-gray-100 rounded-md overflow-hidden">
                                                        <canvas ref={canvasRef} width={300} height={80} className="w-full h-full" />
                                                    </div>
                                                    <Button onClick={testMicrophone} className="w-full">
                                                        Test Microphone
                                                    </Button>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Microphone settings</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                            <Volume2 className="h-12 w-12 text-gray-300" />
                            <p className="text-center max-w-xs">Press the microphone button to start a conversation</p>
                        </div>
                    )}

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                "flex flex-col max-w-[85%] p-4 rounded-xl shadow-sm",
                                message.isUser
                                    ? "ml-auto bg-primary text-primary-foreground rounded-br-none"
                                    : "mr-auto bg-gray-100 text-gray-800 rounded-bl-none",
                            )}
                        >
                            <p className="break-words">{message.content}</p>
                            {message.audioUrl && <audio className="mt-2 max-w-full" controls src={message.audioUrl} />}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Status bar - shows when speaking or recording */}
                {(isRecording || isSpeaking) && (
                    <div
                        className={cn(
                            "px-4 py-2 flex items-center gap-2 text-sm font-medium",
                            isRecording ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600",
                        )}
                    >
                        {isRecording ? (
                            <>
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                Recording...
                            </>
                        ) : isSpeaking ? (
                            <>
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                                </span>
                                Speaking...
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={stopSpeaking}
                                    className="ml-auto text-blue-600 hover:bg-blue-100 p-1 h-auto"
                                >
                                    <StopCircle className="h-4 w-4 mr-1" />
                                    Stop
                                </Button>
                            </>
                        ) : null}
                    </div>
                )}

                <div className="p-4 border-t bg-gray-50 flex flex-col gap-3">
                    {isRecording && (
                        <div className="flex h-10 bg-gray-100 rounded-lg overflow-hidden">
                            {audioLevel.map((level, index) => (
                                <div
                                    key={index}
                                    className="w-full bg-blue-500 mx-px"
                                    style={{
                                        height: `${Math.max(5, level * 100)}%`,
                                        alignSelf: "flex-end",
                                        transition: "height 0.1s ease",
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {audioBlob && !isProcessing && (
                        <div className="flex flex-col gap-2 p-3 bg-white rounded-lg border">
                            <p className="text-sm font-medium text-gray-700">Preview your recording:</p>
                            {previewAudioUrl && (
                                <audio
                                    className="w-full"
                                    controls
                                    src={previewAudioUrl}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    onEnded={() => setIsPlaying(false)}
                                />
                            )}
                            <div className="flex gap-2 mt-2">
                                <Button onClick={sendAudioToAPI} className="flex-1" aria-label="Send audio">
                                    <Send className="h-5 w-5 mr-2" />
                                    Send
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={isProcessing || micPermission === false}
                            className={cn(
                                "flex-1 h-14 rounded-full shadow-md",
                                isRecording ? "bg-red-500 hover:bg-red-600 text-white" : "bg-primary hover:bg-primary/90",
                            )}
                            aria-label={isRecording ? "Stop recording" : "Start recording"}
                        >
                            {isProcessing ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : isRecording ? (
                                <MicOff className="h-6 w-6 mr-2" />
                            ) : (
                                <Mic className="h-6 w-6 mr-2" />
                            )}
                            {isRecording ? "Stop Recording" : "Record Voice"}
                        </Button>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setShowSettings(true)}
                                        className="h-14 w-14 rounded-full shadow-sm"
                                        aria-label="Microphone settings"
                                    >
                                        <Settings className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Microphone settings</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </Card>
        </main>
    )
}

