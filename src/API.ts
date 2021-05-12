import type KoL from "./KoL.js";

type Status = {
    playerid: string,
    name: string,
    hardcore: boolean,
    ascensions: number,
    path: number,
    sign: string,
    roninleft: number,
    casual: boolean,
    drunk: number,
    full: number,
    turnsplayed: number,
    familiar: number,
    hp: number,
    mp: number,
    meat: number,
    adventures: number,
    level: number,
    rawmuscle: number,
    rawmysticality: number,
    rawmoxie: number,
    basemuscle: number,
    basemysticality: number,
    basemoxie: number,
    familiarexp: number,
    class: number,
    lastAdv: {
        id: number,
        name: string,
        link: string,
        container: string,
    },
    title: number,
    pvpfights: number,
    maxhp: number,
    maxmp: number,
    spleen: number,
    muscle: number,
    mysticality: number,
    moxie: number,
    famlevel: number,
    locked: string,
    limitmode: number,
    daysthisrun: number,
    equipement: {
        hat: number,
        shirt: number,
        pants: number,
        weapon: number,
        offhand: number,
        acc1: number,
        acc2: number,
        acc3: number,
        container: number,
        familiarequip: number,
        fakehands: number,
        cardsleeve: number,
    },
    stickers: [number, number, number],
    soulsauce: number,
    fury: number,
    pastathrall: number,
    pastathralllevel: number,
    folder_holder: [number, number, number, number, number],
    eleronkey: string,
    flag_config: {
        noinvpops: boolean,
        fastdecking: boolean,
        seenewaccts: boolean,
        devskills: boolean,
        shortcharpane: boolean,
        lazyinventory: boolean,
        compactfights: boolean,
        poppvpsearch: boolean,
        questtracker: boolean,
        charpanepvp: boolean,
        australia: boolean,
        fffights: boolean,
        compactchar: boolean,
        noframesize: boolean,
        fullnesscounter: boolean,
        nodevdebug: boolean,
        noquestnudge: boolean,
        nocalendar: boolean,
        alwaystag: boolean,
        clanlogins: boolean,
        quickskills: boolean,
        hprestorers: boolean,
        hidejacko: boolean,
        anchorshelf: boolean,
        showoutfit: boolean,
        wowbar: boolean,
        swapfam: boolean,
        hidefamfilter: boolean,
        invimages: boolean,
        showhandedness: boolean,
        acclinks: boolean,
        invadvancedsort: boolean,
        powersort: boolean,
        autodiscard: boolean,
        unfamequip: boolean,
    },
};

const o = { flag_config: { noinvpops: 0, fastdecking: "1", seenewaccts: 0, devskills: 0, shortcharpane: 0, lazyinventory: 0, compactfights: 0, poppvpsearch: 0, questtracker: 0, charpanepvp: "1", australia: 0, fffights: "1", compactchar: 0, noframesize: 0, fullnesscounter: "1", nodevdebug: 0, noquestnudge: 0, nocalendar: 0, alwaystag: 0, clanlogins: 0, quickskills: 0, hprestorers: "1", hidejacko: 0, anchorshelf: "1", showoutfit: "1", wowbar: "1", swapfam: 0, hidefamfilter: 0, invimages: 0, showhandedness: 0, acclinks: "1", invadvancedsort: "1", powersort: 0, autodiscard: 0, unfamequip: "1", invclose: "1", sellstuffugly: 0, oneclickcraft: 0, dontscroll: 0, multisume: 0, threecolinv: "1", profanity: "1", tc_updatetitle: 0, tc_alwayswho: 0, tc_times: 0, tc_combineallpublic: 0, tc_eventsactive: 0, tc_hidebadges: 0, tc_colortabs: 0, tc_modifierkey: 0, tc_tabsonbottom: 0, chatversion: 0, aabosses: "1", compacteffects: "1", slimhpmpdisplay: "1", ignorezonewarnings: "1", whichpenpal: "4", compactmanuel: 0, hideefarrows: 0, questtrackertiny: "1", questtrackerscroll: 0, disablelovebugs: 0, eternalmrj: "1", autoattack: 0, topmenu: 2 }, recalledskills: 0, freedralph: 0, mcd: 0, pwd: "cec95ddbabed44136fff1ce5c0b861cb", rollover: 1617679802, turnsthisrun: 1159, familiar_wellfed: 0, intrinsics: [], familiarpic: "puckman", pathname: "", effects: { "66e8d911f8ca794bffc73c13905aaff8": ["Timer 1", 453, "clock", "", "873"], "55343cf5eba4b1de0cce85bd859789a2": ["Timer 2", 453, "watch", "", "874"], "0dd72e6554242a71e0cef9983e5abaed": ["Timer 3", 453, "nicewatch", "", "875"], e740ba31a0b39922636586368e42e0a5: ["Timer 4", 453, "hourglass", "", "876"], f89e57a785893f0add8c3567088847d0: ["Timer 5", 453, "watchchain", "", "877"], c51acc558b20ae13ce5ff112c34133f8: ["Timer 6", 453, "arrow_time", "", "878"], "4b280e29c80c46a6a459fda8af3b9472": ["Timer 7", 453, "timejuice", "", "879"], "09738ca64561790af54bd6d799e15ef0": ["Timer 8", 453, "glowwatch", "", "880"], fa165b04cc36ebb00457003bd5bef2a1: ["Timer 9", 453, "pixwatch", "", "881"], "4d1c706ae6625bd6e44b1451ffeb3ff1": ["stats.enq", 11831, "10101", "", "2112"], fb4176165c054ea0a34ecfa6d6a03558: ["Truffle Tango", 227, "sleightshroom", "", "2223"] } };

export default class API {
    readonly #kol: KoL;

    constructor(kol: KoL) {
        this.#kol = kol;
    }

    async status(): Status {
        const url = new URL(
            "/api.php",
            this.#kol.mainFrame.window.location.href,
        );
        url.searchParams.set("for", "Jamesernator+KoLJSLib");
        url.searchParams.set("what", "status");
    }
}
