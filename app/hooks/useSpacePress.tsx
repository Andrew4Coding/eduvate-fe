import { createContext, useContext, useEffect, useState } from "react";

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

    useEffect(() => {
        let holdTimeout: NodeJS.Timeout;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                if (!spacePressed) {
                    setSpacePressed(true);
                    holdTimeout = setTimeout(() => {
                        setIsHeld(true); // consider it held after 500ms
                    }, 500);
                }
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                setSpacePressed(false);
                setIsHeld(false);
                clearTimeout(holdTimeout);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [spacePressed]);

    return (
        <KeyPressContext.Provider value={{ spacePressed, isHeld }}>
            {children}
        </KeyPressContext.Provider>
    );
};

export const useKeyPress = () => useContext(KeyPressContext);
