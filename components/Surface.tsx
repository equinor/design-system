import { EDSStyleSheet, useStyles } from "@equinor/eds-mobile-components";
import { FC, PropsWithChildren } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

export const Surface: FC<PropsWithChildren<{ style?: StyleProp<ViewStyle> }>> = ({ children, style }) => {
    const styles = useStyles(tokenStyles);
    return <View style={[styles.container, style]}>{children}</View>;
};

const tokenStyles = EDSStyleSheet.create((token) => ({
    container: {
        backgroundColor: token.newColors.bg.neutral.surface,
        marginHorizontal: token.newSpacing.spacing.inset.xl.horizontal,
        padding: token.newSpacing.spacing.inset.lg.horizontal,
        gap: token.newSpacing.spacing.vertical.md,
        borderRadius: token.newSpacing.spacing.borderRadius.rounded,
    },
}));
