import React, { PropsWithChildren } from "react";
import { View } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { EDSStyleSheet } from "../../styling";
import { Typography } from "../Typography";

export const DialogHeader: React.FC<PropsWithChildren> = (props) => {
    const styles = useStyles(themeStyles);
    return (
        <View style={styles.header}>
            <Typography.Header size="lg"
                numberOfLines={1}
                style={styles.title}>
                {props.children}
            </Typography.Header>
        </View>
    );
};

const themeStyles = EDSStyleSheet.create((token) => ({
    header: {
        minHeight:
            token.geometry.dimension.dialog.header.height -
            token.geometry.border.borderWidth,
        width: "100%",
        borderBottomWidth: token.geometry.border.borderWidth,
        borderBottomColor: token.newColors.border.neutral.subtle,
        padding: token.spacing.dialog.padding,
        paddingBottom: 0,
    },
    title: {
        color: token.newColors.text.neutral.strong,
    },
}));
