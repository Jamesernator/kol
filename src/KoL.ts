import assert from "./assert/assert.js";
import CharFrame from "./CharFrame.js";
import ChatFrame from "./ChatFrame.js";
import DeckOfEveryCard from "./DeckOfEveryCard.js";
import cancel from "./lib/cancel.js";
import Signal from "./lib/Signal.js";
import MainFrame from "./MainFrame.js";
import MenuFrame from "./MenuFrame.js";
import RootFrame from "./RootFrame.js";

export default class KoL {
    static createAuto(): KoL {
        const topWindow = window.top;
        if (topWindow === null) {
            throw new Error("window is detached from browser");
        }
        return new KoL(topWindow as Window & typeof globalThis);
    }

    readonly #rootFrame: RootFrame;
    readonly #mainFrame: MainFrame;
    readonly #chatFrame: ChatFrame;
    readonly #menuFrame: MenuFrame;
    readonly #charFrame: CharFrame;
    readonly #deckOfEveryCard: DeckOfEveryCard = new DeckOfEveryCard(this);

    constructor(rootWindow: Window & typeof globalThis) {
        this.#rootFrame = new RootFrame(rootWindow, null);
        const $ = (s: string) => {
            const el = rootWindow.document.querySelector(s);
            assert(el instanceof HTMLFrameElement);
            return el;
        };
        this.#mainFrame = new MainFrame(
            $("[name=mainpane]").contentWindow as any,
            this.#rootFrame,
        );
        this.#chatFrame = new ChatFrame(
            $("[name=chatpane]").contentWindow as any,
            this.#rootFrame,
        );
        this.#menuFrame = new MenuFrame(
            $("[name=menupane]").contentWindow as any,
            this.#rootFrame,
        );
        this.#charFrame = new CharFrame(
            $("[name=charpane]").contentWindow as any,
            this.#rootFrame,
        );
    }

    get rootWindow(): Window & typeof globalThis {
        return this.#rootFrame.window;
    }

    get rootFrame(): RootFrame {
        return this.#rootFrame;
    }

    get mainFrame(): MainFrame {
        return this.#mainFrame;
    }

    get chatFrame(): ChatFrame {
        return this.#chatFrame;
    }

    get charFrame(): CharFrame {
        return this.#charFrame;
    }

    get menuFrame(): MenuFrame {
        return this.#menuFrame;
    }

    get pwdHash(): string {
        return this.#charFrame.windowHandle.unwrapValue().pwdhash;
    }

    get mainURL(): string {
        return this.#mainFrame.window.location.href;
    }

    get deckOfEveryCard(): DeckOfEveryCard {
        return this.#deckOfEveryCard;
    }

    nextLoad(cancelSignal: Signal = Signal.never): Promise<Event> {
        return new Promise((resolve, reject) => {
            this.#mainFrame.frameElement
                ?.addEventListener("load", resolve, {
                    once: true,
                });
            cancelSignal.register(() => {
                this.#mainFrame.frameElement
                    ?.removeEventListener("load", resolve);
                reject(cancel());
            });
        });
    }

    async goto(
        url: URL | string,
        options: Record<string, number | string> = {},
    ): Promise<void> {
        url = new URL(url.toString(), this.#rootFrame.window.location.origin);
        for (const [key, value] of Object.entries(options)) {
            url.searchParams.set(key, String(value));
        }
        const nextLoad = this.nextLoad();
        this.#mainFrame.window.location.href = url.href;
        await nextLoad;
    }

    async use(
        item: number,
        extraOptions: Record<string, number | string> = {},
    ): Promise<void> {
        await this.goto("/inv_use.php", {
            pwd: this.pwdHash,
            whichitem: String(item),
            ...extraOptions,
        });
    }

    async $submit(formSelector: string = "form"): Promise<void> {
        const nextLoad = this.nextLoad();
        this.#mainFrame.$submit(formSelector);
        await nextLoad;
    }

    async $click(selector: string): Promise<void> {
        const nextLoad = this.nextLoad();
        this.#mainFrame.$click(selector);
        await nextLoad;
    }

    assertIsChoice(expectedChoiceAdv: number): void {
        const url = new URL(this.mainURL);
        if (url.pathname !== "/choice.php") {
            throw new Error("Not in choice.php");
        }
        const choiceElement = this.#mainFrame.$(`[name=whichchoice]`);
        if (choiceElement === null) {
            throw new Error(`Expected to be in a choice adventure`);
        }

        const choiceValue = choiceElement.eval((el) => {
            if (!(el instanceof HTMLInputElement)) {
                throw new Error(`Expected choice to be an <input> element`);
            }
            return Number(el.value);
        });

        if (choiceValue !== expectedChoiceAdv) {
            throw new Error(
                `Expected to be in choice ${ expectedChoiceAdv } not ${ choiceValue }`,
            );
        }
    }
}

