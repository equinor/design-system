import React from "react";
import { View } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { EDSStyleSheet } from "../../styling";
import { SpacerProps } from "./types";

export const SpacerHorizontal = ({ amount = "medium" }: SpacerProps) => {
    const styles = useStyles(themeStyles, { amount });

    return <View style={styles.spacer} />;
};

SpacerHorizontal.defaultName = "Spacer.Horizontal";

const themeStyles = EDSStyleSheet.create((theme, props) => {
    const { amount: amount = "medium" } = props as SpacerProps;
    return {
        spacer: {
            width: theme.spacing.spacer[amount],
        },
    };
});
