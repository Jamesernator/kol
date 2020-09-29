
export type SignalInit = (sendSignal: () => void) => void;

export default class Signal {
    static never = new Signal(() => {});

    static any(signals: Array<Signal>): Signal {
        return new Signal((sendSignal) => {
            for (const signal of signals) {
                signal.register(sendSignal);
            }
        });
    }

    static all(signals: Array<Signal>): Signal {
        return new Signal((sendSignal) => {
            let remaining = 0;
            function onSignal() {
                remaining -= 1;
                if (remaining === 0) {
                    sendSignal();
                }
            }
            for (const signal of signals) {
                remaining += 1;
                signal.register(onSignal);
            }
        });
    }

    #listeners = new Set<() => void>();
    #signaled = false;

    constructor(init: SignalInit) {
        init(this.#signal);
    }

    #signal = (): void => {
        if (this.#signaled) {
            return;
        }
        this.#signaled = true;
        this.#listeners.forEach((listener) => listener());
        this.#listeners = new Set();
    };

    get signaled(): boolean {
        return this.#signaled;
    }

    register(listener: () => void, callImmediate: boolean=true): () => void {
        if (this.#signaled) {
            if (callImmediate) {
                listener();
            }
            return () => {};
        }
        this.#listeners.add(listener);
        return () => this.#listeners.delete(listener);
    }
}

