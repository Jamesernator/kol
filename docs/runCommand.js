import { getRootWindow } from "./lib/getRootWindow.js";
function importInWindow(window, scriptUrl) {
    return window.eval(`
        import(${JSON.stringify(scriptUrl.href)})
    `);
}
export default async function runCommand(command) {
    const rootWindow = getRootWindow();
    const { default: runCommandInRootWindow } = await importInWindow(rootWindow, new URL("./runCommandInRootWindow.js", import.meta.url));
    await runCommandInRootWindow(command);
}
//# sourceMappingURL=runCommand.js.map