import type KoL from "./KoL.js";

export default class DeckOfEveryCard {
    #kol: KoL;

    constructor(kol: KoL) {
        this.#kol = kol;
    }

    async visitCheat(): Promise<void> {
        await this.#kol.goto("/inv_use.php", {
            pwd: this.#kol.pwdHash,
            cheat: 1,
            whichitem: 8382,
        });
    }

    async cheat(card: string): Promise<void> {
        await this.visitCheat();

        const options = Array.from(this.#kol.mainDocument
            .querySelectorAll("select#which > option"))
            .filter((option) => {
                return option.textContent!.toLowerCase().includes(card.toLowerCase());
            }) as (Array<HTMLOptionElement>);

        if (options.length === 0) {
            throw new Error(`No matches for card ${ card }`);
        }
        if (options.length > 1) {
            throw new Error(`Multiple options for card ${ card }`);
        }
        options[0].selected = true;
        await this.#kol.submit();
        await this.#kol.submit("#play");
    }
}
