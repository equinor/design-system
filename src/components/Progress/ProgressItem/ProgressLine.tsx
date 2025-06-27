import React from "react";
import { View, ViewProps } from "react-native";
import { useStyles } from "../../../hooks/useStyles";
import { EDSStyleSheet } from "../../../styling";
import { statusToColor } from "../progressUtils";
import { ProgressStatus } from "../types";
import { useProgressItemContext } from "./ProgressItemContext";

export const ProgressLine = ({ ...viewProps }: ViewProps) => {
    const { status } = useProgressItemContext();
    const styles = useStyles(tokenStyles, { status });
    return (
        <View {...viewProps} style={[styles.container, viewProps.style]}>
            <View style={styles.line} />
        </View>
    );
};

type ProgressLineStyleProps = {
    status: ProgressStatus;
};

const tokenStyles = EDSStyleSheet.create((token, { status }: ProgressLineStyleProps) => ({
    container: {
        flexDirection: "column",
        alignItems: "center",
    },
    line: {
        flex: 1,
        width: token.geometry.border.borderWidth,
        backgroundColor: statusToColor(status, token),
    },
}));
