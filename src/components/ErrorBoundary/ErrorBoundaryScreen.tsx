import React from "react";
import { FallbackProps } from "react-error-boundary";
import { SafeAreaView, View } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { EDSStyleSheet } from "../../styling";
import { Button } from "../Button";
import { Typography } from "../Typography";

export const ErrorBoundaryScreen = ({ resetErrorBoundary }: FallbackProps) => {
    const styles = useStyles(theme);
    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <View style={styles.container}>
                <Typography size="xl" style={styles.title_color}>
                    Error
                </Typography>
                <Typography size="xl">
                    Something unexpected happened, and the app crashed. You can
                    restart the app by clicking the button below.
                    {"\n\n"}
                    If this keeps happening, we recommend creating a Service-Now
                    ticket.
                </Typography>
                <Button label="Restart app" onPress={resetErrorBoundary} />
            </View>
        </SafeAreaView>
    );
};

const theme = EDSStyleSheet.create((token) => ({
    title_color: { color: token.colors.text.danger.subtle },
    safeAreaContainer: {
        backgroundColor: token.colors.bg.neutral.canvas,
    },
    container: {
        paddingHorizontal: token.spacing.spacing.inset.xl.horizontal,
        paddingVertical: token.spacing.spacing.inset.xl.verticalSquished,
        justifyContent: "center",
        height: "100%",
        gap: token.spacing.spacing.vertical.lg,
    },
}));
