import type KoL from "./KoL.js";

export default class CLI {
    readonly #kol: KoL;
    readonly #pending?: {
        commands: string[],
        abortController: AbortController,
    };

    constructor(kol: KoL) {
        this.#kol = kol;
    }

    async runCommand(command: string): Promise<void> {
        if (this.#pending) {
            this.#pending.commands.push(command);
        }
    }

    abort(): void {

    }
}
