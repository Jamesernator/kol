
    function rootWindow() {
        let currentWindow = window;
        while (currentWindow.parent !== currentWindow) {
            currentWindow = currentWindow.parent;
        }
        return currentWindow;
    }

    export default class KoL {
        #rootWindow;
        #mainPane;
        #chatPane;
        #menuPane;
        #charPane;

        constructor(rootWindow) {
            this.#rootWindow = rootWindow;
            const $ = s => rootWindow.document.querySelector(s);
            this.#mainPane = $("[name=mainpane]");
            this.#chatPane = $("[name=chatpane]");
            this.#menuPane = $("[name=menupane]");
            this.#charPane = $("[name=charpane]");
        }

        get rootWindow() {
            return this.#rootWindow;
        }

        get mainPane() {
            return this.#mainPane;
        }

        get mainWindow() {
            return this.#mainPane.contentWindow;
        }

        get mainDocument() {
            return this.#mainPane.contentDocument;
        }

        get chatPane() {
            return this.#chatPane;
        }

        get chatWindow() {
            return this.#chatPane.contentWindow;
        }

        get chatDocument() {
            return this.#chatPane.contentDocument
        }

        get menuPane() {
            return this.#menuPane;
        }

        get menuWindow() {
            return this.#menuPane.contentWindow;
        }

        get menuDocument() {
            return this.#menuPane.contentDocument;
        }

        get charPane() {
            return this.#charPane;
        }

        get charWindow() {
            return this.#charPane.contentWindow;
        }

        get charDocument() {
            return this.#charPane.contentDocument;
        }

        get pwdHash() {
            return this.chatWindow.pwdhash;
        }

        get mainUrl() {
            return this.mainWindow.location.href;
        }

        nextLoad() {
            return new Promise(resolve => {
                this.#mainPane.addEventListener('load', resolve, { once: true });
            });
        }

        async goto(url, options={}) {
            url = new URL(url, this.#rootWindow.location.origin);
            for (const [key, value] of Object.entries(options)) {
                url.searchParams.set(key, value);
            }
            const nextLoad = this.nextLoad();
            this.mainWindow.location.href = url.href;
            await nextLoad;
        }

        async submit(form='form') {
            if (typeof form === 'string') form = this.mainDocument.querySelector(form);
            const nextLoad = this.nextLoad();
            form.submit();
            await nextLoad;
        }
    }

    class DeckOfEveryCard {
        #kol;

        constructor(kol) {
            this.#kol = kol;
        }
 
        async visitCheat() {
            await this.#kol.goto('/inv_use.php', {
                pwd: this.#kol.pwdHash,
                cheat: 1,
                whichitem: 8382,
            });
        }

        async cheat(card) {
            await this.visitCheat();

            const options = Array.from(this.#kol.mainDocument
                .querySelectorAll('select#which > option'))
                .filter(option => {
                    return option.textContent.toLowerCase().includes(card.toLowerCase());
                });
            if (options.length === 0) {
                throw new Error(`No matches for card ${ card }`);
            }
            if (options.length > 1) {
                throw new Error(`Multiple options for card ${ card }`);
            }
            options[0].selected = true;
            await this.#kol.submit();
            await this.#kol.submit("#play");

        }
    }
    
    window.kol = new KoL(rootWindow());
    window.deck = new DeckOfEveryCard(kol);
