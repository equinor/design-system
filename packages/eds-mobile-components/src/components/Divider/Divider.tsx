import React from "react";
import { View, ViewProps } from "react-native";
// SPIKE: useStyles/EDSStyleSheet swapped for the spike token hook (now V2).
import { useSpikeTokensV2 } from "../../styling/tokens/__spike__/useSpikeTokensV2";

export type DividerProps = ViewProps;

export const Divider = ({ style, ...rest }: DividerProps) => {
    const token = useSpikeTokensV2();
    // SPIKE: was sizing.stroke.thin, a flat 1px in both legacy densities. The
    // new foundation has no stroke concept, so the rule scales with density:
    // 1px compact, 2px comfortable, 4px relaxed. A full-width divider is where
    // that doubling is most visible. See equinor/design-system#5464.
    const divider = {
        height: token.spacing["4xs"],
        backgroundColor: token.border.nonInteractive.neutral.muted,
        alignSelf: "stretch" as const,
    };

    return (
        <View
            {...rest}
            style={[divider, style]}
            accessible={false}
            importantForAccessibility="no"
        />
    );
};
