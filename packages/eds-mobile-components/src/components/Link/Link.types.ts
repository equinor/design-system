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
     * Visual variant. `standalone` has its own underline and a proper touch target. `inline` sits inside a sentence of text and renders as a Text element.
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
