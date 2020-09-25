export function getRootWindow() {
    let currentWindow = window;
    while (currentWindow.parent !== currentWindow) {
        currentWindow = currentWindow.parent;
    }
    return currentWindow;
}
//# sourceMappingURL=getRootWindow.js.map