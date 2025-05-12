"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Mic, Settings } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { useKeyPress } from "~/hooks/useKeyPress"
import useSpeakText from "~/hooks/useSpeakSpeech"
import useVoiceRecorder from "~/hooks/useVoiceRecord"
import { executeCommand } from "~/lib/command"
import getPageContent from "~/lib/page-content"

export default function VoiceIndicator() {
    const { isHeld } = useKeyPress()
    const speech = useSpeakText()
    const [showMicDialog, setShowMicDialog] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isFirstTime, setIsFirstTime] = useState(true)

    const {
        startRecording,
        stopRecording,
        audioDevices,
        selectedDeviceId,
        setSelectedDeviceId,
        initialSetupDone,
        completeMicrophoneSetup,
        micPermission,
    } = useVoiceRecorder({
        onRecordingComplete: (blob, url) => {
            // Here you can send the audio to your API
            console.log("Recording completed", { blob, url })

            const beep = new Audio("/beep.mp3")
            console.log("beep");

            beep.play().catch()

            sessionStorage.getItem("hasInteracted")

            if (sessionStorage.getItem("hasInteracted")) {
                // Send the audio blob to your API
                sendAudioToAPI(blob)
            } else {
                console.log("User has not interacted yet.")
            }
        },
    })

    const sendAudioToAPI = async (blob: Blob) => {
        setIsLoading(true)
        try {
            // Create form data to send the audio file
            const formData = new FormData()
            formData.append("audio", blob, "recording.wav")

            formData.append("pageContent", getPageContent())

            // Send to your API endpoint
            const response = await fetch("/api/transcribe", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                throw new Error("Failed to transcribe audio")
            }

            const data = await response.json()

            setIsLoading(false)

            // Play the response audio if available
            if (data.text) {
                // Clean markdown text including *, _, and < > tags
                const cleanedText = data.text
                    .replace(/\*/g, "")
                    .replace(/_/g, "")
                    .replace(/<[^>]+>/g, "")

                console.log(cleanedText);

                if (cleanedText.includes("EXECCOMMAND")) {
                    // Speak the sentence before EXECCOMMAND
                    const beforeCommandText = cleanedText.substring(0, cleanedText.indexOf("EXECCOMMAND")).trim()
                    if (beforeCommandText) {
                        speech.stopSpeaking()
                        speech.speak(beforeCommandText)
                    }

                    // Get text starting from EXECCOMMAND but still includes EXECCOMMAND
                    const commandText = cleanedText.substring(
                        cleanedText.indexOf("EXECCOMMAND") + "EXECCOMMAND".length
                    )
                    return executeCommand(commandText.trim().replaceAll("EXECCOMMAND", ""), speech)
                } else {
                    // Speak the cleaned text
                    speech.stopSpeaking()
                    speech.speak(cleanedText)
                }

            }
        } catch (error) {
            console.error("Error processing audio:", error)
        }
    }

    // Check if microphone setup is needed
    useEffect(() => {
        if (micPermission === true && !initialSetupDone) {
            setShowMicDialog(true)
        }
    }, [micPermission, initialSetupDone])

    // Handle recording based on space key
    useEffect(() => {
        speech.stopSpeaking();
        // Only allow recording if microphone setup is complete
        if (isHeld && initialSetupDone && isFirstTime) {
            sessionStorage.setItem("hasInteracted", "true")
            speech.speak("Halo! Apa yang bisa aku bantu?")
            startRecording()

            const beep = new Audio("/beep.mp3")
            beep.play().catch()
        } else if (!isHeld && initialSetupDone) {
            stopRecording()
        }
    }, [isHeld])

    // Handle microphone setup completion
    const handleSetupComplete = () => {
        completeMicrophoneSetup()
        setShowMicDialog(false)
    }

    // Open settings dialog manually
    const openMicSettings = () => {
        setShowMicDialog(true)
    }

    return (
        <>
            {/* Microphone Selection Dialog */}
            <Dialog open={showMicDialog} onOpenChange={setShowMicDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{initialSetupDone ? "Microphone Settings" : "Select Your Microphone"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {!initialSetupDone && (
                            <div className="text-sm text-gray-600 mb-4">
                                <p>
                                    Please select a microphone to use with the voice assistant. This will be used when you hold the space
                                    key to speak.
                                </p>
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Microphone</label>
                            <Select value={selectedDeviceId} onValueChange={setSelectedDeviceId}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a microphone" />
                                </SelectTrigger>
                                <SelectContent className="w-">
                                    {audioDevices.map((device) => (
                                        <SelectItem key={device.deviceId} value={device.deviceId} className="overflow-hidden">
                                            {device.label.slice(0, 40)} ...
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button onClick={handleSetupComplete} className="w-full mt-4" disabled={!selectedDeviceId}>
                            {initialSetupDone ? "Save Settings" : "Continue"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Speech Subtitle with Progressive Text Display */}
            <AnimatePresence>
                {speech.isSpeaking && (
                    <motion.div
                        className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-black/50 text-white py-2 rounded-xl shadow-lg px-6 max-h-24 overflow-hidden z-50"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        style={{ maxWidth: "80vw" }}
                    >
                        <div className="relative">
                            <p className="text-center pb-1 whitespace-pre-wrap break-words">
                                {speech.spokenText.slice(speech.spokenText.lastIndexOf("\n") + 1)}
                            </p>
                            {/* Progress bar */}
                            <div className="w-full h-0.5 bg-gray-600 rounded-full mt-1 overflow-hidden">
                                <motion.div
                                    className="h-full bg-white"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${speech.progress}%` }}
                                    transition={{ ease: "linear" }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Voice Button */}
            <div className="fixed bottom-32 md:bottom-10 right-4 md:right-10 flex flex-col items-end space-y-4">
                {/* Settings Button */}
                <motion.button
                    className="p-3 rounded-full bg-gray-800/70 text-white hover:bg-gray-700/70 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openMicSettings}
                >
                    <Settings
                        className="size-8 md:size-4"
                    />
                </motion.button>

                {/* Main Voice Button */}
                <motion.div
                    className="w-40 md:w-20 aspect-square p-4 flex flex-col items-center justify-center rounded-full bg-[#C244EB] text-white relative cursor-pointer hover:scale-105 duration-300"
                    animate={{
                        scale: isHeld ? 1.2 : 1, // Scale up when space is held
                        boxShadow: isHeld ? "0px 0px 20px rgba(194, 68, 235, 0.8)" : "0px 0px 10px rgba(194, 68, 235, 0.5)", // Add a glowing effect
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <Mic className="aspect-square size-16 md:size-8" />
                    {isHeld && (
                    <motion.div
                            className="flex space-x-1 mt-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{
                                repeat: Number.POSITIVE_INFINITY,
                                duration: 1,
                                ease: "easeInOut",
                            }}
                        >
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        </motion.div>
                    )}
                    {isLoading && (
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </>
    )
}

