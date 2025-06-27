import React, { PropsWithChildren } from "react";
import { LayoutAnimation, Pressable, SafeAreaView, StyleSheet } from "react-native";
import { Portal } from "../Portal";
import { EDSStyleSheet } from "../../styling";
import { useStyles } from "../../hooks/useStyles";

export type ScrimProps = PropsWithChildren<{
    /**
     * A boolean value indicating whether or not the scrim should be open.
     */
    isOpen: boolean;
    /**
     * A callback method invoked when a user presses the scrim surface.
     */
    onPress?: () => void;
}>;

export const Scrim = ({ isOpen, onPress, children }: ScrimProps) => {
    const styles = useStyles(themeStyles);
    if (!isOpen) return null;
    LayoutAnimation.configureNext({ ...LayoutAnimation.Presets.spring, duration: 100 });
    return (
        <Portal name="scrim">
            <Pressable style={styles.scrim} onPress={onPress}>
                <SafeAreaView style={styles.safeAreaView}>
                    {children}
                </SafeAreaView>
            </Pressable>
        </Portal>
    );
};

const themeStyles = EDSStyleSheet.create(theme => ({
    scrim: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme.colors.container.scrim,
        paddingHorizontal: theme.spacing.container.paddingHorizontal,
        paddingVertical: theme.spacing.container.paddingVertical
    },
    safeAreaView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
}));
