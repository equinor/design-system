import { TextStyle, ViewStyle } from "react-native";

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
    | EDSTextColor;

export type ColorScheme = "light" | "dark";
export type Density = "tablet" | "phone";

export type ColorSchemeValues<T> = Record<ColorScheme, T>;
export type DensityValues<T> = Record<Density, T>;

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
type ColorSchemeValue<T> = {
    light: T;
    dark: T;
};

export type ColorToken = {
    border: {
        lighter: ColorSchemeValue<string>;
        light: ColorSchemeValue<string>;
        medium: ColorSchemeValue<string>;
    };
    container: {
        background: ColorSchemeValue<string>;
        default: ColorSchemeValue<string>;
        warning: ColorSchemeValue<string>;
        elevation: {
            none: ColorSchemeValue<string>;
            aboveScrim: ColorSchemeValue<string>;
            raised: ColorSchemeValue<string>;
            overlay: ColorSchemeValue<string>;
            sticky: ColorSchemeValue<string>;
            temporaryNav: ColorSchemeValue<string>;
        };
        scrim: ColorSchemeValue<string>;
    };
    interactive: {
        primary: ColorSchemeValue<string>;
        secondary: ColorSchemeValue<string>;
        success: ColorSchemeValue<string>;
        warning: ColorSchemeValue<string>;
        danger: ColorSchemeValue<string>;
        disabled: ColorSchemeValue<string>;
        pressedOverlay: ColorSchemeValue<string>;
        selectedHighlight: ColorSchemeValue<string>;
    };
    feedback: {
        success: ColorSchemeValue<string>;
        warning: ColorSchemeValue<string>;
        danger: ColorSchemeValue<string>;
    };
    environment: {
        dev: ColorSchemeValue<string>;
        test: ColorSchemeValue<string>;
        qa: ColorSchemeValue<string>;
        text: ColorSchemeValue<string>;
    };
    text: {
        primary: ColorSchemeValue<string>;
        secondary: ColorSchemeValue<string>;
        tertiary: ColorSchemeValue<string>;
        primaryInverted: ColorSchemeValue<string>;
        disabled: ColorSchemeValue<string>;
        danger: ColorSchemeValue<string>;
        menu: {
            resting: ColorSchemeValue<string>;
            active: ColorSchemeValue<string>;
        };
        feedbackWarning: ColorSchemeValue<string>;
    };
    toast: {
        error: {
            background: ColorSchemeValue<string>;
            text: ColorSchemeValue<string>;
        };
        info: {
            background: ColorSchemeValue<string>;
            text: ColorSchemeValue<string>;
        };
        warning: {
            background: ColorSchemeValue<string>;
            text: ColorSchemeValue<string>;
        };
        success: {
            background: ColorSchemeValue<string>;
            text: ColorSchemeValue<string>;
        };
    };
};

export type LayoutToken = {
    geometry: {
        border: {
            elementBorderRadius: number;
            containerBorderRadius: number;
            borderWidth: number;
            focusedBorderWidth: number;
            tabsBorderWidth: number;
        };
        dimension: {
            icon: {
                size: number;
            };
            button: {
                minHeight: DensityValues<number>;
            };
            cell: {
                minHeight: number;
                navigation: {
                    height: DensityValues<number>;
                };
                accordion: {
                    height: DensityValues<number>;
                };
                adornment: {
                    widthSmall: DensityValues<number>;
                    widthMedium: DensityValues<number>;
                    widthLarge: DensityValues<number>;
                };
            };
            dialog: {
                minHeight: DensityValues<number>;
                defaultWidth: DensityValues<number>;
                header: {
                    height: DensityValues<number>;
                };
            };
            tabs: {
                minWidth: DensityValues<number>;
            };
        };
        shadow: Record<Elevation, ShadowStyle>;
    };
    spacing: {
        container: {
            paddingHorizontal: DensityValues<number>;
            paddingVertical: DensityValues<number>;
        };
        element: {
            paddingHorizontal: DensityValues<number>;
            paddingVertical: DensityValues<number>;
        };
        chip: {
            paddingHorizontal: DensityValues<number>;
            paddingVertical: DensityValues<number>;
        };
        button: {
            paddingHorizontal: DensityValues<number>;
            paddingVertical: DensityValues<number>;
            iconGap: DensityValues<number>;
        };
        textField: {
            paddingHorizontal: DensityValues<number>;
            paddingVertical: DensityValues<number>;
        };
        menu: {
            paddingVertical: DensityValues<number>;
            item: {
                paddingHorizontal: DensityValues<number>;
                paddingVertical: DensityValues<number>;
                iconGap: DensityValues<number>;
            };
        };
        dialog: {
            padding: DensityValues<number>;
            gap: DensityValues<number>;
        };
        cell: {
            group: {
                titleBottomPadding: DensityValues<number>;
            };
            content: {
                titleDescriptionGap: DensityValues<number>;
            };
            paddingVertical: DensityValues<number>;
            gapHorizontal: DensityValues<number>;
        };
        spacer: {
            small: DensityValues<number>;
            medium: DensityValues<number>;
            large: DensityValues<number>;
        };
        tabs: {
            paddingVerical: DensityValues<number>;
            paddingHorizontal: DensityValues<number>;
        };
    };
    typography: {
        [TGroup in TypographyGroup]: Record<
            TypographyVariant<TGroup>,
            TypographyStyle
        >;
    };
    timing: {
        animation: {
            slow: number;
            normal: number;
            fast: number;
        };
    };
};

export type MasterToken = {
    colors: ColorToken;
} & LayoutToken;

export type WithoutThemeOptionValues<TToken> = {
    [K in keyof TToken]: TToken[K] extends ColorSchemeValues<infer U>
        ? U
        : TToken[K] extends DensityValues<infer V>
          ? V
          : TToken[K] extends object
            ? WithoutThemeOptionValues<TToken[K]>
            : TToken[K];
};

export type Token = WithoutThemeOptionValues<MasterToken>;
