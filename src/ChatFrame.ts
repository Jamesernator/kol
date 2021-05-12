import Frame from "./Frame.js";
import type RootFrame from "./RootFrame.js";

type ChatFrameGlobals = {
    submitchat: (chat: string, callback: () => void) => void,
};

export default class ChatFrame extends Frame<RootFrame, ChatFrameGlobals> {}
