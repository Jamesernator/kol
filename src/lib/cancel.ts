
class Cancelled extends Error {
    name = "Cancelled";
}

if (typeof window === "object") {
    window.addEventListener("unhandledrejection", (event) => {
        if (event.reason instanceof Cancelled) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    });
}

export default function cancel(): never {
    throw new Cancelled();
}
