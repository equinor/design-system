import { ReactNode } from "react";
import { TextProps } from "react-native";
import { TypographyToken } from "../../styling/tokens";

export type LinkSize = keyof TypographyToken["ui"]["fontFamilySize"];

export type LinkVariant = "standalone" | "inline";

export type LinkProps = {
    /** The link label. */
    children: ReactNode;
    /** Called when the link is pressed. */
    onPress?: TextProps["onPress"];
    /**
     * Visual variant.
     * - `standalone` (default): used as a standalone element with a separate underline View and proper touch target.
     * - `inline`: used inside a sentence alongside other text, renders as a Text element.
     */
    variant?: LinkVariant;
    /** Font size, matching the Typography UI size scale. Defaults to md. */
    size?: LinkSize;
    /** Shows an external link icon alongside the text. */
    external?: boolean;
    /** Marks the link as previously visited. Consumer is responsible for tracking this state. */
    visited?: boolean;
};
