import React from "react";
import { View } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { EDSStyleSheet } from "../../styling";
import { SpacerProps } from "./types";

export const SpacerVertical = ({ amount = "medium" }: SpacerProps) => {
    const styles = useStyles(themeStyles, { amount });

    return <View style={styles.spacer} />;
};

SpacerVertical.defaultName = "Spacer.Vertical";

const themeStyles = EDSStyleSheet.create((theme, props) => {
    const { amount: amount = "medium" } = props as SpacerProps;
    return {
        spacer: {
            height: theme.spacing.spacer[amount],
        },
    };
});
