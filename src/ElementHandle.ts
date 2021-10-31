import NodeHandle from "./NodeHandle.js";
import type { WindowGlobal } from "./WindowGlobal.js";
import nonNullish from "./lib/nonNullish.js";

export default class ElementHandle<E extends Element> extends NodeHandle<E> {
    readonly #window: WindowGlobal;
    readonly #element: E;

    constructor(window: WindowGlobal, element: E) {
        if (!(element instanceof window.Element)) {
            throw new TypeError(`element should be an instance of window.Element`);
        }
        super(window, element);
        this.#window = window;
        this.#element = element;
    }

    get textContent(): string {
        return nonNullish(this.#element.textContent);
    }

    $(selector: string): ElementHandle<Element> | null {
        const element = this.#element.querySelector(selector);
        if (element === null) {
            return element;
        }
        return new ElementHandle(this.#window, element);
    }

    $$(selector: string): Array<ElementHandle<Element>> {
        const elements = this.#element.querySelectorAll(selector);
        return Array.from(elements, (element) => {
            return new ElementHandle(this.#window, element);
        });
    }
}
