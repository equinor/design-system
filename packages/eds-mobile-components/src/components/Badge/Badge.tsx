import React from "react";
import { View } from "react-native";
// SPIKE: useStyles/EDSStyleSheet swapped for the spike token hook.
import {
    SpikeToken,
    useSpikeTokens,
} from "../../styling/tokens/__spike__/useSpikeTokens";
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
    const styles = badgeSpikeStyles(useSpikeTokens(), {
        tone,
        emphasis,
        variant,
    });

    return (
        <View {...rest} style={[styles.container, rest.style]}>
            <Typography size="sm" weight="bolder" numberOfLines={1} style={styles.label}>
                {children}
            </Typography>
        </View>
    );
};

// SPIKE: styles below are resolved from the Tokens Studio TypeScript export via
// `useSpikeTokens` rather than from the generated token modules. See
// src/styling/tokens/__spike__/ and equinor/design-system#5464. Revert before merging.
const badgeSpikeStyles = (
    token: SpikeToken,
    { tone, emphasis, variant }: BadgeStyleProps
) => {
    const backgroundColor =
        variant === "outlined"
            ? token.background.nonInteractive[tone].muted
            : emphasis === "medium"
              ? token.background.nonInteractive[tone].default
              : token.background.nonInteractive[tone].muted;

    const borderColor =
        variant === "outlined"
            ? emphasis === "low"
                ? token.border.nonInteractive[tone].muted
                : token.border.nonInteractive[tone].default
            : "transparent"; // keeps solid and outlined badges the same total size

    const textColor = token.text.onDefault[tone];

    return {
        container: {
            alignSelf: "flex-start" as const,
            flexDirection: "row" as const,
            alignItems: "center" as const,
            justifyContent: "center" as const,
            // No icon-sizing token in the new foundation; spacing.xl is the same
            // 24px the old sizing.icon.lg gave us, but it is a spacing token
            // doing a sizing job.
            minWidth: token.spacing.xl,
            borderRadius: token.cornerRadius.rounded,
            paddingHorizontal: token.spacing.sm,
            paddingVertical: token.spacing["3xs"],
            backgroundColor,
            // Was sizing.stroke.thin, a flat 1px in both old densities. The new
            // foundation has no stroke concept, so a hairline scales with
            // density: 1px compact, 2px comfortable, 4px relaxed.
            borderWidth: token.spacing["4xs"],
            borderColor,
        },
        label: {
            color: textColor,
        },
    };
};
