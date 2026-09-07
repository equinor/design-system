import type { PressableProps, StyleProp, ViewStyle } from "react-native";
import type {
    EDSColor,
    EDSTextColor,
    HexColorValue,
    RGBAColorValue,
    RGBColorValue,
} from "./types";

/**
 * Merges a caller-supplied `style` on top of a component's own container style
 * instead of letting it replace the whole thing.
 *
 * Use this on Pressable-based components, where `style` may arrive either as a
 * value or as a function of press state. The function form is only produced
 * when the caller used it, so the common case stays a plain array.
 */
export const mergePressableStyle = (
    containerStyle: StyleProp<ViewStyle>,
    style: PressableProps["style"]
): PressableProps["style"] =>
    typeof style === "function"
        ? (state) => [containerStyle, style(state)]
        : [containerStyle, style];

export const isHexColorValue = (obj: string): obj is HexColorValue =>
    obj.startsWith("#");
export const isRGBAColorValue = (obj: string): obj is RGBAColorValue =>
    obj.startsWith("rgba(");
export const isRGBColorValue = (obj: string): obj is RGBColorValue =>
    obj.startsWith("rgb(");
export const isEDSColor = (obj: string): obj is EDSColor =>
    ["primary", "secondary", "warning", "danger", "success"].some(
        (col) => col === obj
    );
export const isTextColor = (obj: string): obj is EDSTextColor =>
    [
        "textPrimary",
        "textSecondary",
        "textTertiary",
        "textInverted",
        "textDisabled",
    ].some((col) => col === obj);
