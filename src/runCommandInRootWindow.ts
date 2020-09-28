
export default async function runCommandInRootWindow(
    command: string,
): Promise<void> {
    // eslint-disable-next-line no-alert
    alert(`Run command: ${ command }`);
}
