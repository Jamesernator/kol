import assert from "./assert/assert.js";
import ObjectHandle from "./ObjectHandle.js";
import type { WindowGlobal } from "./WindowGlobal.js";

type SelectOptionSelector = {
    text: string,
};

export default class Frame<
    ParentType extends Frame | null=null,
    GlobalExtensions={},
> {
    readonly #window: GlobalExtensions & WindowGlobal;
    readonly #parent: ParentType;
    readonly #windowHandle: ObjectHandle<GlobalExtensions & WindowGlobal>;

    constructor(
        window: GlobalExtensions & WindowGlobal,
        parent: ParentType,
    ) {
        this.#window = window;
        this.#parent = parent;
        this.#windowHandle = new ObjectHandle(window, window);
    }

    get parentFrame(): ParentType {
        return this.#parent;
    }

    get window(): WindowGlobal {
        return this.#window;
    }

    get windowHandle(): ObjectHandle<GlobalExtensions & WindowGlobal> {
        return this.#windowHandle;
    }

    get documentHandle(): ObjectHandle<Document> {
        return this.#windowHandle.eval((window) => window.document);
    }

    get frameElement(): Element | null {
        return this.#window.frameElement;
    }

    eval<R>(
        func: (window: WindowGlobal) => R,
    ): R extends object ? ObjectHandle<R> : R {
        return new ObjectHandle(this.#window, this.#window)
            .eval(func);
    }

    $(selector: string): ObjectHandle<Element> | null {
        return this.documentHandle.eval(
            (document, selector) => document.querySelector(selector),
            selector,
        );
    }

    $$(selector: string): Array<ObjectHandle<Element>> {
        const elements = this.#window.document.querySelectorAll(selector);
        return Array.from(elements, (element) => new ObjectHandle(this.#window, element));
    }

    $eval<R, Args extends Array<any> | [any]>(
        selector: string,
        func: (element: Element, ...extraArgs: Args) => R,
        ...extraArgs: Args
    ): R extends object ? ObjectHandle<R> : R {
        const element = this.$(selector);
        if (element === null) {
            throw new Error(
                `No element matching selector ${ JSON.stringify(selector) }`,
            );
        }
        return element.eval(func, ...extraArgs);
    }

    $input(selector: string, text: string): void {
        const element = this.#window.document.querySelector(selector);
        if (element === null) {
            throw new Error(
                `No element matching selector ${ JSON.stringify(selector) }`,
            );
        }
        if (!(element instanceof this.#window.HTMLInputElement)) {
            throw new Error(
                `Element is not an <input> element`,
            );
        }
        element.value = text;
    }

    $click(selector: string): void {
        const element = this.#window.document.querySelector(selector);
        if (!(element instanceof this.#window.HTMLElement)) {
            throw new Error(`element is not an HTMLElement`);
        }
        element.click();
    }

    $submit(selector: string): void {
        const element = this.#window.document.querySelector(selector);
        if (!(element instanceof this.#window.HTMLFormElement)) {
            throw new Error(`element is not an HTMLFormElement`);
        }
        element.submit();
    }

    $selectOption(
        selectSelector: string,
        optionSelector: SelectOptionSelector,
    ): void {
        const element = this.#window.document.querySelector(selectSelector);
        if (!(element instanceof this.#window.HTMLSelectElement)) {
            throw new Error(`Expected <select> element to match selector`);
        }

        const options = Array.from(element.options);
        const selectedOptions = options.filter((option) => option.textContent
            ?.toLowerCase()
            .includes(optionSelector.text.toLowerCase()));
        if (selectedOptions.length !== 1) {
            throw new Error(`Multiple options matched`);
        }
        const [selectedOption] = selectedOptions;
        assert(selectedOption !== undefined);
        selectedOption.selected = true;
    }
}
