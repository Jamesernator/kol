import ElementHandle from "./ElementHandle.js";
import type ObjectHandle from "./ObjectHandle.js";
import type { WindowGlobal } from "./WindowGlobal.js";

export default class HTMLElementHandle<H extends HTMLElement=HTMLElement>
    extends ElementHandle<H> {
    static from(handle: ObjectHandle<object>): HTMLElementHandle {
        const value = handle.unwrapValue();
        if (!(value instanceof handle.window.HTMLElement)) {
            throw new RangeError(`handle should be an HTMLElement`);
        }
        return new HTMLElementHandle(handle.window, value);
    }

    readonly #window: WindowGlobal;
    readonly #htmlElement: H;

    constructor(window: WindowGlobal, htmlElement: H) {
        if (!(htmlElement instanceof window.HTMLElement)) {
            throw new TypeError(
                `htmlElement should be instance of window.HTMLElement`,
            );
        }
        super(window, htmlElement);
        this.#window = window;
        this.#htmlElement = htmlElement;
    }

    click(): void {
        this.#htmlElement.click();
    }

    fill(text: string): void {
        if (this.#htmlElement instanceof this.#window.HTMLInputElement) {
            this.#htmlElement.value = text;
        } else if (this.#htmlElement instanceof this.#window.HTMLTextAreaElement) {
            this.#htmlElement.value = text;
        } else if (this.#htmlElement.contentEditable) {
            this.#htmlElement.textContent = text;
        }
        throw new RangeError(`element should be either <input> or <textarea> or content editable`);
    }
}
