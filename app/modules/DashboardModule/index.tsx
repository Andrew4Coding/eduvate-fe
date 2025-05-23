import { useKeyPress } from "~/hooks/useKeyPress";

export default function DashbordModule() {
    const { isHeld } = useKeyPress()
    
    return (
        <div className="p-6 md:p-20 flex flex-col items-center justify-center h-full overflow-hidden relative">
            <div className="relative z-10 flex flex-col items-center text-center">
                <h1 className="text-h4 md:text-h2 font-bold">
                    Halo! Apa yang bisa aku bantu?
                </h1>
                <h3 className="text-s6 md:text-s5 font-medium text-violet-600 mt-2">
                    Tekan tombol Spasi dan langsung katakan <span className="text-h4 md:text-h2 font-bold">“HI EDU”</span>
                </h3>

                <div
                    id="speech-button"
                    onClick={() => {
                        sessionStorage.setItem("hasInteracted", "true");
                    }}
                    className="w-36 md:w-72 aspect-square p-2 md:p-4 flex items-center justify-center rounded-full bg-[#C244EB]/32 mt-6">
                    <div className="w-full aspect-square p-2 md:p-4 flex items-center justify-center rounded-full bg-[#C244EB]/32">
                        <div className="w-full aspect-square p-2 md:p-4 flex items-center justify-center rounded-full bg-[#C244EB]/32">
                            <div className="w-full aspect-square p-2 md:p-4 flex items-center justify-center rounded-full bg-[#C244EB]/32 relative overflow-visible">
                                <img
                                    src="/eduvate-mascot.png"
                                    alt="Eduvate Mascot"
                                    className={`absolute object-contain min-w-[150px] md:min-w-[300px] aspect-square hover:scale-105 transition-transform duration-300 ease-in-out ${isHeld && 'scale-110'}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}