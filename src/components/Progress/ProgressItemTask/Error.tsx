import React from "react";
import { View } from "react-native";
import { Typography } from "../../Typography";
import { ProgressTaskError } from "../types";
import { EDSStyleSheet } from "../../../styling";
import { useStyles } from "../../../hooks/useStyles";

type ErrorProps = {
    error: ProgressTaskError;
};

export const Error = ({ error }: ErrorProps) => {
    const styles = useStyles(tokenStyles);
    return (
        <View style={styles.container}>
            <Typography size="md" style={styles.textSecondary}>
                {error.message}
            </Typography>
            {error.code && (
                <Typography size="md" style={styles.textSecondary}>
                    {error.code}
                </Typography>
            )}
            {error.suggestion && (
                <Typography size="md" style={styles.textSecondary}>
                    {error.suggestion}
                </Typography>
            )}
        </View>
    );
};

const tokenStyles = EDSStyleSheet.create((token) => ({
    container: {
        flexDirection: "column",
        gap: token.spacing.spacer.small,
    },
    textSecondary: {
        color: token.colors.text.secondary,
    },
}));
