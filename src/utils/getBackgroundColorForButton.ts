import { ButtonProps } from "../components/Button";
import { MasterToken, WithoutThemeOptionValues } from "../styling";

type Variant = Exclude<ButtonProps["variant"], undefined>;
type Theme = WithoutThemeOptionValues<MasterToken>;
type ButtonColorVariant = Exclude<ButtonProps["color"], undefined>;

/**
 * Get background color for button.
 * @param theme theme
 * @param variant button variant
 * @param color button color variant
 * @param disabled whether the button is disabled or not
 * @returns a color value, or 'transparent'
 */
export const getBackgroundColorForButton = (
    theme: Theme,
    variant: Variant,
    color: ButtonColorVariant,
    disabled: boolean,
) => {
    if (variant !== "contained") return "transparent";
    if (disabled) return theme.colors.interactive.disabled;
    return theme.colors.interactive[color];
};
