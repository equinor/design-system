import { ReactNode } from "react";
import { TextProps } from "react-native";
import { TypographyToken } from "../../styling/tokens";

export type LinkSize = keyof TypographyToken["ui"]["fontFamilySize"];

/**
 * Visual variant of the link.
 * - `standalone`: Used as a standalone element with a separate underline and a proper touch target (default)
 * - `inline`: Used inside a sentence alongside other text, renders as a Text element
 */
export type LinkVariant = "standalone" | "inline";

export type LinkProps = {
    /** The link label. */
    children: ReactNode;
    /** Called when the link is pressed. */
    onPress?: TextProps["onPress"];
    /**
     * Visual variant.
     * @default 'standalone'
     */
    variant?: LinkVariant;
    /**
     * Font size, matching the Typography UI size scale.
     * @default 'md'
     */
    size?: LinkSize;
    /**
     * Shows an external link icon alongside the text.
     * @default false
     */
    external?: boolean;
    /**
     * Marks the link as previously visited. Consumer is responsible for tracking this state.
     * @default false
     */
    visited?: boolean;
};
