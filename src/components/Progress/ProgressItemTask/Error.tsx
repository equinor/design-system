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
            <Typography variant="description" group="cell" color="textSecondary">
                {error.message}
            </Typography>
            {error.code && (
                <Typography variant="description" group="cell" color="textSecondary">
                    {error.code}
                </Typography>
            )}
            {error.suggestion && (
                <Typography variant="description" group="cell" color="textSecondary">
                    {error.suggestion}
                </Typography>
            )}
        </View>
    );
};

const tokenStyles = EDSStyleSheet.create(token => ({
    container: {
        flexDirection: "column",
        gap: token.spacing.spacer.small,
    },
}));
