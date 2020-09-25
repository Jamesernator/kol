import { getRootWindow } from "./lib/getRootWindow.js";
import type * as runCommandInRootWindowModule
    from "./runCommandInRootWindow.js";

function importInWindow(
    window: Window & typeof globalThis,
    scriptUrl: URL,
): Promise<any> {
    return window.eval(`
        import(${ JSON.stringify(scriptUrl.href) })
    `);
}

export default async function runCommand(command: string): Promise<void> {
    const rootWindow = getRootWindow();
    const { default: runCommandInRootWindow } = await importInWindow(
        rootWindow,
        new URL("./runCommandInRootWindow.js", import.meta.url),
    ) as typeof runCommandInRootWindowModule;
    await runCommandInRootWindow(command);
}
