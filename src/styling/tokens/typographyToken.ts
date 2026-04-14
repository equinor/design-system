type FontFamily = "Inter" | "Equinor";
export type TypographyVariantStyle = {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    letterSpacing: number;
};

type FontWeight = 300 | 400 | 500 | 700;

const fontNameMap: Record<FontFamily, Partial<Record<FontWeight, string>>> = {
    Inter: {
        400: "Inter",
    },
    Equinor: {
        300: "Equinor-Light",
        400: "Equinor-Regular",
        500: "Equinor-Medium",
        700: "Equinor-Bold",
    },
};

function resolveFontFamily(family: FontFamily, weight: FontWeight): string {
    return fontNameMap[family][weight] ?? fontNameMap[family][400] ?? family;
}

function preset(
    family: FontFamily,
    weight: FontWeight,
    fontSize: number,
    lineHeight: number,
    letterSpacing = 0
): TypographyVariantStyle {
    return {
        fontFamily: resolveFontFamily(family, weight),
        fontSize,
        lineHeight,
        letterSpacing,
    };
}

export const typographyToken = {
    display: {
        lg: preset("Equinor", 500, 34, 41),
        md: preset("Equinor", 500, 28, 34),
        sm: preset("Equinor", 500, 22, 28),
    },
    heading: {
        lg: preset("Equinor", 500, 20, 25),
        md: preset("Equinor", 500, 17, 22),
        sm: preset("Equinor", 500, 15, 20),
    },
    body: {
        lg: preset("Inter", 400, 17, 22),
        md: preset("Inter", 400, 15, 20),
        sm: preset("Inter", 400, 13, 18),
    },
    label: {
        lg: preset("Inter", 400, 15, 20),
        md: preset("Inter", 400, 13, 18),
        sm: preset("Inter", 400, 12, 16),
    },
    caption: preset("Inter", 400, 11, 13),
    button: preset("Inter", 400, 17, 22),
    overline: preset("Inter", 400, 12, 16),
};

export type TypographyToken = typeof typographyToken;

type DisplayVariant = `display.${keyof TypographyToken["display"]}`;
type HeadingVariant = `heading.${keyof TypographyToken["heading"]}`;
type BodyVariant = `body.${keyof TypographyToken["body"]}`;
type LabelVariant = `label.${keyof TypographyToken["label"]}`;
type StandaloneVariant = "caption" | "button" | "overline";

export type NewTypographyVariant =
    | DisplayVariant
    | HeadingVariant
    | BodyVariant
    | LabelVariant
    | StandaloneVariant;

export function resolveVariant(
    token: TypographyToken,
    variantKey: NewTypographyVariant
): TypographyVariantStyle {
    if (variantKey.includes(".")) {
        const [group, variant] = variantKey.split(".") as [
            "display" | "heading" | "body" | "label",
            string,
        ];
        return (token[group] as Record<string, TypographyVariantStyle>)[variant];
    }
    return token[variantKey as StandaloneVariant];
}
