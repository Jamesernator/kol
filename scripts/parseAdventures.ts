import fs from "node:fs/promises";

const kolMafiaData = new URL("../kolmafia-data/", import.meta.url)

await fs.readFile(new URL("adventures.txt", kolMafiaData))
