import type KoL from "./KoL.js";

const GENIE_BOTTLE = 9529;
const POCKET_WISH = 9537;

export const Wish = {
    pony(): string {
        return "for a pony";
    },
    dragonMail(): string {
        return "for a blessed rustproof +2 gray dragon scale mail";
    },
    free(): string {
        return "you were free";
    },
    trophy(value: string): string {
        return `for trophy ${ value }`;
    },
    muscleStats(): string {
        return "I was a little bit taller";
    },
    moxieStats(): string {
        return "I was a baller";
    },
    mysticalityStats(): string {
        return "I had a rabbit in a hat with a bat";
    },
    stats(): string {
        return "I was big";
    },
    meat(): string {
        return "I was rich";
    },
    pocketWish(): string {
        return "for more wishes";
    },
    effect(phrase: string): string {
        return `to be ${ phrase }`;
    },
    fight(monster: string): string {
        return `to fight ${ monster }`;
    },
};

export default class Genie {
    readonly #kol: KoL;

    constructor(kol: KoL) {
        this.#kol = kol;
    }

    readonly #submitWish = async (
        item: typeof GENIE_BOTTLE | typeof POCKET_WISH,
        wish: string,
    ): Promise<void> => {
        const nextLoad = this.#kol.nextLoad();
        await this.#kol.use(item);
        await nextLoad;
        this.#kol.assertIsChoice(1267);
        const wishInput = this.#kol.mainFrame
            .querySelector("[name=wish]") as HTMLInputElement;
        wishInput.value = wish;
        await this.#kol.submit();
    };

    async genieWish(wish: string): Promise<void> {
        await this.#submitWish(GENIE_BOTTLE, wish);
    }

    async pocketWish(wish: string): Promise<void> {
        await this.#submitWish(POCKET_WISH, wish);
    }
}
