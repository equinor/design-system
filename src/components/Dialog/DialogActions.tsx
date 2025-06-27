import React, { PropsWithChildren } from "react";
import { View } from "react-native";
import { EDSStyleSheet } from "../../styling";
import { useStyles } from "../../hooks/useStyles";

export type DialogActionsProps = PropsWithChildren<{ align?: "left" | "right" }>;
export const DialogActions = ({ align = "left", children }: DialogActionsProps) => {
    const styles = useStyles(themeStyles, align);
    return (
        <>
            <View style={styles.spacer} />
            <View style={styles.actionsContainer}>{children}</View>
        </>
    );
};

const themeStyles = EDSStyleSheet.create((theme, align: "left" | "right") => ({
    spacer: { flex: 1 },
    actionsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: theme.spacing.dialog.gap,
        justifyContent: align === "left" ? "flex-start" : "flex-end",
        padding: theme.spacing.dialog.padding,
    },
}));
