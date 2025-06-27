import React from "react";
import { Button } from "../../Button";
import { Typography } from "../../Typography";
import { Dialog } from "../Dialog";
import { DialogHeader } from "../DialogHeader";
import { DialogActions } from "../DialogActions";
import { DialogCustomContent } from "../DialogCustomContent";
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
                        title={button.text}
                        variant={button.isPreferred ? undefined : "outlined"}
                        onPress={() => {
                            button.onPress();
                            finishDialog();
                        }}
                        color={
                            button.style === "cancel"
                                ? "secondary"
                                : button.style === "destructive"
                                ? "danger"
                                : "primary"
                        }
                        iconPosition="leading"
                        iconName={button.icon}
                    />
                ))}
            </DialogActions>
        </Dialog>
    );
};
