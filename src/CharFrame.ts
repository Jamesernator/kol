import Frame from "./Frame.js";
import type RootFrame from "./RootFrame.js";

type CharFrameGlobals = {
    pwdhash: string,
};

export default class CharFrame extends Frame<RootFrame, CharFrameGlobals> {}
