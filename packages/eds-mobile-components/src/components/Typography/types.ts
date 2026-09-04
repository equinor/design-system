import { TextProps } from "react-native";

export type TypographyWeight = "bolder" | "lighter" | "normal";

export type TypographyLineHeight = "default" | "squished";

export type TypographyTracking = "normal" | "tight" | "wide";

export type TypographyStyleProps = {
    /**
     * Font weight of the text.
     */
    weight: TypographyWeight;
    /**
     * Line height of the text.
     */
    lineHeight: TypographyLineHeight;
    /**
     * Letter spacing of the text.
     */
    tracking: TypographyTracking;
};

export type TypographyBaseProps = Partial<TypographyStyleProps> & TextProps;
