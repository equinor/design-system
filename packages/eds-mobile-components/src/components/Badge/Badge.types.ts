import { ViewProps } from "react-native";

/**
 * Semantic color tone.
 * - `neutral`: Neutral gray tones (default)
 * - `accent`: Brand or action color
 * - `success`: Positive or confirmation
 * - `info`: Informational
 * - `warning`: Caution or alerts
 * - `danger`: Destructive or error
 */
export type BadgeTone =
    | "neutral"
    | "accent"
    | "success"
    | "info"
    | "warning"
    | "danger";

/**
 * Fill intensity.
 * - `low`: Canvas background or light border
 * - `medium`: Muted fill or medium border
 */
export type BadgeEmphasis = "low" | "medium";

/**
 * Visual style.
 * - `solid`: Filled background, no border (default)
 * - `outlined`: Border with a transparent or canvas background
 */
export type BadgeVariant = "solid" | "outlined";

export type BadgeProps = {
    /** The label text or number displayed inside the badge. */
    children: string | number;
    /**
     * Semantic color tone.
     * @default 'neutral'
     */
    tone?: BadgeTone;
    /**
     * Visual weight of the badge.
     * @default 'low'
     */
    emphasis?: BadgeEmphasis;
    /**
     * Solid fill or outlined border.
     * @default 'solid'
     */
    variant?: BadgeVariant;
} & ViewProps;
