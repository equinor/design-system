import {
    EDSStyleSheet,
    Typography,
    useStyles,
} from "@equinor/eds-mobile-components";
import { FC, PropsWithChildren } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

export const Section: FC<PropsWithChildren<{ title?: string; style?: StyleProp<ViewStyle> }>> = ({
    title,
    children,
    style,
}) => {
    const styles = useStyles(tokenStyles);
    return (
        <View style={[styles.container, style]}>
            {title && (
                <Typography size="sm" style={styles.title}>
                    {title.toUpperCase()}
                </Typography>
            )}
            {children}
        </View>
    );
};

const tokenStyles = EDSStyleSheet.create((token) => ({
    container: {
        paddingTop: token.newSpacing.spacing.vertical.xl,
        paddingBottom: token.newSpacing.spacing.inset.md.verticalSquished,
        paddingHorizontal: token.newSpacing.spacing.inset.xl.horizontal,
        gap: token.newSpacing.spacing.vertical.lg,
    },
    title: {
        color: token.newColors.text.neutral.subtle,
    },
}));
