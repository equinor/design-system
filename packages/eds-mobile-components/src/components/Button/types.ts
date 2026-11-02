import { Ref } from "react";
import { PressableProps } from "react-native";
import type { ViewRef } from "../../utils/nativeRefs";

export type ButtonSize = "small" | "default";

export type ButtonTone = "accent" | "neutral" | "danger";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export type BaseButtonProps = {
    /**
     * Colour tone of the button.
     * @default 'accent'
     */
    tone?: ButtonTone;
    /**
     * Size of the button.
     * @default 'default'
     */
    size?: ButtonSize;
    /**
     * Button variant.
     * @default 'primary'
     */
    variant?: ButtonVariant;
    /**
     * Ref to the button component.
     */
    ref?: Ref<ViewRef>;
} & PressableProps;
