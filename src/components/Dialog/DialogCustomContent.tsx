import React, { PropsWithChildren } from "react";
import { Pressable, ScrollView } from "react-native";
import { EDSStyleSheet } from "../../styling";
import { useStyles } from "../../hooks/useStyles";

export const DialogCustomContent = ({ children }: PropsWithChildren) => {
    const styles = useStyles(themeStyles);
    return (
        <ScrollView contentContainerStyle={styles.customContentContainer}>
            <Pressable>
                {children}
            </Pressable>
        </ScrollView>
    );
};

const themeStyles = EDSStyleSheet.create(theme => ({
    customContentContainer: {
        padding: theme.spacing.dialog.padding,
        paddingBottom: 0,
    },
}));
