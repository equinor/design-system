import { Ref } from "react";
import { PressableProps, View } from "react-native";

export type ButtonSize = "small" | "default" | "large";
export type ButtonTone = "accent" | "neutral" | "danger";
export type ButtonVariant = "primary" | "secondary" | "ghost";

export type BaseButtonProps = {
    /**
     * Color tone of the button.
     */
    tone?: ButtonTone;
    /**
     * Size of the button.
     */
    size?: ButtonSize;
    /**
     * Button variant.
     */
    variant?: ButtonVariant;
    /**
     * Ref to the button component.
     */
    ref?: Ref<View>;
} & PressableProps;
