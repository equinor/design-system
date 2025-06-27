import React from "react";
import { View, ViewProps } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { EDSStyleSheet } from "../../styling";
import { Button } from "../Button";
import { useProgressItemContext } from "./ProgressItem/ProgressItemContext";

type ActionButtonsRowProps = {
    shouldShowRetryButton: boolean;
    shouldShowCopyTextButton: boolean;
    handleRetryButtonPress: () => void;
    handleCopyTextButtonPress: () => void;
} & ViewProps;

export const ActionButtonsRow = ({
    shouldShowRetryButton,
    shouldShowCopyTextButton,
    handleRetryButtonPress,
    handleCopyTextButtonPress,
    ...viewProps
}: ActionButtonsRowProps) => {
    const styles = useStyles(tokenStyles);
    const { status } = useProgressItemContext();
    return (
        <View {...viewProps} style={[styles.container, viewProps.style]}>
            {shouldShowCopyTextButton && status === "error" ? (
                <Button
                    title="Copy to clipboard"
                    iconName="clipboard-outline"
                    variant="outlined"
                    onPress={handleCopyTextButtonPress}
                />
            ) : null}
            {shouldShowRetryButton && status === "error" ? (
                <Button iconName="restart" title="Retry" onPress={handleRetryButtonPress} />
            ) : null}
        </View>
    );
};

const tokenStyles = EDSStyleSheet.create(token => ({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: token.spacing.spacer.small,
    },
}));
