import type { Page } from "playwright";

const KOL_URL = "https://www.kingdomofloathing.com/";

type LoginDetails = {
    username: string,
    password: string,
};

export default class KoLSession {
    static async login(page: Page, login: LoginDetails): Promise<KoLSession> {
        await page.goto(KOL_URL);
        await page.fill(`[name=\"loginname\"]`, login.username);
        await page.fill(`[name="password"]`, login.password);
        const navigated = page.waitForNavigation();
        await page.click(`#submitbutton`);
        await navigated;
    }

    #page: Page;

    private constructor(page: Page) {
        this.#page = page;
    }
}
