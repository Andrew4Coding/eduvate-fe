import { useEffect } from "react";
import { useKeyPress } from "~/hooks/useSpacePress";
import useSpeakText from "~/hooks/useSpeakText";

export default function HomePage() {

    const speech = useSpeakText();

    const { isHeld } = useKeyPress();

    useEffect(() => {
    }, [isHeld]);

    return (
        <div className="p-20 flex flex-col items-center justify-center h-full overflow-hidden relative">
            <img src="/home-bg.png" alt="" className="fixed w-screen h-screen z-0" />
            <div className="relative z-10 flex flex-col items-center">
                <h1 className="text-h2 font-bold">
                    Halo! Apa yang bisa aku bantu?
                </h1>
                <h3 className="text-s4 font-medium text-violet-600">
                    Tekan tombol di bawah atau langsung katakan <span className="text-h2 font-bold">“HI EDU”</span>
                </h3>

                <div
                    id="speech-button"
                    onClick={() => {
                        sessionStorage.setItem("hasInteracted", "true");
                    }}
                    className="w-72 aspect-square p-4 flex items-center justify-center rounded-full bg-[#C244EB]/32">
                    <div className="w-full aspect-square p-4 flex items-center justify-center rounded-full bg-[#C244EB]/32">
                        <div className="w-full aspect-square p-4 flex items-center justify-center rounded-full bg-[#C244EB]/32">
                            <div className="w-full aspect-square p-4 flex items-center justify-center rounded-full bg-[#C244EB]/32 relative overflow-visible">
                                <img
                                    src="/eduvate-mascot.png"
                                    alt="Eduvate Mascot"
                                    className="absolute object-contain min-w-[300px] aspect-square hover:scale-105 transition-transform duration-300 ease-in-out"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}