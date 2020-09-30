import Signal from "./lib/Signal.js";
import cancel from "./lib/cancel.js";

function assertIsIFrame(value: any): HTMLIFrameElement {
    if (!(value instanceof HTMLIFrameElement)) {
        throw new TypeError("Not an iframe element");
    }
    return value;
}

function assertIsWindow(value: any): Window & typeof globalThis {
    if (!(value instanceof Window)) {
        throw new TypeError("Not a window");
    }
    return value as Window & typeof globalThis;
}

function assertIsDocument(value: any): Document {
    if (!(value instanceof Document)) {
        throw new TypeError("Not a document");
    }
    return value;
}

function assertIsForm(value: any): HTMLFormElement {
    if (!(value instanceof HTMLFormElement)) {
        throw new TypeError("Not a form");
    }
    return value;
}

export default class KoL {
    #rootWindow: Window & typeof globalThis;
    #mainPane: HTMLIFrameElement;
    #chatPane: HTMLIFrameElement;
    #menuPane: HTMLIFrameElement;
    #charPane: HTMLIFrameElement;

    constructor(rootWindow: Window & typeof globalThis) {
        this.#rootWindow = rootWindow;
        const $ = (s: string) => {
            return assertIsIFrame(rootWindow.document.querySelector(s));
        };
        this.#mainPane = $("[name=mainpane]");
        this.#chatPane = $("[name=chatpane]");
        this.#menuPane = $("[name=menupane]");
        this.#charPane = $("[name=charpane]");
    }

    get rootWindow(): Window & typeof globalThis {
        return this.#rootWindow;
    }

    get mainPane(): HTMLIFrameElement {
        return this.#mainPane;
    }

    get mainWindow(): Window & typeof globalThis {
        return assertIsWindow(this.#mainPane.contentWindow);
    }

    get mainDocument(): Document {
        return assertIsDocument(this.#mainPane.contentDocument);
    }

    get chatPane(): HTMLIFrameElement {
        return this.#chatPane;
    }

    get chatWindow(): Window & typeof globalThis {
        return assertIsWindow(this.#chatPane.contentWindow);
    }

    get chatDocument(): Document {
        return assertIsDocument(this.#chatPane.contentDocument);
    }

    get menuPane(): HTMLIFrameElement {
        return this.#menuPane;
    }

    get menuWindow(): Window & typeof globalThis {
        return assertIsWindow(this.#menuPane.contentWindow);
    }

    get menuDocument(): Document {
        return assertIsDocument(this.#menuPane.contentDocument);
    }

    get charPane(): HTMLIFrameElement {
        return this.#charPane;
    }

    get charWindow(): Window & typeof globalThis {
        return assertIsWindow(this.#charPane.contentWindow);
    }

    get charDocument(): Document {
        return assertIsDocument(this.#charPane.contentDocument);
    }

    get pwdHash(): string {
        return (this.chatWindow as any).pwdhash as string;
    }

    get mainUrl(): string {
        return this.mainWindow.location.href;
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
        const choice = document
            .getElementsByName("whichchoice")[0] as HTMLInputElement;
        if (Number(choice.value) !== choiceAdv) {
            throw new Error(`Expected to be in choice ${ choiceAdv }`);
        }
    }
}

