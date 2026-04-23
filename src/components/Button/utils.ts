import { ColorToken } from "../../styling/tokens/colorToken";
import { ButtonSize, ButtonTone, ButtonVariant } from "./types";

export const SIZE_MAP = {
    small: "sm",
    default: "md",
} as const satisfies Record<ButtonSize, "sm" | "md">;

type TextEmphasis = keyof ColorToken["text"][ButtonTone];
export const TEXT_VARIANT_MAP = {
    primary: "strongOnEmphasis",
    secondary: "subtle",
    ghost: "subtle",
} as const satisfies Record<ButtonVariant, TextEmphasis>;

type FillEmphasis = keyof ColorToken["bg"][ButtonTone];
export const VARIANT_MAP = {
    ghost: "fillMuted",
    secondary: "fillMuted",
    primary: "fillEmphasis",
} as const satisfies Record<ButtonVariant, FillEmphasis>;
