import type KoL from "./KoL.js";

export default class API {
    readonly #kol: KoL;

    constructor(kol: KoL) {
        this.#kol = kol;
    }
}
