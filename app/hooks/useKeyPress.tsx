import { createContext, useContext, useEffect, useRef, useState } from "react";

type KeyPressContextType = {
    spacePressed: boolean;
    isHeld: boolean;
};

const KeyPressContext = createContext<KeyPressContextType>({
    spacePressed: false,
    isHeld: false,
});

export const KeyPressProvider = ({ children }: { children: React.ReactNode }) => {
    const [spacePressed, setSpacePressed] = useState(false);
    const [isHeld, setIsHeld] = useState(false);

    const holdTimeout = useRef<NodeJS.Timeout | null>(null);
    const isKeyDownRef = useRef(false); // new ref to track actual key status

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space" && !isKeyDownRef.current) {
                isKeyDownRef.current = true;
                setSpacePressed(true);

                holdTimeout.current = setTimeout(() => {
                    if (isKeyDownRef.current) {
                        setIsHeld(true); // only set if still held
                    }
                }, 500);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                isKeyDownRef.current = false;
                setSpacePressed(false);
                setIsHeld(false);

                if (holdTimeout.current) {
                    clearTimeout(holdTimeout.current);
                    holdTimeout.current = null;
                }
            }
        };

        const handleMouseDown = () => {
            setSpacePressed(true);

            holdTimeout.current = setTimeout(() => {
                setIsHeld(true);
            }, 500);
        };

        const handleMouseUp = () => {
            setSpacePressed(false);
            setIsHeld(false);

            if (holdTimeout.current) {
                clearTimeout(holdTimeout.current);
                holdTimeout.current = null;
            }
        };

        const handleTouchStart = () => {
            setSpacePressed(true);

            holdTimeout.current = setTimeout(() => {
                setIsHeld(true);
            }, 500);
        };

        const handleTouchEnd = () => {
            setSpacePressed(false);
            setIsHeld(false);

            if (holdTimeout.current) {
                clearTimeout(holdTimeout.current);
                holdTimeout.current = null;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("touchstart", handleTouchStart);
        window.addEventListener("touchend", handleTouchEnd);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
            if (holdTimeout.current) {
                clearTimeout(holdTimeout.current);
            }
        };
    }, []);

    return (
        <KeyPressContext.Provider value={{ spacePressed, isHeld }}>
            {children}
        </KeyPressContext.Provider>
    );
};

export const useKeyPress = () => useContext(KeyPressContext);
