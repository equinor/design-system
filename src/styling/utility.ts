import type {
    Color,
    EDSColor,
    EDSTextColor,
    HexColorValue,
    RGBAColorValue,
    RGBColorValue,
    Token,
} from "./types";

export const isHexColorValue = (obj: string): obj is HexColorValue => obj.startsWith("#");
export const isRGBAColorValue = (obj: string): obj is RGBAColorValue => obj.startsWith("rgba(");
export const isRGBColorValue = (obj: string): obj is RGBColorValue => obj.startsWith("rgb(");
export const isEDSColor = (obj: string): obj is EDSColor =>
    ["primary", "secondary", "warning", "danger", "success"].some(col => col === obj);
export const isTextColor = (obj: string): obj is EDSTextColor =>
    ["textPrimary", "textSecondary", "textTertiary", "textInverted", "textDisabled"].some(
        col => col === obj,
    );

/**
 * Given a library color, resolve it to a abstracted color used by the master token.
 * @param color Color to resolve.
 * @param theme The current theme of the application.
 * @returns A resolved color.
 */
export function resolveColor(color: Color, theme: Token): Color {
    if (isEDSColor(color)) return theme.colors.interactive[color];
    if (isTextColor(color)) {
        const textColorToThemeKeyMap = {
            textPrimary: "primary",
            textSecondary: "secondary",
            textTertiary: "tertiary",
            textInverted: "primaryInverted",
            textDisabled: "disabled",
        } as const satisfies Record<EDSTextColor, keyof typeof theme.colors.text>;

        return theme.colors.text[textColorToThemeKeyMap[color]];
    }
    return color;
}
