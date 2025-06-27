import { TextStyle, ViewStyle } from "react-native";

export type HexColorValue = `#${string}`;
export type RGBAColorValue = `rgba(${string})`;
export type RGBColorValue = `rgb(${string})`;
export type EDSColor = "primary" | "secondary" | "warning" | "danger" | "success";
export type EDSTextColor =
    | "textPrimary"
    | "textSecondary"
    | "textTertiary"
    | "textInverted"
    | "textDisabled";
export type Color = HexColorValue | RGBAColorValue | RGBColorValue | EDSColor | EDSTextColor;

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
export type TypographyVariant<TKey extends TypographyGroup> = TypographyVariantGroupMap[TKey];

export type Elevation = "raised" | "none" | "overlay" | "sticky" | "temporaryNav" | "aboveScrim";

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
    "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "elevation"
>;

export type MasterToken = {
    colors: {
        border: {
            lighter: ColorSchemeValues<Color>;
            light: ColorSchemeValues<Color>;
            medium: ColorSchemeValues<Color>;
        };
        container: {
            background: ColorSchemeValues<Color>;
            default: ColorSchemeValues<Color>;
            warning: ColorSchemeValues<Color>;
            elevation: {
                none: ColorSchemeValues<Color>;
                aboveScrim: ColorSchemeValues<Color>;
                raised: ColorSchemeValues<Color>;
                overlay: ColorSchemeValues<Color>;
                sticky: ColorSchemeValues<Color>;
                temporaryNav: ColorSchemeValues<Color>;
            };
            scrim: ColorSchemeValues<string>;
        };
        interactive: {
            primary: ColorSchemeValues<Color>;
            secondary: ColorSchemeValues<Color>;
            /**
             * @deprecated 29.12.2023 - This will not be available 6 months after deprecation. Use `feedback.success` instead.
             */
            success: ColorSchemeValues<Color>;
            /**
             * @deprecated 29.12.2023 - This will not be available 6 months after deprecation. Use `feedback.warning` instead.
             */
            warning: ColorSchemeValues<Color>;
            /**
             * @deprecated 29.12.2023 - This will not be available 6 months after deprecation. Use `feedback.danger` instead.
             */
            danger: ColorSchemeValues<Color>;
            disabled: ColorSchemeValues<Color>;
            pressedOverlay: ColorSchemeValues<Color>;
            selectedHighlight: ColorSchemeValues<Color>;
        };
        feedback: {
            success: ColorSchemeValues<Color>;
            warning: ColorSchemeValues<Color>;
            danger: ColorSchemeValues<Color>;
        };
        environment: {
            dev: ColorSchemeValues<Color>;
            test: ColorSchemeValues<Color>;
            qa: ColorSchemeValues<Color>;
            text: ColorSchemeValues<Color>;
        };
        toast: {
            error: {
                background: ColorSchemeValues<Color>;
                text: ColorSchemeValues<Color>;
            };
            info: {
                background: ColorSchemeValues<Color>;
                text: ColorSchemeValues<Color>;
            };
            warning: {
                background: ColorSchemeValues<Color>;
                text: ColorSchemeValues<Color>;
            };
            success: {
                background: ColorSchemeValues<Color>;
                text: ColorSchemeValues<Color>;
            };
        };
        text: {
            primary: ColorSchemeValues<Color>;
            secondary: ColorSchemeValues<Color>;
            tertiary: ColorSchemeValues<Color>;
            primaryInverted: ColorSchemeValues<Color>;
            disabled: ColorSchemeValues<Color>;
            danger: ColorSchemeValues<Color>;
            menu: {
                resting: ColorSchemeValues<Color>;
                active: ColorSchemeValues<Color>;
            };
            feedbackWarning: ColorSchemeValues<Color>;
        };
    };
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
        shadow: {
            [TElev in Elevation]: ShadowStyle;
        };
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
        [TGroup in TypographyGroup]: {
            [TKey in TypographyVariant<TGroup>]: TypographyStyle;
        };
    };
    timing: {
        animation: {
            slow: number;
            normal: number;
            fast: number;
        };
    };
};

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
