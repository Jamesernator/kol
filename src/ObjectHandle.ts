import type { WindowGlobal } from "./WindowGlobal.js";
import isObject from "./lib/isObject.js";

export default class ObjectHandle<T extends object> {
    readonly #window: WindowGlobal;
    readonly #value: T;

    constructor(window: WindowGlobal, value: T) {
        this.#value = value;
        this.#window = window;
    }

    get window(): WindowGlobal {
        return this.#window;
    }

    /**
     * NOTE: Objects returned from this function are in general
     * expected to be in other Realms, so rules about instanceof
     * and such apply
     * @returns The value itself
     */
    unwrapValue(): T {
        return this.#value;
    }

    eval<R>(func: (value: T) => R): R extends object ? ObjectHandle<R> : R {
        const inRealmFunc = this.#window
            .eval.call(null, `(${ func.toString() })`);
        const result = inRealmFunc(this.#value);
        if (isObject(result)) {
            return new ObjectHandle(this.#window, result) as any;
        }
        return result;
    }
}
