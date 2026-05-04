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

const theme = EDSStyleSheet.create((theme) => ({
    title_color: { color: theme.colors.text.danger },
    safeAreaContainer: {
        backgroundColor: theme.colors.container.background,
    },
    container: {
        paddingHorizontal: theme.spacing.container.paddingHorizontal,
        paddingVertical: theme.spacing.container.paddingVertical,
        justifyContent: "center",
        height: "100%",
        gap: theme.spacing.spacer.medium,
    },
}));
