import {
    EDSStyleSheet,
    Typography,
    useStyles,
} from "@equinor/eds-mobile-components";
import { FC, PropsWithChildren } from "react";
import { View } from "react-native";

export const Section: FC<PropsWithChildren<{ title?: string }>> = ({
    title,
    children,
}) => {
    const styles = useStyles(tokenStyles);
    return (
        <View style={styles.container}>
            <Typography variant="h5">{title}</Typography>
            {children}
        </View>
    );
};

const tokenStyles = EDSStyleSheet.create((token) => ({
    container: {
        paddingVertical: token.newSpacing.spacing.inset.xl["vertical-squished"],
        paddingHorizontal: token.newSpacing.spacing.inset.xl.horizontal,
        gap: token.newSpacing.spacing.vertical.lg,
    },
}));
