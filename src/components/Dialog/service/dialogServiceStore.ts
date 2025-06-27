import { useSyncExternalStore } from "react";
import { IconName } from "../../Icon";

export type DialogContent = {
    /**
     * Title of the dialog.
     */
    title: string;
    /**
     * The message field text.
     */
    message: string;
    /**
     * A list of configured buttons to render as action buttons in the dialog.
     */
    buttons: DialogButton[];
};

export type DialogButton = {
    /**
     * Title of the button.
     */
    text: string;
    /**
     * Callback method invoked when a user presses the button.
     */
    onPress: () => void;
    /**
     * The style of the button described from its effects on the system.
     */
    style?: "default" | "cancel" | "destructive";
    /**
     * A boolean value indicating whether or not the button should be visually highligted.
     */
    isPreferred?: boolean;
    /**
     * The name of the icon to display with the button.
     */
    icon?: IconName;
};

type Listener = () => void;

let dialogContent: DialogContent | null = null;
let listeners: Listener[] = [];

const _getSnapshot = () => dialogContent;

const _subscribe = (listener: Listener) => {
    listeners = [...listeners, listener];
    return () => {
        listeners = listeners.filter(l => l !== listener);
    };
};

const _emitChange = () => {
    for (const listener of listeners) {
        listener();
    }
};

export const alert = (
    title: DialogContent["title"],
    message: DialogContent["message"],
    buttons: DialogContent["buttons"],
) => {
    if (dialogContent === null) {
        dialogContent = { title, message, buttons };
        _emitChange();
    }
};

const finishDialog = () => {
    if (dialogContent !== null) {
        dialogContent = null;
        _emitChange();
    }
};

export const _useDialogService = () => {
    const dialogContent = useSyncExternalStore(_subscribe, _getSnapshot);
    return { dialogContent, finishDialog };
};
