
export default class Frame<
    ParentType extends Frame | null=null,
    GlobalExtensions={},
> {
    readonly #window: typeof globalThis & Window & GlobalExtensions;
    readonly #parent: ParentType;

    constructor(
        window: typeof globalThis & Window & GlobalExtensions,
        parent: ParentType,
    ) {
        this.#window = window;
        this.#parent = parent;
    }

    get parentFrame(): ParentType {
        return this.#parent;
    }

    get window(): typeof globalThis & Window & GlobalExtensions {
        return this.#window;
    }

    get document(): Document {
        return this.#window.document;
    }

    get frameElement(): Element | null {
        return this.#window.frameElement;
    }

    evalFunction<T>(
        func: (window: typeof globalThis & GlobalExtensions) => T,
    ): T {
        return this.#window.eval(`(${ func.toString() })`)(this.#window);
    }

    $(selector: string): Element | null {
        return this.#window.document.querySelector(selector);
    }

    $$(selector: string): Array<Element> {
        return [...this.#window.document.querySelectorAll(selector)];
    }

    $eval<T>(
        selector: string,
        func: (element: Element | null, window: typeof globalThis & GlobalExtensions) => T,
    ): T {
        const inWindowFunc = this.#window.eval(`(${ func.toString() })`);
        return inWindowFunc(
            this.#window.document.querySelector(selector),
            this.#window,
        );
    }

    $$eval<T>(
        selector: string,
        func: (elements: Array<Element>, window: typeof globalThis & GlobalExtensions) => T,
    ): T {
        const inWindowFunc = this.#window.eval(`(${ func.toString() })`);
        return inWindowFunc(
            [...this.#window.document.querySelectorAll(selector)],
            this.#window,
        );
    }
}
