
export default function nonNullish<T>(value: T): NonNullable<T> {
    if (value === undefined || value === null) {
        throw new TypeError("Value should not be nullish");
    }
    return value as any;
}
