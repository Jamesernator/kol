import type KoL from "./KoL.js";

export default class PowerPlant {
    readonly #kol: KoL;

    constructor(kol: KoL) {
        this.#kol = kol;
    }
}
