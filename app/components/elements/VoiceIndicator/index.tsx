import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import { useEffect } from "react";
import { useKeyPress } from "~/hooks/useSpacePress";
import useSpeakText from "~/hooks/useSpeakText";

export default function VoiceIndicator() {
    const { isHeld } = useKeyPress();
    const speech = useSpeakText();

    useEffect(() => {
        if (isHeld) {
            sessionStorage.setItem("hasInteracted", "true");
            speech.speak("Halo! Apa yang bisa aku bantu?");
        }
    }, [isHeld, speech]);


    return (
        <motion.div
            className="fixed bottom-10 right-10 w-20 aspect-square p-4 flex flex-col items-center justify-center rounded-full bg-[#C244EB] text-white"
            animate={{
                scale: isHeld ? 1.2 : 1, // Scale up when space is held
                boxShadow: isHeld
                    ? "0px 0px 20px rgba(194, 68, 235, 0.8)"
                    : "0px 0px 10px rgba(194, 68, 235, 0.5)", // Add a glowing effect
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <Mic />
            {isHeld && (
                <motion.div
                    className="flex space-x-1 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "easeInOut",
                    }}
                >
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </motion.div>
            )}
        </motion.div>
    );
}