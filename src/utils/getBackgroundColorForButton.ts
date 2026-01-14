import { MasterToken } from "src/styling/tokens";
import { ButtonProps } from "../components/Button";

type Variant = Exclude<ButtonProps["variant"], undefined>;
type ButtonColorVariant = Exclude<ButtonProps["color"], undefined>;

/**
 * Get background color for button.
 * @param token resolved token
 * @param variant button variant
 * @param color button color variant
 * @param disabled whether the button is disabled or not
 * @returns a color value, or 'transparent'
 */
export const getBackgroundColorForButton = (
    token: MasterToken,
    variant: Variant,
    color: ButtonColorVariant,
    disabled: boolean
) => {
    if (variant !== "contained") return "transparent";
    if (disabled) return token.colors.interactive.disabled;
    return token.colors.interactive[color];
};
