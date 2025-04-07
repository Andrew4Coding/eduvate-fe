import { useCallback, useEffect, useRef, useState } from "react";

interface AudioDevice {
    deviceId: string;
    label: string;
}

interface UseVoiceRecorderOptions {
    onRecordingComplete?: (blob: Blob, audioUrl: string) => void;
    autoSendOnSpaceUp?: boolean;
    savePreferences?: boolean;
}

interface UseVoiceRecorderReturn {
    isRecording: boolean;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    audioBlob: Blob | null;
    audioUrl: string | null;
    audioDevices: AudioDevice[];
    selectedDeviceId: string;
    setSelectedDeviceId: (deviceId: string) => void;
    micPermission: boolean | null;
    isProcessing: boolean;
    setIsProcessing: (isProcessing: boolean) => void;
    testMicrophone: () => Promise<void>;
    initialSetupDone: boolean;
    completeMicrophoneSetup: () => void;
}

export default function useVoiceRecorder(options: UseVoiceRecorderOptions = {}): UseVoiceRecorderReturn {
    const {
        onRecordingComplete,
        autoSendOnSpaceUp = false,
        savePreferences = true,
    } = options;

    // State
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
    const [micPermission, setMicPermission] = useState<boolean | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const [initialSetupDone, setInitialSetupDone] = useState(false);

    // Refs
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);
    const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Get available audio devices on component mount
    useEffect(() => {
        const getAudioDevices = async () => {
            try {
                // First request permission
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = stream;
                setMicPermission(true);

                // Then enumerate devices
                const devices = await navigator.mediaDevices.enumerateDevices();
                const audioInputs = devices
                    .filter((device) => device.kind === "audioinput")
                    .map((device) => ({
                        deviceId: device.deviceId,
                        label: device.label || `Microphone ${device.deviceId.slice(0, 5)}...`,
                    }));

                setAudioDevices(audioInputs);

                // Load saved device ID if available
                if (savePreferences) {
                    const savedDeviceId = localStorage.getItem("selectedMicrophoneId");
                    if (savedDeviceId) {
                        setSelectedDeviceId(savedDeviceId);
                    } else if (audioInputs.length > 0) {
                        // Set default device if no saved preference
                        setSelectedDeviceId(audioInputs[0].deviceId);
                    }
                } else if (audioInputs.length > 0) {
                    // Set default device if not saving preferences
                    setSelectedDeviceId(audioInputs[0].deviceId);
                }

                // Setup audio context for visualization
                setupAudioContext(stream);

                // Stop the initial stream since we're not recording yet
                stream.getTracks().forEach((track) => track.stop());
            } catch (error) {
                console.error("Error accessing microphone:", error);
                setMicPermission(false);
            }
        };

        getAudioDevices();

        // Listen for device changes
        navigator.mediaDevices.addEventListener("devicechange", getAudioDevices);

        return () => {
            // Clean up
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            if (audioContextRef.current) {
                audioContextRef.current.close();
            }

            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }

            navigator.mediaDevices.removeEventListener("devicechange", getAudioDevices);
        };
    }, [savePreferences]);

    // Load microphone setup status from localStorage
    useEffect(() => {
        if (savePreferences) {
            // Check if we've already completed initial setup
            const setupDone = localStorage.getItem("microphoneSetupComplete") === "true";
            setInitialSetupDone(setupDone);
        }
    }, [savePreferences]);

    // Save microphone preferences when changed
    useEffect(() => {
        if (savePreferences && selectedDeviceId) {
            localStorage.setItem("selectedMicrophoneId", selectedDeviceId);
        }
    }, [selectedDeviceId, savePreferences]);

    const setupAudioContext = (stream: MediaStream) => {
        // Create audio context
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        // Create analyser node
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        // Create buffer for frequency data
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        dataArrayRef.current = dataArray;

        // Connect stream to analyser
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        sourceNodeRef.current = source;
    };

    const startRecording = async () => {
        try {
            // Use selected device if available
            const constraints = {
                audio: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            // Setup audio context and analyser for visualization
            if (!audioContextRef.current) {
                setupAudioContext(stream);
            } else {
                // If context exists, reconnect with new stream
                if (sourceNodeRef.current) {
                    sourceNodeRef.current.disconnect();
                }
                const source = audioContextRef.current.createMediaStreamSource(stream);
                source.connect(analyserRef.current!);
                sourceNodeRef.current = source;
            }

            // Start visualization
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            // Setup media recorder
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
                setAudioBlob(audioBlob);
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioUrl(audioUrl);

                // Stop visualization
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                }

                // Stop the stream
                stream.getTracks().forEach((track) => track.stop());

                // Call the callback if provided
                if (onRecordingComplete && !autoSendOnSpaceUp) {
                    onRecordingComplete(audioBlob, audioUrl);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Could not access your microphone. Please check permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            // Stop visualization
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        }
    };

    const testMicrophone = async () => {
        try {
            // Stop any existing stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }

            // Get new stream with selected device
            const constraints = {
                audio: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            // Setup audio context for visualization
            if (!audioContextRef.current) {
                setupAudioContext(stream);
            } else {
                // If context exists, reconnect with new stream
                if (sourceNodeRef.current) {
                    sourceNodeRef.current.disconnect();
                }
                const source = audioContextRef.current.createMediaStreamSource(stream);
                source.connect(analyserRef.current!);
                sourceNodeRef.current = source;
            }

            // Start visualization for 3 seconds
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            // Stop after 3 seconds
            setTimeout(() => {
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                }

                // Stop the stream
                stream.getTracks().forEach((track) => track.stop());
            }, 3000);
        } catch (error) {
            console.error("Error testing microphone:", error);
            alert("Could not access the selected microphone. Please check permissions.");
        }
    };

    const handleDeviceChange = useCallback((deviceId: string) => {
        setSelectedDeviceId(deviceId);
        if (savePreferences) {
            localStorage.setItem("selectedMicrophoneId", deviceId);
        }
    }, [savePreferences]);

    const completeMicrophoneSetup = useCallback(() => {
        if (savePreferences) {
            localStorage.setItem("microphoneSetupComplete", "true");
        }
        setInitialSetupDone(true);
    }, [savePreferences]);

    return {
        isRecording,
        startRecording,
        stopRecording,
        audioBlob,
        audioUrl,
        audioDevices,
        selectedDeviceId,
        setSelectedDeviceId: handleDeviceChange,
        micPermission,
        isProcessing,
        setIsProcessing,
        testMicrophone,
        initialSetupDone,
        completeMicrophoneSetup,
    };
}
