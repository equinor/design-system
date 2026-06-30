import React from "react";
import { View, ViewProps } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { EDSStyleSheet } from "../../styling";

export type DividerProps = ViewProps;

export const Divider = ({ style, ...rest }: DividerProps) => {
    const styles = useStyles(themeStyles);
    return (
        <View
            style={[styles.divider, style]}
            accessible={false}
            importantForAccessibility="no"
            {...rest}
        />
    );
};

const themeStyles = EDSStyleSheet.create((token) => ({
    divider: {
        height: token.spacing.sizing.stroke.thin,
        backgroundColor: token.colors.border.neutral.subtle,
        alignSelf: "stretch",
    },
}));
