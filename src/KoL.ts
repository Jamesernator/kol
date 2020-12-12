import DeckOfEveryCard from "./DeckOfEveryCard.js";
import Signal from "./lib/Signal.js";
import cancel from "./lib/cancel.js";

function assertIsFrame(value: any): HTMLFrameElement {
    if (value?.constructor.name !== "HTMLFrameElement") {
        throw new TypeError("Not an iframe element");
    }
    return value;
}

function assertIsWindow<T={}>(value: any): Window & typeof globalThis & T {
    if (value?.constructor.name !== "Window") {
        throw new TypeError("Not a window");
    }
    return value as Window & typeof globalThis & T;
}

function assertIsDocument(value: any): Document {
    if (value?.constructor.name !== "HTMLDocument") {
        throw new TypeError("Not a document");
    }
    return value;
}

function assertIsForm(value: any): HTMLFormElement {
    if (value?.constructor.name !== "HTMLFormElement") {
        throw new TypeError("Not a form");
    }
    return value;
}

type ChatPane = HTMLFrameElement & {
    contentWindow: NonNullable<HTMLFrameElement["contentWindow"]> & {
        submitchat: (chat: string, callback: () => void) => void,
    },
};

type CharPane = HTMLFrameElement & {
    contentWindow: NonNullable<HTMLFrameElement["contentWindow"]> & {
        pwdhash: string,
    },
};

export default class KoL {
    readonly #rootWindow: Window & typeof globalThis;
    readonly #mainPane: HTMLFrameElement;
    readonly #chatPane: ChatPane;
    readonly #menuPane: HTMLFrameElement;
    readonly #charPane: CharPane;
    readonly #deckOfEveryCard: DeckOfEveryCard = new DeckOfEveryCard(this);

    constructor(rootWindow: Window & typeof globalThis) {
        this.#rootWindow = rootWindow;
        const $ = (s: string) => {
            return assertIsFrame(rootWindow.document.querySelector(s));
        };
        this.#mainPane = $("[name=mainpane]");
        this.#chatPane = $("[name=chatpane]") as ChatPane;
        this.#menuPane = $("[name=menupane]");
        this.#charPane = $("[name=charpane]") as CharPane;
    }

    get rootWindow(): Window & typeof globalThis {
        return this.#rootWindow;
    }

    get mainPane(): HTMLFrameElement {
        return this.#mainPane;
    }

    get mainWindow(): Window & typeof globalThis {
        return assertIsWindow(this.#mainPane.contentWindow);
    }

    get mainDocument(): Document {
        return assertIsDocument(this.#mainPane.contentDocument);
    }

    get chatPane(): HTMLFrameElement {
        return this.#chatPane;
    }

    get chatWindow(): Window & typeof globalThis {
        return assertIsWindow(this.#chatPane.contentWindow);
    }

    get chatDocument(): Document {
        return assertIsDocument(this.#chatPane.contentDocument);
    }

    get menuPane(): HTMLFrameElement {
        return this.#menuPane;
    }

    get menuWindow(): Window & typeof globalThis {
        return assertIsWindow(this.#menuPane.contentWindow);
    }

    get menuDocument(): Document {
        return assertIsDocument(this.#menuPane.contentDocument);
    }

    get charPane(): HTMLFrameElement {
        return this.#charPane;
    }

    get charWindow(): CharPane["contentWindow"] {
        return assertIsWindow(this.#charPane.contentWindow);
    }

    get charDocument(): Document {
        return assertIsDocument(this.#charPane.contentDocument);
    }

    get pwdHash(): string {
        return this.charWindow.pwdhash;
    }

    get mainUrl(): string {
        return this.mainWindow.location.href;
    }

    get deckOfEveryCard(): DeckOfEveryCard {
        return this.#deckOfEveryCard;
    }

    async chatCommand(command: string): Promise<void> {
        if (!command.startsWith("/")) {
            command = `/${ command }`;
        }
        await new Promise((resolve) => {
            this.#chatPane.contentWindow.submitchat(command, resolve);
        });
    }

    nextLoad(cancelSignal: Signal=Signal.never): Promise<Event> {
        return new Promise((resolve, reject) => {
            this.#mainPane.addEventListener("load", resolve, { once: true });
            cancelSignal.register(() => {
                this.#mainPane.removeEventListener("load", resolve);
                reject(cancel());
            });
        });
    }

    async goto(
        url: string | URL,
        options: Record<string, string | number>={},
    ): Promise<void> {
        url = new URL(url.toString(), this.#rootWindow.location.origin);
        for (const [key, value] of Object.entries(options)) {
            url.searchParams.set(key, String(value));
        }
        const nextLoad = this.nextLoad();
        this.mainWindow.location.href = url.href;
        await nextLoad;
    }

    async use(item: number): Promise<void> {
        await this.goto("/inv_use.php", {
            pwd: this.pwdHash,
            whichItem: String(item),
        });
    }

    async submit(form: string | HTMLFormElement="form"): Promise<void> {
        if (typeof form === "string") {
            form = assertIsForm(this.mainDocument.querySelector(form));
        }
        const nextLoad = this.nextLoad();
        form.submit();
        await nextLoad;
    }

    assertIsChoice(choiceAdv: number): void {
        const url = new URL(this.mainUrl);
        if (url.pathname !== "/choice.php") {
            throw new Error("Not in choice.php");
        }
        const choice = this.mainDocument
            .getElementsByName("whichchoice")[0] as HTMLInputElement;
        if (Number(choice.value) !== choiceAdv) {
            throw new Error(`Expected to be in choice ${ choiceAdv }`);
        }
    }
}

