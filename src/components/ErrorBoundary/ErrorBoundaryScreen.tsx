import React from "react";
// eslint-disable-next-line import/named
import { FallbackProps } from "react-error-boundary";
import { View, SafeAreaView } from "react-native";
import { Button } from "../Button";
import { EDSStyleSheet } from "../../styling";
import { useStyles } from "../../hooks/useStyles";
import { Typography } from "../Typography";

export const ErrorBoundaryScreen = ({ resetErrorBoundary }: FallbackProps) => {
    const styles = useStyles(theme);
    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <View style={styles.container}>
                <Typography color={styles.title_color.color} group="paragraph" variant="body_short">
                    Error
                </Typography>
                <Typography group="paragraph" variant="body_long">
                    Something unexpected happened, and the app crashed. You can restart the app by
                    clicking the button below.
                    {"\n\n"}
                    If this keeps happening, we recommend creating a Service-Now ticket.
                </Typography>
                <Button title="Restart app" onPress={resetErrorBoundary} />
            </View>
        </SafeAreaView>
    );
};

const theme = EDSStyleSheet.create(theme => ({
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
