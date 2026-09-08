import { ViewProps } from "react-native";

export type BadgeTone =
    | "neutral"
    | "accent"
    | "success"
    | "info"
    | "warning"
    | "danger";

export type BadgeEmphasis = "low" | "medium";

export type BadgeVariant = "solid" | "outlined";

export type BadgeProps = {
    /** The label text or number displayed inside the badge. */
    children: string | number;
    /** Semantic color tone. */
    tone?: BadgeTone;
    /** Visual weight of the badge. */
    emphasis?: BadgeEmphasis;
    /** Solid fill or outlined border. */
    variant?: BadgeVariant;
} & ViewProps;
