import type { UseSpeakTextType } from "~/hooks/useSpeakSpeech";

function navigateToRouteWithAI(route: string, speech: UseSpeakTextType) {
    if (typeof window !== 'undefined') {

        const url = new URL(route, window.location.origin);
        const path = url.pathname;
        const params = new URLSearchParams(url.search);

        const newUrl = `${path}?${params.toString()}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
        window.dispatchEvent(new PopStateEvent('popstate', { state: { path: newUrl } }));

        speech.speak(`Navigasi berhasil`)
    }
}

function clickButton(buttonId: string) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.click();
    } else {
        console.error('Button not found:', buttonId);
    }
}

function getCurrentHtml() {
    return document.documentElement.outerHTML;
}

enum PROMPT_TYPE {
    NAVIGATE,
    CLICK,
}

function parsePromptResult(prompt: string) {
    const lines = prompt.split('\n');

    const command = lines[0].trim();
    const args = lines.slice(1).map(line => line.trim()).filter(line => line.length > 0);
    let type: PROMPT_TYPE;
    let data: any;

    console.log(command);
    

    if (command === 'navigate') {
        type = PROMPT_TYPE.NAVIGATE;
        data = args[0];
    }
    else if (command === 'click') {
        type = PROMPT_TYPE.CLICK;
        data = args[0];
    }
    else {
        throw new Error('Unknown command: ' + command);
    }

    return {
        type,
        data,
    };
}

function executeCommand(command: string, speech: UseSpeakTextType) {
    console.log(command)
    try {
        const { type, data } = parsePromptResult(command);
        console.log(type, data)
        switch (type) {
            case PROMPT_TYPE.NAVIGATE:
                navigateToRouteWithAI(data, speech);
                break;
            case PROMPT_TYPE.CLICK:
                clickButton(data);
                break;
            default:
                console.error('Unknown command type:', type);
        }
    } catch (error) {
        console.error('Error executing command:', error);
    }
}

export { executeCommand, getCurrentHtml };
