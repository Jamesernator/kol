import ObjectHandle from "./ObjectHandle.js";
import type { WindowGlobal } from "./WindowGlobal.js";

export default class NodeHandle<N extends Node> extends ObjectHandle<N> {
    readonly #node: N;

    constructor(window: WindowGlobal, node: N) {
        if (!(node instanceof window.Node)) {
            throw new TypeError(`Expected node to be a window.Node`);
        }
        super(window, node);
        this.#node = node;
    }

    get nodeName(): string {
        return this.#node.nodeName;
    }

    isElement(): this is NodeHandle<Element> {
        return this.#node.nodeType === Node.ELEMENT_NODE;
    }
}
