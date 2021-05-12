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
        this.#kol.assertIsChoice(1086);
    }

    async cheat(card: string): Promise<void> {
        await this.visitCheat();

        const options = this.#kol.mainFrame.$$("select#which > option")
            .filter((option) => {
                return option.textContent!.toLowerCase().includes(card.toLowerCase());
            });
        if (options.length === 0) {
            throw new Error(`No matches for card ${ card }`);
        }
        if (options.length > 1) {
            throw new Error(`Multiple options for card ${ card }`);
        }
        (options[0] as HTMLOptionElement).selected = true;


        await this.#kol.submit();
        this.#kol.assertIsChoice(1085);
        await this.#kol.submit("#play");
    }
}
