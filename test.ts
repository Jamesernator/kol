import { readFile } from "fs/promises";
import playwright from "playwright";
import KoLSession from "./src/KoLSession.js";

const loginDetailsFile = new URL("./credentials/login.json", import.meta.url);
const loginDetails = JSON.parse(await readFile(loginDetailsFile, "utf8"));
const browser = await playwright.chromium.launch({
    headless: false,
});
const page = await browser.newPage();
const session = await KoLSession.login(page, loginDetails);
