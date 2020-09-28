
export function getRootWindow(): Window & typeof globalThis {
    let currentWindow: Window & typeof globalThis = window;
    while (currentWindow.parent !== currentWindow) {
        currentWindow = currentWindow.parent as Window & typeof globalThis;
    }
    return currentWindow;
}
