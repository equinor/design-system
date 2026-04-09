import { EDSStyleSheet, useStyles } from "@equinor/eds-mobile-components";
import { FC, PropsWithChildren } from "react";
import { View } from "react-native";

export const Surface: FC<PropsWithChildren> = ({ children }) => {
    const styles = useStyles(tokenStyles);
    return <View style={styles.container}>{children}</View>;
};

const tokenStyles = EDSStyleSheet.create((token) => ({
    container: {
        backgroundColor: token.newColors.bg.neutral.surface,
        marginHorizontal: token.newSpacing.spacing.inset.xl.horizontal,
        padding: token.newSpacing.spacing.inset.lg.horizontal,
        gap: token.newSpacing.spacing.vertical.lg,
        borderRadius: token.newSpacing.spacing.borderRadius.rounded,
    },
}));
