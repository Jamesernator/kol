import Signal from "./Signal.js";

type ForkZoneOptions = {
    name?: string,
    cancelSignal?: Signal,
};

export type ZoneOptions = ForkZoneOptions & {
    parent?: Zone,
};

let currentZone!: Zone;

export default class Zone {
    static get current(): Zone {
        return currentZone;
    }

    #parent?: Zone;
    #cancelSignal: Signal;
    name;

    constructor({
        name="<anonymous>",
        parent,
        cancelSignal=Signal.never,
    }: ZoneOptions={}) {
        this.name = name;
        this.#parent = parent;
        this.#cancelSignal = cancelSignal;
    }

    #callInZone = <This, Args extends Array<any>, Return>(
        callback: (this: This, ...args: Args) => Return,
        thisArg: This,
        args: Args,
    ): Return => {
        const beforeZone = currentZone;
        currentZone = this;
        try {
            return callback.apply(thisArg, args);
        } finally {
            currentZone = beforeZone;
        }
    };

    get parent(): Zone | undefined {
        return this.#parent;
    }

    get cancelSignal(): Signal {
        return this.#cancelSignal;
    }

    fork(options: ForkZoneOptions={}): Zone {
        return new Zone({ ...options, parent: this });
    }

    run<Return>(callback: (this: undefined, value: Zone) => Return): Return {
        if (typeof callback !== "function") {
            throw new TypeError("Callback is not a function");
        }
        return this.#callInZone(callback, undefined, [this]);
    }

    wrap<This, Args extends Array<any>, Return>(
        callback: (this: This, ...args: Args) => Return,
    ): (this: This, ...args: Args) => Return {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const zone = this;
        return function(this: This, ...args: Args): Return {
            return zone.#callInZone(callback, this, args);
        };
    }
}

currentZone = new Zone({ name: "<main>" });
