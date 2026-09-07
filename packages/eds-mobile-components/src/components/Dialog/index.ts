import { Dialog as _Dialog } from "./Dialog";
import { DialogActions } from "./DialogActions";
import { DialogCustomContent } from "./DialogCustomContent";
import { DialogHeader } from "./DialogHeader";
import { DialogServiceProvider } from "./service/DialogServiceProvider";
import { alert } from "./service/dialogServiceStore";

type DialogFamily = typeof _Dialog & {
    /**
     * The header component of the dialog. This component will be rendered prominently.
     */
    Header: typeof DialogHeader;
    /**
     * The main content component of the dialog.
     */
    CustomContent: typeof DialogCustomContent;
    /**
     * Content for the actions space for the dialog.
     */
    Actions: typeof DialogActions;
};

const Dialog = _Dialog as DialogFamily;
Dialog.Header = DialogHeader;
Dialog.CustomContent = DialogCustomContent;
Dialog.Actions = DialogActions;

export { Dialog, DialogServiceProvider, alert };
