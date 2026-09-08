import React from "react";
import { View } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { EDSStyleSheet } from "../../styling";
import { Typography } from "../Typography";

import {
    BadgeEmphasis,
    BadgeProps,
    BadgeTone,
    BadgeVariant,
} from "./Badge.types";

type BadgeStyleProps = {
    tone: BadgeTone;
    emphasis: BadgeEmphasis;
    variant: BadgeVariant;
};

export const Badge = ({
    children,
    tone = "neutral",
    emphasis = "low",
    variant = "solid",
    ...rest
}: BadgeProps) => {
    const styles = useStyles(badgeThemeStyles, { tone, emphasis, variant });

    return (
        <View style={styles.container} {...rest}>
            <Typography size="sm" weight="bolder" numberOfLines={1} style={styles.label}>
                {children}
            </Typography>
        </View>
    );
};

const badgeThemeStyles = EDSStyleSheet.create(
    (token, { tone, emphasis, variant }: BadgeStyleProps) => {
        const backgroundColor = variant === "outlined"
            ? token.colors.bg[tone].canvas
            : emphasis === "medium"
                ? token.colors.bg[tone].fillMuted.default
                : token.colors.bg[tone].canvas;

        const borderColor = variant === "outlined"
            ? emphasis === "low"
                ? token.colors.border[tone].subtle
                : token.colors.border[tone].medium
            : "transparent"; // keeps solid and outlined badges the same total size

        const textColor = token.colors.text[tone].subtle;

        return {
            container: {
                alignSelf: "flex-start",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                minWidth: token.spacing.sizing.icon.lg,
                borderRadius: token.spacing.spacing.borderRadius.rounded,
                paddingHorizontal: token.spacing.spacing.horizontal.sm,
                paddingVertical: token.spacing.spacing.vertical.threeXs,
                backgroundColor,
                borderWidth: token.spacing.sizing.stroke.thin,
                borderColor,
            },
            label: {
                color: textColor,
            },
        };
    }
);
