import { EDSStyleSheet, useStyles } from "@equinor/eds-mobile-components";
import { FC, PropsWithChildren } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

export const Surface: FC<PropsWithChildren<{ style?: StyleProp<ViewStyle> }>> = ({ children, style }) => {
    const styles = useStyles(tokenStyles);
    return <View style={[styles.container, style]}>{children}</View>;
};

const tokenStyles = EDSStyleSheet.create((token) => ({
    container: {
        backgroundColor: token.colors.bg.neutral.surface,
        marginHorizontal: token.spacing.spacing.inset.xl.horizontal,
        padding: token.spacing.spacing.inset.lg.horizontal,
        gap: token.spacing.spacing.vertical.md,
        borderRadius: token.spacing.spacing.borderRadius.rounded,
    },
}));
