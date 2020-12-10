import type KoL from "./KoL.js";

export default class Genie {
    readonly #kol: KoL;

    constructor(kol: KoL) {
        this.#kol = kol;
    }
}
