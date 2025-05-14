import { enrollInCourse } from "~/modules/CourseModule/const";
import type { TTS } from "./tts";

function navigateToRouteWithAI(route: string, speech: TTS, isLast: boolean = false) {
    if (typeof window !== 'undefined') {

        const url = new URL(route, window.location.origin);
        const path = url.pathname;
        const params = new URLSearchParams(url.search);

        const newUrl = `${path}?${params.toString()}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
        window.dispatchEvent(new PopStateEvent('popstate', { state: { path: newUrl } }));

        if (isLast) {
            // Play audio
            const audio = new Audio('/audios/navigation-success.mp3')
            audio.play().catch()
        }
    }
}

function clickButton(buttonId: string, speech: TTS) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.click();
        const audio = new Audio('/audios/button-clicked.mp3')
        audio.play().catch();

    } else {
        console.error('Button not found:', buttonId);
    }
}

async function enrollCourse(code: string, speech: TTS) {
    const data = await enrollInCourse(code.replaceAll(' ', '').replaceAll("_", "").replaceAll("-", "").toUpperCase());

    if (data.success) {
        const audio = new Audio('/audios/enroll-success.mp3')
        audio.play().catch();

        setTimeout(() => {
            window.location.reload();
        }, 1000);

    } else {
        const audio = new Audio('/audios/enroll-failed.mp3')
        audio.play().catch();
    }
}

function getCurrentHtml() {
    return document.documentElement.outerHTML;
}

enum PROMPT_TYPE {
    NAVIGATE,
    CLICK,
    ENROLL
}

function parsePromptResult(prompt: string) {
    const commands = prompt.split('\n\n').map(block => block.trim()).filter(block => block.length > 0);
    const parsedCommands = commands.map(block => {
        const lines = block.split('\n');
        const command = lines[0].trim();
        const args = lines.slice(1).map(line => line.trim()).filter(line => line.length > 0);
        let type: PROMPT_TYPE;
        let data: any;

        if (command === 'navigate') {
            type = PROMPT_TYPE.NAVIGATE;
            data = args[0];
        }
        else if (command === 'click') {
            type = PROMPT_TYPE.CLICK;
            data = args[0];
        }
        else if (command === 'enroll') {
            type = PROMPT_TYPE.ENROLL;
            data = args[0];
        }
        else {
            throw new Error('Unknown command: ' + command);
        }

        return {
            type,
            data,
        };
    });

    return parsedCommands;
}

function executeCommand(command: string, speech: TTS) {
    try {
        const parsedCommands = parsePromptResult(command);
        for (let i = 0; i < parsedCommands.length; i++) {
            const { type, data } = parsedCommands[i];
            console.log(type, data);
            const isLast = i === parsedCommands.length - 1; // Check if this is the last command
            switch (type) {
                case PROMPT_TYPE.NAVIGATE:
                    navigateToRouteWithAI(data, speech, isLast);
                    break;
                case PROMPT_TYPE.CLICK:
                    clickButton(data, speech);
                    break;
                case PROMPT_TYPE.ENROLL:
                    enrollCourse(data, speech);
                    break;
                default:
                    console.error('Unknown command type:', type);
            }
        }
    } catch (error) {
        console.error('Error executing command:', error);
    }
}

export { executeCommand, getCurrentHtml };
