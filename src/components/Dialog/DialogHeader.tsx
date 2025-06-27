import React from "react";
import { EDSStyleSheet } from "../../styling";
import { TextChildren, Typography } from "../Typography";
import { View } from "react-native";
import { useStyles } from "../../hooks/useStyles";

export const DialogHeader = (props: TextChildren) => {
    const styles = useStyles(themeStyles);
    return (
        <View style={styles.header}>
            <Typography variant="h6" numberOfLines={1} style={styles.title}>
                {props.children}
            </Typography>
        </View>
    );
};

const themeStyles = EDSStyleSheet.create(theme => ({
    header: {
        minHeight: theme.geometry.dimension.dialog.header.height - theme.geometry.border.borderWidth,
        width: "100%",
        borderBottomWidth: theme.geometry.border.borderWidth,
        borderBottomColor: theme.colors.border.medium,
        padding: theme.spacing.dialog.padding,
        paddingBottom: 0,
    },
    title: {
        lineHeight: 26,
        color: theme.colors.text.primary,
    },
}));
