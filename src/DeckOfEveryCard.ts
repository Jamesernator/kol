import type KoL from "./KoL.js";

const DECK_OF_EVERY_CARD = 8382

export default class DeckOfEveryCard {
    #kol: KoL;

    constructor(kol: KoL) {
        this.#kol = kol;
    }

    async draw(): Promise<void> {
        await this.#kol.use(DECK_OF_EVERY_CARD);
        this.#kol.assertIsChoice(1085);
        await this.#kol.$submit("#play");
    }

    async visitCheat(): Promise<void> {
        await this.#kol.use(DECK_OF_EVERY_CARD, {
            cheat: 1,
        });
        this.#kol.assertIsChoice(1086);
    }

    async cheat(card: string): Promise<void> {
        await this.visitCheat();

        this.#kol.mainFrame.$selectOption("select#which", {
            text: card,
        });

        await this.#kol.$submit();
        this.#kol.assertIsChoice(1085);
        await this.#kol.$submit("#play");
    }
}
