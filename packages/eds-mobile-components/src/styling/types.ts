import type { TextStyle, ViewStyle } from "react-native";

export type HexColorValue = `#${string}`;
export type RGBAColorValue = `rgba(${string})`;
export type RGBColorValue = `rgb(${string})`;
export type EDSColor =
    | "primary"
    | "secondary"
    | "warning"
    | "danger"
    | "success";
export type EDSTextColor =
    | "textPrimary"
    | "textSecondary"
    | "textTertiary"
    | "textInverted"
    | "textDisabled";
export type Color =
    | HexColorValue
    | RGBAColorValue
    | RGBColorValue
    | EDSColor
    | EDSTextColor
    | (string & {}); // Allows resolved theme colors (strings) while preserving autocomplete for named colors

export type ColorScheme = "light" | "dark";
export type Density = "comfortable" | "spacious";

export type TypographyVariantGroupMap = {
    paragraph: "body_short" | "body_long" | "overline" | "caption";
    basic: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "label" | "input";
    interactive: "button" | "link";
    ui: "tooltip" | "chipAndBadge";
    cell: "groupTitle" | "title" | "description";
    navigation: "menuTab";
};
export type TypographyGroup = keyof TypographyVariantGroupMap;
export type TypographyVariant<TKey extends TypographyGroup> =
    TypographyVariantGroupMap[TKey];

export type Elevation =
    | "raised"
    | "none"
    | "overlay"
    | "sticky"
    | "temporaryNav"
    | "aboveScrim";

export type TypographyStyle = Pick<
    TextStyle,
    | "fontFamily"
    | "fontSize"
    | "letterSpacing"
    | "textTransform"
    | "textAlign"
    | "lineHeight"
    | "paddingTop"
    | "color"
    | "textDecorationLine"
>;
export type ShadowStyle = Pick<
    ViewStyle,
    | "shadowColor"
    | "shadowOffset"
    | "shadowOpacity"
    | "shadowRadius"
    | "elevation"
>;
