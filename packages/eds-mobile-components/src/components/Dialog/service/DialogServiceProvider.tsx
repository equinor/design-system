import React from "react";
import { Button } from "../../Button";
import { Typography } from "../../Typography";
import { Dialog } from "../Dialog";
import { DialogActions } from "../DialogActions";
import { DialogCustomContent } from "../DialogCustomContent";
import { DialogHeader } from "../DialogHeader";
import { _useDialogService } from "./dialogServiceStore";

/**
 * This component is used in EDS Provider, and
 * provides a simpler dialog interface, similar to
 * React Native Alert
 */
export const DialogServiceProvider = () => {
    const { dialogContent, finishDialog } = _useDialogService();
    const isDialogOpen = !!dialogContent;
    return (
        <Dialog isOpen={isDialogOpen}>
            <DialogHeader>{dialogContent?.title}</DialogHeader>
            <DialogCustomContent>
                <Typography>{dialogContent?.message}</Typography>
            </DialogCustomContent>
            <DialogActions align="right">
                {dialogContent?.buttons.map((button, index) => (
                    <Button
                        key={index}
                        label={button.text}
                        size="default"
                        variant={button.isPreferred ? undefined : "secondary"}
                        onPress={() => {
                            button.onPress();
                            finishDialog();
                        }}
                        tone={
                            button.style === "cancel"
                                ? "neutral"
                                : button.style === "destructive"
                                  ? "danger"
                                  : "accent"
                        }
                        leadingIcon={button.icon}
                    />
                ))}
            </DialogActions>
        </Dialog>
    );
};
